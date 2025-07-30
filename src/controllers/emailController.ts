import { Request, Response, NextFunction } from 'express';
import { esClient } from '../services/elasticService';
import { categorizeEmail } from '../services/emailCategorizer';
import { Email } from '../models/email';
import { sendSlackNotification, sendExternalWebhook } from '../services/notificationService';


const INDEX_NAME = 'emails';

//Create and index a new email with AI categorization
 
export const createEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { from, to, subject, body } = req.body;

    if (!from || !to || !subject || !body) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const emailContent = `From: ${from}\nTo: ${to}\nSubject: ${subject}\nBody:\n${body}`;
    const label = await categorizeEmail(emailContent);

    //  Notify if label is "Interested"
    if (label.toLowerCase() === 'interested') {
      await sendSlackNotification({ from, to, subject, body });
      await sendExternalWebhook({ from, to, subject, body, category: label });
    }

    const email: Email = {
      from,
      to,
      subject,
      body,
      timestamp: new Date().toISOString(),
      category: label
    };

    const response = await esClient.index({
      index: INDEX_NAME,
      body: email
    });

    res.status(201).json({
      message: 'Email indexed with category',
      id: response.body._id,
      category: label
    });

  } catch (error) {
    next(error);
  }
};

//Search emails by query string (across subject, body, from, to)
// Optional: filter by category, from, or to using query params
 
export const searchEmails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = req.query.q || '';
    const category = req.query.category;
    const from = req.query.from;
    const to = req.query.to;

    const must: any[] = [];

    if (query) {
      must.push({
        multi_match: {
          query: query,
          fields: ['subject', 'body', 'from', 'to'],
        }
      });
    }

    if (category) {
      must.push({ match: { category } });
    }

    if (from) {
      must.push({ match: { from } });
    }

    if (to) {
      must.push({ match: { to } });
    }

    const result = await esClient.search({
      index: INDEX_NAME,
      body: {
        query: {
          bool: {
            must
          }
        }
      }
    });

    const emails = result.body.hits.hits.map((hit: any) => ({
      id: hit._id,
      ...hit._source
    }));

    res.status(200).json({
      count: emails.length,
      emails
    });

  } catch (error) {
    next(error);
  }
};

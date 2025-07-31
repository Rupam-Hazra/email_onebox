import { ImapFlow } from 'imapflow';
import { simpleParser } from 'mailparser';
import { esClient } from './elasticService';
import { categorizeEmail } from './emailCategorizer';
import { sendSlackNotification, sendExternalWebhook } from './notificationService';
import config from '../config/config';

const sinceDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Last 30 days

// ⛔️ Replace these hardcoded credentials with environment variables or DB in real app
const accounts = [
  {
    user: process.env.EMAIL_USER_1 || '',
    pass: process.env.EMAIL_PASS_1 || '',
  },
  {
    user: process.env.EMAIL_USER_2 || '',
    pass: process.env.EMAIL_PASS_2 || '',
  },
];

const processEmail = async (parsed: any, account: string) => {
  try {
    const subject = parsed.subject || '';
    const from = parsed.from?.text || '';
    const to = parsed.to?.text || '';
    const body = parsed.text || '';

    const category = await categorizeEmail(`${subject}\n${body}`);

    const doc = {
      from,
      to,
      subject,
      body,
      timestamp: parsed.date || new Date(),
      folder: 'INBOX',
      account,
      category,
    };

    await esClient.index({
      index: 'emails',
      body: doc,
    });

    console.log(`📥 Indexed email: "${subject}" → Category: ${category}`);

    if (category.toLowerCase() === 'interested') {
      await sendSlackNotification(doc);
      await sendExternalWebhook(doc);
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(`⚠️ Error processing email for ${account}:`, err.message);
    } else {
      console.error(`⚠️ Error processing email for ${account}:`, err);
    }
  }
};

const connectImapAccount = async ({ user, pass }: { user: string; pass: string }) => {
  const client = new ImapFlow({
    host: 'imap.gmail.com',
    port: 993,
    secure: true,
    auth: { user, pass },
  });

  try {
    await client.connect();
    await client.mailboxOpen('INBOX');
    console.log(`📬 Connected to IMAP: ${user}`);

    const messages = client.fetch({ since: sinceDate }, { source: true });
    for await (const msg of messages) {
      if (msg && typeof msg !== 'boolean' && msg.source) {
        const parsed = await simpleParser(msg.source as Buffer);
        await processEmail(parsed, user);
      }
    }

    client.on('exists', async () => {
      const lock = await client.getMailboxLock('INBOX');
      try {
        const latest = await client.fetchOne('*', { source: true });
        if (latest && typeof latest !== 'boolean' && latest.source) {
          const parsed = await simpleParser(latest.source as Buffer);
          await processEmail(parsed, user);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error(`📛 Error while processing new mail for ${user}:`, err.message);
        } else {
          console.error(`📛 Error while processing new mail for ${user}:`, err);
        }
      } finally {
        lock.release();
      }
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(`❌ Connection error for ${user}:`, err.message);
    } else {
      console.error(`❌ Connection error for ${user}:`, err);
    }
  }
};

export const startImapSync = async () => {
  for (const acc of accounts) {
    if (acc.user && acc.pass) {
      connectImapAccount(acc).catch((err: unknown) => {
        if (err instanceof Error) {
          console.error(`❌ IMAP error for ${acc.user}:`, err.message);
        } else {
          console.error(`❌ IMAP error for ${acc.user}:`, err);
        }
      });
    } else {
      console.warn(`⚠️ Skipping empty email account configuration`);
    }
  }
};

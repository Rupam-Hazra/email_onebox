import axios from 'axios';
import config from '../config/config';

export const sendSlackNotification = async (email: {
  from: string;
  to: string;
  subject: string;
  body: string;
}) => {
  if (!config.slackWebhookUrl) return;

  const message = {
    text: ` *Interested Lead Alert!*
*From:* ${email.from}
*Subject:* ${email.subject}
*Body:* ${email.body.slice(0, 300)}...`
  };

  try {
    await axios.post(config.slackWebhookUrl, message);
    console.log('Slack notification sent');
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Slack notification failed:', error.message);
    } else {
      console.error('Slack notification failed:', error);
    }
  }
  
};

export const sendExternalWebhook = async (email: any) => {
  if (!config.externalWebhookUrl) return;

  try {
    await axios.post(config.externalWebhookUrl, email);
    console.log('External webhook triggered');
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Slack notification failed:', error.message);
    } else {
      console.error('Slack notification failed:', error);
    }
  }
  
};

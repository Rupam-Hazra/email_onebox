import axios from 'axios';
import config from '../config/config';

interface EmailData {
  from: string;
  to: string;
  subject: string;
  body: string;
  [key: string]: any; // Allows additional optional fields
}

export const sendSlackNotification = async (email: EmailData) => {
  if (!config.slackWebhookUrl) return;

  const message = {
    text: `*📩 Interested Lead Alert!*
*From:* ${email.from}
*Subject:* ${email.subject}
*Body:* ${email.body.slice(0, 300)}...`, // Truncate long body
  };

  try {
    await axios.post(config.slackWebhookUrl, message);
    console.log('✅ Slack notification sent');
  } catch (error: any) {
    console.error('❌ Slack notification failed:', error?.message || error);
  }
};

export const sendExternalWebhook = async (email: EmailData) => {
  if (!config.externalWebhookUrl) return;

  try {
    await axios.post(config.externalWebhookUrl, email);
    console.log('✅ External webhook triggered');
  } catch (error: any) {
    console.error('❌ External webhook failed:', error?.message || error);
  }
};

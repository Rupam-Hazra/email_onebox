import dotenv from 'dotenv';
dotenv.config();

const config = {
  port: Number(process.env.PORT) || 7000,
  elasticUrl: process.env.ELASTIC_URL || 'http://localhost:9200',
  openaiKey: process.env.OPENAI_SECRET_KEY || '',
  slackWebhookUrl: process.env.SLACK_WEBHOOK_URL || '',
  externalWebhookUrl: process.env.TRIGGER_WEBHOOK_URL || ''
};

export default config;

import dotenv from 'dotenv';
dotenv.config();

const config = {
  port: Number(process.env.PORT) || 7001,
  elasticUrl: process.env.ELASTIC_URL || 'http://localhost:9200',
  ollamaUrl: process.env.OLLAMA_URL || 'http://localhost:11434',
  slackWebhookUrl: process.env.SLACK_WEBHOOK_URL || '',
  externalWebhookUrl: process.env.TRIGGER_WEBHOOK_URL || '',
};

export default config;

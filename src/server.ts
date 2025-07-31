import app from './app';
import config from './config/config';
import { initializeElasticsearch } from './services/elasticService';
import { startImapSync } from './services/imapService';

const startServer = async () => {
  try {
    console.log('🧠 Initializing Elasticsearch...');
    await initializeElasticsearch();

    console.log('🚀 Starting Express server...');
    app.listen(config.port, () => {
      console.log(`✅ Server is running at http://localhost:${config.port}`);
    });

    console.log('📩 Starting IMAP sync...');
    await startImapSync();
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('❌ Server failed to start:', err.message);
    } else {
      console.error('❌ Server failed to start:', err);
    }
    process.exit(1);
  }
};

startServer();

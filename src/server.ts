import app from './app';
import config from './config/config';
import { initializeElasticsearch } from './services/elasticService';
import { startImapSync } from './services/imapService';

const startServer = async () => {
  try {
    // Initialize Elasticsearch index
    await initializeElasticsearch();

    // Start Express server
    app.listen(config.port, () => {
      console.log(`🚀 Server is running on http://localhost:${config.port}`);
    });

    // Start IMAP sync for all accounts
    await startImapSync();
  } catch (err) {
    console.error('❌ Server failed to start:', err);
    process.exit(1);
  }
};

startServer();

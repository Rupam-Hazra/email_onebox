import app from './app';
import config from './config/config';
import { initializeElasticsearch } from './services/elasticService';

const startServer = async () => {
  try {
    
    await initializeElasticsearch();

    app.listen(config.port, () => {
      console.log(`Server is running on http://localhost:${config.port}`);
    });
  } catch (err) {
    console.error('Server failed to start:', err);
    process.exit(1);
  }
};

startServer();

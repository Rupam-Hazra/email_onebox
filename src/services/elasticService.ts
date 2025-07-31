import { Client } from '@elastic/elasticsearch';
import config from '../config/config';

const esClient = new Client({ node: config.elasticUrl });

const initializeElasticsearch = async () => {
  const indexName = 'emails';

  try {
    const exists = await esClient.indices.exists({ index: indexName });

    if (!exists.body) {
      // Create index with initial mapping
      await esClient.indices.create({
        index: indexName,
        body: {
          mappings: {
            properties: {
              from: { type: 'keyword' },
              to: { type: 'keyword' },
              subject: { type: 'text' },
              body: { type: 'text' },
              timestamp: { type: 'date' },
              folder: { type: 'keyword' },
              account: { type: 'keyword' },
              category: { type: 'keyword' },
            },
          },
        },
      });

      console.log(`✅ Created and mapped index: ${indexName}`);
    } else {
      console.log(`ℹ️ Elasticsearch index "${indexName}" already exists.`);
    }
  } catch (err) {
    console.error('❌ Elasticsearch initialization error:', err);
  }
};

export { esClient, initializeElasticsearch };

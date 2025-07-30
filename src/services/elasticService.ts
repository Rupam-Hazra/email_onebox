import { Client } from '@elastic/elasticsearch';
import config from '../config/config';

const esClient = new Client({ node: config.elasticUrl });

const initializeElasticsearch = async () => {
  const indexName = 'emails';

  // Check if the index already exists
  const { body: exists } = await esClient.indices.exists({ index: indexName });
  if (!exists) {
    // Create index
    await esClient.indices.create({ index: indexName });

    // Define mapping
    await esClient.indices.putMapping({
      index: indexName,
      body: {
        properties: {
          from: { type: 'keyword' },
          to: { type: 'keyword' },
          subject: { type: 'text' },
          body: { type: 'text' },
          timestamp: { type: 'date' } // also recommended
        }
      }
    });

    console.log(`Created and mapped index: ${indexName}`);
  } else {
    console.log(`Elasticsearch index "${indexName}" already exists.`);
  }
};

export  { esClient, initializeElasticsearch };



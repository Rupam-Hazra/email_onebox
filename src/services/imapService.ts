import { ImapFlow } from 'imapflow';
import { simpleParser } from 'mailparser';
import { esClient } from './elasticService';
import { categorizeEmail } from './emailCategorizer';
import { sendSlackNotification, sendExternalWebhook } from './notificationService';
import config from '../config/config';

const sinceDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Last 30 days

const accounts = [
  {
    user: 'your-email-1@gmail.com',
    pass: 'your-app-password-1',
  },
  {
    user: 'your-email-2@gmail.com',
    pass: 'your-app-password-2',
  },
];

const processEmail = async (parsed: any, account: string) => {
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

  // ✅ Fixed for Elasticsearch v7
  await esClient.index({
    index: 'emails',
    body: doc, // ❗️ Use "body" for ES v7, not "document"
  });

  console.log(`📥 Indexed email: "${subject}" → Category: ${category}`);

  if (category === 'Interested') {
    await sendSlackNotification(doc);
    await sendExternalWebhook(doc);
  }
};

const connectImapAccount = async ({ user, pass }: { user: string; pass: string }) => {
  const client = new ImapFlow({
    host: 'imap.gmail.com',
    port: 993,
    secure: true,
    auth: { user, pass },
  });

  await client.connect();
  await client.mailboxOpen('INBOX');
  console.log(`📬 Connected to IMAP: ${user}`);

  const messages = client.fetch({ since: sinceDate }, { source: true });
  for await (const msg of messages) {
    if (msg && 'source' in msg && msg.source) {
      const parsed = await simpleParser(msg.source as Buffer);
      await processEmail(parsed, user);
    }
  }

  client.on('exists', async () => {
    const lock = await client.getMailboxLock('INBOX');
    try {
      const latest = await client.fetchOne('*', { source: true });
      if (latest && 'source' in latest && latest.source) {
        const parsed = await simpleParser(latest.source as Buffer);
        await processEmail(parsed, user);
      }
    } catch (err) {
      console.error(`📛 Error while processing new mail for ${user}:`, err);
    } finally {
      lock.release();
    }
  });
};

export const startImapSync = async () => {
  for (const acc of accounts) {
    connectImapAccount(acc).catch(err => {
      console.error(`❌ IMAP error for ${acc.user}:`, err.message);
    });
  }
};

import { ImapFlow } from 'imapflow';
import { simpleParser } from 'mailparser';
import dotenv from 'dotenv';

dotenv.config();

const testAccount = {
  user: process.env.IMAP_USER_1 || '',
  pass: process.env.IMAP_PASS_1 || '',
};

async function testImapConnection() {
  const client = new ImapFlow({
    host: 'imap.zoho.in',
    port: 993,
    secure: true,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  try {
    await client.connect();
    console.log(`✅ Connected to IMAP for ${testAccount.user}`);

    await client.mailboxOpen('INBOX');

    let count = 0;
    const maxMessages = 5;

    const messages = client.fetch({ seq: '1:*' }, { envelope: true, source: true });

    for await (const message of messages) {
      if (message.source) {
        const parsed = await simpleParser(message.source as Buffer);
        console.log(`📨 Subject: ${parsed.subject}`);
        console.log(`📧 From: ${parsed.from?.text}`);
        console.log(`📝 Body: ${parsed.text?.slice(0, 100)}\n`);
      }

      count++;
      if (count >= maxMessages) break;
    }

    await client.logout();
    console.log('📤 Logged out of IMAP');
  } catch (error) {
    console.error(`❌ IMAP test error:`, error);
  }
}

testImapConnection();

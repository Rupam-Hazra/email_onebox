
# 📬 Email Onebox Backend

A feature-rich backend system that aggregates multiple email accounts into a unified inbox (onebox). Supports real-time IMAP syncing, full-text search via Elasticsearch, AI-based email categorization using local LLMs (Ollama), Slack/webhook notifications, and a clean modular architecture.

---

## 🔧 Features

- 🔄 IMAP Email Aggregation (Zoho, Gmail, etc.)
- 📦 Stores emails in Elasticsearch for fast querying
- 🤖 AI Categorization (e.g. Interested, Spam, Unread)
- 🔔 Slack & Webhook Notifications for important emails
- 💡 AI-powered Suggested Replies (RAG-ready structure)
- 🧪 Modular, testable TypeScript backend
- 🐳 Docker-ready for deployment

---

## 📁 Folder Structure

```
email-onebox-backend/
├── src/
│   ├── config/               # Environment & IMAP config
│   ├── controllers/          # API logic (if needed)
│   ├── middlewares/          # Express middlewares
│   ├── models/               # (Optional) data models
│   ├── routes/               # Route definitions
│   ├── services/             # Core services: IMAP, LLM, Elastic, Notify
│   ├── app.ts                # App initialization
│   └── server.ts             # Server entry point
├── .env                      # Environment variables
├── .gitignore
├── Dockerfile
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourname/email-onebox-backend.git
cd email-onebox-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Update the `.env` file:

```env
PORT=7001
NODE_ENV=development

# Elasticsearch
ELASTIC_URL=http://localhost:9200

# Ollama (Local LLM)
OLLAMA_URL=http://localhost:11434

# Notification Webhooks
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
TRIGGER_WEBHOOK_URL=https://webhook.site/...

# IMAP Email Account 1
IMAP_EMAIL_1=your_email@provider.com
IMAP_PASS_1=your_password

# IMAP Email Account 2
IMAP_EMAIL_2=another_email@provider.com
IMAP_PASS_2=your_password
```

### 4. Start Development Server

```bash
npm run dev
```

---

## 🧠 Tech Stack

- **Node.js + Express**
- **TypeScript**
- **IMAPFlow** for email sync
- **Mailparser** to parse raw emails
- **Elasticsearch** for email search
- **LangChain + Ollama** for AI classification
- **Slack/Webhook** integration for notifications

---

## 🐳 Docker Support

To build and run with Docker:

```bash
docker build -t email-onebox-backend .
docker run -p 7001:7001 --env-file .env email-onebox-backend
```

---

## ✅ Git Best Practices

Ensure the following are excluded from Git (already in `.gitignore`):

```gitignore
node_modules
package-lock.json
.env
```

If `package-lock.json` is still tracked, remove it once:

```bash
git rm --cached package-lock.json
```

---

## 📬 Future Enhancements

- [ ] Suggested replies using vector DB + LLM (RAG)
- [ ] OAuth2 support for Gmail/Zoho
- [ ] Admin dashboard UI for viewing logs/email history

---

## 📄 License

MIT © 2025 Your Name

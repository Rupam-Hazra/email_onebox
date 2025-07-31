import express, { Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';

import emailRoutes from './routes/emailRoutes'; 
import suggestedReplyRoutes from './routes/suggestedReplyRoutes'; // ✅ NEW: Suggested reply routes

const app = express();

// 🛡 Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// 📬 Email API Routes
app.use('/emails', emailRoutes);

// 🤖 AI Reply Suggestion Route
app.use('/ai', suggestedReplyRoutes); // ✅ Mount under /ai

// 🏁 Health check
app.get('/', (req: Request, res: Response) => {
  res.status(200).send('✅ Email API is running!');
});

export default app;

import express from 'express';
import { generateSuggestedReply } from '../services/ollamaService';

const router = express.Router();

// ✅ Step 2: Test route to check if the /ai path is working
router.get('/test', (req, res) => {
  res.send('🤖 Suggested Reply Test OK');
});

router.post('/suggest-reply', async (req, res) => {
  const { context, email } = req.body;

  if (!context || !email) {
    return res.status(400).json({ error: 'Missing context or email in request body' });
  }

  try {
    const reply = await generateSuggestedReply(context, email);
    res.status(200).json({ reply });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate suggested reply' });
  }
});

export default router;

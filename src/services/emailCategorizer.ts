import axios from 'axios';

const systemPrompt = `
You are an AI that categorizes email leads into the following types:
- Interested
- Meeting Booked
- Not Interested
- Spam
- Out of Office

Respond with only one of the above labels. No explanation.
`;

export const categorizeEmail = async (emailContent: string): Promise<string> => {
  const prompt = `${systemPrompt}\n\nEmail:\n${emailContent}\n\nLabel:`;

  try {
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: 'mistral', // or llama3, whichever you're using
      prompt,
      stream: false,
    });

    const label = response.data.response.trim();

    // Normalize output
    const allowedLabels = ['Interested', 'Meeting Booked', 'Not Interested', 'Spam', 'Out of Office'];
    return allowedLabels.includes(label) ? label : 'Unknown';
  } catch (error: any) {
    console.error('Failed to categorize email:', error.message);
    return 'Unknown';
  }
};

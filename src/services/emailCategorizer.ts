import openai from './openaiService';

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
  const chatCompletion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: emailContent }
    ],
    temperature: 0.2
  });

  const response = chatCompletion.choices[0]?.message?.content?.trim();
  return response || 'Unknown';
};

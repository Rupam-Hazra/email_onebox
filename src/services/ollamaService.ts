import axios from 'axios';

export const generateSuggestedReply = async (context: string, email: string): Promise<string> => {
  const prompt = `You are an AI assistant. Based on the following context and email, generate a professional and helpful reply.\n\nContext:\n${context}\n\nEmail:\n${email}\n\nReply:`;

  try {
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: 'mistral', // or llama3, depending on what you have
      prompt,
      stream: false,
    });

    return response.data.response.trim();
  } catch (error: any) {
    console.error('🔥 Ollama Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw new Error('Failed to generate response from Ollama');
  }
};

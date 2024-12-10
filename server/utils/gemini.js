import { DiscussServiceClient } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const client = new DiscussServiceClient({
  apiKey: process.env.GEMINI_API_KEY,
});

export const getGeminiResponse = async (prompt) => {
  try {
    const [response] = await client.generateText({
      model: 'models/text-bison-001', // Update with the desired Gemini model
      temperature: 0.7, // Adjust for randomness in output
      candidateCount: 1, // Number of generated responses
      prompt,
    });

    return response?.candidates?.[0]?.output || 'No response generated.';
  } catch (error) {
    console.error('Error with Gemini API:', error);
    throw new Error('Failed to get a response from the Gemini API');
  }
};

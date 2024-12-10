import express from 'express';
import { getGeminiResponse } from '../utils/gemini.js';

const router = express.Router();

// Chat endpoint
router.post('/', async (req, res) => {
  const { role, input } = req.body;

  if (!role || !input) {
    return res.status(400).json({ message: 'Role and input are required.' });
  }

  try {
    // Create a role-specific prompt
    const prompt = `Role: ${role}. Input: ${input}. Follow up with clarifying questions based on the role.`;

    // Get Gemini API response
    const response = await getGeminiResponse(prompt);

    // Send back the response
    res.json({ response });
  } catch (error) {
    console.error('Error in chat route:', error);
    res.status(500).json({ message: 'Failed to process the chat request' });
  }
});

export default router;

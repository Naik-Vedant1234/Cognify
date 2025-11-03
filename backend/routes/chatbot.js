import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

router.post('/message', async (req, res) => {
  try {
    const { message, context } = req.body;

    console.log('Chatbot request received:', { message, hasContext: !!context });

    if (!process.env.GEMINI_API_KEY) {
      console.error('Gemini API key not configured');
      return res.status(500).json({
        success: false,
        error: 'Gemini API key not configured. Please add GEMINI_API_KEY to your .env file.'
      });
    }

    const prompt = `You are Cog, an AI assistant specifically designed for Cognify - a time tracking and productivity platform for students.

STRICT RULES:
1. ONLY answer questions about:
   - Time management and productivity
   - Study habits and techniques
   - Using Cognify features (time tracking, focus mode, analytics)
   - Managing distractions and staying focused
   - Goal setting and planning
   - Work-life balance for students

2. If the user asks about ANYTHING ELSE (weather, sports, cooking, general knowledge, etc.), politely decline and redirect them to productivity topics.

3. Keep responses concise (2-3 sentences max) and actionable.

4. Be friendly, encouraging, and supportive.

5. If asked about unrelated topics, respond with: "I'm Cog, your productivity assistant! I can only help with time management, study tips, and using Cognify. How can I help you be more productive today?"

User's context: ${context ? JSON.stringify(context) : 'No context provided'}

User message: ${message}

Your response:`;

    console.log('Sending request to Gemini API...');

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini API error:', data);
      throw new Error(data.error?.message || 'Failed to get response from Gemini');
    }

    const text = data.candidates[0].content.parts[0].text;
    console.log('Gemini response received:', text.substring(0, 100) + '...');

    res.json({ success: true, response: text });
  } catch (error) {
    console.error('Chatbot error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get AI response. Please check your API key and try again.'
    });
  }
});

export default router;

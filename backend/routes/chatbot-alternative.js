import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

// Try different model names in order
const MODELS_TO_TRY = [
  'gemini-2.5-flash'
];

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

    // Try each model until one works
    let lastError = null;

    for (const modelName of MODELS_TO_TRY) {
      try {
        console.log(`Trying model: ${modelName}...`);

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${process.env.GEMINI_API_KEY}`,
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

        if (response.ok && data.candidates && data.candidates[0]) {
          const text = data.candidates[0].content.parts[0].text;
          console.log(`Success with model ${modelName}!`);
          console.log('Response:', text.substring(0, 100) + '...');

          return res.json({ success: true, response: text });
        } else {
          console.log(`Model ${modelName} failed:`, data.error?.message);
          lastError = data.error?.message || 'Unknown error';
        }
      } catch (error) {
        console.log(`Model ${modelName} error:`, error.message);
        lastError = error.message;
      }
    }

    // If we get here, all models failed
    throw new Error(`All models failed. Last error: ${lastError}`);

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

import { Router } from 'express';
import openai from '../services/openaiConfig.js';

const router = Router();

// PrePrompt
const prePrompt = `
You are a specialized assistant with expertise in blockchain staking, particularly using Kiln services.
Your goal is to provide precise and real-time insights based on Kiln's API data.
Use the provided JSON data to answer staking-related queries accurately.
If you lack relevant information, respond concisely and suggest general blockchain staking principles.
`;

// 
router.post('/ask', async (req, res) => {
  try {
    console.log("Request received in chatbot:", req.body);

    const userQuestion = req.body?.question;
    const kilnData = req.body?.kilnData;

    if (!userQuestion) {
      return res.status(400).json({ error: 'Question is required' });
    }

   
    const context = kilnData ? JSON.stringify(kilnData) : "No Kiln data available.";

    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: "system", content: prePrompt + "\n\nKiln Data: " + context },
        { role: "user", content: userQuestion }
      ],
      temperature: 0.9,
    });

    console.log(completion);

    res.json({
      answer: completion.choices[0]?.message?.content || "No response from OpenAI."
    });

  } catch (error) {
    console.error(' OpenAI API Error:', error.response ? error.response.data : error.message);
    res.status(500).json({
      error: 'Failed to get a response from OpenAI',
      details: error.response ? error.response.data : error.message
    });
  }
});

export default router;

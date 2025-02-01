// import { Router } from 'express';
// import openai from '../services/openaiConfig.js';
// import fetch from 'node-fetch';

// const router = Router();

// // 🔥 PrePrompt optimisé pour le staking et Kiln API
// const prePrompt = `
// You are a specialized assistant with expertise in blockchain staking, particularly using Kiln services.
// Your goal is to provide precise and real-time insights based on Kiln's API data.
// Use the provided JSON data to answer staking-related queries accurately.
// If you lack relevant information, respond concisely and suggest general blockchain staking principles.
// `;



// router.post('/ask', async (req, res) => {
//   try {
//     const userQuestion = req.body?.question;
//     if (!userQuestion) {
//       return res.status(400).json({ error: 'Question is required' });
//     }

//     const kilnData = await fetchKilnData();
//     const context = kilnData ? JSON.stringify(kilnData) : "No Kiln data available.";

//     const completion = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: [
//         { role: "system", content: prePrompt + "\n\nKiln Data: " + context },
//         { role: "user", content: userQuestion }
//       ],
//       temperature: 0.7,
//     });

//     res.json({
//       answer: completion.choices[0].message.content
//     });

//   } catch (error) {
//     console.error('Error handling chatbot request:', error);
//     res.status(500).json({ error: error.message });
//   }
// });

// export default router;
import { Router } from 'express';
import openai from '../services/openaiConfig.js';

const router = Router();

// 🔥 PrePrompt optimisé pour le staking et Kiln API
const prePrompt = `
You are a specialized assistant with expertise in blockchain staking, particularly using Kiln services.
Your goal is to provide precise and real-time insights based on Kiln's API data.
Use the provided JSON data to answer staking-related queries accurately.
If you lack relevant information, respond concisely and suggest general blockchain staking principles.
`;

// 📌 Route pour répondre aux questions
router.post('/ask', async (req, res) => {
  try {
    const userQuestion = req.body?.question;
    const kilnData = req.body?.kilnData; // Récupère les données de Kiln envoyées par BrainRoute

    if (!userQuestion) {
      return res.status(400).json({ error: 'Question is required' });
    }

    if (!kilnData) {
      return res.status(400).json({ error: 'Kiln data is required' });
    }

    // Formater les données Kiln (si elles existent) en chaîne JSON pour le prompt
    const context = kilnData ? JSON.stringify(kilnData) : "No Kiln data available.";

    // Appel à OpenAI avec les données et la question
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: prePrompt + "\n\nKiln Data: " + context },
        { role: "user", content: userQuestion }
      ],
      temperature: 0.7,
    });

    res.json({
      answer: completion.choices[0].message.content
    });

  } catch (error) {
    console.error('Error handling chatbot request:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;

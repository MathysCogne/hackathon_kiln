// backend/app.js

const express = require('express');
const axios = require('axios');
const { OpenAI } = require('openai');  // Utilisation de l'API OpenAI pour GPT

const app = express();
const port = 3000;

// Middleware pour parser les données JSON
app.use(express.json());

// Configuration de l'API OpenAI
const openai = new OpenAI({
  apiKey: 'YOUR_OPENAI_API_KEY',  // Remplace par ta clé API OpenAI
});

// Fonction pour récupérer des données de Kiln
const getKilnData = async (endpoint) => {
  try {
    const response = await axios.get(`https://api.kiln.fi/${endpoint}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching Kiln data:', error);
    return null;
  }
};

// Route pour interroger le chatbot
app.post('/api/chatbot', async (req, res) => {
  const userMessage = req.body.message;

  let apiEndpoint = '';
  let aiPrompt = '';

  // Analyser la question de l'utilisateur
  if (userMessage.toLowerCase().includes('utilisateurs actifs')) {
    apiEndpoint = '/api/users/active';  // Exemple de endpoint Kiln pour les utilisateurs actifs
    aiPrompt = 'Utilise les données des utilisateurs actifs pour répondre à la question de l\'utilisateur.';
  } else if (userMessage.toLowerCase().includes('transactions')) {
    apiEndpoint = '/api/transactions';  // Exemple de endpoint Kiln pour les transactions
    aiPrompt = 'Utilise les données des transactions pour répondre à la question de l\'utilisateur.';
  } else {
    aiPrompt = 'Réponds à cette question sans données de Kiln.';
  }

  // Récupérer les données de Kiln (si nécessaire)
  let kilnData;
  if (apiEndpoint) {
    kilnData = await getKilnData(apiEndpoint);  // Appel API vers Kiln
  }

  // Créer un prompt pour GPT
  const prompt = `${aiPrompt} Donne-moi une réponse avec ces données : ${JSON.stringify(kilnData)}`;

  try {
    // Demander une réponse à GPT
    const aiResponse = await openai.chat.completions.create({
      model: 'gpt-4',  // ou gpt-3.5 si tu préfères une version plus économique
      messages: [{ role: 'system', content: 'Tu es un assistant virtuel qui aide avec des données blockchain.' },
                { role: 'user', content: userMessage },
                { role: 'assistant', content: prompt }],
    });

    // Retourner la réponse de GPT
    res.json({ reply: aiResponse.choices[0].message.content });
  } catch (error) {
    console.error('Error generating AI response:', error);
    res.status(500).send('Error generating AI response');
  }
});

module.exports = app;

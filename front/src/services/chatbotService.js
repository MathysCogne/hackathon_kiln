import axios from 'axios';

export const askChatbot = async (question) => {
  try {
    // Appel à la route brain de ton API pour orchestrer tout le processus
    const response = await axios.post('http://localhost:3000/api/brain/brain', { prompt: question });
    
    // Retourner la réponse d'OpenAI après traitement par la route brain
    return response.data.answer;
  } catch (error) {
    console.error('Error:', error);
    throw new Error('Error, try again later.');
  }
};

import { Router } from 'express';
import axios from 'axios';

const router = Router();


const KILN_API_URL = 'http://localhost:3000/api/kiln/kiln';  
const OPENAI_URL = 'http://localhost:3000/api/chatbot/ask';  

// Minite token for GPT
const MAX_TOKENS = 4096;

router.post('/brain', async (req, res) => {
  try {
    const userPrompt = req.body.prompt;
    if (!userPrompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    console.log('🔍 Received user prompt:', userPrompt);

    // ANALYSE SEMANTIC DU PROMPT AVEC LE SCRIPT PYTHON
    const scriptData = await executeScript(userPrompt);
    console.log('📊 Script Output:', scriptData);

    let kilnData = null;
	
    let promptContext = "You are an AI assistant specialized in blockchain and staking.";

    
    // RECUP DATA DE API KILN
    if (scriptData) {
      kilnData = await fetchKilnData(scriptData);
      console.log('📡 Kiln Data:', kilnData);
    }

    // CREATE PROMPT CONTEXT
    if (scriptData && scriptData.keywords) {
      promptContext += ` The user is asking about "${scriptData.keywords.join(', ')}".`;
    }

    if (kilnData && Object.keys(kilnData).length > 0) {
      promptContext += ` Here is the latest blockchain data from Kiln API: ${JSON.stringify(kilnData)}.`;
    } else {
      promptContext += " No relevant blockchain data was found.";
    }

    promptContext += ` The user asked: "${userPrompt}". Provide a precise and relevant answer.`;

    console.log('Final Prompt:', promptContext);

    // TRUNCATE PROMPT FOR TOKEN LIMIT
    const tokenCount = countTokens(promptContext);
    if (tokenCount > MAX_TOKENS) {
      console.log('Prompt exceeds the maximum token limit. Truncating...');
      promptContext = truncatePrompt(promptContext);
    }

    // CALL OPENAI API
    const aiResponse = await queryOpenAI(promptContext);
    console.log('🤖 OpenAI Response:', aiResponse);

    // SEND TO USER
    res.json({ answer: aiResponse });

  } catch (error) {
    console.error('❌ Error in brain route:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;

//
//  Utilitaires
//

// Python
const executeScript = async (input) => {
  try {
    const response = await axios.post('http://localhost:3000/api/python/execute-script', { prompt: input });
    return response.data; 
  } catch (error) {
    console.error('❌ Error executing Python script:', error.message);
    throw new Error('Failed to execute Python script');
  }
};

const fetchKilnData = async (scriptData) => {
  try {
    const requestBody = {
      call: scriptData.call,
      start_date: scriptData.start_date,
      end_date: scriptData.end_date,
      addr: scriptData.addr
    };

    console.log('Sending to Kiln:', requestBody);

    const response = await axios.post(KILN_API_URL, requestBody);
    return response.data;
  } catch (error) {
    console.error(' Error fetching Kiln API:', error.message);
    console.error(' Request data:', error.config?.data);
    return null;
  }
};

// OPENAI
const queryOpenAI = async (prompt) => {
  try {
    const response = await axios.post(OPENAI_URL, { question: prompt });
    return response.data.answer;
  } catch (error) {
    console.error('❌ Error in OpenAI request:', error);
    return "I'm sorry, I couldn't process your request.";
  }
};

// PROMPT LIMIT
const countTokens = (text) => {
  return Math.ceil(text.length / 4); 
};

//TRECUNT 
const truncatePrompt = (text) => {
  return text.slice(0, MAX_TOKENS * 4);
};

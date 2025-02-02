
import React, { useState } from 'react';
import { askChatbot } from '../services/chatbotService';
import ChatHistory from './ChatHistory';
import ChatInput from './ChatInput';
import BlockchainBackground from './BlockchainBackground';

const WELCOME_MESSAGE = {
  user: null,
  bot: <>
    Hi there ! 👋 <br/>I'm your AI assistant specialized in blockchain and staking 🚀<br/><br/>
    Powered by Kiln’s API, I provide real-time insights on staking rewards, validator statuses, ETH network stats, and much more. Whether you want to track your portfolio, analyze trends, or optimize your staking strategy, I’ve got you covered. 🔍<br/><br/>
    What would you like to explore today ?
  </>
};

const Chatbot = () => {
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);

  const handleUserSubmit = async () => {
    if (!userInput.trim()) return;

    const newChat = { user: userInput, bot: '...' };
    setChatHistory([...chatHistory, newChat]);
    setUserInput('');
    setIsLoading(true);

    try {
      const botResponse = await askChatbot(userInput);
      setChatHistory((prevChatHistory) => [
        ...prevChatHistory.slice(0, -1),
        { user: userInput, bot: botResponse }
      ]);
    } catch (error) {
      setChatHistory((prevChatHistory) => [
        ...prevChatHistory.slice(0, -1),
        { user: userInput, bot: 'Error, try again later.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black">
      <BlockchainBackground />
      <div className="absolute inset-0 flex flex-col">
        <main className="flex-1 overflow-hidden flex flex-col bg-gradient-to-b from-black/90 to-gray-900/90 backdrop-blur-sm">
          <ChatHistory chatHistory={chatHistory} isLoading={isLoading} />
          <ChatInput userInput={userInput} setUserInput={setUserInput} handleUserSubmit={handleUserSubmit} />
        </main>
      </div>
    </div>
  );
};

export default Chatbot;

import React, { useRef, useEffect, useState } from 'react';

const EXAMPLE_PROMPTS = [
  "Can you show me the latest transactions for this wallet <wallet> ?",
  "What is the current price of Bitcoin ?",
  "Can you provide more details on the transactions for this wallet <wallet> ?",
  "Can you give me the day gross api stats from Kiln ?",
  "How many ETH validators are there ?",
  "Can you provide Ethereum network statistics ?",
  "Can you fetch the latest rewards for this wallet <wallet> ?",
  "What is the validator for this wallet <wallet> ?",
  "What is the status of transaction <tx_hash> ?",
];

const ChatInput = ({ userInput, setUserInput, handleUserSubmit }) => {
  const textareaRef = useRef(null);
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [userInput]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleUserSubmit();
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholderIndex((prevIndex) => 
        prevIndex === EXAMPLE_PROMPTS.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let typingTimer;
    let currentIndex = 0;
    let currentText = EXAMPLE_PROMPTS[currentPlaceholderIndex];

    const typeCharacter = () => {
      if (currentIndex < currentText.length) {
        setDisplayedPlaceholder(currentText.substring(0, currentIndex + 1));
        currentIndex++;
        typingTimer = setTimeout(typeCharacter, 50);
      } else {
        setIsTyping(false);
        setTimeout(() => {
          setIsTyping(true);
          setCurrentPlaceholderIndex((prevIndex) =>
            prevIndex === EXAMPLE_PROMPTS.length - 1 ? 0 : prevIndex + 1
          );
        }, 2000);
      }
    };

    if (isTyping) {
      currentIndex = 0;
      typeCharacter();
    }

    return () => clearTimeout(typingTimer);
  }, [currentPlaceholderIndex, isTyping]);

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-4">
      <div className="flex items-center backdrop-blur-md rounded-lg shadow-lg overflow-hidden
                    border border-gray-800/50 bg-black/40
                    transition-all duration-200
                    hover:border-orange-500/30 hover:bg-black/60
                    focus-within:border-orange-500/50 focus-within:ring-1 focus-within:ring-orange-500/30">
        <textarea
          ref={textareaRef}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={handleKeyPress}
          rows={1}
          className="flex-1 py-2.5 px-4 bg-transparent text-gray-100 text-sm
                   placeholder-gray-500 transition-colors duration-200
                   border-none outline-none focus:ring-0
                   resize-none overflow-hidden min-h-[42px] max-h-[120px]"
          placeholder={displayedPlaceholder}
        />
        <button
          onClick={handleUserSubmit}
          className="h-full px-4 bg-transparent text-gray-400
                   transition-all duration-200
                   hover:text-orange-500
                   focus:outline-none
                   cursor-pointer"
          aria-label="Send message"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            className="w-5 h-5 transform rotate-90 transition-transform duration-200 hover:scale-110"
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <line x1="12" y1="19" x2="12" y2="5" />
            <polyline points="5 12 12 5 19 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatInput;

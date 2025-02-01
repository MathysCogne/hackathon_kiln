import React, { useRef, useEffect } from 'react';

const ChatInput = ({ userInput, setUserInput, handleUserSubmit }) => {
  const textareaRef = useRef(null);

  // Ajuster automatiquement la hauteur du textarea
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  // Ajuster la hauteur lors de la saisie
  useEffect(() => {
    adjustTextareaHeight();
  }, [userInput]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleUserSubmit();
    }
  };

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
          placeholder="Type your message..."
        />
        <button
          onClick={handleUserSubmit}
          className="h-full px-6 bg-transparent text-gray-400 text-sm
                   transition-colors duration-200
                   group-hover:text-orange-500 hover:text-orange-500
                   focus:outline-none whitespace-nowrap
                   cursor-pointer"
        >
						{/* <img src="/logo_alone.svg" alt="Kiln Logo" className="w-4 h-4" /> */}
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatInput;

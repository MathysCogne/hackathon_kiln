import React from 'react';

const ChatHistory = ({ chatHistory, isLoading }) => {
  return (
    <div className="flex-1 overflow-y-auto space-y-12 p-6 pb-24">
      {chatHistory.map((chat, index) => (
        <div key={index} className="space-y-6 max-w-3xl mx-auto">
          {/* Message utilisateur - affiché uniquement si ce n'est pas le message initial ET si le message n'est pas vide */}
          {chat.type !== 'initial' && chat.user && chat.user.trim() !== '' && (
            <div className="flex justify-end space-x-3">
              <div className="max-w-[80%]">
                <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 text-gray-100
                              border border-gray-700/50 shadow-lg
                              transform transition-all duration-200">
                  {chat.user}
                </div>
              </div>
            </div>
          )}

          {/* Réponse de l'IA */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-orange-500/70 text-xs uppercase tracking-wider pl-1">
              <img src="/logo_alone.svg" alt="Kiln Logo" className="w-4 h-4" />
              <span>Kiln Assistant</span>
            </div>
            <div className="text-gray-100 leading-relaxed whitespace-pre-wrap">
              {chat.bot}
            </div>
          </div>
        </div>
      ))}
      {isLoading && (
        <div className="flex items-center space-x-2 text-orange-500/70">
          <div className="w-1.5 h-1.5 rounded-full bg-orange-500/70 animate-pulse"></div>
          <div className="text-sm">Generating response...</div>
        </div>
      )}
    </div>
  );
};

export default ChatHistory;

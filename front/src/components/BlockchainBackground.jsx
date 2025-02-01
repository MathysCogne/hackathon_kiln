import React from 'react';

const BlockchainBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="blockchain-grid"></div>
      <style jsx="true">{`
        .blockchain-grid {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
            linear-gradient(transparent 97%, rgba(234, 88, 12, 0.1) 100%),
            linear-gradient(90deg, transparent 97%, rgba(234, 88, 12, 0.1) 100%);
          background-size: 50px 50px;
        }

        /* Styles globaux pour la scrollbar */
        ::-webkit-scrollbar {
          width: 2px;
        }

        ::-webkit-scrollbar-track {
          background: transparent;
        }

        ::-webkit-scrollbar-thumb {
          background-color: rgba(234, 88, 12, 0.1);
          border-radius: 20px;
          transition: all 0.3s ease;
        }

        ::-webkit-scrollbar-thumb:hover {
          background-color: rgba(234, 88, 12, 0.2);
        }

        * {
          scrollbar-width: none;
          scrollbar-color: rgba(234, 88, 12, 0.1) transparent;
        }

        .blockchain-grid::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at 50% 50%,
            rgba(234, 88, 12, 0.05) 0%,
            transparent 50%
          );
          animation: pulse 4s ease-in-out infinite;
        }

        @keyframes pulse {
          0% { opacity: 0.2; }
          50% { opacity: 0.5; }
          100% { opacity: 0.2; }
        }
      `}</style>
    </div>
  );
};

export default BlockchainBackground;

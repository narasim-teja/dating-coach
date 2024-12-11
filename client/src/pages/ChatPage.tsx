import React from 'react';
import ChatBot from '../components/ChatBot/ChatBot';

const ChatPage: React.FC = () => {
  return (
    <div className="bg-gray-900 min-h-screen text-gray-100">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap');
        `}
      </style>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 
          className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text text-center"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          AI Dating Assistant
        </h1>
        <p 
          className="text-xl text-gray-400 text-center mb-8"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Your personal coach for crafting engaging messages
        </p>
        <ChatBot />
      </div>
    </div>
  );
};

export default ChatPage; 
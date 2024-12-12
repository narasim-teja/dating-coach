import React from 'react';
import { FaRobot, FaUser } from 'react-icons/fa';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatDisplayProps {
  messages: Message[];
}

const ChatDisplay: React.FC<ChatDisplayProps> = ({ messages }) => {
  return (
    <div className="h-full p-4 overflow-y-auto" style={{ fontFamily: "'Playfair Display', serif" }}>
      {messages.map((message, index) => (
        <div
          key={index}
          className={`mb-4 flex items-end gap-2 ${
            message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
          }`}
        >
          {/* Profile Icon */}
          <div className={`flex-shrink-0 ${message.role === 'user' ? 'ml-2' : 'mr-2'}`}>
            {message.role === 'assistant' ? (
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center">
                <FaRobot className="w-5 h-5 text-white" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                <FaUser className="w-5 h-5 text-gray-300" />
              </div>
            )}
          </div>

          {/* Message Bubble */}
          <div
            className={`max-w-[70%] p-3 rounded-lg ${
              message.role === 'user'
                ? 'bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-white'
                : 'bg-gray-700/50 text-gray-200'
            }`}
          >
            <p className="text-sm">{message.content}</p>
          </div>
        </div>
      ))}
      {messages.length === 0 && (
        <div className="h-full flex items-center justify-center">
          <p className="text-gray-400 text-center">
            Start a conversation with your AI dating assistant
          </p>
        </div>
      )}
    </div>
  );
};

export default ChatDisplay; 
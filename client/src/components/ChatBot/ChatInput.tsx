import React, { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4" style={{ fontFamily: "'Playfair Display', serif" }}>
      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
        />
        <button
          type="submit"
          disabled={!message.trim()}
          className="px-6 py-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-white rounded-lg hover:from-blue-500 hover:via-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2"
        >
          <span>Send</span>
          <FaPaperPlane className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
};

export default ChatInput; 
import React, { useState } from 'react';
import ChatDisplay from './ChatDisplay';
import ChatInput from './ChatInput';
import AnalysisDisplay from './AnalysisDisplay';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Analysis {
  interest: number;
  engagement: number;
  sentiment: 'positive' | 'neutral' | 'negative';
}

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);

  const handleSendMessage = async (message: string) => {
    // Add user message to chat
    const userMessage: Message = { role: 'user', content: message };
    setMessages(prev => [...prev, userMessage]);

    try {
      // TODO: Replace with actual API call
      // Simulate API response for now
      const response = { content: "This is a simulated response.", analysis: {
        interest: 0.7,
        engagement: 0.8,
        sentiment: 'positive' as const
      }};

      // Add assistant message to chat
      const assistantMessage: Message = { role: 'assistant', content: response.content };
      setMessages(prev => [...prev, assistantMessage]);
      setAnalysis(response.analysis);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex flex-col h-[70vh] bg-gray-800/50 backdrop-blur-lg rounded-lg border border-gray-700 shadow-lg">
      <div className="flex-1 overflow-hidden">
        <ChatDisplay messages={messages} />
      </div>
      <div className="border-t border-gray-700">
        <AnalysisDisplay analysis={analysis} />
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatBot; 
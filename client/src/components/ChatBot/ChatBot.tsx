import React, { useState, useEffect } from 'react';
import ChatDisplay from './ChatDisplay';
import ChatInput from './ChatInput';
import AnalysisDisplay from './AnalysisDisplay';
import { chatbotService, ConversationContext, Analysis } from '../../services/chatbotService';
import { FaCog } from 'react-icons/fa';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatSettings {
  goal: ConversationContext['goal'];
  platform: string;
  userGender: string;
  matchGender: string;
}

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [context, setContext] = useState<ConversationContext | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<ChatSettings>({
    goal: 'BUILD_RAPPORT',
    platform: 'Hinge',
    userGender: 'male',
    matchGender: 'female'
  });

  // Initialize context when settings change
  useEffect(() => {
    const newContext = chatbotService.createInitialContext(
      settings.goal,
      settings.platform,
      settings.userGender,
      settings.matchGender
    );
    setContext(newContext);
  }, [settings]);

  const handleSendMessage = async (message: string) => {
    if (!context) return;

    try {
      // Use a random userId for now - in a real app, this would come from authentication
      const userId = 'user123';
      const response = await chatbotService.sendMessage(message, userId, context);

      // Update messages and context
      setMessages(response.context.messages);
      setContext(response.context);
      setAnalysis(response.analysis);
    } catch (error) {
      console.error('Error sending message:', error);
      // Show error in chat
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }]);
    }
  };

  const handleSettingsChange = (newSettings: Partial<ChatSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <div className="flex flex-col h-[70vh] bg-gray-800/50 backdrop-blur-lg rounded-lg border border-gray-700 shadow-lg">
      {/* Settings Button */}
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-gray-200">Chat Settings</h2>
        <button
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          className="p-2 text-gray-400 hover:text-gray-200 transition-colors"
        >
          <FaCog className={`w-5 h-5 ${isSettingsOpen ? 'rotate-180' : ''} transition-transform`} />
        </button>
      </div>

      {/* Settings Panel */}
      {isSettingsOpen && (
        <div className="p-4 bg-gray-700/30 border-b border-gray-700">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Goal</label>
              <select
                value={settings.goal}
                onChange={(e) => handleSettingsChange({ goal: e.target.value as ConversationContext['goal'] })}
                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-purple-500"
              >
                <option value="BUILD_RAPPORT">Build Rapport</option>
                <option value="GET_PHONE_NUMBER">Get Phone Number</option>
                <option value="SET_DATE">Set Date</option>
                <option value="ASK_OUT">Ask Out</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Platform</label>
              <select
                value={settings.platform}
                onChange={(e) => handleSettingsChange({ platform: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-purple-500"
              >
                <option value="Hinge">Hinge</option>
                <option value="Tinder">Tinder</option>
                <option value="Bumble">Bumble</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Your Gender</label>
              <select
                value={settings.userGender}
                onChange={(e) => handleSettingsChange({ userGender: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-purple-500"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Match Gender</label>
              <select
                value={settings.matchGender}
                onChange={(e) => handleSettingsChange({ matchGender: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-purple-500"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Chat Display */}
      <div className="flex-1 overflow-hidden">
        <ChatDisplay messages={messages} />
      </div>

      {/* Analysis and Input */}
      <div className="border-t border-gray-700">
        <AnalysisDisplay analysis={analysis?.tone} stage={analysis?.currentStage} progress={analysis?.goalProgress} />
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatBot; 
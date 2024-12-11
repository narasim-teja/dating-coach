import React from 'react';
import { FaHeart, FaComments, FaSmile } from 'react-icons/fa';

interface Analysis {
  interest: number;
  engagement: number;
  sentiment: 'positive' | 'neutral' | 'negative';
}

interface AnalysisDisplayProps {
  analysis: Analysis | null;
}

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ analysis }) => {
  if (!analysis) return null;

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-400';
      case 'negative':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getPercentage = (value: number) => `${Math.round(value * 100)}%`;

  return (
    <div className="px-4 py-2 bg-gray-700/30 border-t border-gray-700">
      <div className="flex items-center justify-between text-sm" style={{ fontFamily: "'Playfair Display', serif" }}>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <FaHeart className="text-pink-400" />
            <span className="text-gray-400">Interest: </span>
            <span className="font-medium text-gray-200">{getPercentage(analysis.interest)}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaComments className="text-purple-400" />
            <span className="text-gray-400">Engagement: </span>
            <span className="font-medium text-gray-200">{getPercentage(analysis.engagement)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <FaSmile className={getSentimentColor(analysis.sentiment)} />
          <span className="text-gray-400">Sentiment: </span>
          <span className={`font-medium ${getSentimentColor(analysis.sentiment)}`}>
            {analysis.sentiment.charAt(0).toUpperCase() + analysis.sentiment.slice(1)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AnalysisDisplay; 
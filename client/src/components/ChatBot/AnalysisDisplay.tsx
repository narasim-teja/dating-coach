import React from 'react';
import { FaHeart, FaComments, FaSmile, FaChartLine, FaStepForward } from 'react-icons/fa';

interface Analysis {
  interest: number;
  engagement: number;
  sentiment: 'positive' | 'neutral' | 'negative';
}

interface AnalysisDisplayProps {
  analysis: Analysis | null;
  stage?: 'initial' | 'building_rapport' | 'advancing' | 'closing';
  progress?: number;
}

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ analysis, stage, progress }) => {
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

  const getStageColor = (currentStage: string) => {
    switch (currentStage) {
      case 'initial':
        return 'text-blue-400';
      case 'building_rapport':
        return 'text-purple-400';
      case 'advancing':
        return 'text-pink-400';
      case 'closing':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  const formatStage = (stage: string) => {
    return stage.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getPercentage = (value: number) => `${Math.round(value * 100)}%`;

  return (
    <div className="px-4 py-2 bg-gray-700/30 border-t border-gray-700">
      <div className="flex flex-col gap-2" style={{ fontFamily: "'Playfair Display', serif" }}>
        {/* Metrics Row */}
        <div className="flex items-center justify-between text-sm">
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

        {/* Progress Row */}
        {(stage || progress !== undefined) && (
          <div className="flex items-center justify-between text-sm border-t border-gray-600/30 pt-2">
            {stage && (
              <div className="flex items-center gap-2">
                <FaStepForward className={getStageColor(stage)} />
                <span className="text-gray-400">Stage: </span>
                <span className={`font-medium ${getStageColor(stage)}`}>
                  {formatStage(stage)}
                </span>
              </div>
            )}
            {progress !== undefined && (
              <div className="flex items-center gap-2">
                <FaChartLine className="text-blue-400" />
                <span className="text-gray-400">Progress: </span>
                <span className="font-medium text-gray-200">{getPercentage(progress)}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisDisplay; 
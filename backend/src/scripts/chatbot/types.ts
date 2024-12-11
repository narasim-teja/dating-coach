export type ConversationGoal = 'GET_PHONE_NUMBER' | 'SET_DATE' | 'ASK_OUT' | 'BUILD_RAPPORT';

export interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export interface ConversationContext {
    goal: ConversationGoal;
    messages: Message[];
    matchInfo: {
        platform: string;
        userGender: string;
        matchGender: string;
        conversationStage: 'initial' | 'building_rapport' | 'advancing' | 'closing';
        toneAnalysis?: {
            interest: number;  // 0-1 scale
            engagement: number;
            sentiment: 'positive' | 'neutral' | 'negative';
        };
    };
    metrics: {
        messageCount: number;
        averageResponseTime: number;
        goalProgress: number;  // 0-1 scale
    };
}

export interface ChatbotConfig {
    maxMessagesBeforeGoalAttempt: number;
    minRapportScoreForGoal: number;
    temperatureByStage: {
        initial: number;
        building_rapport: number;
        advancing: number;
        closing: number;
    };
} 
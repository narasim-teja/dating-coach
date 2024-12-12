export type ConversationStage = 'initial' | 'building_rapport' | 'advancing' | 'closing';

export type ConversationGoal = 'GET_PHONE_NUMBER' | 'SET_DATE' | 'ASK_OUT' | 'BUILD_RAPPORT';

export interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export interface ToneAnalysis {
    interest: number;
    engagement: number;
    sentiment: 'positive' | 'neutral' | 'negative';
}

export interface MatchInfo {
    platform: string;
    conversationStage: ConversationStage;
    toneAnalysis?: ToneAnalysis;
}

export interface ConversationContext {
    matchInfo: MatchInfo;
    goal: ConversationGoal;
    messages: Message[];
}

// API Types
export interface ChatRequest {
    message: string;
    context?: {
        platform?: string;
        goal?: ConversationGoal;
        conversationStage?: ConversationStage;
    };
}

export interface ChatResponse {
    message: string;
    analysis: ToneAnalysis;
} 
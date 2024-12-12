import axios from 'axios';

export interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export interface Analysis {
    tone: {
        interest: number;
        engagement: number;
        sentiment: 'positive' | 'neutral' | 'negative';
    };
    currentStage: 'initial' | 'building_rapport' | 'advancing' | 'closing';
    goalProgress: number;
}

export interface ConversationContext {
    goal: 'GET_PHONE_NUMBER' | 'SET_DATE' | 'ASK_OUT' | 'BUILD_RAPPORT';
    messages: Message[];
    matchInfo: {
        platform: string;
        userGender: string;
        matchGender: string;
        conversationStage: 'initial' | 'building_rapport' | 'advancing' | 'closing';
        toneAnalysis?: {
            interest: number;
            engagement: number;
            sentiment: 'positive' | 'neutral' | 'negative';
        };
    };
    metrics: {
        messageCount: number;
        averageResponseTime: number;
        goalProgress: number;
    };
}

const API_URL = 'http://localhost:3000/api';

export const chatbotService = {
    async sendMessage(message: string, userId: string, context?: ConversationContext) {
        try {
            const response = await axios.post(`${API_URL}/chatbot/chat`, {
                message,
                userId,
                context
            });

            return response.data.data;
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    },

    createInitialContext(
        goal: ConversationContext['goal'] = 'BUILD_RAPPORT',
        platform: string = 'dating_app',
        userGender: string = 'unknown',
        matchGender: string = 'unknown'
    ): ConversationContext {
        return {
            goal,
            messages: [],
            matchInfo: {
                platform,
                userGender,
                matchGender,
                conversationStage: 'initial'
            },
            metrics: {
                messageCount: 0,
                averageResponseTime: 0,
                goalProgress: 0
            }
        };
    }
}; 
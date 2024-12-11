import { ConversationContext, ConversationGoal } from './types';

export class PromptEngineering {
    private static readonly SYSTEM_PROMPT_TEMPLATE = `You are an AI dating coach assistant helping to maintain a conversation on {platform}. 
Your goal is to help craft messages that will lead to {goal}, while maintaining a natural and engaging conversation.
You should adapt your responses based on the conversation stage and the other person's engagement level.
Never be too pushy or aggressive, and always maintain a respectful and genuine tone.`;

    private static readonly STAGE_PROMPTS = {
        initial: "Focus on creating a light, engaging response that builds on shared interests or their profile information.",
        building_rapport: "Deepen the conversation by asking meaningful questions and sharing relevant experiences.",
        advancing: "Start steering the conversation towards the goal while maintaining natural flow.",
        closing: "Look for natural opportunities to achieve the conversation goal."
    };

    private static getGoalSpecificPrompt(goal: ConversationGoal): string {
        const goalPrompts = {
            GET_PHONE_NUMBER: "Work towards naturally exchanging phone numbers when appropriate rapport is established.",
            SET_DATE: "Guide the conversation towards setting up a specific date when the timing feels right.",
            ASK_OUT: "Build towards asking them out while ensuring they feel comfortable and engaged.",
            BUILD_RAPPORT: "Focus on deepening the connection and understanding through meaningful conversation."
        };
        return goalPrompts[goal];
    }

    static generatePrompt(context: ConversationContext): string {
        const systemPrompt = this.SYSTEM_PROMPT_TEMPLATE
            .replace('{platform}', context.matchInfo.platform)
            .replace('{goal}', context.goal);

        const stagePrompt = this.STAGE_PROMPTS[context.matchInfo.conversationStage];
        const goalPrompt = this.getGoalSpecificPrompt(context.goal);

        const conversationHistory = context.messages
            .map(msg => `${msg.role.toUpperCase()}: ${msg.content}`)
            .join('\n');

        const toneAnalysis = context.matchInfo.toneAnalysis 
            ? `\nCurrent engagement level: ${context.matchInfo.toneAnalysis.engagement}
               Interest level: ${context.matchInfo.toneAnalysis.interest}
               Overall sentiment: ${context.matchInfo.toneAnalysis.sentiment}`
            : '';

        return `${systemPrompt}

Current Stage: ${context.matchInfo.conversationStage}
${stagePrompt}

Goal: ${context.goal}
${goalPrompt}

Conversation History:
${conversationHistory}

${toneAnalysis}

Based on the above context, generate a natural and engaging response that moves the conversation forward:`;
    }

    static analyzeMessageTone(message: string): { interest: number; engagement: number; sentiment: 'positive' | 'neutral' | 'negative' } {
        // TODO: Implement actual tone analysis using NLP
        // This is a placeholder implementation
        return {
            interest: 0.7,
            engagement: 0.8,
            sentiment: 'positive'
        };
    }
} 
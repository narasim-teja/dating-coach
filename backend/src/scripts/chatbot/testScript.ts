import { ConversationContext, Message, ChatbotConfig } from './types';
import { PromptEngineering } from './promptEngineering';
import { generateResponse } from './openaiClient';
import { ToneAnalyzer } from './toneAnalyzer';
import OpenAI from 'openai';

const config: ChatbotConfig = {
    maxMessagesBeforeGoalAttempt: 15,
    minRapportScoreForGoal: 0.7,
    temperatureByStage: {
        initial: 0.7,
        building_rapport: 0.8,
        advancing: 0.6,
        closing: 0.5
    }
};

// Initialize a test conversation
const testContext: ConversationContext = {
    goal: 'SET_DATE',
    messages: [],
    matchInfo: {
        platform: 'Hinge',
        userGender: 'male',
        matchGender: 'female',
        conversationStage: 'initial',
    },
    metrics: {
        messageCount: 0,
        averageResponseTime: 0,
        goalProgress: 0
    }
};

async function simulateConversation(userMessage: string) {
    const startTime = new Date();

    // Add user message to context
    const userMsg: Message = {
        role: 'user',
        content: userMessage,
        timestamp: startTime
    };
    testContext.messages.push(userMsg);
    testContext.metrics.messageCount++;

    // Analyze message tone
    const toneAnalysis = ToneAnalyzer.analyzeMessage(userMessage);
    testContext.matchInfo.toneAnalysis = {
        interest: toneAnalysis.interest,
        engagement: toneAnalysis.engagement,
        sentiment: toneAnalysis.sentiment
    };

    // Update conversation stage based on message count and tone
    if (testContext.metrics.messageCount > 5 && toneAnalysis.interest > 0.6) {
        testContext.matchInfo.conversationStage = 'building_rapport';
    } else if (testContext.metrics.messageCount > 10 && toneAnalysis.interest > 0.8) {
        testContext.matchInfo.conversationStage = 'advancing';
    }

    // Generate prompt for AI response
    const prompt = PromptEngineering.generatePrompt(testContext);
    
    // Convert conversation history to OpenAI message format
    const messages: Array<OpenAI.Chat.ChatCompletionMessageParam> = [
        { 
            role: 'system', 
            content: prompt 
        } as const,
        ...testContext.messages.map(msg => ({
            role: msg.role === 'user' ? 'user' as const : 'assistant' as const,
            content: msg.content
        }))
    ];

    // Get AI response
    const aiResponseContent = await generateResponse(messages);
    
    // Add AI response to context
    const aiMsg: Message = {
        role: 'assistant',
        content: aiResponseContent || "I'm not sure how to respond to that.",
        timestamp: new Date()
    };
    testContext.messages.push(aiMsg);

    // Update metrics
    const responseTime = (aiMsg.timestamp.getTime() - startTime.getTime()) / 1000;
    testContext.metrics.averageResponseTime = 
        (testContext.metrics.averageResponseTime * (testContext.metrics.messageCount - 1) + responseTime) / 
        testContext.metrics.messageCount;
    
    testContext.metrics.goalProgress = calculateGoalProgress(testContext);

    return {
        response: aiResponseContent,
        context: testContext,
        analysis: toneAnalysis
    };
}

function calculateGoalProgress(context: ConversationContext): number {
    const { messageCount } = context.metrics;
    const { interest, engagement } = context.matchInfo.toneAnalysis || { interest: 0, engagement: 0 };
    
    // Weight factors for goal progress
    const weights = {
        messageProgress: 0.3,  // How far along in the conversation
        rapport: 0.4,         // Combined interest and engagement
        consistency: 0.3      // Maintaining positive sentiment
    };

    const messageProgress = Math.min(messageCount / config.maxMessagesBeforeGoalAttempt, 1);
    const rapport = (interest + engagement) / 2;
    const consistency = context.messages
        .filter(m => m.role === 'user')
        .reduce((pos, msg) => {
            const sentiment = ToneAnalyzer.analyzeMessage(msg.content).sentiment;
            return pos + (sentiment === 'positive' ? 1 : sentiment === 'neutral' ? 0.5 : 0);
        }, 0) / Math.max(messageCount / 2, 1);

    return Math.min(
        (messageProgress * weights.messageProgress) +
        (rapport * weights.rapport) +
        (consistency * weights.consistency),
        1
    );
}

// Example usage
async function runTest() {
    console.log('Starting test conversation...\n');

    const testMessages = [
        "Hey! I saw on your profile that you're into hiking. What's your favorite trail?",
        "That's awesome! I actually did that trail last weekend. Have you been to any good restaurants in the area?",
        "I know this great Italian place nearby. Maybe we could check it out sometime?"
    ];

    for (const message of testMessages) {
        console.log('\nUser Message:', message);
        const result = await simulateConversation(message);
        console.log('AI Response:', result.response);
        console.log('Message Analysis:', {
            interest: result.analysis.interest.toFixed(2),
            engagement: result.analysis.engagement.toFixed(2),
            sentiment: result.analysis.sentiment
        });
        console.log('Current Stage:', result.context.matchInfo.conversationStage);
        console.log('Goal Progress:', result.context.metrics.goalProgress.toFixed(2));
        console.log('---');
    }
}

// Export for testing
export { simulateConversation, testContext, config, runTest };

// Uncomment to run the test
// runTest().catch(console.error); 
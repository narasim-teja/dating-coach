import OpenAI from 'openai';
import natural from 'natural';
import Sentiment from 'sentiment';
import { ConversationContext, ConversationGoal, Message, ChatbotConfig } from '../scripts/chatbot/types';

export type { ConversationContext, ConversationGoal, Message, ChatbotConfig };

type ConversationStage = 'initial' | 'building_rapport' | 'advancing' | 'closing';

export class ChatbotService {
    private openai: OpenAI;
    private tokenizer: natural.WordTokenizer;
    private sentiment: Sentiment;
    
    private readonly config: ChatbotConfig = {
        maxMessagesBeforeGoalAttempt: 10,
        minRapportScoreForGoal: 0.7,
        temperatureByStage: {
            initial: 0.7,
            building_rapport: 0.8,
            advancing: 0.6,
            closing: 0.5
        }
    };

    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
        this.tokenizer = new natural.WordTokenizer();
        this.sentiment = new Sentiment();
    }

    private generateSystemPrompt(context: ConversationContext): string {
        const basePrompt = `You are a charismatic and witty dating coach AI helping to maintain engaging conversations on ${context.matchInfo.platform}. 
Your goal is to help craft messages that will lead to ${context.goal}, while keeping the conversation fun, natural, and engaging.
You have a great sense of humor and know how to use it appropriately - from clever wordplay to playful teasing.

Key Personality Traits:
- Confident but not arrogant
- Witty and playful while staying respectful
- Genuinely interested and engaging
- Quick with situational humor
- Master of both clever and cheesy pickup lines (use when appropriate)
- Natural at creating playful banter

User Gender: ${context.matchInfo.userGender}
Match Gender: ${context.matchInfo.matchGender}
Current Stage: ${context.matchInfo.conversationStage}
Message Count: ${context.metrics.messageCount}

Stage Guidelines:
${this.getStagePrompt(context.matchInfo.conversationStage)}

Goal: ${context.goal}
${this.getGoalPrompt(context.goal, context.metrics.messageCount)}

Remember:
- Use humor appropriately - clever wordplay, light teasing, or situational jokes
- If there's an opportunity for a good pun or clever pickup line, take it
- Keep responses concise and engaging
- Create opportunities for playful banter
- Be genuine and show real interest in shared topics
- Match the energy level of the conversation`;

        const toneInfo = context.matchInfo.toneAnalysis 
            ? `\nMatch's Current State:
               - Engagement Level: ${context.matchInfo.toneAnalysis.engagement}
               - Interest Level: ${context.matchInfo.toneAnalysis.interest}
               - Overall Sentiment: ${context.matchInfo.toneAnalysis.sentiment}
               
Adjust your approach based on their engagement:
- High engagement: Amplify the playful energy
- Medium engagement: Use humor to increase interest
- Low engagement: Focus on their interests with light humor`
            : '';

        return `${basePrompt}${toneInfo}`;
    }

    private getStagePrompt(stage: ConversationStage): string {
        const prompts: Record<ConversationStage, string> = {
            initial: `Create an engaging first impression that stands out:
- If there's a good opportunity for a clever pickup line or pun based on their profile/interests, use it
- Reference shared interests in a playful way
- Ask questions that are both fun and interesting
- Use humor to break the ice, but keep it classy
- Show genuine interest while maintaining a light tone`,

            building_rapport: `Build connection through engaging conversation:
- Use playful banter and light teasing when appropriate
- Share funny or interesting experiences related to shared interests
- Ask creative questions that lead to entertaining discussions
- Use callbacks to previous jokes or topics
- Balance humor with genuine interest in getting to know them`,

            advancing: `Deepen the conversation while maintaining fun energy:
- Use situational humor to keep things light
- Create inside jokes based on your previous conversations
- Mix deeper questions with playful banter
- Look for natural opportunities to suggest meeting up
- Keep the flirting subtle but present`,

            closing: `Progress towards the goal while keeping it fun:
- Use shared jokes and references from your conversation
- Be confident but playful in suggesting next steps
- Keep the energy high if engagement is good
- Use humor to make suggesting plans feel natural
- Create excitement about potential meetup activities`
        };
        return prompts[stage];
    }

    private getGoalPrompt(goal: ConversationGoal, messageCount: number): string {
        const basePrompts: Record<ConversationGoal, string> = {
            GET_PHONE_NUMBER: `Guide towards exchanging numbers naturally:
- Use humor to make asking for their number feel casual and fun
- Create situations where exchanging numbers makes sense
- Be clever about transitioning platforms
- Make it feel like their idea`,

            SET_DATE: `Work towards setting up a date:
- Use shared interests to suggest fun date ideas
- Be creative and specific with date suggestions
- Make planning feel exciting and spontaneous
- Use playful banter to build anticipation`,

            ASK_OUT: `Build towards asking them out:
- Create excitement about potential shared experiences
- Use humor to make the ask feel natural
- Be confident but playful in your approach
- Make suggestions based on shared interests`,

            BUILD_RAPPORT: `Focus on creating a fun and engaging connection:
- Use humor to keep the conversation flowing
- Create opportunities for playful banter
- Share funny stories related to common interests
- Keep the energy upbeat and positive`
        };

        // Add message count based guidance
        const countBasedGuidance = messageCount >= this.config.maxMessagesBeforeGoalAttempt
            ? "\nThe rapport is strong - look for a fun and natural way to progress towards the goal."
            : "\nKeep building connection through engaging conversation and shared humor.";

        return basePrompts[goal] + countBasedGuidance;
    }

    private analyzeTone(message: string) {
        const tokens = this.tokenizer.tokenize(message) || [];
        const sentimentResult = this.sentiment.analyze(message);
        
        const engagement = this.calculateEngagement(message, tokens);
        const interest = this.calculateInterest(message, sentimentResult);
        const overallSentiment = this.determineOverallSentiment(sentimentResult.comparative);

        return { 
            engagement, 
            interest, 
            sentiment: overallSentiment,
            analysis: {
                tokens,
                sentiment: sentimentResult
            }
        };
    }

    private calculateEngagement(message: string, tokens: string[]): number {
        const factors = {
            messageLength: Math.min(tokens.length / 20, 1),
            questionMarks: (message.match(/\?/g) || []).length * 0.2,
            exclamationMarks: (message.match(/!/g) || []).length * 0.1,
            personalPronouns: this.countPersonalPronouns(tokens) * 0.15
        };

        return Math.min(Math.max(
            Object.values(factors).reduce((sum, value) => sum + value, 0),
            0
        ), 1);
    }

    private calculateInterest(message: string, sentimentResult: any): number {
        const factors = {
            sentimentScore: (sentimentResult.comparative + 5) / 10,
            questionPresence: message.includes('?') ? 0.2 : 0,
            enthusiasticMarkers: this.countEnthusiasticMarkers(message) * 0.15,
            followUpIndicators: this.hasFollowUpIndicators(message) ? 0.2 : 0
        };

        return Math.min(Math.max(
            Object.values(factors).reduce((sum, value) => sum + value, 0),
            0
        ), 1);
    }

    private determineOverallSentiment(comparative: number): 'positive' | 'neutral' | 'negative' {
        if (comparative > 0.2) return 'positive';
        if (comparative < -0.2) return 'negative';
        return 'neutral';
    }

    private countPersonalPronouns(tokens: string[]): number {
        const personalPronouns = ['i', 'you', 'we', 'my', 'your', 'our'];
        return tokens.filter(token => personalPronouns.includes(token.toLowerCase())).length;
    }

    private countEnthusiasticMarkers(message: string): number {
        const markers = [
            '!', 'wow', 'great', 'awesome', 'cool', 'nice', 'love', 'perfect',
            'interesting', 'amazing', 'excellent', 'fantastic'
        ];
        return markers.reduce((count, marker) => 
            count + (message.toLowerCase().match(new RegExp(marker, 'g')) || []).length, 0);
    }

    private hasFollowUpIndicators(message: string): boolean {
        const indicators = [
            'what about', 'how about', 'tell me more', 'and you',
            'what do you', 'have you', 'would you', 'do you'
        ];
        return indicators.some(indicator => message.toLowerCase().includes(indicator));
    }

    private determineConversationStage(context: ConversationContext): ConversationStage {
        const { messageCount } = context.metrics;
        const { engagement, interest } = context.matchInfo.toneAnalysis || { engagement: 0, interest: 0 };
        const score = (engagement + interest) / 2;

        if (messageCount <= 2) return 'initial';
        if (messageCount <= 5 || score < 0.6) return 'building_rapport';
        if (messageCount <= this.config.maxMessagesBeforeGoalAttempt || score < this.config.minRapportScoreForGoal) return 'advancing';
        return 'closing';
    }

    private updateMetrics(context: ConversationContext, newMessage: Message): void {
        const messageCount = context.messages.length + 1;
        
        // Calculate average response time
        const timestamps = context.messages.map(m => m.timestamp.getTime());
        timestamps.push(newMessage.timestamp.getTime());
        let totalTime = 0;
        for (let i = 1; i < timestamps.length; i++) {
            totalTime += timestamps[i] - timestamps[i-1];
        }
        const averageResponseTime = messageCount > 1 ? totalTime / (messageCount - 1) : 0;

        // Calculate goal progress based on engagement and stage
        const { engagement, interest } = context.matchInfo.toneAnalysis || { engagement: 0, interest: 0 };
        const stageProgress: Record<ConversationStage, number> = {
            initial: 0.25,
            building_rapport: 0.5,
            advancing: 0.75,
            closing: 1.0
        };
        const goalProgress = Math.min(
            ((engagement + interest) / 2 + stageProgress[context.matchInfo.conversationStage]) / 2,
            1
        );

        context.metrics = {
            messageCount,
            averageResponseTime,
            goalProgress
        };
    }

    async generateResponse(
        message: string,
        userId: string,
        context?: ConversationContext
    ): Promise<{ response: string; context: ConversationContext; analysis: any }> {
        try {
            const toneAnalysis = this.analyzeTone(message);
            const newMessage: Message = {
                role: 'user',
                content: message,
                timestamp: new Date()
            };

            // Initialize or update context
            let currentContext: ConversationContext;
            
            if (context) {
                currentContext = {
                    ...context,
                    messages: Array.isArray(context.messages) ? [...context.messages] : [],
                    matchInfo: {
                        ...context.matchInfo,
                        toneAnalysis
                    }
                };
            } else {
                currentContext = {
                    goal: 'BUILD_RAPPORT' as ConversationGoal,
                    messages: [],
                    matchInfo: {
                        platform: 'dating_app',
                        userGender: 'unknown',
                        matchGender: 'unknown',
                        conversationStage: 'initial' as ConversationStage,
                        toneAnalysis
                    },
                    metrics: {
                        messageCount: 0,
                        averageResponseTime: 0,
                        goalProgress: 0
                    }
                };
            }

            // Update context with new message
            currentContext.messages.push(newMessage);
            this.updateMetrics(currentContext, newMessage);
            
            // Determine conversation stage
            currentContext.matchInfo.conversationStage = this.determineConversationStage(currentContext);

            // Generate response
            const systemPrompt = this.generateSystemPrompt(currentContext);
            const completion = await this.openai.chat.completions.create({
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...currentContext.messages.map(m => ({ role: m.role, content: m.content }))
                ],
                model: 'gpt-3.5-turbo',
                temperature: this.config.temperatureByStage[currentContext.matchInfo.conversationStage],
            });

            const responseContent = completion.choices[0]?.message?.content || 
                'I apologize, but I could not generate a response at this time.';

            // Add AI response to context
            const aiResponse: Message = {
                role: 'assistant',
                content: responseContent,
                timestamp: new Date()
            };
            currentContext.messages.push(aiResponse);

            return {
                response: responseContent,
                context: currentContext,
                analysis: {
                    tone: toneAnalysis,
                    currentStage: currentContext.matchInfo.conversationStage,
                    goalProgress: currentContext.metrics.goalProgress
                }
            };
        } catch (error) {
            console.error('Error generating chatbot response:', error);
            throw new Error('Failed to generate response');
        }
    }
} 
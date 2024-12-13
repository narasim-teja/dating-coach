import OpenAI from 'openai';
import natural from 'natural';
import Sentiment from 'sentiment';
import { ConversationContext, ConversationGoal, Message, ChatbotConfig } from '../scripts/chatbot/types';

export type { ConversationContext, ConversationGoal, Message, ChatbotConfig };

type ConversationStage = 'initial' | 'building_rapport' | 'advancing' | 'closing';

interface UserProfile {
    occupation: string;
    interests: string[];
    preferences: {
        food?: string[];
        movies?: string[];
        music?: string[];
        hobbies?: string[];
    };
}

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
        const userProfile: UserProfile = {
            occupation: "software engineer",
            interests: ["movies", "coding", "trying new restaurants"],
            preferences: {
                food: ["Indian food", "Thai food"],
                movies: ["all genres", "especially sci-fi"],
            }
        };

        const basePrompt = `You are helping craft WITTY and PLAYFUL messages on ${context.matchInfo.platform} AS THE USER who has this profile:
- Occupation: ${userProfile.occupation}
- Interests: ${userProfile.interests.join(', ')}
- Food preferences: ${userProfile.preferences.food?.join(', ')}
- Movie preferences: ${userProfile.preferences.movies?.join(', ')}

CRITICAL RULES:
- Be CLEVER and WITTY (use puns, wordplay, and playful jokes)
- Keep responses SHORT (max 2 lines)
- Make them FLIRTY and FUN
- Use tech/coding humor when possible
- Include max 1-2 emojis
- End with ONE flirty/playful question

Messaging Style Examples:
❌ "Software engineer who codes by day, watches movies by night. What's your favorite genre?"
(Too boring and straightforward!)

✅ "I write code that only crashes 50% of the time... my success rate with pickup lines is slightly better 😉 How's yours?"

❌ "Tech geek with a passion for Indian food. What's your go-to cuisine?"
(Too plain and uninteresting!)

✅ "My code might have bugs, but my taste in Indian food is error-free 🌶️ Care to debug some curries together?"

More Playful Examples:
- "I'm a software engineer, but don't worry - I promise I won't bore you with coding jokes... unless they get a good {response}.length 😏"
- "Looking for someone to test my new dating algorithm - my success metric is making you smile 💻 Bug-free so far?"
- "Warning: May spontaneously talk about movies and Indian food. Any known bugs in your system I should know about? 😊"
- "404: Perfect pickup line not found... but I'm great at handling exceptions 😉 What makes you laugh?"

Remember:
- BE WITTY AND PLAYFUL
- Use clever wordplay
- Keep it flirty but not cheesy
- One short, fun question at the end
- Stay in character as a tech-savvy movie buff`;

        const toneInfo = context.matchInfo.toneAnalysis 
            ? `\nMatch's Current State:
               - Engagement Level: ${context.matchInfo.toneAnalysis.engagement}
               - Interest Level: ${context.matchInfo.toneAnalysis.interest}
               - Overall Sentiment: ${context.matchInfo.toneAnalysis.sentiment}
               
Response Style:
- High engagement: More flirty and playful
- Medium engagement: Light humor and wordplay
- Low engagement: Gentle humor with intrigue`
            : '';

        return `${basePrompt}${toneInfo}`;
    }

    private getStagePrompt(stage: ConversationStage): string {
        const prompts: Record<ConversationStage, string> = {
            initial: `First Message Examples:
"Trying to write the perfect first message... but my code keeps returning 'nervous.exe' 😅 Help me debug?"

"My IDE autocompleted your profile as 'perfect.match' 💻 Shall we test that theory?"`,

            building_rapport: `Rapport Building Examples:
"Just pushed some code and ordered Indian food - living life on the spicy side 🌶️ What's your idea of adventure?"

"Found a bug in my movie-watching algorithm - can't stop replaying your profile 😉 What's your favorite scene?"`,

            advancing: `Advancing Examples:
"My code says we have an 89% compatibility rate... want to verify that data in person? 😊"

"Found this cool Indian place while debugging - care to be my code reviewer over dinner? 🍛"`,

            closing: `Closing Examples:
"System.out.println('Would you like to get coffee?') 💻 Hope that compiles!"

"import first.date; // How about that new Indian place? 🌶️"`,
        };
        return prompts[stage];
    }

    private getGoalPrompt(goal: ConversationGoal, messageCount: number): string {
        const basePrompts: Record<ConversationGoal, string> = {
            GET_PHONE_NUMBER: `Playful Number Request:
"My app's throwing a 'MissingNumberException' - care to resolve this bug? 📱"`,

            SET_DATE: `Fun Date Suggestion:
"Found a critical bug: haven't tried that new restaurant with you yet 🍽️ Patch available this weekend?"`,

            ASK_OUT: `Clever Ask Out:
"Running a new function called dinner.exe - need a partner for testing? 😊"`,

            BUILD_RAPPORT: `Witty Rapport Building:
"Debugging my life story - found some interesting features 💻 Want to explore the code together?"`
        };

        return basePrompts[goal];
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
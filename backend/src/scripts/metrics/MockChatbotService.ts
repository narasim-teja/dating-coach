import { ConversationContext, ConversationGoal, Message } from '../../services/ChatbotService';
import { readFileSync } from 'fs';
import path from 'path';

export class MockChatbotService {
    private knowledgeBase: any[];
    private trainingData: any[];

    constructor() {
        this.knowledgeBase = this.loadKnowledgeBase();
        this.trainingData = this.loadTrainingData();
    }

    private loadKnowledgeBase(): any[] {
        try {
            const pickupLines = readFileSync(path.join(__dirname, '../../data/pickuplines.csv'), 'utf-8');
            return this.parseCSV(pickupLines);
        } catch (error) {
            console.error('Error loading mock knowledge base:', error);
            return [
                { text: "I debug with extra spice! 🌶️", category: "food" },
                { text: "Let's compile some memories together!", category: "tech" },
                { text: "My favorite movie? It's a recursive story called Inception!", category: "movies" }
            ];
        }
    }

    private loadTrainingData(): any[] {
        try {
            const successfulConversations = readFileSync(
                path.join(__dirname, '../../../data/training/successful_conversations.jsonl'),
                'utf-8'
            );
            return successfulConversations
                .split('\n')
                .filter(line => line.trim())
                .map(line => JSON.parse(line));
        } catch (error) {
            console.error('Error loading mock training data:', error);
            return [];
        }
    }

    private parseCSV(content: string): any[] {
        return content
            .split('\n')
            .filter(line => line.trim())
            .map(line => {
                const [text, category = ''] = line.split(',');
                return { text: text.trim(), category: category.trim() };
            });
    }

    async generateResponse(
        message: string,
        userId: string,
        context?: ConversationContext
    ): Promise<{ response: string; context: ConversationContext }> {
        // Mock response generation
        const mockContext = context || this.createInitialContext();
        const ragContext = await this.retrieveContext(message);
        
        // Generate a mock response based on the query type
        let response = '';
        if (message.toLowerCase().includes('movie')) {
            response = "As a software engineer, I debug through movies! Currently stuck in an infinite loop of Marvel films 🎬";
        } else if (message.toLowerCase().includes('food')) {
            response = "My code runs on curry power! Let's debug some spicy algorithms together 🌶️";
        } else if (message.toLowerCase().includes('work')) {
            response = "I turn coffee into code and bugs into features! 💻";
        } else if (message.toLowerCase().includes('weekend')) {
            response = "Planning to optimize my Netflix algorithm and debug some restaurant APIs 🍽️";
        } else {
            response = "Let me compile a clever response... How about we catch up over some exception handling? ☕";
        }

        return {
            response,
            context: mockContext
        };
    }

    private createInitialContext(): ConversationContext {
        return {
            goal: 'BUILD_RAPPORT' as ConversationGoal,
            messages: [],
            matchInfo: {
                platform: 'test',
                userGender: 'unknown',
                matchGender: 'unknown',
                conversationStage: 'initial',
                toneAnalysis: {
                    interest: 0.7,
                    engagement: 0.8,
                    sentiment: 'positive'
                }
            },
            metrics: {
                messageCount: 0,
                averageResponseTime: 0,
                goalProgress: 0
            }
        };
    }

    async retrieveContext(query: string): Promise<string> {
        const keywords = query.toLowerCase().split(' ');
        const relevantResponses = this.knowledgeBase
            .filter(item => 
                keywords.some(keyword => 
                    item.text.toLowerCase().includes(keyword) ||
                    item.category.toLowerCase().includes(keyword)
                )
            )
            .map(item => item.text)
            .slice(0, 3);

        return relevantResponses.join(' ');
    }
} 
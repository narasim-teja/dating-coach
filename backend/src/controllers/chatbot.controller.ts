import { Request, Response } from 'express';
import { PromptEngineering } from '../scripts/chatbot/promptEngineering';
import { ChatRequest, ChatResponse, ConversationContext, Message } from '../scripts/chatbot/types';
import { OpenAIApi, Configuration } from 'openai';

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export class ChatbotController {
    private static conversationHistory: Message[] = [];

    static async chat(req: Request<{}, {}, ChatRequest>, res: Response<ChatResponse>) {
        try {
            const { message, context } = req.body;

            // Add user message to history
            this.conversationHistory.push({
                role: 'user',
                content: message
            });

            // Create conversation context
            const conversationContext: ConversationContext = {
                matchInfo: {
                    platform: context?.platform || 'default',
                    conversationStage: context?.conversationStage || 'initial',
                },
                goal: context?.goal || 'BUILD_RAPPORT',
                messages: this.conversationHistory
            };

            // Generate prompt
            const prompt = PromptEngineering.generatePrompt(conversationContext);

            // Get response from OpenAI
            const completion = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: prompt },
                    ...this.conversationHistory.map(msg => ({
                        role: msg.role,
                        content: msg.content
                    }))
                ],
                temperature: 0.7,
                max_tokens: 150
            });

            const assistantMessage = completion.data.choices[0]?.message?.content || "I'm not sure how to respond to that.";

            // Add assistant message to history
            this.conversationHistory.push({
                role: 'assistant',
                content: assistantMessage
            });

            // Analyze message tone
            const analysis = PromptEngineering.analyzeMessageTone(message);

            // Return response
            res.json({
                message: assistantMessage,
                analysis
            });

        } catch (error) {
            console.error('Error in chat endpoint:', error);
            res.status(500).json({
                message: "An error occurred while processing your message.",
                analysis: {
                    interest: 0,
                    engagement: 0,
                    sentiment: 'neutral'
                }
            });
        }
    }

    // Optional: Clear conversation history
    static clearHistory(req: Request, res: Response) {
        this.conversationHistory = [];
        res.json({ message: 'Conversation history cleared' });
    }
} 
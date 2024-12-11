import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set in environment variables');
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function generateResponse(messages: Array<OpenAI.Chat.ChatCompletionMessageParam>) {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4",  // You can switch to "gpt-3.5-turbo" for faster/cheaper responses
            messages: messages,
            temperature: 0.7,
            max_tokens: 150,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0.5,
        });

        return completion.choices[0].message.content;
    } catch (error) {
        console.error('Error generating response:', error);
        throw error;
    }
}

export { openai }; 
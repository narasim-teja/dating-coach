import OpenAI from 'openai';
import dotenv from 'dotenv';
import { MessageAnalyzer } from './MessageAnalyzer';

dotenv.config();

interface PersonalizationContext {
  commonWords?: string[];
  messageStyle?: string;
}

async function generateContextualMessages(bio: string, personalization?: PersonalizationContext): Promise<string[]> {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  let personalizationContext = '';
  if (personalization) {
    personalizationContext = `
Additional personalization context:
- Your typical communication style: ${personalization.messageStyle || 'N/A'}
- Common phrases/words you use: ${personalization.commonWords?.join(', ') || 'N/A'}

Please incorporate these elements naturally into the responses to match your usual communication style.`;
  }

  const prompt = `You are a flirty and witty dating coach who specializes in crafting playful, engaging, and cheesy opening lines for dating apps. Your goal is to make the recipient smile and feel intrigued enough to reply.

  Bio you're responding to: "${bio}"
  ${personalizationContext}
  
  Your task:
  1. Write three distinct, cheesy, and clever opening lines tailored to their bio.
  2. Each line should have a slightly different style:
     - One should be confidently flirty and playful.
     - One should be lighthearted and humorous.
     - One should lean into clever wordplay or cheesiness.
  3. Avoid relying on questions for all three lines; use them sparingly and only when they add intrigue.
  4. Keep each line concise (1 sentence, max 15 words).
  
  Important:
  - Focus on making the lines memorable and engaging.
  - Avoid overly formal or generic compliments.
  - Use natural language that matches your communication style.
  - If personalization is provided, incorporate it seamlessly.
  - Never mention or use the recipient's name.
  
  Examples for calibration:
  - Bio about loving science articles: 
    1. "Reading science for fun? Guess I’ll have to be your next big discovery!"
    2. "Explosive chemistry alert! Science geeks like us could definitely rewrite the periodic table of love."
    3. "I’m working on a theory: us + conversation = a perfect reaction."
  
  - Bio about beaches:
    1. "If being a beach bum is an art, you’re clearly a masterpiece."
    2. "Beach days? Let me guess, you’re the wave everyone chases!"
    3. "Sandcastles and sunsets? Looks like you’ve mastered the recipe for happiness."
  
  Now, write three distinct, playful, and cheesy opening lines for this bio:`;
  

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: "You are an expert dating coach who creates natural, engaging conversation starters." },
      { role: "user", content: prompt }
    ],
    temperature: 0.85,
  });

  const generatedText = response.choices[0].message.content?.trim() || "";
  return generatedText.split('\n').map(line => line.replace(/^\d+\.\s*/, '').trim());
}

export async function generatePickupLines(bio: string, userId?: string): Promise<string[]> {
  try {
    console.log('Generating contextual messages...');
    
    let personalization: PersonalizationContext | undefined;
    
    if (userId) {
      const analyzer = new MessageAnalyzer();
      const userProfile = await analyzer.analyzeUserMessages(userId);
      
      if (userProfile) {
        personalization = {
          commonWords: userProfile.commonWords,
          messageStyle: userProfile.messageStyle
        };
        console.log('Using communication style:', userProfile.messageStyle);
      }
    }

    const messages = await generateContextualMessages(bio, personalization);
    return messages;
  } catch (error) {
    console.error('Error generating messages:', error);
    throw error;
  }
}

// Example usage
async function example() {
  const bio = "The dorkiest thing about me is I read science articles for fun";
  const userId = "user123"; // Optional: provide userId for personalized results
  
  try {
    const messages = await generatePickupLines(bio, userId);
    console.log('\nGenerated Opening Lines:');
    messages.forEach((message, index) => console.log(`${index + 1}. ${message}`));
  } catch (error) {
    console.error('Error:', error);
  }
}

if (require.main === module) {
  example();
}

export class ConversationService {
  async generatePickupLines(bio: string, userId?: string): Promise<string[]> {
    try {
      console.log('Generating contextual messages...');
      
      let personalization: PersonalizationContext | undefined;
      
      if (userId) {
        const analyzer = new MessageAnalyzer();
        const userProfile = await analyzer.analyzeUserMessages(userId);
        
        if (userProfile) {
          personalization = {
            commonWords: userProfile.commonWords,
            messageStyle: userProfile.messageStyle
          };
          console.log('Using communication style:', userProfile.messageStyle);
        }
      }

      const messages = await generateContextualMessages(bio, personalization);
      return messages;
    } catch (error) {
      console.error('Error generating messages:', error);
      throw error;
    }
  }
}
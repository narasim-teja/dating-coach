import { Pinecone, RecordMetadata as PineconeMetadata } from '@pinecone-database/pinecone';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import natural from 'natural';
import { MessageLoader } from './utils/MessageLoader';

dotenv.config();

interface UserProfile {
  userId: string;
  name: string;
  commonWords: string[];
  messageStyle: string;
  embeddings: number[];
}

interface CustomMetadata {
  name: string;
  commonWords: string;
  messageStyle: string;
}

export class MessageAnalyzer {
  private openai: OpenAI;
  private pinecone: Pinecone;
  private tokenizer: natural.WordTokenizer;
  private messageLoader: MessageLoader;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    this.pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!
    });
    this.tokenizer = new natural.WordTokenizer();
    this.messageLoader = new MessageLoader();
  }

  private async generateEmbedding(text: string): Promise<number[]> {
    const response = await this.openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: text,
    });
    return response.data[0].embedding;
  }

  private analyzeMessageStyle(messages: string[]): string {
    const avgLength = messages.reduce((sum: number, msg: string) => sum + msg.length, 0) / messages.length;
    const hasEmojis = messages.some((msg: string) => /[\u{1F300}-\u{1F9FF}]/u.test(msg));
    const formalWords = messages.some((msg: string) => 
      /\b(therefore|however|furthermore|consequently)\b/i.test(msg));

    if (hasEmojis && avgLength < 50) return 'casual and emoji-friendly';
    if (formalWords) return 'formal and structured';
    return 'conversational';
  }

  public async analyzeUserMessages(userId: string): Promise<UserProfile | null> {
    const userData = await this.messageLoader.loadUserMessages(userId);
    if (!userData || !userData.messages.length) {
      return null;
    }

    // Tokenize and count word frequencies
    const words = userData.messages.flatMap(msg => {
      const tokens = this.tokenizer.tokenize(msg.toLowerCase());
      return tokens ? tokens.filter((token): token is string => token !== null) : [];
    });
    
    const wordFreq = new Map<string, number>();
    words.forEach(word => {
      if (word.length > 3) {
        wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
      }
    });

    // Get top 10 most common words
    const commonWords = Array.from(wordFreq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);

    // Analyze message style
    const messageStyle = this.analyzeMessageStyle(userData.messages);

    // Generate embeddings for the combined common words and style
    const embeddingText = `${commonWords.join(' ')} ${messageStyle}`;
    const embeddings = await this.generateEmbedding(embeddingText);

    const userProfile: UserProfile = {
      userId,
      name: userData.name || userId,
      commonWords,
      messageStyle,
      embeddings
    };

    // Store in Pinecone
    const index = this.pinecone.index(process.env.PINECONE_INDEX_NAME!);
    await index.upsert([{
      id: userId,
      values: embeddings,
      metadata: {
        name: userData.name || userId,
        commonWords: commonWords.join(','),
        messageStyle,
        messages: userData.messages
      }
    }]);

    return userProfile;
  }

  public async getUserProfile(userId: string): Promise<UserProfile | null> {
    const index = this.pinecone.index(process.env.PINECONE_INDEX_NAME!);
    const queryResponse = await index.fetch([userId]);
    
    const vector = queryResponse.records[userId];
    if (!vector || !vector.metadata) {
      return null;
    }

    const metadata = vector.metadata as any;
    if (!this.isValidCustomMetadata(metadata) && !metadata.messages) {
      return null;
    }

    // If we have messages, analyze them
    if (metadata.messages && Array.isArray(metadata.messages)) {
      const messages = metadata.messages;
      const commonWords = this.tokenizer.tokenize(messages.join(' '))
        ?.filter((token): token is string => token !== null && token.length > 3)
        .slice(0, 10) || [];
      
      return {
        userId,
        name: metadata.name || userId,
        commonWords,
        messageStyle: this.analyzeMessageStyle(messages),
        embeddings: vector.values
      };
    }

    // Fall back to legacy format
    return {
      userId,
      name: metadata.name,
      commonWords: metadata.commonWords.split(','),
      messageStyle: metadata.messageStyle,
      embeddings: vector.values
    };
  }

  private isValidCustomMetadata(metadata: any): metadata is CustomMetadata {
    return (
      typeof metadata === 'object' &&
      typeof metadata.name === 'string' &&
      typeof metadata.commonWords === 'string' &&
      typeof metadata.messageStyle === 'string'
    );
  }
} 
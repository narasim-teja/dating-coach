import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

interface UserData {
  name?: string;
  messages: string[];
}

interface LegacyMetadata {
  commonWords: string;
  messageStyle: string;
  name: string;
}

export class MessageLoader {
  private pinecone: Pinecone;
  private openai: OpenAI;

  constructor() {
    this.pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!
    });
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  private async generateEmbedding(text: string): Promise<number[]> {
    const response = await this.openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: text,
    });
    return response.data[0].embedding;
  }

  async storeUserMessages(userId: string, messages: string[], name?: string): Promise<void> {
    try {
      const index = this.pinecone.index(process.env.PINECONE_INDEX_NAME!);
      const embedding = await this.generateEmbedding(messages.join(' '));

      await index.upsert([{
        id: userId,
        values: embedding,
        metadata: {
          name: name || `User ${userId}`,
          messages: messages,
          lastUpdated: new Date().toISOString()
        }
      }]);
    } catch (error) {
      console.error('Error storing user messages:', error);
      throw error;
    }
  }

  async loadUserMessages(userId: string): Promise<UserData | null> {
    try {
      const index = this.pinecone.index(process.env.PINECONE_INDEX_NAME!);
      const queryResponse = await index.fetch([userId]);
      
      if (!queryResponse.records[userId]) {
        return null;
      }

      const vector = queryResponse.records[userId];
      const metadata = vector.metadata as { messages?: string[] } | LegacyMetadata;

      // Handle legacy format
      if ('commonWords' in metadata) {
        return {
          name: metadata.name,
          messages: metadata.commonWords.split(',')
        };
      }

      // Handle new format
      if (!metadata || !('messages' in metadata) || !metadata.messages) {
        return null;
      }

      return {
        name: (metadata as any).name || `User ${userId}`,
        messages: metadata.messages
      };
    } catch (error) {
      console.error('Error loading user messages:', error);
      return null;
    }
  }

  async searchSimilarProfiles(message: string, limit: number = 5): Promise<Array<UserData & { similarity: number }>> {
    try {
      const index = this.pinecone.index(process.env.PINECONE_INDEX_NAME!);
      const queryEmbedding = await this.generateEmbedding(message);
      
      const searchResponse = await index.query({
        vector: queryEmbedding,
        topK: limit,
        includeMetadata: true
      });

      return searchResponse.matches.map(match => {
        const metadata = match.metadata as { messages?: string[] } | LegacyMetadata;
        let messages: string[] = [];
        
        if ('commonWords' in metadata) {
          messages = metadata.commonWords.split(',');
        } else if (metadata && 'messages' in metadata) {
          messages = metadata.messages || [];
        }

        return {
          name: (metadata as any).name || 'Unknown',
          messages,
          similarity: match.score || 0
        };
      });
    } catch (error) {
      console.error('Error searching similar profiles:', error);
      return [];
    }
  }
} 
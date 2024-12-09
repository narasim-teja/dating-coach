import fs from 'fs/promises';
import path from 'path';
import { AppError } from '../middleware/errorHandler';

interface Message {
  text: string;
  timestamp: string;
}

export class MessageService {
  private dataPath: string;

  constructor() {
    this.dataPath = path.join(process.cwd(), 'data', 'user_messages.json');
  }

  private async readMessagesFile(): Promise<any> {
    try {
      const data = await fs.readFile(this.dataPath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return { users: [] };
      }
      throw error;
    }
  }

  private async writeMessagesFile(data: any): Promise<void> {
    const dirPath = path.dirname(this.dataPath);
    await fs.mkdir(dirPath, { recursive: true });
    await fs.writeFile(this.dataPath, JSON.stringify(data, null, 2));
  }

  public async uploadMessages(userId: string, messages: Message[]): Promise<void> {
    const data = await this.readMessagesFile();
    
    const userIndex = data.users.findIndex((u: any) => u.userId === userId);
    const newMessages = messages.map(msg => ({
      ...msg,
      timestamp: msg.timestamp || new Date().toISOString()
    }));

    if (userIndex === -1) {
      data.users.push({
        userId,
        messages: newMessages
      });
    } else {
      // Append new messages to existing ones
      data.users[userIndex].messages = [
        ...data.users[userIndex].messages,
        ...newMessages
      ];
    }

    await this.writeMessagesFile(data);
  }

  public async getUserMessages(userId: string): Promise<Message[]> {
    const data = await this.readMessagesFile();
    const user = data.users.find((u: any) => u.userId === userId);
    
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    return user.messages;
  }
} 
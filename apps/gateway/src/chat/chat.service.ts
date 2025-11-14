import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ChatService {
  private readonly chatServiceUrl = 'http://localhost:4002'; 

  constructor(private readonly httpService: HttpService) {}

  async getConversations(userId: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.chatServiceUrl}/api/chat/conversations`, {
          params: { userId }
        })
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getConversation(conversationId: string, userId: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.chatServiceUrl}/api/chat/conversations/${conversationId}`, {
          params: { userId }
        })
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getMessages(conversationId: string, userId: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.chatServiceUrl}/api/chat/conversations/${conversationId}/messages`, {
          params: { userId }
        })
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
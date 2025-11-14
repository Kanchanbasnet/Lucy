import { Controller, Get, Param, Query } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('api/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('conversations')
  async getConversations(@Query('userId') userId: string) {
    return this.chatService.getUserConversations(userId);
  }

  @Get('conversations/:id')
  async getConversation(
    @Param('id') conversationId: string,
    @Query('userId') userId: string
  ) {
    return this.chatService.getConversationById(conversationId, userId);
  }

  @Get('conversations/:id/messages')
  async getMessages(
    @Param('id') conversationId: string,
    @Query('userId') userId: string
  ) {
    // Verify ownership first
    await this.chatService.getConversationById(conversationId, userId);
    return this.chatService.getConversationMessages(conversationId);
  }
}
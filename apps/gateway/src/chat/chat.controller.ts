import { Controller, Get, Param, Query } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('conversations')
  async getConversations(@Query('userId') userId: string) {
    return this.chatService.getConversations(userId);
  }

  @Get('conversations/:id')
  async getConversation(
    @Param('id') conversationId: string,
    @Query('userId') userId: string
  ) {
    return this.chatService.getConversation(conversationId, userId);
  }

  @Get('conversations/:id/messages')
  async getMessages(
    @Param('id') conversationId: string,
    @Query('userId') userId: string
  ) {
    return this.chatService.getMessages(conversationId, userId);
  }
}
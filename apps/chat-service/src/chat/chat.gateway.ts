import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  import { OpenAIService } from '../openai/openai.service';
import { ChatService } from './chat.service';
  
  @WebSocketGateway({
    cors: {
      origin: '*',
    },
  })
  export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server!: Server;
  
    constructor(private readonly openaiService: OpenAIService,
      private readonly chatService: ChatService
    ) {}
  
    handleConnection(client: Socket) {
      console.log(`Client connected: ${client.id}`);
    }
  
    handleDisconnect(client: Socket) {
      console.log(`Client disconnected: ${client.id}`);
    }
  
    @SubscribeMessage('message')
    async handleMessage(client: Socket, payload: { message: string, userId: string, conversationId?: string }) {
      const { message, userId, conversationId } = payload;
      
      if (!message || message.trim() === '') {
        client.emit('error', { message: 'Message cannot be empty' });
        return;
      }
      if(!userId) {
        client.emit('error', {message: 'UserId cannot be empty'});
        return;
      }
  
      try {
        // Step 1: Get or create conversation
        let convId = conversationId;
        if (!convId) {
          const conversation = await this.chatService.createNewConversation(userId);
          convId = conversation.id;
          client.emit('conversation_created', { conversationId: convId });
        } else {
          // Verify conversation exists and user owns it
          await this.chatService.getConversationById(convId, userId);
        }
    
        // Step 2: Save user message to database
        await this.chatService.saveMessage(convId, 'USER', message);
    
        // Step 3: Get conversation history for context
        const history = await this.chatService.getConversationMessages(convId);
    
        // Step 4: Add new user message to history
        const messages: Array<{role: 'user' | 'assistant' | 'system', content: string}> = [
          ...history,
          { role: 'user' as const, content: message }
        ];
    
        // Step 5: Stream OpenAI response with context
        let fullResponse = '';
        for await (const chunk of this.openaiService.streamChat(messages)) {
          fullResponse += chunk;
          client.emit('chunk', { content: chunk });
        }
    
        // Step 6: Save assistant response to database
        await this.chatService.saveMessage(convId, 'BOT', fullResponse);
    
        // Step 7: Emit done with conversationId
        client.emit('done', { conversationId: convId });
    
      } catch (error: any) {
        console.error('Error processing message:', error);
        client.emit('error', {
          message: error.message || 'Failed to process message'
        });
      }
    }
  }
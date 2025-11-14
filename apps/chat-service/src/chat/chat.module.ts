import { Module } from '@nestjs/common';
import { PrismaModule } from '@repo/db';
import { ChatService } from './chat.service';
import { OpenAIModule } from '../openai/openai.module';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';


@Module({
  providers: [ ChatService, ChatGateway],
  controllers: [ChatController],
  exports: [ChatService],
  imports: [PrismaModule, OpenAIModule]
})
export class ChatModule {}

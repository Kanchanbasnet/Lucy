import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@repo/db';

@Injectable()
export class ChatService {
    constructor(private readonly prisma: PrismaService) { }


    async createNewConversation(userId: string) {
        try {
            const conversation = await this.prisma.conversation.create({
                data: {
                    userId: userId
                }
            })
            return conversation;

        }
        catch (error: any) {
            throw new BadRequestException(error.message);

        }
    }

    async getConversationById(conversationId: string, userId: string) {
        try {
            const conversation = await this.prisma.conversation.findUnique({
                where: {
                    id: conversationId
                }
            })
            if (!conversation) {
                throw new NotFoundException('Conversation Not Found')
            }
            if (conversation.userId !== userId) {
                throw new ForbiddenException('You are not allowed to access this conversation.')
            }
            return conversation;


        }
        catch (error: any) {
            throw new BadRequestException(error.message);

        }
    }

    async getUserConversations(userId: string) {
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    id: userId
                }
            })
            if (!user) {
                throw new NotFoundException('User not Found.')
            }
            const conversations = await this.prisma.conversation.findMany({
                where: {
                    userId: userId
                }
            })
            if (conversations.length === 0) {
                throw new NotFoundException('No conversations found for this user.')
            }
            return conversations;

        }
        catch (error: any) {
            throw new BadRequestException(error.message);

        }
    }

    async getConversationMessages(conversationId: string, limit: number = 10): Promise<Array<{role: 'user' | 'assistant' | 'system', content: string}>> {
        try {
            const messages = await this.prisma.message.findMany({
                where: {
                    conversationId: conversationId
                },
                orderBy: {
                    createdAt: 'asc'
                },
                take: limit
            });
            return messages.map(msg => ({
                role: (msg.role === 'USER' ? 'user' : 'assistant') as 'user' | 'assistant',
                content: msg.content
            }))

        } catch (error: any) {
            throw new BadRequestException(error.message);

        }
    }
    async saveMessage(
        conversationId: string,
        role: 'USER' | 'BOT',
        content: string,
        tokens?: number,
        model?: string
      ) {
        try {
          const message = await this.prisma.message.create({
            data: {
              conversationId: conversationId,
              role: role,
              content: content,
              tokens: tokens,
              model: model
            }
          });
      
          await this.prisma.conversation.update({
            where: { id: conversationId },
            data: { updatedAt: new Date() }
          });
      
          return message;
        } catch (error: any) {
          throw new BadRequestException(error.message);
        }
      }

}

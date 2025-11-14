import { Injectable } from '@nestjs/common';
import { ConfigService } from '@repo/config';
import OpenAI from 'openai';


@Injectable()
export class OpenAIService {
    private openai: OpenAI;

    constructor(
        private readonly configService: ConfigService
    ) { 
        const apiKey = this.configService.get<string>('OPENAI_API_KEY');
        this.openai = new OpenAI({
            apiKey: apiKey || ''
        })
    }


    async *streamChat(messages: Array<{role: 'user' | 'assistant' | 'system', content: string}>) {
        const stream = await this.openai.chat.completions.create({
            model: this.configService.get<string>('OPENAI_MODEL') || 'gpt-3.5-turbo',
            messages: messages,
            stream: true
        });
        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
                yield content;
            }

        }
    }

}

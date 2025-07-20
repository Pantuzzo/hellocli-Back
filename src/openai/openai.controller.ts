import { Body, Controller, Post } from '@nestjs/common';
import { OpenAIService } from './openai.service';

@Controller('openai')
export class OpenAIController {
  constructor(private readonly openAIService: OpenAIService) {}

  @Post('chat')
  async chat(@Body('message') message: string) {
    return this.openAIService.chatWithAI([
      { role: 'user', content: message },
    ]);
  }
}

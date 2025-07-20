import OpenAI from 'openai';

export class OpenAIService {
  chatWithAI(arg0: { role: string; content: string; }[]) {
    throw new Error('Method not implemented.');
  }
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.IAToken,
    });
  }

  async createChatCompletion(prompt: string): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return response.choices[0].message.content || '';
  }
}

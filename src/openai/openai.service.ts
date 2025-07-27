import OpenAI from 'openai';

export class OpenAIService {
  private openai: OpenAI | null;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.warn('⚠️  OPENAI_API_KEY não configurada. Serviço OpenAI desabilitado.');
      this.openai = null;
    } else {
      this.openai = new OpenAI({
        apiKey: apiKey,
      });
    }
  }

  async chatWithAI(messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>): Promise<any> {
    if (!this.openai) {
      throw new Error('OpenAI API não configurada. Configure a variável OPENAI_API_KEY no arquivo .env');
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: messages as any,
        temperature: 0.7,
        max_tokens: 1000,
      });

      return {
        content: response.choices[0].message.content,
        role: 'assistant',
        model: 'gpt-3.5-turbo'
      };
    } catch (error) {
      throw new Error(`Erro na comunicação com OpenAI: ${error.message}`);
    }
  }

  async createChatCompletion(prompt: string): Promise<string> {
    if (!this.openai) {
      throw new Error('OpenAI API não configurada. Configure a variável OPENAI_API_KEY no arquivo .env');
    }

    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return response.choices[0].message.content || '';
  }
}

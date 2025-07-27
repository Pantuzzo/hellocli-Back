import { Injectable, NotFoundException } from '@nestjs/common';
import OpenAI from 'openai';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) { }

  async generateAndSave({ userId, prompt }: { userId: number; prompt: string }) {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Chamada para criar completions (ou chat completions)
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const textResponse = completion.choices[0].message.content ?? "";

    // Criar uma nova conversa
    const conversation = await this.prisma.conversation.create({
      data: {
        userId,
        title: prompt.substring(0, 50) + (prompt.length > 50 ? '...' : ''),
        companyId: 1,
      },
    });

    // Criar mensagem do usuário
    await this.prisma.message.create({
      data: {
        content: prompt,
        sender: 'USER',
        conversationId: conversation.id,
      },
    });

    // Criar mensagem do bot
    await this.prisma.message.create({
      data: {
        content: textResponse,
        sender: 'BOT',
        conversationId: conversation.id,
      },
    });

    // Retornar a conversa com as mensagens
    return this.prisma.conversation.findUnique({
      where: { id: conversation.id },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  }

  async findAllByUser(userId: number) {
    return this.prisma.conversation.findMany({
      where: { userId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneByUser(id: string, userId: number) {
    const conversation = await this.prisma.conversation.findFirst({
      where: { id: parseInt(id), userId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversa não encontrada ou não pertence ao usuário');
    }

    return conversation;
  }

  async deleteOneByUser(id: string, userId: number) {
    const conversation = await this.prisma.conversation.findFirst({
      where: { id: parseInt(id), userId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversa não encontrada ou não pertence ao usuário');
    }

    return this.prisma.conversation.delete({
      where: { id: parseInt(id) },
    });
  }
}

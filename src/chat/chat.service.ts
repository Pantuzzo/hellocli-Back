import { Injectable, NotFoundException } from '@nestjs/common';
import OpenAI from 'openai';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async generateAndSave({ userId, prompt }: { userId: number; prompt: string }) {
  const openai = new OpenAI({
    apiKey: process.env.IAToken,
  });

  // Chamada para criar completions (ou chat completions)
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  const textResponse = completion.choices[0].message.content ?? "";

  // Salva no banco
  return this.prisma.chat.create({
    data: {
      userId,
      prompt,
      response: textResponse,
    },
  });
}


  async findAllByUser(userId: number) {
    return this.prisma.chat.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneByUser(id: string, userId: number) {
    const chat = await this.prisma.chat.findFirst({
      where: { id, userId },
    });

    if (!chat) {
      throw new NotFoundException('Chat não encontrado ou não pertence ao usuário');
    }

    return chat;
  }

  async deleteOneByUser(id: string, userId: number) {
    const chat = await this.prisma.chat.findFirst({
      where: { id, userId },
    });

    if (!chat) {
      throw new NotFoundException('Chat não encontrado ou não pertence ao usuário');
    }

    return this.prisma.chat.delete({
      where: { id },
    });
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async generateAndSave({
    userId,
    prompt,
  }: {
    userId: number;
    prompt: string;
  }) {
    // Simulação de chamada para uma IA (você pode usar OpenAI ou outro)
    const response = `Resposta gerada para: ${prompt}`;

    return this.prisma.chat.create({
      data: {
        userId,
        prompt,
        response,
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

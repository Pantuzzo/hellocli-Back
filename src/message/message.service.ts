import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Injectable()
export class MessageService {
    constructor(private prisma: PrismaService) { }

    async create(userId: number, dto: CreateMessageDto) {
        // Verificar se a conversa pertence ao usuário
        const conversation = await this.prisma.conversation.findFirst({
            where: { id: dto.conversationId, userId },
        });

        if (!conversation) {
            throw new NotFoundException('Conversa não encontrada');
        }

        return this.prisma.message.create({
            data: {
                content: dto.content,
                sender: dto.sender,
                conversationId: dto.conversationId,
            },
        });
    }

    async findAllByConversation(conversationId: number, userId: number) {
        // Verificar se a conversa pertence ao usuário
        const conversation = await this.prisma.conversation.findFirst({
            where: { id: conversationId, userId },
        });

        if (!conversation) {
            throw new NotFoundException('Conversa não encontrada');
        }

        return this.prisma.message.findMany({
            where: { conversationId },
            orderBy: { createdAt: 'asc' },
        });
    }

    async findOne(id: number, userId: number) {
        const message = await this.prisma.message.findFirst({
            where: {
                id,
                conversation: {
                    userId,
                },
            },
        });

        if (!message) {
            throw new NotFoundException('Mensagem não encontrada');
        }

        return message;
    }

    async update(id: number, userId: number, dto: UpdateMessageDto) {
        const message = await this.prisma.message.findFirst({
            where: {
                id,
                conversation: {
                    userId,
                },
            },
        });

        if (!message) {
            throw new NotFoundException('Mensagem não encontrada');
        }

        return this.prisma.message.update({
            where: { id },
            data: dto,
        });
    }

    async delete(id: number, userId: number) {
        const message = await this.prisma.message.findFirst({
            where: {
                id,
                conversation: {
                    userId,
                },
            },
        });

        if (!message) {
            throw new NotFoundException('Mensagem não encontrada');
        }

        return this.prisma.message.delete({
            where: { id },
        });
    }

    // Métodos para ADMIN
    async findAll() {
        return this.prisma.message.findMany({
            include: {
                conversation: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOneAsAdmin(id: number) {
        const message = await this.prisma.message.findUnique({
            where: { id },
            include: {
                conversation: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
            },
        });

        if (!message) {
            throw new NotFoundException('Mensagem não encontrada');
        }

        return message;
    }

    async deleteAsAdmin(id: number) {
        const message = await this.prisma.message.findUnique({
            where: { id },
        });

        if (!message) {
            throw new NotFoundException('Mensagem não encontrada');
        }

        return this.prisma.message.delete({
            where: { id },
        });
    }
} 
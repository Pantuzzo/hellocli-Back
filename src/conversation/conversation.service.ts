import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';

@Injectable()
export class ConversationService {
    constructor(private prisma: PrismaService) { }

    async create(userId: number, companyId: number, dto: CreateConversationDto) {
        return this.prisma.conversation.create({
            data: {
                userId,
                companyId,
                title: dto.title,
            },
            include: {
                messages: true,
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

    async findOneByUser(id: number, userId: number) {
        const conversation = await this.prisma.conversation.findFirst({
            where: { id, userId },
            include: {
                messages: {
                    orderBy: { createdAt: 'asc' },
                },
            },
        });

        if (!conversation) {
            throw new NotFoundException('Conversa não encontrada');
        }

        return conversation;
    }

    async update(id: number, userId: number, dto: UpdateConversationDto) {
        const conversation = await this.prisma.conversation.findFirst({
            where: { id, userId },
        });

        if (!conversation) {
            throw new NotFoundException('Conversa não encontrada');
        }

        return this.prisma.conversation.update({
            where: { id },
            data: dto,
            include: {
                messages: {
                    orderBy: { createdAt: 'asc' },
                },
            },
        });
    }

    async delete(id: number, userId: number) {
        const conversation = await this.prisma.conversation.findFirst({
            where: { id, userId },
        });

        if (!conversation) {
            throw new NotFoundException('Conversa não encontrada');
        }

        return this.prisma.conversation.delete({
            where: { id },
        });
    }

    async findAll() {
        return this.prisma.conversation.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                messages: {
                    orderBy: { createdAt: 'asc' },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: number) {
        const conversation = await this.prisma.conversation.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                messages: {
                    orderBy: { createdAt: 'asc' },
                },
            },
        });

        if (!conversation) {
            throw new NotFoundException('Conversa não encontrada');
        }

        return conversation;
    }
} 
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompanyService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateCompanyDto) {
        return this.prisma.company.create({
            data: dto,
        });
    }

    async findAll() {
        return this.prisma.company.findMany({
            include: {
                users: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    },
                },
                conversations: {
                    include: {
                        messages: {
                            orderBy: { createdAt: 'asc' },
                        },
                    },
                },
            },
        });
    }

    async findOne(id: number) {
        const company = await this.prisma.company.findUnique({
            where: { id },
            include: {
                users: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    },
                },
                conversations: {
                    include: {
                        messages: {
                            orderBy: { createdAt: 'asc' },
                        },
                    },
                },
            },
        });

        if (!company) {
            throw new NotFoundException('Empresa não encontrada');
        }

        return company;
    }

    async update(id: number, dto: UpdateCompanyDto) {
        const company = await this.prisma.company.findUnique({
            where: { id },
        });

        if (!company) {
            throw new NotFoundException('Empresa não encontrada');
        }

        return this.prisma.company.update({
            where: { id },
            data: dto,
        });
    }

    async delete(id: number) {
        const company = await this.prisma.company.findUnique({
            where: { id },
        });

        if (!company) {
            throw new NotFoundException('Empresa não encontrada');
        }

        return this.prisma.company.delete({
            where: { id },
        });
    }
} 
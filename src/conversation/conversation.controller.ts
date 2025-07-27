import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Req,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiParam,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import type { RequestWithUser } from '../auth/request-with-user.interface';
import { Role } from '../auth/role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ConversationService } from './conversation.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';

@ApiTags('Conversas')
@ApiBearerAuth('JWT-auth')
@Controller('conversations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ConversationController {
    constructor(private readonly conversationService: ConversationService) { }

    @Post()
    @Roles(Role.ADMIN, Role.USER)
    @ApiOperation({ summary: 'Criar nova conversa' })
    @ApiResponse({
        status: 201,
        description: 'Conversa criada com sucesso',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'number', example: 1 },
                title: { type: 'string', example: 'Conversa sobre TypeScript' },
                userId: { type: 'number', example: 1 },
                createdAt: { type: 'string', format: 'date-time' },
                messages: { type: 'array', items: { type: 'object' } }
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @ApiResponse({ status: 400, description: 'Dados inválidos' })
    async create(
        @Body() dto: CreateConversationDto,
        @Req() req: RequestWithUser,
    ) {
        const userId = req.user?.id;
        const companyId = req.user?.companyId;
        if (!userId) {
            throw new UnauthorizedException('User not found in request');
        }
        if (!companyId) {
            throw new UnauthorizedException('Company not found in request');
        }
        return this.conversationService.create(userId, companyId, dto);
    }

    @Get()
    @Roles(Role.ADMIN, Role.USER)
    @ApiOperation({ summary: 'Listar conversas do usuário' })
    @ApiResponse({
        status: 200,
        description: 'Lista de conversas retornada com sucesso',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'number', example: 1 },
                    title: { type: 'string', example: 'Conversa sobre TypeScript' },
                    userId: { type: 'number', example: 1 },
                    createdAt: { type: 'string', format: 'date-time' },
                    messages: { type: 'array', items: { type: 'object' } }
                }
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    async getMyConversations(@Req() req: RequestWithUser) {
        const userId = req.user?.id;
        if (!userId) {
            throw new UnauthorizedException('User not found in request');
        }
        return this.conversationService.findAllByUser(userId);
    }

    @Get(':id')
    @Roles(Role.ADMIN, Role.USER)
    @ApiOperation({ summary: 'Buscar conversa específica do usuário' })
    @ApiParam({ name: 'id', type: 'number', example: 1, description: 'ID da conversa' })
    @ApiResponse({
        status: 200,
        description: 'Conversa encontrada com sucesso',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'number', example: 1 },
                title: { type: 'string', example: 'Conversa sobre TypeScript' },
                userId: { type: 'number', example: 1 },
                createdAt: { type: 'string', format: 'date-time' },
                messages: { type: 'array', items: { type: 'object' } }
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @ApiResponse({ status: 404, description: 'Conversa não encontrada' })
    async getOneConversation(@Param('id') id: string, @Req() req: RequestWithUser) {
        const userId = req.user?.id;
        if (!userId) {
            throw new UnauthorizedException('User not found in request');
        }
        return this.conversationService.findOneByUser(+id, userId);
    }

    @Patch(':id')
    @Roles(Role.ADMIN, Role.USER)
    @ApiOperation({ summary: 'Atualizar conversa do usuário' })
    @ApiParam({ name: 'id', type: 'number', example: 1, description: 'ID da conversa' })
    @ApiResponse({
        status: 200,
        description: 'Conversa atualizada com sucesso',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'number', example: 1 },
                title: { type: 'string', example: 'Conversa atualizada sobre TypeScript' },
                userId: { type: 'number', example: 1 },
                createdAt: { type: 'string', format: 'date-time' },
                messages: { type: 'array', items: { type: 'object' } }
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @ApiResponse({ status: 404, description: 'Conversa não encontrada' })
    async updateConversation(
        @Param('id') id: string,
        @Body() dto: UpdateConversationDto,
        @Req() req: RequestWithUser,
    ) {
        const userId = req.user?.id;
        if (!userId) {
            throw new UnauthorizedException('User not found in request');
        }
        return this.conversationService.update(+id, userId, dto);
    }

    @Delete(':id')
    @Roles(Role.ADMIN, Role.USER)
    @ApiOperation({ summary: 'Excluir conversa do usuário' })
    @ApiParam({ name: 'id', type: 'number', example: 1, description: 'ID da conversa' })
    @ApiResponse({
        status: 200,
        description: 'Conversa excluída com sucesso',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'number', example: 1 },
                title: { type: 'string', example: 'Conversa sobre TypeScript' },
                userId: { type: 'number', example: 1 },
                createdAt: { type: 'string', format: 'date-time' }
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @ApiResponse({ status: 404, description: 'Conversa não encontrada' })
    async deleteConversation(@Param('id') id: string, @Req() req: RequestWithUser) {
        const userId = req.user?.id;
        if (!userId) {
            throw new UnauthorizedException('User not found in request');
        }
        return this.conversationService.delete(+id, userId);
    }

    // Endpoints para ADMIN
    @Get('admin/all')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Listar todas as conversas (ADMIN)' })
    @ApiResponse({
        status: 200,
        description: 'Lista de todas as conversas retornada com sucesso',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'number', example: 1 },
                    title: { type: 'string', example: 'Conversa sobre TypeScript' },
                    userId: { type: 'number', example: 1 },
                    createdAt: { type: 'string', format: 'date-time' },
                    user: {
                        type: 'object',
                        properties: {
                            id: { type: 'number', example: 1 },
                            name: { type: 'string', example: 'João Silva' },
                            email: { type: 'string', example: 'joao@example.com' }
                        }
                    },
                    messages: { type: 'array', items: { type: 'object' } }
                }
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @ApiResponse({ status: 403, description: 'Acesso negado' })
    async getAllConversations() {
        return this.conversationService.findAll();
    }

    @Get('admin/:id')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Buscar conversa específica (ADMIN)' })
    @ApiParam({ name: 'id', type: 'number', example: 1, description: 'ID da conversa' })
    @ApiResponse({
        status: 200,
        description: 'Conversa encontrada com sucesso',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'number', example: 1 },
                title: { type: 'string', example: 'Conversa sobre TypeScript' },
                userId: { type: 'number', example: 1 },
                createdAt: { type: 'string', format: 'date-time' },
                user: {
                    type: 'object',
                    properties: {
                        id: { type: 'number', example: 1 },
                        name: { type: 'string', example: 'João Silva' },
                        email: { type: 'string', example: 'joao@example.com' }
                    }
                },
                messages: { type: 'array', items: { type: 'object' } }
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @ApiResponse({ status: 403, description: 'Acesso negado' })
    @ApiResponse({ status: 404, description: 'Conversa não encontrada' })
    async getConversationAsAdmin(@Param('id') id: string) {
        return this.conversationService.findOne(+id);
    }
} 
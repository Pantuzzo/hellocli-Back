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
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@ApiTags('Mensagens')
@ApiBearerAuth('JWT-auth')
@Controller('messages')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MessageController {
    constructor(private readonly messageService: MessageService) { }

    @Post()
    @Roles(Role.ADMIN, Role.USER)
    @ApiOperation({ summary: 'Criar nova mensagem' })
    @ApiResponse({
        status: 201,
        description: 'Mensagem criada com sucesso',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'number', example: 1 },
                content: { type: 'string', example: 'Olá, como você está?' },
                sender: { type: 'string', example: 'USER' },
                conversationId: { type: 'number', example: 1 },
                createdAt: { type: 'string', format: 'date-time' }
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @ApiResponse({ status: 400, description: 'Dados inválidos' })
    @ApiResponse({ status: 404, description: 'Conversa não encontrada' })
    async create(
        @Body() dto: CreateMessageDto,
        @Req() req: RequestWithUser,
    ) {
        const userId = req.user?.id;
        if (!userId) {
            throw new UnauthorizedException('User not found in request');
        }
        return this.messageService.create(userId, dto);
    }

    @Get('conversation/:conversationId')
    @Roles(Role.ADMIN, Role.USER)
    @ApiOperation({ summary: 'Listar mensagens de uma conversa' })
    @ApiParam({ name: 'conversationId', type: 'number', example: 1, description: 'ID da conversa' })
    @ApiResponse({
        status: 200,
        description: 'Lista de mensagens retornada com sucesso',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'number', example: 1 },
                    content: { type: 'string', example: 'Olá, como você está?' },
                    sender: { type: 'string', example: 'USER' },
                    conversationId: { type: 'number', example: 1 },
                    createdAt: { type: 'string', format: 'date-time' }
                }
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @ApiResponse({ status: 404, description: 'Conversa não encontrada' })
    async getMessagesByConversation(
        @Param('conversationId') conversationId: string,
        @Req() req: RequestWithUser,
    ) {
        const userId = req.user?.id;
        if (!userId) {
            throw new UnauthorizedException('User not found in request');
        }
        return this.messageService.findAllByConversation(+conversationId, userId);
    }

    @Get(':id')
    @Roles(Role.ADMIN, Role.USER)
    @ApiOperation({ summary: 'Buscar mensagem específica do usuário' })
    @ApiParam({ name: 'id', type: 'number', example: 1, description: 'ID da mensagem' })
    @ApiResponse({
        status: 200,
        description: 'Mensagem encontrada com sucesso',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'number', example: 1 },
                content: { type: 'string', example: 'Olá, como você está?' },
                sender: { type: 'string', example: 'USER' },
                conversationId: { type: 'number', example: 1 },
                createdAt: { type: 'string', format: 'date-time' }
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @ApiResponse({ status: 404, description: 'Mensagem não encontrada' })
    async getOneMessage(@Param('id') id: string, @Req() req: RequestWithUser) {
        const userId = req.user?.id;
        if (!userId) {
            throw new UnauthorizedException('User not found in request');
        }
        return this.messageService.findOne(+id, userId);
    }

    @Patch(':id')
    @Roles(Role.ADMIN, Role.USER)
    @ApiOperation({ summary: 'Atualizar mensagem do usuário' })
    @ApiParam({ name: 'id', type: 'number', example: 1, description: 'ID da mensagem' })
    @ApiResponse({
        status: 200,
        description: 'Mensagem atualizada com sucesso',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'number', example: 1 },
                content: { type: 'string', example: 'Mensagem atualizada' },
                sender: { type: 'string', example: 'USER' },
                conversationId: { type: 'number', example: 1 },
                createdAt: { type: 'string', format: 'date-time' }
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @ApiResponse({ status: 404, description: 'Mensagem não encontrada' })
    async updateMessage(
        @Param('id') id: string,
        @Body() dto: UpdateMessageDto,
        @Req() req: RequestWithUser,
    ) {
        const userId = req.user?.id;
        if (!userId) {
            throw new UnauthorizedException('User not found in request');
        }
        return this.messageService.update(+id, userId, dto);
    }

    @Delete(':id')
    @Roles(Role.ADMIN, Role.USER)
    @ApiOperation({ summary: 'Excluir mensagem do usuário' })
    @ApiParam({ name: 'id', type: 'number', example: 1, description: 'ID da mensagem' })
    @ApiResponse({
        status: 200,
        description: 'Mensagem excluída com sucesso',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'number', example: 1 },
                content: { type: 'string', example: 'Olá, como você está?' },
                sender: { type: 'string', example: 'USER' },
                conversationId: { type: 'number', example: 1 },
                createdAt: { type: 'string', format: 'date-time' }
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @ApiResponse({ status: 404, description: 'Mensagem não encontrada' })
    async deleteMessage(@Param('id') id: string, @Req() req: RequestWithUser) {
        const userId = req.user?.id;
        if (!userId) {
            throw new UnauthorizedException('User not found in request');
        }
        return this.messageService.delete(+id, userId);
    }

    // Endpoints para ADMIN
    @Get('admin/all')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Listar todas as mensagens (ADMIN)' })
    @ApiResponse({
        status: 200,
        description: 'Lista de todas as mensagens retornada com sucesso',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'number', example: 1 },
                    content: { type: 'string', example: 'Olá, como você está?' },
                    sender: { type: 'string', example: 'USER' },
                    conversationId: { type: 'number', example: 1 },
                    createdAt: { type: 'string', format: 'date-time' },
                    conversation: {
                        type: 'object',
                        properties: {
                            id: { type: 'number', example: 1 },
                            title: { type: 'string', example: 'Conversa sobre TypeScript' },
                            user: {
                                type: 'object',
                                properties: {
                                    id: { type: 'number', example: 1 },
                                    name: { type: 'string', example: 'João Silva' },
                                    email: { type: 'string', example: 'joao@example.com' }
                                }
                            }
                        }
                    }
                }
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @ApiResponse({ status: 403, description: 'Acesso negado' })
    async getAllMessages() {
        return this.messageService.findAll();
    }

    @Get('admin/:id')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Buscar mensagem específica (ADMIN)' })
    @ApiParam({ name: 'id', type: 'number', example: 1, description: 'ID da mensagem' })
    @ApiResponse({
        status: 200,
        description: 'Mensagem encontrada com sucesso',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'number', example: 1 },
                content: { type: 'string', example: 'Olá, como você está?' },
                sender: { type: 'string', example: 'USER' },
                conversationId: { type: 'number', example: 1 },
                createdAt: { type: 'string', format: 'date-time' },
                conversation: {
                    type: 'object',
                    properties: {
                        id: { type: 'number', example: 1 },
                        title: { type: 'string', example: 'Conversa sobre TypeScript' },
                        user: {
                            type: 'object',
                            properties: {
                                id: { type: 'number', example: 1 },
                                name: { type: 'string', example: 'João Silva' },
                                email: { type: 'string', example: 'joao@example.com' }
                            }
                        }
                    }
                }
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @ApiResponse({ status: 403, description: 'Acesso negado' })
    @ApiResponse({ status: 404, description: 'Mensagem não encontrada' })
    async getMessageAsAdmin(@Param('id') id: string) {
        return this.messageService.findOneAsAdmin(+id);
    }

    @Delete('admin/:id')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Excluir mensagem (ADMIN)' })
    @ApiParam({ name: 'id', type: 'number', example: 1, description: 'ID da mensagem' })
    @ApiResponse({
        status: 200,
        description: 'Mensagem excluída com sucesso',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'number', example: 1 },
                content: { type: 'string', example: 'Olá, como você está?' },
                sender: { type: 'string', example: 'USER' },
                conversationId: { type: 'number', example: 1 },
                createdAt: { type: 'string', format: 'date-time' }
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @ApiResponse({ status: 403, description: 'Acesso negado' })
    @ApiResponse({ status: 404, description: 'Mensagem não encontrada' })
    async deleteMessageAsAdmin(@Param('id') id: string) {
        return this.messageService.deleteAsAdmin(+id);
    }
} 
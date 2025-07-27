import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
import { Roles } from 'src/auth/decorators/roles.decorator';
import type { RequestWithUser } from 'src/auth/request-with-user.interface';
import { Role } from 'src/auth/role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/chat.dto';

@ApiTags('Chat')
@ApiBearerAuth('JWT-auth')
@Controller('chat')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) { }

  @Post()
  @Roles(Role.ADMIN, Role.USER)
  @ApiOperation({ summary: 'Enviar mensagem para IA e salvar resposta' })
  @ApiResponse({
    status: 201,
    description: 'Mensagem enviada e resposta salva com sucesso',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-string' },
        prompt: { type: 'string', example: 'Explique o que é TypeScript' },
        response: { type: 'string', example: 'TypeScript é um superset do JavaScript...' },
        userId: { type: 'number', example: 1 },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async sendMessage(
    @Body() dto: CreateChatDto,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('User not found in request');
    }
    return this.chatService.generateAndSave({ userId, prompt: dto.prompt });
  }

  @Get()
  @Roles(Role.ADMIN, Role.USER)
  @ApiOperation({ summary: 'Listar todas as conversas do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Lista de conversas retornada com sucesso',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'uuid-string' },
          prompt: { type: 'string', example: 'Explique o que é TypeScript' },
          response: { type: 'string', example: 'TypeScript é um superset do JavaScript...' },
          userId: { type: 'number', example: 1 },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async getMyChats(@Req() req: RequestWithUser) {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('User not found in request');
    }
    return this.chatService.findAllByUser(userId);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.USER)
  @ApiOperation({ summary: 'Buscar conversa específica do usuário' })
  @ApiParam({ name: 'id', type: 'string', example: 'uuid-string', description: 'ID da conversa' })
  @ApiResponse({
    status: 200,
    description: 'Conversa encontrada com sucesso',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-string' },
        prompt: { type: 'string', example: 'Explique o que é TypeScript' },
        response: { type: 'string', example: 'TypeScript é um superset do JavaScript...' },
        userId: { type: 'number', example: 1 },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Conversa não encontrada' })
  async getOneChat(@Param('id') id: string, @Req() req: RequestWithUser) {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('User not found in request');
    }
    return this.chatService.findOneByUser(id, userId);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.USER)
  @ApiOperation({ summary: 'Excluir conversa específica do usuário' })
  @ApiParam({ name: 'id', type: 'string', example: 'uuid-string', description: 'ID da conversa' })
  @ApiResponse({
    status: 200,
    description: 'Conversa excluída com sucesso',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-string' },
        prompt: { type: 'string', example: 'Explique o que é TypeScript' },
        response: { type: 'string', example: 'TypeScript é um superset do JavaScript...' },
        userId: { type: 'number', example: 1 },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Conversa não encontrada' })
  async deleteChat(@Param('id') id: string, @Req() req: RequestWithUser) {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('User not found in request');
    }
    return this.chatService.deleteOneByUser(id, userId);
  }
}

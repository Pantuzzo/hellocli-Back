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
import { Roles } from 'src/auth/decorators/roles.decorator';
import type { RequestWithUser } from 'src/auth/request-with-user.interface';
import { Role } from 'src/auth/role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/chat.dto';

@Controller('chat')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // Envia prompt e salva a resposta
  @Post()
  @Roles(Role.ADMIN, Role.USER)
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

  // Lista todos os chats do usuário
  @Get()
  @Roles(Role.ADMIN, Role.USER)
  async getMyChats(@Req() req: RequestWithUser) {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('User not found in request');
    }
    return this.chatService.findAllByUser(userId);
  }

  // Retorna detalhes de um chat específico
  @Get(':id')
  @Roles(Role.ADMIN, Role.USER)
  async getOneChat(@Param('id') id: string, @Req() req: RequestWithUser) {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('User not found in request');
    }
    return this.chatService.findOneByUser(id, userId);
  }

  // Exclui um chat específico do usuário
  @Delete(':id')
  @Roles(Role.ADMIN, Role.USER)
  async deleteChat(@Param('id') id: string, @Req() req: RequestWithUser) {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('User not found in request');
    }
    return this.chatService.deleteOneByUser(id, userId);
  }
}

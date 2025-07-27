import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Role } from 'src/auth/role.enum';
import { OpenAIService } from './openai.service';
import { OpenAIChatDto } from './dto/openai.dto';

@ApiTags('OpenAI')
@ApiBearerAuth('JWT-auth')
@Controller('openai')
export class OpenAIController {
  constructor(private readonly openAIService: OpenAIService) { }

  @Post('chat')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Chat direto com OpenAI (apenas ADMIN)' })
  @ApiResponse({
    status: 200,
    description: 'Resposta da IA gerada com sucesso',
    schema: {
      type: 'object',
      properties: {
        content: {
          type: 'string',
          example: 'TypeScript é um superset do JavaScript que adiciona tipagem estática...'
        },
        role: { type: 'string', example: 'assistant' },
        model: { type: 'string', example: 'gpt-3.5-turbo' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Acesso negado - requer role ADMIN' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async chat(@Body() dto: OpenAIChatDto) {
    return this.openAIService.chatWithAI([
      { role: 'user', content: dto.message },
    ]);
  }
}

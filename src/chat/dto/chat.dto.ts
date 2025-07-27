import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateChatDto {
  @ApiProperty({
    example: 'Explique o que é TypeScript e suas vantagens',
    description: 'Mensagem/prompt para enviar para a IA'
  })
  @IsString()
  @MinLength(1)
  prompt: string;
}

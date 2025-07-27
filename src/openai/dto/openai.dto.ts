import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class OpenAIChatDto {
    @ApiProperty({
        example: 'Explique o que é NestJS e suas principais características',
        description: 'Mensagem para enviar para a OpenAI'
    })
    @IsString()
    @MinLength(1)
    message: string;
} 
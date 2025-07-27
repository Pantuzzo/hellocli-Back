import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export enum SenderType {
    USER = 'USER',
    BOT = 'BOT',
}

export class CreateMessageDto {
    @ApiProperty({
        example: 'Olá, como você está?',
        description: 'Conteúdo da mensagem'
    })
    @IsString()
    @IsNotEmpty()
    content: string;

    @ApiProperty({
        example: 'USER',
        description: 'Tipo do remetente',
        enum: ['USER', 'BOT']
    })
    @IsEnum(SenderType)
    sender: SenderType;

    @ApiProperty({
        example: 1,
        description: 'ID da conversa'
    })
    @IsNumber()
    conversationId: number;
} 
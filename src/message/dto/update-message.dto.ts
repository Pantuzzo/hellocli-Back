import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { SenderType } from './create-message.dto';

export class UpdateMessageDto {
    @ApiProperty({
        example: 'Mensagem atualizada',
        description: 'Novo conteúdo da mensagem',
        required: false
    })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    content?: string;

    @ApiProperty({
        example: 'USER',
        description: 'Tipo do remetente',
        enum: ['USER', 'BOT'],
        required: false
    })
    @IsOptional()
    @IsEnum(SenderType)
    sender?: SenderType;
} 
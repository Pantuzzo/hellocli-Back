import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateConversationDto {
    @ApiProperty({
        example: 'Conversa sobre TypeScript',
        description: 'Título da conversa (opcional)',
        required: false
    })
    @IsOptional()
    @IsString()
    title?: string;
} 
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateConversationDto {
    @ApiProperty({
        example: 'Conversa atualizada sobre TypeScript',
        description: 'Novo título da conversa',
        required: false
    })
    @IsOptional()
    @IsString()
    title?: string;
} 
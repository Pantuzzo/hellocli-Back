import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateCompanyDto {
    @ApiProperty({
        example: 'Tech Solutions Inc. Updated',
        description: 'Novo nome da empresa',
        required: false
    })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    name?: string;
} 
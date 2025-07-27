import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCompanyDto {
    @ApiProperty({
        example: 'Tech Solutions Inc.',
        description: 'Nome da empresa'
    })
    @IsString()
    @IsNotEmpty()
    name: string;
} 
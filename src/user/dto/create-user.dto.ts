import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';
import { Role } from '../../auth/role.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'New User' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'senhaSegura123' })
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: 'user',
    description: 'Role do usuário (user ou admin)',
    enum: ['user', 'admin']
  })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @ApiProperty({
    example: 1,
    description: 'ID da empresa'
  })
  @IsNumber()
  companyId: number;
}

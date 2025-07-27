import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { Role } from '../../auth/role.enum';

export class UpdateUserDto {
  @ApiProperty({ example: 'teste Pantuzzo' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'teste@gmail.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 'icaro Pantuzzo' })
  @IsOptional()
  @MinLength(6)
  password?: string;

  @ApiProperty({
    example: 'admin',
    description: 'Role do usuário (user ou admin)',
    enum: ['user', 'admin']
  })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}

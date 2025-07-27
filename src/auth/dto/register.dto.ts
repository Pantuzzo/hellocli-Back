import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { Role } from '../role.enum';

export class RegisterDto {
  @ApiProperty({ example: 'teste pantuzzo' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'teste2@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '1234568' })
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'ADMIN' })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}

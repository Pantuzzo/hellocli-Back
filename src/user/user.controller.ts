// src/user/user.controller.ts
import { Body, Controller, Delete, ForbiddenException, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Role } from '../auth/role.enum';
import { CreateUserDto } from './dto/create-user.dto';
import type { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Lista todos os usuários - apenas admin
  @Get()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  findAllUsers() {
    return this.userService.findAll();
  }

  // Pega dados do próprio usuário ou admin
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string, @Req() req){
    const userId = req.user.userId;
    const role = req.user.role;
    if (role !== Role.ADMIN && userId !== +id) {
      throw new ForbiddenException('Você não tem permissão para acessar esse recurso');
    }
    return this.userService.findOne(+id);
  }

  // Cria novo usuário (talvez só admin pode criar, adapte se quiser)
  @Post()
  async create(@Body() dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }

   // Atualiza usuário (admin ou dono da conta)
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto, @Req() req) {
    const userId = req.user.userId;
    const role = req.user.role;

    if (role !== Role.ADMIN && userId !== +id) {
      throw new ForbiddenException('Você não tem permissão para atualizar esse recurso');
    }

    return this.userService.update(+id, dto);
  }

  // Deleta usuário - só admin
  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async delete(@Param('id') id: string) {
    return this.userService.delete(+id);
  }
}


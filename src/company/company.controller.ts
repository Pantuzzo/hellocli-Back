import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiParam,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@ApiTags('Empresas')
@ApiBearerAuth('JWT-auth')
@Controller('companies')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CompanyController {
    constructor(private readonly companyService: CompanyService) { }

    @Post()
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Criar nova empresa (ADMIN)' })
    @ApiResponse({
        status: 201,
        description: 'Empresa criada com sucesso',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'number', example: 1 },
                name: { type: 'string', example: 'Tech Solutions Inc.' },
                createdAt: { type: 'string', format: 'date-time' }
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @ApiResponse({ status: 403, description: 'Acesso negado' })
    @ApiResponse({ status: 400, description: 'Dados inválidos' })
    async create(@Body() dto: CreateCompanyDto) {
        return this.companyService.create(dto);
    }

    @Get()
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Listar todas as empresas (ADMIN)' })
    @ApiResponse({
        status: 200,
        description: 'Lista de empresas retornada com sucesso',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'number', example: 1 },
                    name: { type: 'string', example: 'Tech Solutions Inc.' },
                    createdAt: { type: 'string', format: 'date-time' },
                    users: { type: 'array', items: { type: 'object' } },
                    conversations: { type: 'array', items: { type: 'object' } }
                }
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @ApiResponse({ status: 403, description: 'Acesso negado' })
    async findAll() {
        return this.companyService.findAll();
    }

    @Get(':id')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Buscar empresa específica (ADMIN)' })
    @ApiParam({ name: 'id', type: 'number', example: 1, description: 'ID da empresa' })
    @ApiResponse({
        status: 200,
        description: 'Empresa encontrada com sucesso',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'number', example: 1 },
                name: { type: 'string', example: 'Tech Solutions Inc.' },
                createdAt: { type: 'string', format: 'date-time' },
                users: { type: 'array', items: { type: 'object' } },
                conversations: { type: 'array', items: { type: 'object' } }
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @ApiResponse({ status: 403, description: 'Acesso negado' })
    @ApiResponse({ status: 404, description: 'Empresa não encontrada' })
    async findOne(@Param('id') id: string) {
        return this.companyService.findOne(+id);
    }

    @Patch(':id')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Atualizar empresa (ADMIN)' })
    @ApiParam({ name: 'id', type: 'number', example: 1, description: 'ID da empresa' })
    @ApiResponse({
        status: 200,
        description: 'Empresa atualizada com sucesso',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'number', example: 1 },
                name: { type: 'string', example: 'Tech Solutions Inc. Updated' },
                createdAt: { type: 'string', format: 'date-time' }
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @ApiResponse({ status: 403, description: 'Acesso negado' })
    @ApiResponse({ status: 404, description: 'Empresa não encontrada' })
    async update(@Param('id') id: string, @Body() dto: UpdateCompanyDto) {
        return this.companyService.update(+id, dto);
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Excluir empresa (ADMIN)' })
    @ApiParam({ name: 'id', type: 'number', example: 1, description: 'ID da empresa' })
    @ApiResponse({
        status: 200,
        description: 'Empresa excluída com sucesso',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'number', example: 1 },
                name: { type: 'string', example: 'Tech Solutions Inc.' },
                createdAt: { type: 'string', format: 'date-time' }
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @ApiResponse({ status: 403, description: 'Acesso negado' })
    @ApiResponse({ status: 404, description: 'Empresa não encontrada' })
    async delete(@Param('id') id: string) {
        return this.companyService.delete(+id);
    }
} 
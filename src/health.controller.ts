import { Controller, Get } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Controller('health')
export class HealthController {
  @Get()
  async check() {
    await prisma.$queryRaw`SELECT 1`;
    return { status: 'OK', db: 'connected' };
  }
}
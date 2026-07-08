import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ExportController } from './export.controller';

@Module({
  providers: [PrismaService],
  controllers: [ExportController],
})
export class ExportModule {}

import { Module } from '@nestjs/common';
import { ExportController } from '../routes/export.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ExportController],
  providers: [PrismaService],
})
export class ExportModule {}

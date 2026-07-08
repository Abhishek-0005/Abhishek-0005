import { Module } from '@nestjs/common';
import { ReportsController } from '../routes/reports.controller';
import { ReportsService } from '../services/reports.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ReportsController],
  providers: [ReportsService, PrismaService],
})
export class ReportsModule {}

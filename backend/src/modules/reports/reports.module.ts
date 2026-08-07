import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';

@Module({
  providers: [ReportsService, PrismaService],
  controllers: [ReportsController],
})
export class ReportsModule {}

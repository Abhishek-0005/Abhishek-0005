import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { HealthController } from '../routes/health.controller';
import { CategoriesModule } from './categories.module';
import { TransactionsModule } from './transactions.module';
import { ReportsModule } from './reports.module';
import { ExportModule } from './export.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), CategoriesModule, TransactionsModule, ReportsModule, ExportModule],
  controllers: [HealthController],
  providers: [PrismaService],
})
export class AppModule {}

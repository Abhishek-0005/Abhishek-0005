import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';
import { CategoriesModule } from './categories/categories.module';
import { TransactionsModule } from './transactions/transactions.module';
import { ReportsModule } from './reports/reports.module';
import { ExportModule } from './export/export.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HealthModule,
    PrismaModule,
    CategoriesModule,
    TransactionsModule,
    ReportsModule,
    ExportModule,
  ],
})
export class AppModule {}

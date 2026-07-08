import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { HealthController } from '../routes/health.controller';
import { CategoriesModule } from './categories/categories.module';
import { TransactionsModule } from './transactions/transactions.module';
import { ReportsModule } from './reports/reports.module';
import { ExportModule } from './export/export.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env', '.env.local'] }),
    CategoriesModule,
    TransactionsModule,
    ReportsModule,
    ExportModule,
  ],
  providers: [PrismaService],
  controllers: [HealthController],
})
export class AppModule {}

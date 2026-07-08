import { Module } from '@nestjs/common';
import { TransactionsService } from '../services/transactions.service';
import { TransactionsController } from '../routes/transactions.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService, PrismaService],
})
export class TransactionsModule {}

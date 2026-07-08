import { Controller, Get, Header, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { Prisma, TransactionType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Controller('export')
export class ExportController {
  constructor(private prisma: PrismaService) {}

  @Get('transactions.csv')
  @Header('Content-Type', 'text/csv')
  async exportCsv(
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('type') type?: TransactionType,
    @Query('categoryId') categoryId?: string,
    @Query('q') q?: string,
    @Res() res?: Response,
  ) {
    const where: any = {};
    if (from) where.date = { ...(where.date || {}), gte: new Date(from) };
    if (to) where.date = { ...(where.date || {}), lte: new Date(to) };
    if (type) where.type = type;
    if (categoryId) where.categoryId = Number(categoryId);
    if (q) where.OR = [{ description: { contains: q, mode: 'insensitive' } }];

    const txs = await this.prisma.transaction.findMany({ where, include: { category: true }, orderBy: { date: 'desc' } });

    const headers = ['id', 'date', 'amount', 'type', 'description', 'category'];
    const lines = [headers.join(',')];
    for (const t of txs) {
      const row = [
        t.id,
        t.date.toISOString().slice(0, 10),
        Number(t.amount).toFixed(2),
        t.type,
        (t.description || '').replace(/,/g, ' '),
        t.category?.name || '',
      ];
      lines.push(row.join(','));
    }

    const csv = lines.join('\n');
    res?.setHeader('Content-Disposition', 'attachment; filename="transactions.csv"');
    res?.send(csv);
  }
}

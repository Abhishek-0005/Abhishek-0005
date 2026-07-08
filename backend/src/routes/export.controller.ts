import { Controller, Get, Header, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';

@Controller('export')
export class ExportController {
  constructor(private prisma: PrismaService) {}

  @Get('transactions.csv')
  @Header('Content-Type', 'text/csv')
  async exportCsv(
    @Res() res: Response,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('type') type?: string,
    @Query('categoryId') categoryId?: string,
    @Query('q') q?: string,
  ) {
    const where: any = {};
    if (from || to) {
      where.date = {};
      if (from) where.date.gte = new Date(from);
      if (to) where.date.lte = new Date(to);
    }
    if (type && (type === 'INCOME' || type === 'EXPENSE')) where.type = type;
    if (categoryId) where.categoryId = categoryId;
    if (q) where.OR = [{ description: { contains: q, mode: 'insensitive' } }];

    const items = await this.prisma.transaction.findMany({ where, orderBy: { date: 'desc' }, include: { category: true } });

    const header = 'id,date,type,amount,description,categoryName\n';
    const lines = items.map((t) =>
      [t.id, t.date.toISOString(), t.type, t.amount.toString(), (t.description ?? '').replace(/\n/g, ' '), t.category?.name ?? ''].join(','),
    );
    res.setHeader('Content-Disposition', 'attachment; filename="transactions.csv"');
    res.send(header + lines.join('\n'));
  }
}

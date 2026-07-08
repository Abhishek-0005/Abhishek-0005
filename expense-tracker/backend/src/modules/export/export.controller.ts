import { Controller, Get, Header, Query, Res } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Response } from 'express';
import { TransactionType } from '@prisma/client';

@Controller('export')
export class ExportController {
  constructor(private prisma: PrismaService) {}

  @Get('transactions.csv')
  @Header('Content-Type', 'text/csv')
  async exportCsv(
    @Res() res: Response,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('categoryId') categoryId?: string,
    @Query('type') type?: TransactionType,
  ) {
    const where: any = {};
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }
    if (categoryId) where.categoryId = parseInt(categoryId, 10);
    if (type) where.type = type;

    const txs = await this.prisma.transaction.findMany({
      where,
      orderBy: { date: 'desc' },
      include: { category: true },
    });

    const header = 'id,date,type,amount,category,note\n';
    const lines = txs.map((t) => {
      const date = new Date(t.date).toISOString();
      const noteEscaped = (t.note || '').replace(/"/g, '""');
      return `${t.id},${date},${t.type},${Number(t.amount).toFixed(2)},"${t.category.name}","${noteEscaped}"`;
    });

    const csv = header + lines.join('\n');

    res.setHeader('Content-Disposition', 'attachment; filename="transactions.csv"');
    res.send(csv);
  }
}

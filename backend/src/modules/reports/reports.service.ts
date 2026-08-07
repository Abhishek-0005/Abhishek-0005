import { Injectable } from '@nestjs/common';
import { Prisma, TransactionType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async monthly(from: string, to: string) {
    // from/to are YYYY-MM
    const fromDate = new Date(`${from}-01T00:00:00.000Z`);
    const [y, m] = to.split('-').map((x) => Number(x));
    const toDate = new Date(Date.UTC(y, m, 0, 23, 59, 59, 999));

    const rows = await this.prisma.transaction.groupBy({
      by: ['type'],
      where: { date: { gte: fromDate, lte: toDate } },
      _sum: { amount: true },
    });

    const income = rows.find((r) => r.type === TransactionType.INCOME)?._sum.amount ?? new Prisma.Decimal(0);
    const expense = rows.find((r) => r.type === TransactionType.EXPENSE)?._sum.amount ?? new Prisma.Decimal(0);

    return {
      from,
      to,
      income: Number(income),
      expense: Number(expense),
      net: Number(income.minus(expense)),
    };
  }

  async categoryBreakdown(from: string, to: string) {
    const fromDate = new Date(`${from}T00:00:00.000Z`);
    const toDate = new Date(`${to}T23:59:59.999Z`);

    const items = await this.prisma.transaction.groupBy({
      by: ['categoryId'],
      where: { date: { gte: fromDate, lte: toDate }, type: TransactionType.EXPENSE },
      _sum: { amount: true },
    });

    const categories = await this.prisma.category.findMany({
      where: { id: { in: items.map((i) => i.categoryId!).filter(Boolean) } },
    });

    return items.map((i) => ({
      categoryId: i.categoryId,
      category: categories.find((c) => c.id === i.categoryId)?.name ?? 'Uncategorized',
      total: Number(i._sum.amount ?? 0),
    }));
  }
}

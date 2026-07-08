import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, TransactionType } from '@prisma/client';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async monthly(year: number) {
    const start = new Date(`${year}-01-01T00:00:00.000Z`);
    const end = new Date(`${year + 1}-01-01T00:00:00.000Z`);

    const txs = await this.prisma.transaction.findMany({
      where: { date: { gte: start, lt: end } },
      select: {
        amount: true,
        type: true,
        date: true,
        category: { select: { id: true, name: true } },
      },
      orderBy: { date: 'asc' },
    });

    const months = Array.from({ length: 12 }, (_, i) => i); // 0..11

    const data = months.map((m) => ({
      month: m + 1,
      income: 0,
      expense: 0,
      net: 0,
      categories: {},
    } as any));

    for (const t of txs) {
      const m = new Date(t.date).getUTCMonth();
      const amount = Number(t.amount);
      const monthObj = data[m];
      if (t.type === TransactionType.INCOME) {
        monthObj.income += amount;
      } else {
        monthObj.expense += amount;
        // per-category breakdown for expenses
        const key = `${t.category.id}:${t.category.name}`;
        monthObj.categories[key] = (monthObj.categories[key] || 0) + amount;
      }
      monthObj.net = monthObj.income - monthObj.expense;
    }

    // normalize categories into array
    const normalized = data.map((d) => ({
      month: d.month,
      income: d.income,
      expense: d.expense,
      net: d.net,
      categories: Object.entries(d.categories).map(([k, v]) => {
        const [id, name] = k.split(':');
        return { id: Number(id), name, expense: v as number };
      }),
    }));

    return normalized;
  }

  async summary(params: { startDate?: string; endDate?: string }) {
    const where: Prisma.TransactionWhereInput = {};
    if (params.startDate || params.endDate) {
      where.date = {};
      if (params.startDate) (where.date as any).gte = new Date(params.startDate);
      if (params.endDate) (where.date as any).lte = new Date(params.endDate);
    }

    const txs = await this.prisma.transaction.findMany({
      where,
      select: { amount: true, type: true, category: { select: { id: true, name: true } } },
    });

    let income = 0;
    let expense = 0;
    const byCategory = new Map<number, { id: number; name: string; income: number; expense: number }>();

    for (const t of txs) {
      const amt = Number(t.amount);
      if (t.type === TransactionType.INCOME) income += amt;
      else expense += amt;

      const catId = (t.category as any).id;
      const catName = (t.category as any).name;
      if (!byCategory.has(catId)) byCategory.set(catId, { id: catId, name: catName, income: 0, expense: 0 });
      const agg = byCategory.get(catId)!;
      if (t.type === TransactionType.INCOME) agg.income += amt;
      else agg.expense += amt;
    }

    return {
      income,
      expense,
      net: income - expense,
      byCategory: Array.from(byCategory.values()),
    };
  }
}

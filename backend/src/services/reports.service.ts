import { Injectable } from '@nestjs/common';
import { Prisma, TransactionType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async monthly(from: string, to: string) {
    // from/to in YYYY-MM format
    const start = new Date(`${from}-01T00:00:00.000Z`);
    const end = new Date(`${to}-01T00:00:00.000Z`);
    end.setMonth(end.getMonth() + 1);

    const rows = await this.prisma.$queryRawUnsafe<any[]>(
      `
      SELECT date_trunc('month', date) AS month,
        SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END) AS income,
        SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END) AS expense
      FROM "Transaction"
      WHERE date >= $1 AND date < $2
      GROUP BY 1
      ORDER BY 1 ASC
    `,
      start,
      end,
    );

    return rows.map((r) => ({
      month: new Date(r.month).toISOString().slice(0, 7),
      income: Number(r.income ?? 0),
      expense: Number(r.expense ?? 0),
      net: Number(r.income ?? 0) - Number(r.expense ?? 0),
    }));
  }

  async categoryBreakdown(from: string, to: string) {
    const start = new Date(`${from}T00:00:00.000Z`);
    const end = new Date(`${to}T23:59:59.999Z`);

    const rows = await this.prisma.$queryRawUnsafe<any[]>(
      `
      SELECT c.id, c.name, c.type,
        SUM(t.amount) AS total
      FROM "Transaction" t
      LEFT JOIN "Category" c ON c.id = t."categoryId"
      WHERE t.date >= $1 AND t.date <= $2
      GROUP BY c.id, c.name, c.type
      ORDER BY total DESC NULLS LAST
    `,
      start,
      end,
    );

    return rows.map((r) => ({ id: r.id, name: r.name, type: r.type as keyof typeof TransactionType, total: Number(r.total ?? 0) }));
  }
}

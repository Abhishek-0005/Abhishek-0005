import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, TransactionType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTransactionDto, TransactionFiltersDto, UpdateTransactionDto } from './dto';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  private buildWhere(filters: TransactionFiltersDto): Prisma.TransactionWhereInput {
    const where: Prisma.TransactionWhereInput = {};
    if (filters.from) {
      where.date = { ...(where.date as any), gte: new Date(filters.from) };
    }
    if (filters.to) {
      where.date = { ...(where.date as any), lte: new Date(filters.to) };
    }
    if (filters.type) {
      where.type = filters.type as TransactionType;
    }
    if ((filters as any).categoryId) {
      where.categoryId = Number((filters as any).categoryId);
    }
    if (filters.q) {
      where.OR = [
        { description: { contains: filters.q, mode: 'insensitive' } },
      ];
    }
    return where;
  }

  async list(filters: TransactionFiltersDto) {
    const where = this.buildWhere(filters);
    return this.prisma.transaction.findMany({
      where,
      include: { category: true },
      orderBy: { date: 'desc' },
    });
  }

  async get(id: number) {
    const tx = await this.prisma.transaction.findUnique({ where: { id }, include: { category: true } });
    if (!tx) throw new NotFoundException('Transaction not found');
    return tx;
  }

  async create(dto: CreateTransactionDto) {
    return this.prisma.transaction.create({
      data: {
        date: new Date(dto.date),
        amount: new Prisma.Decimal(dto.amount),
        type: dto.type,
        description: dto.description,
        categoryId: dto.categoryId ?? null,
      },
      include: { category: true },
    });
  }

  async update(id: number, dto: UpdateTransactionDto) {
    try {
      return await this.prisma.transaction.update({
        where: { id },
        data: {
          date: dto.date ? new Date(dto.date) : undefined,
          amount: dto.amount !== undefined ? new Prisma.Decimal(dto.amount) : undefined,
          type: dto.type,
          description: dto.description,
          categoryId: dto.categoryId ?? undefined,
        },
        include: { category: true },
      });
    } catch (e) {
      throw new NotFoundException('Transaction not found');
    }
  }

  async delete(id: number) {
    try {
      await this.prisma.transaction.delete({ where: { id } });
      return { success: true };
    } catch (e) {
      throw new NotFoundException('Transaction not found');
    }
  }
}

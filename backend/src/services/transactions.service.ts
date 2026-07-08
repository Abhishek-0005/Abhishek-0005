import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, TransactionType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto, UpdateTransactionDto } from '../dto/transaction.dto';

interface ListFilters {
  from?: string;
  to?: string;
  type?: string;
  categoryId?: string;
  q?: string;
}

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async list(filters: ListFilters) {
    const where: Prisma.TransactionWhereInput = {};
    if (filters.from || filters.to) {
      where.date = {};
      if (filters.from) (where.date as any).gte = new Date(filters.from);
      if (filters.to) (where.date as any).lte = new Date(filters.to);
    }
    if (filters.type && (filters.type === 'INCOME' || filters.type === 'EXPENSE')) {
      where.type = filters.type as TransactionType;
    }
    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }
    if (filters.q) {
      where.OR = [
        { description: { contains: filters.q, mode: 'insensitive' } },
        { category: { name: { contains: filters.q, mode: 'insensitive' } } as any },
      ];
    }

    return this.prisma.transaction.findMany({
      where,
      orderBy: { date: 'desc' },
      include: { category: true },
    });
  }

  async get(id: string) {
    const t = await this.prisma.transaction.findUnique({ where: { id }, include: { category: true } });
    if (!t) throw new NotFoundException('Transaction not found');
    return t;
  }

  async create(dto: CreateTransactionDto) {
    try {
      return await this.prisma.transaction.create({
        data: {
          amount: new Prisma.Decimal(dto.amount),
          type: dto.type,
          date: new Date(dto.date),
          description: dto.description,
          categoryId: dto.categoryId ?? null,
        },
      });
    } catch (e) {
      throw e;
    }
  }

  async update(id: string, dto: UpdateTransactionDto) {
    try {
      return await this.prisma.transaction.update({
        where: { id },
        data: {
          amount: dto.amount !== undefined ? new Prisma.Decimal(dto.amount) : undefined,
          type: dto.type,
          date: dto.date ? new Date(dto.date) : undefined,
          description: dto.description,
          categoryId: dto.categoryId !== undefined ? dto.categoryId : undefined,
        },
      });
    } catch (e: any) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
        throw new NotFoundException('Transaction not found');
      }
      throw e;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.transaction.delete({ where: { id } });
    } catch (e: any) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
        throw new NotFoundException('Transaction not found');
      }
      throw e;
    }
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Prisma, TransactionType } from '@prisma/client';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async list(filters: {
    startDate?: string;
    endDate?: string;
    categoryId?: number;
    type?: TransactionType;
  }) {
    const where: Prisma.TransactionWhereInput = {};

    if (filters.startDate || filters.endDate) {
      where.date = {};
      if (filters.startDate) (where.date as any).gte = new Date(filters.startDate);
      if (filters.endDate) (where.date as any).lte = new Date(filters.endDate);
    }
    if (filters.categoryId) where.categoryId = filters.categoryId;
    if (filters.type) where.type = filters.type;

    return this.prisma.transaction.findMany({
      where,
      orderBy: { date: 'desc' },
      include: { category: true },
    });
  }

  get(id: number) {
    return this.prisma.transaction.findUnique({ where: { id }, include: { category: true } });
  }

  async create(dto: CreateTransactionDto) {
    const data: Prisma.TransactionCreateInput = {
      amount: new Prisma.Decimal(dto.amount),
      type: dto.type,
      date: new Date(dto.date),
      note: dto.note,
      category: { connect: { id: dto.categoryId } },
    };
    return this.prisma.transaction.create({ data, include: { category: true } });
  }

  async update(id: number, dto: UpdateTransactionDto) {
    try {
      const data: Prisma.TransactionUpdateInput = {};
      if (dto.amount !== undefined) data.amount = new Prisma.Decimal(dto.amount);
      if (dto.type !== undefined) data.type = dto.type;
      if (dto.date !== undefined) data.date = new Date(dto.date);
      if (dto.note !== undefined) data.note = dto.note;
      if (dto.categoryId !== undefined) data.category = { connect: { id: dto.categoryId } };

      return await this.prisma.transaction.update({
        where: { id },
        data,
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

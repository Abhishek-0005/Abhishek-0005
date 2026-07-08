import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  list() {
    return this.prisma.category.findMany({ orderBy: { name: 'asc' } });
  }

  async create(dto: CreateCategoryDto) {
    return this.prisma.category.create({ data: dto });
  }

  async update(id: number, dto: UpdateCategoryDto) {
    try {
      return await this.prisma.category.update({ where: { id }, data: dto });
    } catch (e) {
      throw new NotFoundException('Category not found');
    }
  }

  async delete(id: number) {
    try {
      await this.prisma.category.delete({ where: { id } });
      return { success: true };
    } catch (e) {
      throw new NotFoundException('Category not found');
    }
  }
}

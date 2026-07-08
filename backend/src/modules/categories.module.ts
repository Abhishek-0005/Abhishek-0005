import { Module } from '@nestjs/common';
import { CategoriesService } from '../services/categories.service';
import { CategoriesController } from '../routes/categories.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, PrismaService],
})
export class CategoriesModule {}

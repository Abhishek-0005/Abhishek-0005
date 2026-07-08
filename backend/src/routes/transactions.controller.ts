import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { TransactionsService } from '../services/transactions.service';
import { CreateTransactionDto, UpdateTransactionDto } from '../dto/transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly service: TransactionsService) {}

  @Get()
  list(
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('type') type?: string,
    @Query('categoryId') categoryId?: string,
    @Query('q') q?: string,
  ) {
    return this.service.list({ from, to, type, categoryId, q });
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.service.get(id);
  }

  @Post()
  create(@Body() dto: CreateTransactionDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTransactionDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}

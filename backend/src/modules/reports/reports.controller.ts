import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private service: ReportsService) {}

  @Get('monthly')
  monthly(@Query('from') from: string, @Query('to') to: string) {
    return this.service.monthly(from, to);
  }

  @Get('category-breakdown')
  category(@Query('from') from: string, @Query('to') to: string) {
    return this.service.categoryBreakdown(from, to);
  }
}

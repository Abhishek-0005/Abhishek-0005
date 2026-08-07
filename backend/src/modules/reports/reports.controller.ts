import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private service: ReportsService) {}

  @Get('monthly')
  monthly(@Query('from') from: string, @Query('to') to: string) {
    // Expect from/to as YYYY-MM
    return this.service.monthly(from, to);
  }

  @Get('category-breakdown')
  category(@Query('from') from: string, @Query('to') to: string) {
    // Expect from/to as YYYY-MM-DD
    return this.service.categoryBreakdown(from, to);
  }
}

import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from '../services/reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly service: ReportsService) {}

  @Get('monthly')
  monthly(@Query('from') from: string, @Query('to') to: string) {
    return this.service.monthly(from, to);
  }

  @Get('category-breakdown')
  categoryBreakdown(@Query('from') from: string, @Query('to') to: string) {
    return this.service.categoryBreakdown(from, to);
  }
}

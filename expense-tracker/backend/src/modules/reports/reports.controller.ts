import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly service: ReportsService) {}

  @Get('monthly')
  monthly(@Query('year') year: string) {
    const y = parseInt(year, 10) || new Date().getUTCFullYear();
    return this.service.monthly(y);
  }

  @Get('summary')
  summary(@Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
    return this.service.summary({ startDate, endDate });
  }
}

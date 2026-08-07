import { ReportsService } from './reports.service';

describe('ReportsService', () => {
  it('is defined', () => {
    expect(new ReportsService({} as any)).toBeTruthy();
  });
});

import { ReportsService } from '../modules/reports/reports.service';

describe('ReportsService', () => {
  it('aggregates monthly data correctly for empty set', async () => {
    const service = new ReportsService({} as any);
    // mock prisma
    (service as any).prisma = { transaction: { findMany: jest.fn().mockResolvedValue([]) } };

    const res = await service.monthly(2024);
    expect(res).toHaveLength(12);
    expect(res[0]).toMatchObject({ month: 1, income: 0, expense: 0, net: 0 });
  });
});

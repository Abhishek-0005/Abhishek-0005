import { TransactionsService } from '../transactions.service';

describe('TransactionsService', () => {
  it('list applies filters', async () => {
    const prisma = { transaction: { findMany: jest.fn().mockResolvedValue([]) } } as any;
    const svc = new TransactionsService(prisma);
    await svc.list({ startDate: '2024-01-01', endDate: '2024-12-31' });
    expect(prisma.transaction.findMany).toHaveBeenCalled();
  });
});

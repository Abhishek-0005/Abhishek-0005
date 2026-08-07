import { ExportController } from '../export.controller';

describe('ExportController', () => {
  it('sets CSV headers and sends content', async () => {
    const prisma = { transaction: { findMany: jest.fn().mockResolvedValue([]) } } as any;
    const ctrl = new ExportController(prisma);

    const res = {
      headers: {},
      setHeader: function (k: string, v: string) { (this.headers as any)[k] = v; },
      send: jest.fn(),
    } as any;

    await ctrl.exportCsv(res);
    expect(res.headers['Content-Disposition']).toContain('transactions.csv');
    expect(res.send).toHaveBeenCalledWith('id,date,type,amount,category,note\n');
  });
});

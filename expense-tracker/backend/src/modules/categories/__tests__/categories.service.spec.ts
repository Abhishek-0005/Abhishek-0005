import { CategoriesService } from '../categories.service';

describe('CategoriesService', () => {
  it('list returns array', async () => {
    const prisma = { category: { findMany: jest.fn().mockResolvedValue([]) } } as any;
    const svc = new CategoriesService(prisma);
    const res = await svc.list();
    expect(Array.isArray(res)).toBe(true);
  });
});

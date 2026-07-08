import { PrismaClient, TransactionType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed default categories if none exist
  const count = await prisma.category.count();
  if (count === 0) {
    await prisma.category.createMany({
      data: [
        { name: 'Food', description: 'Groceries, dining out' },
        { name: 'Transport', description: 'Public transport, fuel, taxi' },
        { name: 'Utilities', description: 'Electricity, water, internet' },
        { name: 'Entertainment', description: 'Movies, subscriptions' },
        { name: 'Salary', description: 'Monthly income' }
      ],
      skipDuplicates: true,
    });
  }

  // Seed a few transactions for demo
  const food = await prisma.category.findFirst({ where: { name: 'Food' } });
  const salary = await prisma.category.findFirst({ where: { name: 'Salary' } });

  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 15);

  await prisma.transaction.createMany({
    data: [
      {
        date: lastMonth,
        amount: 2500.0,
        type: TransactionType.INCOME,
        description: 'Monthly salary',
        categoryId: salary?.id,
      },
      {
        date: new Date(),
        amount: 45.5,
        type: TransactionType.EXPENSE,
        description: 'Groceries',
        categoryId: food?.id,
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

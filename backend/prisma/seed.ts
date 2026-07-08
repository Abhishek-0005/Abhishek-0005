import { PrismaClient, TransactionType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const defaultCategories = [
    { name: 'Salary', type: TransactionType.INCOME, color: '#22c55e' },
    { name: 'Freelance', type: TransactionType.INCOME, color: '#16a34a' },
    { name: 'Food', type: TransactionType.EXPENSE, color: '#ef4444' },
    { name: 'Rent', type: TransactionType.EXPENSE, color: '#f97316' },
    { name: 'Transport', type: TransactionType.EXPENSE, color: '#3b82f6' },
    { name: 'Utilities', type: TransactionType.EXPENSE, color: '#a855f7' },
  ];

  for (const cat of defaultCategories) {
    await prisma.category.upsert({
      where: { name_type: { name: cat.name, type: cat.type } },
      update: { color: cat.color },
      create: cat,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

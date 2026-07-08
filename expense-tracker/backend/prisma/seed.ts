import { PrismaClient, TransactionType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const defaultCategories = [
    'Salary',
    'Investments',
    'Food',
    'Rent',
    'Utilities',
    'Transportation',
    'Entertainment',
    'Health',
    'Shopping',
    'Travel',
    'Miscellaneous',
  ];

  for (const name of defaultCategories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log('Seed completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

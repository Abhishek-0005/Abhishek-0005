import { PrismaClient, Role } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminEmail = 'admin@example.com'
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: 'Admin',
      email: adminEmail,
      passwordHash: await hash('Admin@123', 10),
      role: 'ADMIN' as Role,
      memberProfile: { create: { status: 'ACTIVE' } }
    }
  })

  const sampleBooks = [
    { title: 'The Pragmatic Programmer', author: 'Andrew Hunt', isbn: '978-0201616224', category: 'Programming', summary: 'Classic book', totalCopies: 3 },
    { title: 'Clean Code', author: 'Robert C. Martin', isbn: '978-0132350884', category: 'Programming', summary: 'Code craftsmanship', totalCopies: 2 },
  ]

  for (const b of sampleBooks) {
    await prisma.book.upsert({ where: { isbn: b.isbn }, update: {}, create: b })
  }

  console.log('Seed completed. Admin: admin@example.com / Admin@123')
}

main().catch((e) => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())

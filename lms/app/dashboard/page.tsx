import { prisma } from '@/lib/prisma'

export default async function Dashboard() {
  const [books, members, activeLoans, overdueLoans] = await Promise.all([
    prisma.book.count(),
    prisma.user.count(),
    prisma.loan.count({ where: { returnedAt: null } }),
    prisma.loan.count({ where: { returnedAt: null, dueAt: { lt: new Date() } } }),
  ])

  const fines = await prisma.loan.aggregate({ _sum: { fineCents: true }, where: { finePaid: false } })

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <Card title="Books" value={books} />
      <Card title="Members" value={members} />
      <Card title="Active Loans" value={activeLoans} />
      <Card title="Overdue Loans" value={overdueLoans} />
      <Card title="Outstanding Fines" value={`$${((fines._sum.fineCents||0)/100).toFixed(2)}`} />
    </div>
  )
}

function Card({ title, value }: { title: string; value: number | string }) {
  return (
    <div className="rounded border p-4 bg-white">
      <div className="text-sm text-gray-600">{title}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  )
}

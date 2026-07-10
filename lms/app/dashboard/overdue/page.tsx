import { prisma } from '@/lib/prisma'

export default async function OverduePage() {
  const now = new Date()
  const loans = await prisma.loan.findMany({ where: { returnedAt: null, dueAt: { lt: now } }, include: { book: true, member: true } })
  const total = loans.reduce((acc, l) => acc + l.fineCents, 0)
  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Overdue</h2>
      <div>Total outstanding fines: ${(total/100).toFixed(2)}</div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">Book</th><th>Member</th><th>Due</th><th>Fine</th>
          </tr>
        </thead>
        <tbody>
          {loans.map(l => (
            <tr key={l.id} className="border-b last:border-0">
              <td className="py-2">{l.book.title}</td>
              <td>{l.member.email}</td>
              <td>{new Date(l.dueAt).toLocaleDateString()}</td>
              <td>${(l.fineCents/100).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

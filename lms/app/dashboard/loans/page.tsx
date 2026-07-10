import { prisma } from '@/lib/prisma'

export default async function LoansAdminPage() {
  const loans = await prisma.loan.findMany({ orderBy: { borrowedAt: 'desc' }, include: { book: true, member: true } })
  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Loans</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">Book</th><th>Member</th><th>Borrowed</th><th>Due</th><th>Returned</th><th>Renewals</th><th>Fine</th>
          </tr>
        </thead>
        <tbody>
          {loans.map(l => (
            <tr key={l.id} className="border-b last:border-0">
              <td className="py-2">{l.book.title}</td>
              <td>{l.member.email}</td>
              <td>{new Date(l.borrowedAt).toLocaleDateString()}</td>
              <td>{new Date(l.dueAt).toLocaleDateString()}</td>
              <td>{l.returnedAt ? new Date(l.returnedAt).toLocaleDateString() : '-'}</td>
              <td>{l.renewals}</td>
              <td>${(l.fineCents/100).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

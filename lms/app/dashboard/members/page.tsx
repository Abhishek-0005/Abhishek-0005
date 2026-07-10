import { prisma } from '@/lib/prisma'

export default async function MembersAdminPage() {
  const members = await prisma.user.findMany({ orderBy: { createdAt: 'desc' }, include: { memberProfile: true } })
  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Members</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">Name</th><th>Email</th><th>Role</th><th>Status</th>
          </tr>
        </thead>
        <tbody>
          {members.map(m => (
            <tr key={m.id} className="border-b last:border-0">
              <td className="py-2">{m.name}</td>
              <td>{m.email}</td>
              <td>{m.role}</td>
              <td>{m.memberProfile?.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

import Link from 'next/link'

export default function AdminDashboard() {
  const sections = [
    { href: '/dashboard', label: 'Overview' },
    { href: '/dashboard/books', label: 'Books' },
    { href: '/dashboard/members', label: 'Members' },
    { href: '/dashboard/loans', label: 'Loans' },
    { href: '/dashboard/overdue', label: 'Overdue' },
    { href: '/dashboard/settings', label: 'Settings' },
  ]
  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Admin</h2>
      <ul className="flex gap-3 flex-wrap">
        {sections.map(s => (
          <li key={s.href}><Link className="underline text-blue-600" href={s.href}>{s.label}</Link></li>
        ))}
      </ul>
    </div>
  )
}

import { cookies } from 'next/headers'

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/api/users/me`, {
    headers: token ? { Cookie: `token=${token}` } : undefined,
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error('Failed to load profile')
  }

  const me = await res.json()

  return (
    <div className="card">
      <h1 className="text-xl font-semibold mb-4">Dashboard</h1>
      <p className="mb-2">Welcome, <span className="font-medium">{me?.name || me?.email || 'User'}</span></p>
      <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">{JSON.stringify(me, null, 2)}</pre>
      <form action="/api/auth/logout" method="post" className="mt-4">
        <button className="button" type="submit">Logout</button>
      </form>
    </div>
  )
}

import { fetchMe } from '@/lib/auth'
import { Button } from '@/components/Button'

async function logout() {
  'use server'
  await fetch('/api/auth/logout', { method: 'POST' })
}

export default async function DashboardPage() {
  const me = await fetchMe()

  return (
    <div className="mx-auto max-w-2xl p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      {me ? (
        <div className="space-y-2">
          <p>
            Logged in as: <span className="font-mono">{me.email || me.username || me.name}</span>
          </p>
          <pre className="p-4 bg-gray-100 rounded text-sm overflow-auto">
{JSON.stringify(me, null, 2)}
          </pre>
          <form action={logout}>
            <Button type="submit">Logout</Button>
          </form>
        </div>
      ) : (
        <p>Not authenticated.</p>
      )}
    </div>
  )
}

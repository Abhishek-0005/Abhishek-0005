import { getTokenFromCookies } from '@/lib/auth'
import { API_BASE_URL } from '@/lib/api'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const token = getTokenFromCookies()
  let me: any = null
  let error: string | null = null
  try {
    const res = await fetch(`${API_BASE_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store'
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      throw new Error((data as any)?.message || 'Failed to load user info')
    }
    me = data
  } catch (e: any) {
    error = e.message
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      {error ? (
        <div className="toast toast-error" role="alert">{error}</div>
      ) : (
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-600">You are logged in as</p>
          <div className="mt-1">
            <pre className="whitespace-pre-wrap break-words text-sm bg-gray-50 p-3 rounded-md border">{JSON.stringify(me, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  )
}

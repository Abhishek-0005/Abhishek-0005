import { cookies } from 'next/headers'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))

  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    return new Response(JSON.stringify({ message: data?.message || 'Login failed' }), { status: res.status })
  }

  const token = data?.token
  if (token) {
    const secure = process.env.NODE_ENV === 'production'
    cookies().set('token', token, {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      path: '/',
      // Optionally set maxAge based on backend provided exp if present
    })
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 })
}

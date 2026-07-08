import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { API_BASE_URL } from '@/lib/env'

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    return NextResponse.json(data || { message: 'Login failed' }, { status: res.status })
  }

  const token = data?.token || data?.accessToken || data?.access_token
  if (token) {
    const cookieStore = cookies()
    cookieStore.set('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
  }

  return NextResponse.json(data)
}

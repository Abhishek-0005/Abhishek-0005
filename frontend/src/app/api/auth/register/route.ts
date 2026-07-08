import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { API_BASE_URL } from '@/lib/api'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      return NextResponse.json(data || { message: 'Registration failed' }, { status: res.status || 400 })
    }

    const token = (data && (data.token || data.accessToken)) as string | undefined
    if (!token) {
      return NextResponse.json({ message: 'Token missing in response' }, { status: 500 })
    }

    const cookieStore = cookies()
    cookieStore.set('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || 'Unexpected error' }, { status: 500 })
  }
}

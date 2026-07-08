import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { API_BASE_URL } from '@/lib/api'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    const res = await fetch(`${API_BASE_URL}/users/me`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(token ? { Cookie: `token=${token}` } : {}),
      },
      cache: 'no-store',
    })

    const data = await res.json().catch(() => ({}))

    return NextResponse.json(data, { status: res.status })
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || 'Unexpected error' }, { status: 500 })
  }
}

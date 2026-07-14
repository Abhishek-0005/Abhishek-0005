import { NextRequest, NextResponse } from 'next/server'
import { API_BASE_URL } from '@/lib/api'
import { cookies } from 'next/headers'

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
  const url = `${API_BASE_URL}/users/${params.path.join('/')}`
  const token = cookies().get('token')?.value
  const res = await fetch(url, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(token ? { Cookie: `token=${token}` } : {}),
    },
    cache: 'no-store',
  })
  const data = await res.json().catch(() => ({}))
  return NextResponse.json(data, { status: res.status })
}

import { NextRequest, NextResponse } from 'next/server'
import { API_BASE_URL } from '@/lib/api'

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
  const url = `${API_BASE_URL}/auth/${params.path.join('/')}`
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  })
  const data = await res.json().catch(() => ({}))
  return NextResponse.json(data, { status: res.status })
}

export async function POST(req: NextRequest, { params }: { params: { path: string[] } }) {
  const url = `${API_BASE_URL}/auth/${params.path.join('/')}`
  const body = await req.json().catch(() => ({}))
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  return NextResponse.json(data, { status: res.status })
}

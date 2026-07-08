import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  const cookieStore = cookies()
  cookieStore.set('token', '', { httpOnly: true, path: '/', maxAge: 0 })
  return NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_BASE_PATH || 'http://localhost:3001'))
}

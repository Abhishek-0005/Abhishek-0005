import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  const cookieStore = cookies()
  cookieStore.set('token', '', { httpOnly: true, path: '/', maxAge: 0 })
  return NextResponse.redirect(new URL('/login', req.url))
}

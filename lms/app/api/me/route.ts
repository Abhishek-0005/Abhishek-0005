import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session?.user?.email) return NextResponse.json({ user: null })
  const user = await prisma.user.findUnique({ where: { email: session.user.email }, include: { memberProfile: true } })
  return NextResponse.json({ user })
}

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const json = await req.json()
  const user = await prisma.user.update({ where: { id: session.user.id }, data: json })
  return NextResponse.json({ user })
}

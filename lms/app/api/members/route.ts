import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { hash } from 'bcryptjs'
import { auth } from '@/lib/auth'

const createSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['ADMIN', 'LIBRARIAN', 'MEMBER']).default('MEMBER'),
})

export async function GET() {
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json({ users })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  const role = (session?.user as any)?.role
  if (!role) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!['ADMIN', 'LIBRARIAN'].includes(String(role))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const json = await req.json()
  const parsed = createSchema.safeParse(json)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  const { name, email, password, role: r } = parsed.data
  try {
    const passwordHash = await hash(password, 10)
    const user = await prisma.user.create({ data: { name, email, passwordHash, role: r, memberProfile: { create: { status: 'ACTIVE' } } } })
    return NextResponse.json({ user }, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}

export async function PATCH(req: NextRequest) {
  const session = await auth()
  const role = (session?.user as any)?.role
  if (!role) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!['ADMIN', 'LIBRARIAN'].includes(String(role))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const json = await req.json()
  const { id, ...data } = json
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  try {
    const user = await prisma.user.update({ where: { id }, data })
    return NextResponse.json({ user })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}

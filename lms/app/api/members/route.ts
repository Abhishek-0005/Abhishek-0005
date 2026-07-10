import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { hash } from 'bcryptjs'

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
  const json = await req.json()
  const parsed = createSchema.safeParse(json)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  const { name, email, password, role } = parsed.data
  try {
    const passwordHash = await hash(password, 10)
    const user = await prisma.user.create({ data: { name, email, passwordHash, role, memberProfile: { create: { status: 'ACTIVE' } } } })
    return NextResponse.json({ user }, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}

export async function PATCH(req: NextRequest) {
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

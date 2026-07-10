import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { hash } from 'bcryptjs'

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
})

export async function POST(req: NextRequest) {
  const json = await req.json()
  const parsed = schema.safeParse(json)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  const { name, email, password } = parsed.data
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return NextResponse.json({ error: 'Email already in use' }, { status: 409 })
  const passwordHash = await hash(password, 10)
  const user = await prisma.user.create({ data: { name, email, passwordHash, role: 'MEMBER', memberProfile: { create: { status: 'ACTIVE' } } } })
  return NextResponse.json({ user }, { status: 201 })
}

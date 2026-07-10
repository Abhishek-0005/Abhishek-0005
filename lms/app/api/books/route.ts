import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createBookSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  isbn: z.string().min(3),
  category: z.string().min(1),
  summary: z.string().default(''),
  totalCopies: z.number().int().positive(),
})

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q') || undefined
  const author = searchParams.get('author') || undefined
  const category = searchParams.get('category') || undefined

  const where: any = {}
  if (q) where.title = { contains: q, mode: 'insensitive' }
  if (author) where.author = { contains: author, mode: 'insensitive' }
  if (category) where.category = { equals: category }

  const books = await prisma.book.findMany({ where, orderBy: { createdAt: 'desc' } })
  return NextResponse.json({ books })
}

export async function POST(req: NextRequest) {
  const json = await req.json()
  const parsed = createBookSchema.safeParse(json)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  try {
    const book = await prisma.book.create({ data: parsed.data })
    return NextResponse.json({ book }, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}

export async function PATCH(req: NextRequest) {
  const json = await req.json()
  const { id, ...rest } = json
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  try {
    const book = await prisma.book.update({ where: { id }, data: rest })
    return NextResponse.json({ book })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}

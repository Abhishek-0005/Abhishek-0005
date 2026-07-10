import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { addDays, isBefore } from '@/lib/time'
import { z } from 'zod'
import { auth } from '@/lib/auth'

const borrowSchema = z.object({
  bookId: z.string().min(1),
  memberId: z.string().min(1),
})

const updateSchema = z.object({
  id: z.string().min(1),
  action: z.enum(['return', 'renew'])
})

const FINE_PER_DAY_CENTS = 1000

export async function POST(req: NextRequest) {
  const session = await auth()
  const role = (session?.user as any)?.role
  const uid = (session?.user as any)?.id
  if (!role) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const json = await req.json()
  const parsed = borrowSchema.safeParse(json)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { bookId, memberId } = parsed.data
  if (!['ADMIN', 'LIBRARIAN'].includes(String(role)) && uid !== memberId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const book = await prisma.book.findUnique({ where: { id: bookId } })
  if (!book) return NextResponse.json({ error: 'Book not found' }, { status: 404 })

  const activeLoans = await prisma.loan.count({ where: { bookId, returnedAt: null } })
  const available = Math.max(0, book.totalCopies - activeLoans)
  if (available <= 0) return NextResponse.json({ error: 'Not available' }, { status: 400 })

  const loan = await prisma.loan.create({
    data: {
      bookId,
      memberId,
      borrowedAt: new Date(),
      dueAt: addDays(new Date(), 14),
      renewals: 0,
      fineCents: 0,
      finePaid: false,
    }
  })
  return NextResponse.json({ loan }, { status: 201 })
}

export async function PATCH(req: NextRequest) {
  const session = await auth()
  const role = (session?.user as any)?.role
  const uid = (session?.user as any)?.id
  if (!role) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const json = await req.json()
  const parsed = updateSchema.safeParse(json)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { id, action } = parsed.data
  const loan = await prisma.loan.findUnique({ where: { id } })
  if (!loan) return NextResponse.json({ error: 'Loan not found' }, { status: 404 })

  if (!['ADMIN', 'LIBRARIAN'].includes(String(role)) && uid !== loan.memberId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (action === 'renew') {
    if (loan.returnedAt) return NextResponse.json({ error: 'Already returned' }, { status: 400 })
    if (loan.renewals >= 2) return NextResponse.json({ error: 'Max renewals reached' }, { status: 400 })
    const updated = await prisma.loan.update({ where: { id }, data: { renewals: { increment: 1 }, dueAt: addDays(loan.dueAt, 14) } })
    return NextResponse.json({ loan: updated })
  }

  if (action === 'return') {
    if (loan.returnedAt) return NextResponse.json({ error: 'Already returned' }, { status: 400 })
    let fine = loan.fineCents
    const now = new Date()
    if (isBefore(loan.dueAt, now)) {
      const days = Math.ceil((now.getTime() - loan.dueAt.getTime()) / (1000 * 60 * 60 * 24))
      fine += days * FINE_PER_DAY_CENTS
    }
    const updated = await prisma.loan.update({ where: { id }, data: { returnedAt: now, fineCents: fine } })
    return NextResponse.json({ loan: updated })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}

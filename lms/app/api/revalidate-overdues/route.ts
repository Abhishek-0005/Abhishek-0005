import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const FINE_PER_DAY_CENTS = 1000

export async function POST() {
  const now = new Date()
  const overdues = await prisma.loan.findMany({ where: { returnedAt: null, dueAt: { lt: now } } })
  for (const loan of overdues) {
    const days = Math.ceil((now.getTime() - loan.dueAt.getTime()) / (1000 * 60 * 60 * 24))
    const fine = days * FINE_PER_DAY_CENTS
    await prisma.loan.update({ where: { id: loan.id }, data: { fineCents: fine } })
  }
  return NextResponse.json({ updated: overdues.length })
}

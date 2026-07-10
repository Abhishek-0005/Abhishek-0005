import { describe, it, expect } from 'vitest'
import { addDays } from '@/lib/time'

describe('fine calculation basics', () => {
  it('calculates overdue days', () => {
    const start = new Date('2024-01-01T00:00:00Z')
    const due = addDays(start, 14)
    const returned = addDays(due, 3)
    const days = Math.ceil((returned.getTime() - due.getTime()) / (1000*60*60*24))
    expect(days).toBe(3)
  })
})

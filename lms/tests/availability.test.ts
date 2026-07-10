import { describe, it, expect } from 'vitest'

function available(total: number, activeLoans: number) {
  return Math.max(0, total - activeLoans)
}

describe('availability', () => {
  it('respects lower bound 0', () => {
    expect(available(1,2)).toBe(0)
  })

  it('simple difference', () => {
    expect(available(5,2)).toBe(3)
  })
})

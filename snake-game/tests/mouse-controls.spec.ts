import { describe, it, expect } from 'vitest'
import { computeEffectiveInterval } from '../src/util/game'

describe('Mouse controls interval', () => {
  it('speeds up on left hold', () => {
    expect(computeEffectiveInterval(140, 'fast')).toBeLessThan(140)
  })
  it('brakes on right hold', () => {
    expect(computeEffectiveInterval(140, 'slow')).toBeGreaterThan(140)
  })
  it('normal when released', () => {
    expect(computeEffectiveInterval(140, 'normal')).toBe(140)
  })
})

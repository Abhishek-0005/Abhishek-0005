import { describe, it, expect } from 'vitest'
import { DIRECTIONS, nextSafeDirectionTowardTarget, chooseNearestFood, isReverse } from '../src/utils/game.js'

describe('AI utilities', () => {
  it('chooseNearestFood picks the closest by manhattan distance', () => {
    const head = { x: 5, y: 5 }
    const foods = [{ x: 9, y: 5 }, { x: 4, y: 3 }, { x: 6, y: 6 }]
    const f = chooseNearestFood(head, foods)
    expect(f).toEqual({ x: 6, y: 6 })
  })

  it('isReverse blocks 180-degree turns', () => {
    expect(isReverse(DIRECTIONS.RIGHT, DIRECTIONS.LEFT)).toBe(true)
    expect(isReverse(DIRECTIONS.UP, DIRECTIONS.DOWN)).toBe(true)
    expect(isReverse(DIRECTIONS.LEFT, DIRECTIONS.UP)).toBe(false)
  })

  it('nextSafeDirectionTowardTarget prefers safe primary direction', () => {
    const head = { x: 2, y: 2 }
    const target = { x: 5, y: 2 }
    const current = DIRECTIONS.UP
    const cols = 10, rows = 10
    const occupiedSet = new Set(['3,2']) // block the primary step to the right of head
    const nd = nextSafeDirectionTowardTarget(head, current, target, { cols, rows, occupiedSet, ownTail: { x: 2, y: 3 }, willGrow: false })
    // Right would be primary but is blocked, so should choose a safe alternative that is not reverse
    expect(nd).not.toEqual(DIRECTIONS.RIGHT)
    expect(nd).not.toEqual(DIRECTIONS.DOWN) // reverse of current
  })

  it('nextSafeDirectionTowardTarget allows stepping into own tail when not growing', () => {
    const head = { x: 2, y: 2 }
    const target = { x: 2, y: 5 }
    const current = DIRECTIONS.DOWN
    const cols = 6, rows = 6
    const occupiedSet = new Set(['2,3']) // own tail here
    const nd = nextSafeDirectionTowardTarget(head, current, target, { cols, rows, occupiedSet, ownTail: { x: 2, y: 3 }, willGrow: false })
    expect(nd).toEqual(DIRECTIONS.DOWN)
  })
})

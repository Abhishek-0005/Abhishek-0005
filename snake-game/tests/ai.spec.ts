import { describe, it, expect } from 'vitest'
import { GameState, initialGameState, getNextDirectionAI } from '../src/util/game'

function makeState(): GameState {
  const s = initialGameState({ rows: 6, cols: 6, aiEnabled: true })
  // place player somewhere safe
  s.player.body = [{ r: 3, c: 3 }]
  s.player.dir = 'left'
  // place ai near a wall with food to the right but wall ahead to test avoidance
  s.ai.body = [{ r: 0, c: 2 }]
  s.ai.dir = 'up'
  s.food = { r: 0, c: 4 }
  return s
}

describe('AI', () => {
  it('chooses non-colliding move when one exists', () => {
    const s = makeState()
    // moving up would collide with wall; right is towards food and safe
    const dir = getNextDirectionAI(s)
    expect(dir).not.toBe('up')
    expect(['right','left','down'].includes(dir)).toBe(true)
  })
})

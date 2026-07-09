import { describe, it, expect } from 'vitest'
import { initialGameState, stepGame } from '../src/util/game'

describe('Player vs AI collision', () => {
  it('leads to game over for player', () => {
    const s = initialGameState({ rows: 5, cols: 5, aiEnabled: true })
    // Put player and AI facing each other
    s.player.body = [{ r: 2, c: 2 }]
    s.player.dir = 'right'
    s.ai.body = [{ r: 2, c: 3 }]
    s.ai.dir = 'left'
    s.food = { r: 0, c: 0 }

    const s2 = stepGame(s)
    expect(s2.gameOver).toBe(true)
  })
})

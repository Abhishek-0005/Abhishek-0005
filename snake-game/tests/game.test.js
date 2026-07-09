import { describe, it, expect, beforeEach, vi } from 'vitest'
import { checkCollision, spawnFood, moveSnake, DIRECTIONS } from '../src/utils/game.js'

describe('game utils', () => {
  beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0.12345)
  })

  it('detects wall collision', () => {
    const snake = [{ x: -1, y: 0 }, { x: 0, y: 0 }]
    expect(checkCollision(snake, 5)).toBe(true)
  })

  it('detects self collision', () => {
    const snake = [{ x: 1, y: 1 }, { x: 1, y: 2 }, { x: 0, y: 1 }, { x: 1, y: 1 }]
    expect(checkCollision(snake, 5)).toBe(true)
  })

  it('no collision when inside bounds and not overlapping', () => {
    const snake = [{ x: 2, y: 2 }, { x: 1, y: 2 }]
    expect(checkCollision(snake, 5)).toBe(false)
  })

  it('spawnFood does not place on the snake body', () => {
    const snake = [{ x: 0, y: 0 }, { x: 1, y: 0 }]
    const food = spawnFood(5, snake)
    expect(food.x).not.toBe(0)
    expect(food.y).not.toBe(0)
  })

  it('moveSnake grows when eating food', () => {
    const snake = [{ x: 1, y: 1 }, { x: 0, y: 1 }]
    const dir = DIRECTIONS.RIGHT
    const food = { x: 2, y: 1 }
    const { newSnake, grew } = moveSnake(snake, dir, food, 5)
    expect(grew).toBe(true)
    expect(newSnake.length).toBe(snake.length + 1)
    expect(newSnake[0]).toEqual({ x: 2, y: 1 })
  })
})

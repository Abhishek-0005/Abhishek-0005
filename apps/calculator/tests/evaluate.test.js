import { describe, it, expect } from 'vitest'
import { evaluate } from '../src/lib/evaluate.js'

describe('evaluate', () => {
  it('adds, subtracts, multiplies, divides', () => {
    expect(evaluate('1+2')).toBe(3)
    expect(evaluate('7-5')).toBe(2)
    expect(evaluate('3*4')).toBe(12)
    expect(evaluate('8/2')).toBe(4)
  })

  it('respects precedence', () => {
    expect(evaluate('2+3*4')).toBe(14)
    expect(evaluate('2*3+4')).toBe(10)
  })

  it('handles parentheses', () => {
    expect(evaluate('2*(3+4)')).toBe(14)
    expect(evaluate('(1+2)*(3+4)')).toBe(21)
  })

  it('handles unary minus', () => {
    expect(evaluate('-5+2')).toBe(-3)
    expect(evaluate('3+-2')).toBe(1)
    expect(evaluate('3*-2')).toBe(-6)
  })

  it('handles decimals', () => {
    expect(evaluate('7/2')).toBeCloseTo(3.5)
    expect(evaluate('0.5+0.25')).toBeCloseTo(0.75)
  })

  it('complex example', () => {
    expect(evaluate('3+4*2/(1-5)')).toBe(1)
  })

  it('errors: division by zero', () => {
    expect(() => evaluate('1/0')).toThrow('Division by zero')
  })

  it('errors: invalid number', () => {
    expect(() => evaluate('1..2')).toThrow()
  })

  it('errors: mismatched parentheses', () => {
    expect(() => evaluate('(1+2')).toThrow('Mismatched parentheses')
  })
})

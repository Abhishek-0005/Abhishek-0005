import { describe, it, expect } from 'vitest'
import { vec, add, sub, mul, len, raySegment, hasLineOfSight, circleShrink } from '../src/game/utils.js'

describe('vector utils', ()=>{
  it('basic ops', ()=>{
    expect(add(vec(1,2), vec(3,4))).toEqual({x:4,y:6})
    expect(sub(vec(5,5), vec(2,3))).toEqual({x:3,y:2})
    expect(mul(vec(2,3), 2)).toEqual({x:4,y:6})
    expect(Math.round(len(vec(3,4)))).toBe(5)
  })
})

describe('ray and los', ()=>{
  it('ray hits segment', ()=>{
    const res = raySegment({x:0,y:0}, {x:1,y:0}, {x:5,y:-1}, {x:5,y:1})
    expect(res).toBeTruthy()
    expect(Math.round(res.t)).toBe(5)
  })
  it('has line of sight', ()=>{
    const rects = [{x:2,y:-1,w:1,h:2}]
    expect(hasLineOfSight({x:0,y:0}, {x:5,y:0}, rects)).toBe(false)
    expect(hasLineOfSight({x:0,y:2}, {x:5,y:2}, rects)).toBe(true)
  })
})

describe('circle shrink', ()=>{
  it('shrinks from 1 to 0 over duration', ()=>{
    expect(circleShrink(100, 0)).toBe(1)
    expect(circleShrink(100, 50)).toBeCloseTo(0.5)
    expect(circleShrink(100, 100)).toBe(0)
  })
})

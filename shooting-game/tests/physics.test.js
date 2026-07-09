import { describe, it, expect } from 'vitest'
import { integrate, resolveWorldBounds, collideCircleRect, raycastEntities } from '../src/game/physics.js'

function approx(v, t){ return Math.abs(v-t) < 1e-6 }

describe('physics', ()=>{
  it('integrates motion', ()=>{
    const {p, v} = integrate({x:0,y:0},{x:0,y:0},{x:1,y:0}, 1)
    expect(approx(p.x,1) && approx(v.x,1)).toBe(true)
  })

  it('bounds resolve reflect', ()=>{
    const {pos, vel} = resolveWorldBounds({x:-5,y:10}, {x:-2,y:0}, 5, 100)
    expect(pos.x).toBe(5)
    expect(vel.x).toBeGreaterThan(0)
  })

  it('circle vs rect', ()=>{
    const hit = collideCircleRect({x:5,y:5,radius:2}, {x:6,y:4,w:4,h:4})
    expect(hit).toBe(true)
  })

  it('raycast circles', ()=>{
    const ro = {x:0,y:0}, rd = {x:1,y:0}
    const entities = [
      {pos:{x:5,y:0}, radius:1, dead:false},
      {pos:{x:7,y:0}, radius:1, dead:false},
    ]
    const res = raycastEntities(ro, rd, entities, 10)
    expect(res.entity).toBe(entities[0])
  })
})

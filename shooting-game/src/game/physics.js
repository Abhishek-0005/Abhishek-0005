import { vec, add, sub, mul, clamp, norm, len } from './utils.js'

export function integrate(pos, vel, acc, dt){
  const v = add(vel, mul(acc, dt))
  const p = add(pos, mul(v, dt))
  return {p, v}
}

export function resolveWorldBounds(p, v, size, world){
  let pos = {...p}; let vel = {...v}
  if (pos.x < size){ pos.x = size; vel.x *= -0.3 }
  if (pos.y < size){ pos.y = size; vel.y *= -0.3 }
  if (pos.x > world - size){ pos.x = world - size; vel.x *= -0.3 }
  if (pos.y > world - size){ pos.y = world - size; vel.y *= -0.3 }
  return {pos, vel}
}

export function collideCircleRect(c, r){
  const nx = clamp(c.x, r.x, r.x + r.w)
  const ny = clamp(c.y, r.y, r.y + r.h)
  const dx = c.x - nx
  const dy = c.y - ny
  const d2 = dx*dx + dy*dy
  return d2 <= c.radius*c.radius
}

export function avoidObstacles(pos, vel, rects){
  // steer away from rects if getting too close
  let steer = vec(0,0)
  for(const r of rects){
    const nearest = {x: clamp(pos.x, r.x, r.x + r.w), y: clamp(pos.y, r.y, r.y + r.h)}
    const to = sub(pos, nearest)
    const d = len(to)
    const influence = Math.max(0, 1 - d/80)
    const away = mul(norm(to), influence * 200)
    steer = add(steer, away)
  }
  return steer
}

export function raycastEntities(ro, rd, entities, maxDist){
  // Fast raycast assuming circle hitboxes
  let best = null
  const m2 = maxDist*maxDist
  for(const e of entities){
    if (e.dead) continue
    const to = sub(e.pos, ro)
    const proj = to.x*rd.x + to.y*rd.y
    if (proj < 0) continue
    const closest = {x: ro.x + rd.x*proj, y: ro.y + rd.y*proj}
    const d2 = (e.pos.x - closest.x)**2 + (e.pos.y - closest.y)**2
    if (d2 <= (e.radius||10)**2){
      const hitDist2 = (closest.x - ro.x)**2 + (closest.y - ro.y)**2
      if (hitDist2 <= m2){
        const dist = Math.sqrt(hitDist2)
        if (!best || dist < best.dist){ best = {entity:e, dist} }
      }
    }
  }
  return best
}

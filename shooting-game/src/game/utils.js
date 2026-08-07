// Lightweight vector and geometry utilities
export const TAU = Math.PI * 2
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v))
export const lerp = (a, b, t) => a + (b - a) * t
export const randRange = (a, b) => a + Math.random() * (b - a)
export const chance = (p) => Math.random() < p

export function vec(x=0,y=0){ return {x,y} }
export function add(a,b){ return {x:a.x+b.x,y:a.y+b.y} }
export function sub(a,b){ return {x:a.x-b.x,y:a.y-b.y} }
export function mul(a,s){ return {x:a.x*s,y:a.y*s} }
export function dot(a,b){ return a.x*b.x + a.y*b.y }
export function len(a){ return Math.hypot(a.x,a.y) }
export function norm(a){ const l = len(a)||1; return {x:a.x/l,y:a.y/l} }
export function dist(a,b){ return len(sub(a,b)) }
export function angle(a){ return Math.atan2(a.y,a.x) }
export function fromAngle(th, m=1){ return {x:Math.cos(th)*m, y:Math.sin(th)*m} }

// Ray vs segment intersection. Returns t along ray and u along segment if hit.
export function raySegment(ro, rd, a, b){
  const v1 = sub(ro, a)
  const v2 = sub(b, a)
  const v3 = {x:-rd.y, y:rd.x}
  const dot23 = dot(v2, v3)
  if (Math.abs(dot23) < 1e-8) return null
  const t = dot(v2, v1) / dot23
  const u = dot(v1, v3) / dot23
  if (t >= 0 && u >= 0 && u <= 1) return {t, u}
  return null
}

// Line of sight: check ray against a list of axis-aligned rect obstacles
export function hasLineOfSight(from, to, rects){
  const rd = norm(sub(to, from))
  for(const r of rects){
    const corners = [
      {x:r.x, y:r.y}, {x:r.x+r.w, y:r.y},
      {x:r.x+r.w, y:r.y+r.h}, {x:r.x, y:r.y+r.h}
    ]
    const edges = [
      [corners[0], corners[1]], [corners[1], corners[2]],
      [corners[2], corners[3]], [corners[3], corners[0]]
    ]
    for(const [a,b] of edges){
      const hit = raySegment(from, rd, a, b)
      if (hit){
        const hitPos = add(from, mul(rd, hit.t))
        if (dist(from, hitPos) < dist(from, to)) return false
      }
    }
  }
  return true
}

export function circleShrink(totalDuration, elapsed){
  const t = clamp(elapsed/totalDuration, 0, 1)
  return 1 - t // scale from 1 to 0 over duration
}

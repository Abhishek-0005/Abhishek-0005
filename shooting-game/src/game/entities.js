import { vec, add, sub, mul, norm, len, clamp, TAU, fromAngle, angle, randRange, chance } from './utils.js'
import { avoidObstacles, raycastEntities } from './physics.js'

export function createPlayer(x, y){
  return {
    type: 'player',
    pos: vec(x,y), vel: vec(0,0), acc: vec(0,0),
    radius: 10,
    dir: 0,
    color: '#4ade80',
    speed: 180,
    sprint: 300,
    friction: 8,
    health: 100,
    maxHealth: 100,
    ammo: 30,
    mag: 30,
    reserve: 90,
    reloadTime: 1.2,
    reloading: 0,
    fireCd: 0,
    kills: 0,
    dashCd: 0,
    dead: false,
    ai: null,
  }
}

export function createBot(x, y, hue){
  const color = `hsl(${hue},70%,60%)`
  return {
    type: 'bot',
    pos: vec(x,y), vel: vec(0,0), acc: vec(0,0),
    radius: 10,
    dir: 0,
    color,
    speed: 160,
    friction: 8,
    health: 60,
    maxHealth: 60,
    ammo: 30,
    mag: 30,
    reserve: 120,
    reloadTime: 1.4,
    reloading: 0,
    fireCd: 0,
    target: null,
    dead: false,
    ai: {state:'wander', at:0}
  }
}

export function createLoot(type, x, y){
  return { type:'loot', lootType:type, pos:vec(x,y), radius:8, dead:false }
}

export function createWorld(size){
  // few rectangular obstacles
  const rects = [
    {x: size*0.2, y: size*0.2, w: 120, h: 40},
    {x: size*0.6, y: size*0.3, w: 60, h: 160},
    {x: size*0.3, y: size*0.65, w: 160, h: 60},
    {x: size*0.7, y: size*0.7, w: 100, h: 100},
  ]
  return { size, rects, circle: {center: vec(size/2,size/2), radius: size*0.45, shrinkTime: 180, elapsed: 0} }
}

export function updateSafeZone(world, dt){
  world.circle.elapsed += dt
  const t = Math.min(world.circle.elapsed/world.circle.shrinkTime, 1)
  world.circle.radius = world.size*0.45 * (1 - t*0.8)
}

export function spawnLootRandom(world){
  const x = randRange(40, world.size-40)
  const y = randRange(40, world.size-40)
  return Math.random()<0.5 ? createLoot('medkit', x, y) : createLoot('ammo', x, y)
}

export function shoot(bulletSource, entities, world, accuracy=1){
  if (bulletSource.reloading>0 || bulletSource.fireCd>0) return null
  if (bulletSource.ammo<=0){ return 'click' }
  bulletSource.ammo--
  bulletSource.fireCd = 0.15
  const spread = (1-accuracy) * 0.2
  const th = bulletSource.dir + randRange(-spread, spread)
  const rd = fromAngle(th, 1)
  const others = entities.filter(e => e!==bulletSource && (e.type==='bot' || e.type==='player'))
  const hit = raycastEntities(bulletSource.pos, rd, others, 600)
  if (hit){
    hit.entity.health -= 25
    // knockback
    hit.entity.vel = add(hit.entity.vel, mul(rd, 80))
    if (hit.entity.health<=0 && !hit.entity.dead){
      hit.entity.dead = true
      if (bulletSource.type==='player') bulletSource.kills++
      // drop small medkit
      entities.push(createLoot('medkit', hit.entity.pos.x, hit.entity.pos.y))
    }
    return 'hit'
  }
  return 'shot'
}

export function reload(e){
  if (e.reloading>0) return
  const need = e.mag - e.ammo
  if (need<=0 || e.reserve<=0) return
  e.reloading = e.reloadTime
}

export function finishReload(e){
  const need = e.mag - e.ammo
  const take = Math.min(need, e.reserve)
  e.ammo += take
  e.reserve -= take
  e.reloading = 0
}

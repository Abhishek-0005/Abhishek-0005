import { add, sub, norm, len, angle, fromAngle, vec, dist, clamp } from './utils.js'
import { avoidObstacles } from './physics.js'
import { shoot } from './entities.js'

export function updateBot(bot, ctx){
  const { player, entities, world, settings } = ctx
  if (bot.dead) return
  // simple state machine
  const toPlayer = sub(player.pos, bot.pos)
  const d = len(toPlayer)
  const vision = 360
  const inVision = d < 420

  // obstacle avoidance
  const steer = avoidObstacles(bot.pos, bot.vel, world.rects)

  if (!inVision){
    // wander
    if (!bot.ai.dir || Math.random()<0.01){
      bot.ai.dir = fromAngle(Math.random()*Math.PI*2)
    }
    bot.acc = add(bot.ai.dir, steer)
    bot.dir = angle(bot.ai.dir)
  } else {
    // pursue and shoot with accuracy
    const desired = add(norm(toPlayer), steer)
    bot.acc = desired
    bot.dir = angle(toPlayer)
    if (d < 380){
      const res = shoot(bot, entities, world, settings.botAccuracy)
      if (res==='hit' || res==='shot'){ /* noop */ }
    }
  }
}

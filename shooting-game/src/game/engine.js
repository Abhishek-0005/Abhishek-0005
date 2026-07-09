import { vec, add, sub, mul, norm, len, clamp, angle, fromAngle, TAU } from './utils.js'
import { integrate, resolveWorldBounds, avoidObstacles } from './physics.js'
import { createPlayer, createBot, createWorld, updateSafeZone, spawnLootRandom, shoot, reload, finishReload } from './entities.js'
import { updateBot } from './ai.js'
import { sfx } from './audio.js'

export function createGame(initialSettings){
  const settings = Object.assign({ bots: 10, botAccuracy: 0.7, audio: true }, initialSettings)
  const state = {
    world: createWorld(1400),
    entities: [],
    player: null,
    input: {keys:{}, mouse:{x:0,y:0,down:false}},
    running: false,
    paused: false,
    lastTime: 0,
    accumulator: 0,
    dt: 1/60,
    camera: vec(0,0),
    settings,
    stats: {remaining:0},
  }
  const player = createPlayer(700, 700)
  state.player = player
  state.entities.push(player)
  for(let i=0;i<settings.bots;i++){
    const a = Math.random()*TAU
    const r = 500 + Math.random()*200
    const x = 700 + Math.cos(a)*r
    const y = 700 + Math.sin(a)*r
    state.entities.push(createBot(x,y, Math.floor(Math.random()*360)))
  }
  // Seed starting loot
  for(let i=0;i<8;i++) state.entities.push(spawnLootRandom(state.world))

  function handleInput(){
    const p = state.player
    if (p.dead) return
    const k = state.input.keys
    let move = vec(0,0)
    if (k['KeyW']||k['ArrowUp']) move.y -= 1
    if (k['KeyS']||k['ArrowDown']) move.y += 1
    if (k['KeyA']||k['ArrowLeft']) move.x -= 1
    if (k['KeyD']||k['ArrowRight']) move.x += 1
    if (move.x||move.y) move = norm(move)
    const steer = avoidObstacles(p.pos, p.vel, state.world.rects)
    const speed = k['ShiftLeft']||k['ShiftRight'] ? p.sprint : p.speed
    p.acc = add(mul(move, speed), steer)

    // dash/roll with cooldown
    if ((k['Space'] || k['Spacebar']) && p.dashCd<=0){
      p.vel = add(p.vel, mul(fromAngle(p.dir), 320))
      p.dashCd = 1.0
    }
    if (k['KeyR']) reload(p)
  }

  function update(dt){
    if (state.paused) return
    const p = state.player

    // AI
    for(const e of state.entities){
      if (e.type==='bot') updateBot(e, {player:p, entities:state.entities, world:state.world, settings:state.settings})
    }

    // Physics and timers
    for(const e of state.entities){
      if (e.dead) continue
      if (e.reloading>0){ e.reloading -= dt; if (e.reloading<=0) finishReload(e) }
      if (e.fireCd>0) e.fireCd -= dt
      if (e.dashCd>0) e.dashCd -= dt

      const friction = mul(e.vel, -e.friction)
      const acc = add(e.acc||vec(0,0), friction)
      const {p:np, v:nv} = integrate(e.pos, e.vel, acc, dt)
      let {pos, vel} = resolveWorldBounds(np, nv, e.radius, state.world.size)
      e.pos = pos; e.vel = vel; e.acc = vec(0,0)
    }

    // Safe zone shrink and damage outside
    updateSafeZone(state.world, dt)
    for(const e of state.entities){
      if (e.dead) continue
      const d = len(sub(e.pos, state.world.circle.center))
      if (d > state.world.circle.radius){
        e.health -= 10*dt
        if (e.health<=0){ e.dead = true }
      }
    }

    // Loot pickup
    for(const loot of state.entities.filter(x=>x.type==='loot'&&!x.dead)){
      if (len(sub(loot.pos, p.pos)) < (p.radius + loot.radius)){
        loot.dead = true
        if (loot.lootType==='medkit') p.health = Math.min(p.maxHealth, p.health + 30)
        if (loot.lootType==='ammo') p.reserve += 30
      }
    }

    // Cull dead bots count
    state.stats.remaining = state.entities.filter(e=>e.type==='bot'&&!e.dead).length

    // Clean dead/old loot occasionally
    if (Math.random()<0.02){
      for(const e of state.entities){ if (e.type==='loot' && e.dead) e.remove=true }
      state.entities = state.entities.filter(e=>!e.remove)
      if (state.entities.filter(e=>e.type==='loot'&&!e.dead).length<6){
        state.entities.push(spawnLootRandom(state.world))
      }
    }
  }

  function render(ctx2d, w, h){
    const p = state.player
    state.camera.x = clamp(p.pos.x - w/2, 0, state.world.size - w)
    state.camera.y = clamp(p.pos.y - h/2, 0, state.world.size - h)

    ctx2d.clearRect(0,0,w,h)

    // World background
    ctx2d.fillStyle = '#0f172a'
    ctx2d.fillRect(0,0,w,h)

    // Safe zone
    ctx2d.strokeStyle = '#22c55e'
    ctx2d.lineWidth = 2
    ctx2d.beginPath()
    ctx2d.arc(state.world.circle.center.x - state.camera.x, state.world.circle.center.y - state.camera.y, state.world.circle.radius, 0, Math.PI*2)
    ctx2d.stroke()

    // Obstacles
    ctx2d.fillStyle = '#1f2937'
    for(const r of state.world.rects){
      ctx2d.fillRect(r.x - state.camera.x, r.y - state.camera.y, r.w, r.h)
    }

    // Entities
    for(const e of state.entities){
      if (e.dead) continue
      const x = e.pos.x - state.camera.x
      const y = e.pos.y - state.camera.y
      if (x<-40||y<-40||x>w+40||y>h+40) continue // cull offscreen
      if (e.type==='player' || e.type==='bot'){
        ctx2d.fillStyle = e.color
        ctx2d.beginPath(); ctx2d.arc(x,y,e.radius,0,Math.PI*2); ctx2d.fill()
        // gun direction
        ctx2d.strokeStyle = '#fff'; ctx2d.lineWidth = 2
        ctx2d.beginPath();
        ctx2d.moveTo(x,y); ctx2d.lineTo(x + Math.cos(e.dir)*18, y + Math.sin(e.dir)*18); ctx2d.stroke()
      } else if (e.type==='loot'){
        ctx2d.fillStyle = e.lootType==='medkit' ? '#ef4444' : '#60a5fa'
        ctx2d.beginPath(); ctx2d.arc(x,y,e.radius,0,Math.PI*2); ctx2d.fill()
      }
    }

    // Player HUD
    // health bar
    const hp = p.health/p.maxHealth
    ctx2d.fillStyle = '#111827'; ctx2d.fillRect(10, h-24, 200, 14)
    ctx2d.fillStyle = '#22c55e'; ctx2d.fillRect(10, h-24, 200*hp, 14)
    ctx2d.fillStyle = '#e5e7eb'; ctx2d.fillText(`Ammo ${p.ammo}/${p.reserve}${p.reloading>0? ' (reloading)': ''}`, 220, h-12)
    ctx2d.fillText(`Kills ${p.kills}  Bots ${state.stats.remaining}`, 10, 16)
  }

  function onMouseMove(x, y, canvasRect){
    const worldX = x + state.camera.x
    const worldY = y + state.camera.y
    const aim = vec(worldX - state.player.pos.x, worldY - state.player.pos.y)
    state.player.dir = angle(aim)
    state.input.mouse = {x:worldX, y:worldY}
  }

  function onMouseDown(){
    state.input.mouse.down = true
    const res = shoot(state.player, state.entities, state.world, 1)
    if (state.settings.audio){ if (res==='hit') sfx.hit(); else if (res==='shot') sfx.shot(); else sfx.click() }
  }
  function onMouseUp(){ state.input.mouse.down = false }

  function onKey(down, code){
    state.input.keys[code] = down
    if (code==='KeyP' && down) state.paused = !state.paused
    if ((code==='Enter' || code==='NumpadEnter') && down && state.player.dead) return 'restart'
  }

  function fixedUpdateLoop(time){
    if (!state.running) return
    if (document.hidden){ state.lastTime = time; requestAnimationFrame(fixedUpdateLoop); return }
    if (state.lastTime===0) state.lastTime = time
    let frame = (time - state.lastTime)/1000
    if (frame>0.25) frame = 0.25
    state.lastTime = time
    state.accumulator += frame
    while(state.accumulator >= state.dt){
      handleInput()
      update(state.dt)
      state.accumulator -= state.dt
    }
    const canvas = state.canvas
    const ctx2d = state.ctx
    const {width, height} = canvas
    render(ctx2d, width, height)
    requestAnimationFrame(fixedUpdateLoop)
  }

  function mount(canvas){
    state.canvas = canvas
    const ctx2d = canvas.getContext('2d')
    state.ctx = ctx2d
    resize()
    state.running = true
    requestAnimationFrame(fixedUpdateLoop)
  }

  function resize(){
    const dpr = Math.min(window.devicePixelRatio||1, 2)
    const rect = state.canvas.getBoundingClientRect()
    state.canvas.width = Math.floor(rect.width * dpr)
    state.canvas.height = Math.floor(rect.height * dpr)
    state.ctx.setTransform(dpr,0,0,dpr,0,0)
  }

  function blur(){ state.paused = true }
  function focus(){ state.paused = false }

  return { state, mount, resize, blur, focus, onMouseMove, onMouseDown, onMouseUp, onKey }
}

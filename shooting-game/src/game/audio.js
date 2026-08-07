// Minimal WebAudio beeps for click/shot/hit
const ctx = typeof window !== 'undefined' ? new (window.AudioContext || window.webkitAudioContext)() : null

function beep(freq=440, time=0.05, type='square', vol=0.3){
  if (!ctx) return
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  o.type = type
  o.frequency.value = freq
  g.gain.value = vol
  o.connect(g).connect(ctx.destination)
  const now = ctx.currentTime
  o.start(now)
  g.gain.exponentialRampToValueAtTime(0.001, now + time)
  o.stop(now + time)
}

export const sfx = {
  click: () => beep(600, 0.03, 'square', 0.2),
  shot: () => beep(1200, 0.05, 'square', 0.25),
  hit:  () => beep(200, 0.06, 'sawtooth', 0.25),
  pickup: () => beep(900, 0.04, 'triangle', 0.2),
  reload: () => beep(500, 0.1, 'triangle', 0.2),
}

export function resumeAudio(){
  if (ctx && ctx.state === 'suspended') ctx.resume()
}

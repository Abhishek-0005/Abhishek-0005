import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createGame } from '../src/game/engine.js'

function makeCanvas(){
  const ctx = {
    setTransform: vi.fn(),
    clearRect: vi.fn(),
    fillStyle: '#000',
    fillRect: vi.fn(),
    strokeStyle: '#fff',
    lineWidth: 1,
    beginPath: vi.fn(),
    arc: vi.fn(),
    stroke: vi.fn(),
    fill: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    fillText: vi.fn(),
  }
  const canvas = {
    width: 0,
    height: 0,
    getContext: () => ctx,
    getBoundingClientRect: () => ({width: 800, height: 600}),
  }
  return {canvas, ctx}
}

describe('engine mount/start', ()=>{
  beforeEach(()=>{ vi.useFakeTimers() })
  afterEach(()=>{ vi.useRealTimers() })

  it('mounts, starts loop, and toggles pause on blur/focus', ()=>{
    const {canvas} = makeCanvas()
    const g = createGame({bots:0, audio:false})
    expect(g.state.running).toBe(false)
    g.mount(canvas)
    expect(g.state.canvas).toBe(canvas)
    expect(g.state.ctx).toBeTruthy()
    expect(g.state.running).toBe(true)
    // advance a couple of frames via RAF fallback
    vi.advanceTimersByTime(40)
    // blur/focus toggles paused
    g.blur(); expect(g.state.paused).toBe(true)
    g.focus(); expect(g.state.paused).toBe(false)
  })
})

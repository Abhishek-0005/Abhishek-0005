import React, { useEffect, useRef, useState } from 'react'
import { createGame } from './game/engine.js'
import { resumeAudio, sfx } from './game/audio.js'

export default function App(){
  const canvasRef = useRef(null)
  const [game, setGame] = useState(null)
  const [ui, setUi] = useState({screen:'start'})
  const [settings, setSettings] = useState({ bots: 10, botAccuracy: 0.7, audio: true })

  useEffect(()=>{
    function onBlur(){ game?.blur() }
    function onFocus(){ game?.focus(); resumeAudio() }
    window.addEventListener('blur', onBlur)
    window.addEventListener('focus', onFocus)
    return ()=>{ window.removeEventListener('blur', onBlur); window.removeEventListener('focus', onFocus) }
  }, [game])

  useEffect(()=>{
    function onResize(){ game?.resize() }
    window.addEventListener('resize', onResize)
    return ()=> window.removeEventListener('resize', onResize)
  }, [game])

  useEffect(()=>{
    const c = canvasRef.current
    if (!c || !game) return
    const rect = ()=> c.getBoundingClientRect()

    const mm = (e)=> game.onMouseMove(e.clientX - rect().left, e.clientY - rect().top, rect())
    const md = ()=> { if (ui.screen==='playing'){ game.onMouseDown(); settings.audio && sfx.click() } }
    const mu = ()=> game.onMouseUp()
    const kd = (e)=>{
      const r = game.onKey(true, e.code)
      if (r==='restart') start()
      if (e.code==='KeyR') settings.audio && sfx.reload()
    }
    const ku = (e)=> game.onKey(false, e.code)

    c.addEventListener('mousemove', mm)
    c.addEventListener('mousedown', md)
    window.addEventListener('mouseup', mu)
    window.addEventListener('keydown', kd)
    window.addEventListener('keyup', ku)
    return ()=>{
      c.removeEventListener('mousemove', mm)
      c.removeEventListener('mousedown', md)
      window.removeEventListener('mouseup', mu)
      window.removeEventListener('keydown', kd)
      window.removeEventListener('keyup', ku)
    }
  }, [game, ui.screen, settings])

  function start(){
    const g = createGame(settings)
    setGame(g)
    setUi({screen:'playing'})
    // Mount immediately; allow a microtask to ensure canvasRef is set but don't defer a full frame
    Promise.resolve().then(()=> g.mount(canvasRef.current))
  }

  return (
    <div style={{position:'relative', width:'100vw', height:'100vh'}}>
      <canvas ref={canvasRef} />
      {ui.screen==='start' && (
        <div className="center">
          <div className="panel" style={{minWidth:320}}>
            <h2>Shooting Game (MVP)</h2>
            <div className="small">WASD/Arrows move, Shift sprint, Mouse aim, LMB shoot, R reload, Space dash, P pause</div>
            <div style={{marginTop:8}}>
              <label> Bots: {settings.bots}
                <input type="range" min="0" max="20" value={settings.bots} onChange={e=>setSettings(s=>({...s, bots:+e.target.value}))} />
              </label>
            </div>
            <div>
              <label> Bot Accuracy: {settings.botAccuracy.toFixed(2)}
                <input type="range" min="0" max="1" step="0.01" value={settings.botAccuracy} onChange={e=>setSettings(s=>({...s, botAccuracy:+e.target.value}))} />
              </label>
            </div>
            <div>
              <label>
                <input type="checkbox" checked={settings.audio} onChange={e=>setSettings(s=>({...s, audio:e.target.checked}))} /> Audio
              </label>
            </div>
            <div style={{display:'flex', gap:8, marginTop:8}}>
              <button onClick={()=>{ start(); sfx.click() }}>Play</button>
              <button onClick={()=>{ window.open('https://github.com/Abhishek-0005/Abhishek-0005','_blank'); sfx.click() }}>Repo</button>
            </div>
          </div>
        </div>
      )}
      {ui.screen==='playing' && (
        <div className="overlay">
          <div className="panel small">P: Pause/Resume</div>
        </div>
      )}
    </div>
  )
}

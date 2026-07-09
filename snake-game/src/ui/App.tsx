import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { computeEffectiveInterval, getNextDirectionAI, type Cell, type Direction, type GameState, initialGameState, stepGame, turnLeft, turnRight, type MouseAccel } from '../util/game'

export function App() {
  const [state, setState] = useState<GameState>(() => initialGameState())
  const [isRunning, setIsRunning] = useState(true)
  const [mouseAccel, setMouseAccel] = useState<MouseAccel>('normal')
  const downButtons = useRef<Set<number>>(new Set())

  const intervalRef = useRef<number | null>(null)

  const effectiveInterval = useMemo(() => {
    return computeEffectiveInterval(state.settings.speedMs, mouseAccel)
  }, [mouseAccel, state.settings.speedMs])

  const tick = useCallback(() => {
    setState((s) => stepGame(s))
  }, [])

  useEffect(() => {
    if (!isRunning) return
    if (intervalRef.current) window.clearInterval(intervalRef.current)
    intervalRef.current = window.setInterval(tick, effectiveInterval)
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [tick, effectiveInterval, isRunning])

  // Keyboard controls
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        setIsRunning(r => !r)
        return
      }
      if (e.key === 'ArrowLeft') setState(s => ({...s, player: {...s.player, dir: turnLeft(s.player.dir)}}))
      if (e.key === 'ArrowRight') setState(s => ({...s, player: {...s.player, dir: turnRight(s.player.dir)}}))
      if (e.key === 'r') setState(() => initialGameState({ keepHighScore: true, ...state.settings }))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [state.settings])

  const recomputeMouseAccel = () => {
    const s = downButtons.current
    if (s.has(2)) setMouseAccel('slow')
    else if (s.has(0)) setMouseAccel('fast')
    else setMouseAccel('normal')
  }

  const onMouseDown = (e: React.MouseEvent) => {
    downButtons.current.add(e.button)
    recomputeMouseAccel()
  }
  const onMouseUp = (e: React.MouseEvent) => {
    downButtons.current.delete(e.button)
    recomputeMouseAccel()
  }
  const onMouseLeave = () => {
    downButtons.current.clear()
    setMouseAccel('normal')
  }
  const onContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
  }

  const cellSize = useMemo(() => {
    const maxPx = Math.min(window.innerWidth, 520) - 40
    return Math.floor(maxPx / state.settings.cols)
  }, [state.settings.cols])

  return (
    <div className={`app theme-${state.settings.theme}`}>
      <header className="hud">
        <div className="scores">
          <span>Score: {state.score}</span>
          <span>High: {state.highScore}</span>
          {state.settings.aiEnabled && <span>AI length: {state.ai.alive ? state.ai.body.length : 0}</span>}
          <span>{isRunning ? 'Running' : 'Paused'}{state.gameOver ? ' • Game Over' : ''}</span>
        </div>
        <div className="controls">
          <label>
            AI
            <input type="checkbox" checked={state.settings.aiEnabled} onChange={e => setState(s => ({...s, settings: {...s.settings, aiEnabled: e.target.checked}}))} />
          </label>
          <label>
            Theme
            <select value={state.settings.theme} onChange={e => setState(s => ({...s, settings: {...s.settings, theme: e.target.value as any}}))}>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
          <label>
            Size
            <input type="range" min={12} max={30} value={state.settings.cols} onChange={e => setState(s => initialGameState({
              cols: Number(e.target.value),
              rows: Number(e.target.value),
              keepHighScore: true,
              speedMs: s.settings.speedMs,
              aiEnabled: s.settings.aiEnabled,
              theme: s.settings.theme,
            }))} />
          </label>
          <label>
            Speed
            <input type="range" min={80} max={260} step={10} value={state.settings.speedMs} onChange={e => setState(s => ({...s, settings: {...s.settings, speedMs: Number(e.target.value)}}))} />
          </label>
          <button onClick={() => setIsRunning(r => !r)}>{isRunning ? 'Pause' : 'Resume'}</button>
          <button onClick={() => setState(() => initialGameState({ keepHighScore: true, ...state.settings }))}>Reset</button>
        </div>
      </header>
      <main>
        <div
          className="board"
          style={{
            gridTemplateColumns: `repeat(${state.settings.cols}, ${cellSize}px)`,
            gridTemplateRows: `repeat(${state.settings.rows}, ${cellSize}px)`
          }}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
          onContextMenu={onContextMenu}
          role="application"
          aria-label="Snake board"
        >
          {Array.from({ length: state.settings.rows }).map((_, r) =>
            Array.from({ length: state.settings.cols }).map((_, c) => {
              const cell: Cell = { r, c }
              const isFood = state.food.r === r && state.food.c === c
              const isPlayer = state.player.body.some(p => p.r === r && p.c === c)
              const isAI = state.settings.aiEnabled && state.ai.alive && state.ai.body.some(p => p.r === r && p.c === c)
              const classes = [
                'cell',
                isFood ? 'food' : '',
                isPlayer ? 'player' : '',
                isAI ? 'ai' : '',
              ].filter(Boolean).join(' ')
              return <div key={`${r}-${c}`} className={classes} />
            })
          )}
        </div>
      </main>
      <footer className="tips">Left click: speed up • Right click: brake • Space: pause • Arrows: turn • R: reset</footer>
    </div>
  )
}

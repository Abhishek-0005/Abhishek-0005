import React, { useEffect, useMemo, useRef, useState } from 'react'
import Board from './components/Board.jsx'
import Controls from './components/Controls.jsx'
import Scoreboard from './components/Scoreboard.jsx'
import { useInterval } from './hooks/useInterval.js'
import { useEventListener } from './hooks/useEventListener.js'
import {
  initialSnake,
  initialDirection,
  moveSnake,
  nextDirectionFromKey,
  spawnFood,
  checkCollision,
  SPEED_LEVELS,
  nextDirectionTowardTarget,
} from './utils/game.js'

const GRID_SIZE = 20

export default function App() {
  const [snake, setSnake] = useState(initialSnake)
  const [direction, setDirection] = useState(initialDirection)
  const [food, setFood] = useState(() => spawnFood(GRID_SIZE, initialSnake))
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(() => Number(localStorage.getItem('snake-high-score') || 0))
  const [speedLevel, setSpeedLevel] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isGameOver, setIsGameOver] = useState(false)

  // Mouse control state
  const [mouseEnabled, setMouseEnabled] = useState(true)
  const [boosting, setBoosting] = useState(false)
  const [braking, setBraking] = useState(false)
  const mouseTarget = useRef(null) // {x, y} grid coordinates
  const boardRef = useRef(null)

  const pendingDir = useRef(direction)
  const foodsEaten = useRef(0)

  // Keyboard controls
  useEventListener('keydown', (e) => {
    const key = e.key
    if (key === ' ' || key === 'Enter') {
      if (isGameOver) restart()
      else togglePause()
      return
    }
    const nd = nextDirectionFromKey(key, direction)
    if (nd) {
      pendingDir.current = nd
    }
  })

  // Global mouseup to avoid stuck boost/brake when releasing outside board
  useEventListener('mouseup', () => {
    setBoosting(false)
    setBraking(false)
  })

  // Game tick
  const baseInterval = useMemo(() => SPEED_LEVELS[Math.min(speedLevel, SPEED_LEVELS.length - 1)], [speedLevel])
  const intervalMs = useMemo(() => {
    let factor = 1
    if (boosting && !braking) factor = 0.6
    else if (braking && !boosting) factor = 1.6
    const v = Math.max(30, Math.round(baseInterval * factor))
    return v
  }, [baseInterval, boosting, braking])

  useInterval(() => {
    if (isPaused || isGameOver) return

    // Continuous steering toward mouse target when enabled
    if (mouseEnabled && mouseTarget.current) {
      const head = snake[0]
      const nd = nextDirectionTowardTarget(head, direction, mouseTarget.current)
      if (nd) pendingDir.current = nd
    }

    const newDir = pendingDir.current
    const { newSnake, grew } = moveSnake(snake, newDir, food, GRID_SIZE)

    if (checkCollision(newSnake, GRID_SIZE)) {
      setIsGameOver(true)
      setIsPaused(true)
      setHighScore((prev) => {
        const next = Math.max(prev, score)
        localStorage.setItem('snake-high-score', String(next))
        return next
      })
      return
    }

    setSnake(newSnake)
    setDirection(newDir)

    if (grew) {
      setScore((s) => s + 1)
      foodsEaten.current += 1
      setFood((prev) => spawnFood(GRID_SIZE, newSnake))
      if (foodsEaten.current % 5 === 0) {
        setSpeedLevel((l) => l + 1)
      }
    }
  }, intervalMs)

  function togglePause() {
    setIsPaused((p) => !p)
  }

  function restart() {
    setSnake(initialSnake)
    setDirection(initialDirection)
    setFood(spawnFood(GRID_SIZE, initialSnake))
    setScore(0)
    setIsPaused(false)
    setIsGameOver(false)
    setSpeedLevel(0)
    foodsEaten.current = 0
    pendingDir.current = initialDirection
    // keep mouse settings as-is
  }

  // Mouse handlers
  function updateMouseTarget(ev) {
    if (!boardRef.current) return
    const rect = boardRef.current.getBoundingClientRect()
    const cx = Math.min(Math.max(ev.clientX - rect.left, 0), rect.width)
    const cy = Math.min(Math.max(ev.clientY - rect.top, 0), rect.height)
    const gx = Math.floor((cx / rect.width) * GRID_SIZE)
    const gy = Math.floor((cy / rect.height) * GRID_SIZE)
    mouseTarget.current = { x: gx, y: gy }
  }

  function onMouseMove(ev) {
    if (!mouseEnabled) return
    updateMouseTarget(ev)
  }
  function onMouseDown(ev) {
    if (!mouseEnabled) return
    // 0: left, 2: right
    if (ev.button === 0) {
      setBoosting(true)
      updateMouseTarget(ev)
    } else if (ev.button === 2) {
      setBraking(true)
      updateMouseTarget(ev)
    }
  }
  function onMouseUp(ev) {
    if (ev.button === 0) setBoosting(false)
    if (ev.button === 2) setBraking(false)
  }
  function onMouseLeave() {
    setBoosting(false)
    setBraking(false)
  }
  function onContextMenu(ev) {
    // disable context menu when interacting over the board
    ev.preventDefault()
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Snake</h1>
      </header>
      <main className="main">
        <Scoreboard
          score={score}
          highScore={Math.max(highScore, score)}
          onRestart={restart}
          onPause={togglePause}
          isPaused={isPaused}
          mouseEnabled={mouseEnabled}
          onToggleMouse={() => setMouseEnabled((m) => !m)}
        />
        <div ref={boardRef}>
          <Board
            gridSize={GRID_SIZE}
            snake={snake}
            food={food}
            isGameOver={isGameOver}
            direction={direction}
            onMouseMove={onMouseMove}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
            onContextMenu={onContextMenu}
          />
        </div>
        <Controls
          onDirection={(d) => (pendingDir.current = d)}
          onPause={togglePause}
          onRestart={restart}
        />
      </main>
      {isGameOver && (
        <div className="overlay" role="dialog" aria-modal="true" aria-label="Game Over">
          <div className="overlay-card">
            <h2>Game Over</h2>
            <p>Your score: {score}</p>
            <button className="btn" onClick={restart} aria-label="Restart game">Restart</button>
          </div>
        </div>
      )}
    </div>
  )
}

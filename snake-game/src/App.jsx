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

  // Game tick
  const intervalMs = useMemo(() => SPEED_LEVELS[Math.min(speedLevel, SPEED_LEVELS.length - 1)], [speedLevel])
  useInterval(() => {
    if (isPaused || isGameOver) return

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
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Snake</h1>
      </header>
      <main className="main">
        <Scoreboard score={score} highScore={Math.max(highScore, score)} onRestart={restart} onPause={togglePause} isPaused={isPaused} />
        <Board gridSize={GRID_SIZE} snake={snake} food={food} isGameOver={isGameOver} />
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

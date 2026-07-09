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
  spawnFoodWithOccupied,
  rectCheckSelfOrWallCollision,
  SPEED_LEVELS,
  nextDirectionTowardTarget,
  DIRECTIONS,
  nextSafeDirectionTowardTarget,
  chooseNearestFood,
  willCollideAt,
  spawnRandomSnake,
} from './utils/game.js'

const TILE_SIZE = 20 // px per logical tile (approx)
const MAX_AI = 5

export default function App() {
  const containerRef = useRef(null)
  const [cols, setCols] = useState(20)
  const [rows, setRows] = useState(20)

  // player state
  const [playerSnake, setPlayerSnake] = useState(initialSnake)
  const [playerDir, setPlayerDir] = useState(initialDirection)

  // ai snakes
  const [aiSnakes, setAiSnakes] = useState([]) // array of { id, body, direction, alive, respawnAt }
  const [aiCount, setAiCount] = useState(3)

  const [food, setFood] = useState({ x: 5, y: 5 })
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

  const pendingDir = useRef(playerDir)
  const foodsEaten = useRef(0)
  const idCounter = useRef(1)

  // Responsive grid based on container size
  useEffect(() => {
    function computeGrid() {
      const el = containerRef.current || document.documentElement
      const w = el.clientWidth
      const h = el.clientHeight
      const c = Math.max(10, Math.floor(w / TILE_SIZE))
      const r = Math.max(10, Math.floor(h / TILE_SIZE))
      setCols(c)
      setRows(r)
    }
    computeGrid()
    window.addEventListener('resize', computeGrid)
    return () => window.removeEventListener('resize', computeGrid)
  }, [])

  // Setup and maintain AI snakes based on aiCount
  useEffect(() => {
    // Build occupied set from player only when (re)spawning
    const occ = new Set(playerSnake.map((p) => `${p.x},${p.y}`))
    const next = []
    for (let i = 0; i < aiCount; i++) {
      const { body, direction } = spawnRandomSnake(cols, rows, occ)
      body.forEach((p) => occ.add(`${p.x},${p.y}`))
      next.push({ id: `ai-${idCounter.current++}`, body, direction, alive: true, aiIndex: i })
    }
    setAiSnakes(next)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aiCount, cols, rows])

  // Recompute food when board or snakes change significantly at start
  useEffect(() => {
    const occ = new Set(playerSnake.map((p) => `${p.x},${p.y}`))
    aiSnakes.forEach((s) => s.body.forEach((p) => occ.add(`${p.x},${p.y}`)))
    setFood(spawnFoodWithOccupied(cols, rows, occ))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cols, rows])

  // Keyboard controls
  useEventListener('keydown', (e) => {
    const key = e.key
    if (key === ' ' || key === 'Enter') {
      if (isGameOver) restart()
      else togglePause()
      return
    }
    const nd = nextDirectionFromKey(key, playerDir)
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

    // Player steering
    if (mouseEnabled && mouseTarget.current) {
      const head = playerSnake[0]
      const nd = nextDirectionTowardTarget(head, playerDir, mouseTarget.current)
      if (nd) pendingDir.current = nd
    }

    let newPlayerDir = pendingDir.current

    // Occupancy set for collisions includes all snakes except each snake's own tail (which vacates if not growing)
    const occupiedNow = new Set()
    playerSnake.slice(0, -1).forEach((p) => occupiedNow.add(`${p.x},${p.y}`)) // exclude player tail by default
    aiSnakes.forEach((s) => s.body.forEach((p, idx) => {
      if (idx < s.body.length - 1) occupiedNow.add(`${p.x},${p.y}`)
    }))

    // Move AI snakes first using safe-step heuristic
    const movedAIs = aiSnakes.map((s, idx) => {
      if (!s.alive) {
        // check for respawn
        return s
      }
      const head = s.body[0]
      const target = chooseNearestFood(head, [food]) || food
      const willGrow = head.x + s.direction.x === food.x && head.y + s.direction.y === food.y
      const nextDir = nextSafeDirectionTowardTarget(head, s.direction, target, {
        cols,
        rows,
        occupiedSet: occupiedNow,
        ownTail: s.body[s.body.length - 1],
        willGrow,
      })
      const nextHead = { x: head.x + nextDir.x, y: head.y + nextDir.y }
      let newBody = [nextHead, ...s.body]
      let grew = false
      if (nextHead.x === food.x && nextHead.y === food.y) {
        grew = true
      } else {
        newBody.pop()
      }
      let died = false
      // Collision vs walls, self, player, other AI bodies
      const hitWall = nextHead.x < 0 || nextHead.y < 0 || nextHead.x >= cols || nextHead.y >= rows
      const hitSelf = newBody.slice(1).some((p) => p.x === nextHead.x && p.y === nextHead.y)
      const hitPlayer = playerSnake.some((p, i) => i !== playerSnake.length - 1 && p.x === nextHead.x && p.y === nextHead.y)
      let hitOtherAI = false
      for (let j = 0; j < aiSnakes.length; j++) {
        if (j === idx) continue
        const other = aiSnakes[j]
        if (!other.alive) continue
        // other body except tail
        if (other.body.some((p, k) => k !== other.body.length - 1 && p.x === nextHead.x && p.y === nextHead.y)) {
          hitOtherAI = true
          break
        }
      }
      if (hitWall || hitSelf || hitPlayer || hitOtherAI) {
        died = true
      }
      return {
        ...s,
        body: died ? s.body : newBody,
        direction: died ? s.direction : nextDir,
        alive: died ? false : true,
        // simple respawn timer via counter ticks
        respawnIn: died ? 10 : undefined,
        justAte: grew,
      }
    })

    // Decrement respawn timers and respawn if needed
    const respawnedAIs = movedAIs.map((s, i) => {
      if (s.alive) return s
      const rem = (s.respawnIn ?? 0) - 1
      if (rem > 0) return { ...s, respawnIn: rem }
      // Respawn at a safe spot
      const occ = new Set()
      // Occupy current player and all alive AI (after their move)
      playerSnake.forEach((p) => occ.add(`${p.x},${p.y}`))
      movedAIs.forEach((t, j) => {
        if (i === j) return
        if (t.alive) t.body.forEach((p) => occ.add(`${p.x},${p.y}`))
      })
      const { body, direction } = spawnRandomSnake(cols, rows, occ)
      return { ...s, body, direction, alive: true, respawnIn: undefined }
    })

    // Now move player
    const playerHead = playerSnake[0]
    const nextPlayerHead = { x: playerHead.x + newPlayerDir.x, y: playerHead.y + newPlayerDir.y }

    // Player collisions: walls, self, any AI body (including their new heads)
    const hitWall = nextPlayerHead.x < 0 || nextPlayerHead.y < 0 || nextPlayerHead.x >= cols || nextPlayerHead.y >= rows
    const hitSelf = playerSnake.slice(1).some((p) => p.x === nextPlayerHead.x && p.y === nextPlayerHead.y)
    let hitAI = false
    for (const s of respawnedAIs) {
      if (!s.alive) continue
      if (s.body.some((p) => p.x === nextPlayerHead.x && p.y === nextPlayerHead.y)) {
        hitAI = true
        break
      }
    }

    if (hitWall || hitSelf || hitAI) {
      setIsGameOver(true)
      setIsPaused(true)
      setHighScore((prev) => {
        const next = Math.max(prev, score)
        localStorage.setItem('snake-high-score', String(next))
        return next
      })
      return
    }

    let grew = false
    let newPlayerSnake = [nextPlayerHead, ...playerSnake]
    if (nextPlayerHead.x === food.x && nextPlayerHead.y === food.y) {
      grew = true
    } else {
      newPlayerSnake.pop()
    }

    // If any AI also ate the same food, they grow too. Food is shared; respawn new food if consumed by anyone.
    let foodConsumed = grew
    const finalAIs = respawnedAIs.map((s) => {
      if (!s.alive) return s
      const h = s.body[0]
      if (h.x === food.x && h.y === food.y) {
        foodConsumed = true
        return { ...s, body: [h, ...s.body] } // grow without dropping tail (already advanced)
      }
      return s
    })

    if (foodConsumed) {
      // increment only for player eating
      if (grew) {
        setScore((sc) => sc + 1)
        foodsEaten.current += 1
        if (foodsEaten.current % 5 === 0) setSpeedLevel((l) => l + 1)
      }
      // Recompute occupied and spawn new food
      const occ = new Set(newPlayerSnake.map((p) => `${p.x},${p.y}`))
      finalAIs.forEach((s) => s.alive && s.body.forEach((p) => occ.add(`${p.x},${p.y}`)))
      setFood(spawnFoodWithOccupied(cols, rows, occ))
    }

    setPlayerSnake(newPlayerSnake)
    setPlayerDir(newPlayerDir)
    setAiSnakes(finalAIs)
  }, intervalMs)

  function togglePause() { setIsPaused((p) => !p) }

  function restart() {
    setPlayerSnake(initialSnake)
    setPlayerDir(initialDirection)
    setScore(0)
    setIsPaused(false)
    setIsGameOver(false)
    setSpeedLevel(0)
    foodsEaten.current = 0
    pendingDir.current = initialDirection
    // respawn AI per current aiCount
    const occ = new Set(initialSnake.map((p) => `${p.x},${p.y}`))
    const next = []
    for (let i = 0; i < aiCount; i++) {
      const { body, direction } = spawnRandomSnake(cols, rows, occ)
      body.forEach((p) => occ.add(`${p.x},${p.y}`))
      next.push({ id: `ai-${idCounter.current++}`, body, direction, alive: true, aiIndex: i })
    }
    setAiSnakes(next)
    // spawn food not on any snake
    const occ2 = new Set(initialSnake.map((p) => `${p.x},${p.y}`))
    next.forEach((s) => s.body.forEach((p) => occ2.add(`${p.x},${p.y}`)))
    setFood(spawnFoodWithOccupied(cols, rows, occ2))
  }

  // Mouse handlers: map to grid coordinates based on container size
  function updateMouseTarget(ev) {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = Math.min(Math.max(ev.clientX - rect.left, 0), rect.width)
    const cy = Math.min(Math.max(ev.clientY - rect.top, 0), rect.height)
    const gx = Math.floor((cx / rect.width) * cols)
    const gy = Math.floor((cy / rect.height) * rows)
    mouseTarget.current = { x: gx, y: gy }
  }

  function onMouseMove(ev) { if (!mouseEnabled) return; updateMouseTarget(ev) }
  function onMouseDown(ev) {
    if (!mouseEnabled) return
    if (ev.button === 0) { setBoosting(true); updateMouseTarget(ev) }
    else if (ev.button === 2) { setBraking(true); updateMouseTarget(ev) }
  }
  function onMouseUp(ev) { if (ev.button === 0) setBoosting(false); if (ev.button === 2) setBraking(false) }
  function onMouseLeave() { setBoosting(false); setBraking(false) }
  function onContextMenu(ev) { ev.preventDefault() }

  const snakes = useMemo(() => {
    return [
      { id: 'player', body: playerSnake, direction: playerDir, kind: 'player' },
      ...aiSnakes.map((s, i) => ({ ...s, kind: 'ai', aiIndex: i })),
    ]
  }, [playerSnake, playerDir, aiSnakes])

  return (
    <div className="app fullscreen" ref={containerRef}>
      <header className="header">
        <h1>Snake</h1>
      </header>
      <main className="main fullscreen-main">
        <Scoreboard
          score={score}
          highScore={Math.max(highScore, score)}
          onRestart={restart}
          onPause={togglePause}
          isPaused={isPaused}
          mouseEnabled={mouseEnabled}
          onToggleMouse={() => setMouseEnabled((m) => !m)}
        />
        <Board
          cols={cols}
          rows={rows}
          snakes={snakes}
          food={food}
          isGameOver={isGameOver}
          onMouseMove={onMouseMove}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
          onContextMenu={onContextMenu}
        />
        <Controls
          onDirection={(d) => (pendingDir.current = d)}
          onPause={togglePause}
          onRestart={restart}
        />
        <div className="ai-controls">
          <label htmlFor="aicount">AI Snakes:</label>
          <input id="aicount" type="range" min="0" max={MAX_AI} value={aiCount} onChange={(e) => setAiCount(Number(e.target.value))} />
          <span>{aiCount}</span>
        </div>
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

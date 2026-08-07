export const GRID_DEFAULT = 20

export const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
}

export const initialSnake = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
]
export const initialDirection = DIRECTIONS.RIGHT

export const SPEED_LEVELS = [200, 170, 150, 130, 110, 90, 80, 70, 60]

export function nextDirectionFromKey(key, currentDir) {
  const map = {
    ArrowUp: DIRECTIONS.UP,
    ArrowDown: DIRECTIONS.DOWN,
    ArrowLeft: DIRECTIONS.LEFT,
    ArrowRight: DIRECTIONS.RIGHT,
    w: DIRECTIONS.UP,
    W: DIRECTIONS.UP,
    s: DIRECTIONS.DOWN,
    S: DIRECTIONS.DOWN,
    a: DIRECTIONS.LEFT,
    A: DIRECTIONS.LEFT,
    d: DIRECTIONS.RIGHT,
    D: DIRECTIONS.RIGHT,
  }
  const nd = map[key]
  if (!nd) return null
  // Prevent reversing into itself
  if (currentDir.x + nd.x === 0 && currentDir.y + nd.y === 0) return null
  return nd
}

export function moveSnake(snake, direction, food, gridSize = GRID_DEFAULT) {
  const head = snake[0]
  const newHead = { x: head.x + direction.x, y: head.y + direction.y }
  const ateFood = newHead.x === food.x && newHead.y === food.y
  const newSnake = [newHead, ...snake]
  if (!ateFood) newSnake.pop()
  return { newSnake, grew: ateFood }
}

export function checkCollision(snake, gridSize = GRID_DEFAULT) {
  const [head, ...body] = snake
  // Wall collision
  if (head.x < 0 || head.y < 0 || head.x >= gridSize || head.y >= gridSize) return true
  // Self collision
  return body.some((p) => p.x === head.x && p.y === head.y)
}

export function spawnFood(gridSize = GRID_DEFAULT, snake) {
  const occupied = new Set(snake.map((p) => `${p.x},${p.y}`))
  const total = gridSize * gridSize
  if (occupied.size >= total) return { x: 0, y: 0 } // board full, shouldn't happen
  let x, y
  do {
    x = Math.floor(Math.random() * gridSize)
    y = Math.floor(Math.random() * gridSize)
  } while (occupied.has(`${x},${y}`))
  return { x, y }
}

// New: rectangular-grid aware helpers for AI and fullscreen mode
export function isReverse(currentDir, nd) {
  return currentDir && nd && currentDir.x + nd.x === 0 && currentDir.y + nd.y === 0
}

export function willCollideAt(pos, cols, rows, occupiedSet) {
  // bounds
  if (pos.x < 0 || pos.y < 0 || pos.x >= cols || pos.y >= rows) return true
  // body occupancy
  if (occupiedSet && occupiedSet.has(`${pos.x},${pos.y}`)) return true
  return false
}

export function spawnFoodWithOccupied(cols, rows, occupiedSet) {
  const total = cols * rows
  if (occupiedSet.size >= total) return { x: 0, y: 0 }
  let x, y
  let safety = 0
  do {
    x = Math.floor(Math.random() * cols)
    y = Math.floor(Math.random() * rows)
    safety++
  } while (occupiedSet.has(`${x},${y}`) && safety < total + 5)
  return { x, y }
}

export function chooseNearestFood(head, foods) {
  if (!foods || foods.length === 0) return null
  let best = foods[0]
  let bestDist = Math.abs(best.x - head.x) + Math.abs(best.y - head.y)
  for (let i = 1; i < foods.length; i++) {
    const f = foods[i]
    const d = Math.abs(f.x - head.x) + Math.abs(f.y - head.y)
    if (d < bestDist) {
      best = f
      bestDist = d
    }
  }
  return best
}

// Decide a grid direction that steers the snake head toward a target cell without reversing.
export function nextDirectionTowardTarget(head, currentDir, target) {
  if (!target) return currentDir
  const dx = target.x - head.x
  const dy = target.y - head.y
  // If already on target, keep current direction
  if (dx === 0 && dy === 0) return currentDir
  // Prefer the axis with the larger absolute distance
  const tryXFirst = Math.abs(dx) >= Math.abs(dy)

  function dirFor(sign, axis) {
    if (axis === 'x') return sign > 0 ? DIRECTIONS.RIGHT : DIRECTIONS.LEFT
    return sign > 0 ? DIRECTIONS.DOWN : DIRECTIONS.UP
  }

  const primary = tryXFirst ? dirFor(Math.sign(dx), 'x') : dirFor(Math.sign(dy), 'y')
  const secondary = tryXFirst ? dirFor(Math.sign(dy), 'y') : dirFor(Math.sign(dx), 'x')

  // Helper to check reverse
  function isRev(nd) {
    return currentDir && currentDir.x + nd.x === 0 && currentDir.y + nd.y === 0
  }

  if (primary && !isRev(primary)) return primary
  if (secondary && !isRev(secondary)) return secondary
  return currentDir
}

// Greedy AI step: prefer moving toward nearest food, avoid immediate collisions (walls/occupied next cells),
// respect no-reverse rule; try alternatives when blocked.
export function nextSafeDirectionTowardTarget(head, currentDir, target, {
  cols,
  rows,
  occupiedSet,
  ownTail,
  willGrow,
} = {}) {
  // Fallback to existing heuristic first to get a preference ordering
  const pref1 = nextDirectionTowardTarget(head, currentDir, target)

  const allDirs = [DIRECTIONS.UP, DIRECTIONS.DOWN, DIRECTIONS.LEFT, DIRECTIONS.RIGHT]
  const noReverse = (d) => !isReverse(currentDir, d)

  // Create an ordered list to try: primary, secondary from heuristic, then the remaining
  const dx = target ? target.x - head.x : 0
  const dy = target ? target.y - head.y : 0
  const tryXFirst = Math.abs(dx) >= Math.abs(dy)
  const dirFor = (sign, axis) => (axis === 'x' ? (sign > 0 ? DIRECTIONS.RIGHT : DIRECTIONS.LEFT) : (sign > 0 ? DIRECTIONS.DOWN : DIRECTIONS.UP))
  const primary = pref1
  const secondary = tryXFirst ? dirFor(Math.sign(dy), 'y') : dirFor(Math.sign(dx), 'x')
  const candidates = [primary, secondary, ...allDirs.filter((d) => d !== primary && d !== secondary)]

  for (const cand of candidates) {
    if (!cand || !noReverse(cand)) continue
    const next = { x: head.x + cand.x, y: head.y + cand.y }
    // Allow stepping onto own tail if not growing (tail will vacate)
    const occ = new Set(occupiedSet || [])
    if (ownTail && !willGrow) occ.delete(`${ownTail.x},${ownTail.y}`)
    if (!willCollideAt(next, cols, rows, occ)) return cand
  }
  // If everything seems blocked, try to keep going if it's not an immediate collision
  if (currentDir) {
    const next = { x: head.x + currentDir.x, y: head.y + currentDir.y }
    const occ = new Set(occupiedSet || [])
    if (ownTail && !willGrow) occ.delete(`${ownTail.x},${ownTail.y}`)
    if (!willCollideAt(next, cols, rows, occ)) return currentDir
  }
  // As a last resort, pick any non-reverse direction (might collide; caller will handle death)
  for (const d of allDirs) if (noReverse(d)) return d
  return currentDir || DIRECTIONS.RIGHT
}

export function rectCheckSelfOrWallCollision(snake, cols, rows) {
  const [head, ...body] = snake
  if (head.x < 0 || head.y < 0 || head.x >= cols || head.y >= rows) return true
  return body.some((p) => p.x === head.x && p.y === head.y)
}

export function spawnRandomSnake(cols, rows, occupiedSet) {
  // Attempt to place a 2-length snake in a random safe spot with a valid initial direction
  const attempts = Math.max(200, cols * rows)
  for (let i = 0; i < attempts; i++) {
    const x = Math.floor(Math.random() * cols)
    const y = Math.floor(Math.random() * rows)
    const dirs = [DIRECTIONS.UP, DIRECTIONS.DOWN, DIRECTIONS.LEFT, DIRECTIONS.RIGHT]
    for (const d of dirs) {
      const head = { x, y }
      const tail = { x: x - d.x, y: y - d.y }
      const okHead = !willCollideAt(head, cols, rows, occupiedSet)
      const okTail = !willCollideAt(tail, cols, rows, occupiedSet)
      if (okHead && okTail) {
        return { body: [head, tail], direction: d }
      }
    }
  }
  // Fallback: place at (0,0) to avoid crash
  return { body: [{ x: 1, y: 1 }, { x: 0, y: 1 }], direction: DIRECTIONS.RIGHT }
}

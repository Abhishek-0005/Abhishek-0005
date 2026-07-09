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

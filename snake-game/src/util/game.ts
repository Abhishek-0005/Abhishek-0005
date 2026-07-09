export type Cell = { r: number; c: number }
export type Direction = 'up' | 'down' | 'left' | 'right'

export type Snake = {
  body: Cell[]
  dir: Direction
  alive: boolean
}

export type Settings = {
  rows: number
  cols: number
  speedMs: number
  aiEnabled: boolean
  theme: 'light' | 'dark'
}

export type GameState = {
  settings: Settings
  player: Snake
  ai: Snake
  food: Cell
  score: number
  highScore: number
  gameOver: boolean
  // Internal respawn timer for AI when dead
  aiRespawnIn: number
}

const DIRS: Record<Direction, Cell> = {
  up: { r: -1, c: 0 },
  down: { r: 1, c: 0 },
  left: { r: 0, c: -1 },
  right: { r: 0, c: 1 },
}

export function turnLeft(d: Direction): Direction {
  switch (d) {
    case 'up': return 'left'
    case 'left': return 'down'
    case 'down': return 'right'
    case 'right': return 'up'
  }
}
export function turnRight(d: Direction): Direction {
  switch (d) {
    case 'up': return 'right'
    case 'right': return 'down'
    case 'down': return 'left'
    case 'left': return 'up'
  }
}

function eq(a: Cell, b: Cell) { return a.r === b.r && a.c === b.c }

function inBounds(s: Settings, p: Cell) {
  return p.r >= 0 && p.c >= 0 && p.r < s.rows && p.c < s.cols
}

export function initialGameState(opts?: Partial<Settings & { keepHighScore?: boolean }>): GameState {
  const settings: Settings = {
    rows: opts?.rows ?? 20,
    cols: opts?.cols ?? 20,
    speedMs: opts?.speedMs ?? 140,
    aiEnabled: opts?.aiEnabled ?? true,
    theme: opts?.theme ?? 'light'
  }
  const center: Cell = { r: Math.floor(settings.rows/2), c: Math.floor(settings.cols/2) }
  const player: Snake = { body: [center], dir: 'right', alive: true }
  const ai: Snake = { body: [{ r: 1, c: 1 }], dir: 'right', alive: true }
  const food = randomEmptyCell(settings, [player.body, ai.body])
  const high = (opts as any)?.keepHighScore ? (typeof localStorage !== 'undefined' ? Number(localStorage.getItem('snakeHigh') || 0) : 0) : 0
  return { settings, player, ai, food, score: 0, highScore: high, gameOver: false, aiRespawnIn: 0 }
}

export function randomEmptyCell(settings: Settings, occupiedGroups: Cell[][]): Cell {
  const occ = new Set(occupiedGroups.flat().map(p => `${p.r}:${p.c}`))
  const free: Cell[] = []
  for (let r=0;r<settings.rows;r++) for (let c=0;c<settings.cols;c++) {
    if (!occ.has(`${r}:${c}`)) free.push({ r, c })
  }
  return free[Math.floor(Math.random()*free.length)]
}

function willCollide(settings: Settings, next: Cell, snakes: Snake[], ignore?: Snake) {
  if (!inBounds(settings, next)) return true
  for (const s of snakes) {
    if (ignore && s === ignore) continue
    if (s.alive && s.body.some(p => eq(p, next))) return true
  }
  return false
}

function advanceSnake(snake: Snake, nextHead: Cell, grow: boolean): Snake {
  const newBody = [nextHead, ...snake.body]
  if (!grow) newBody.pop()
  return { ...snake, body: newBody }
}

function manhattan(a: Cell, b: Cell) { return Math.abs(a.r-b.r)+Math.abs(a.c-b.c) }

export function getNextDirectionAI(gs: GameState): Direction {
  const s = gs.ai
  if (!s.alive) return s.dir
  const dirs: Direction[] = ['up','down','left','right']
  // Greedy towards food
  dirs.sort((a,b) => manhattan(applyDir(s.body[0], a), gs.food) - manhattan(applyDir(s.body[0], b), gs.food))

  const candidates: Direction[] = [...new Set([
    // forward greedy options first
    dirs[0], dirs[1],
    // then maintain
    s.dir,
    // then left/right relative as fallback
    turnLeft(s.dir), turnRight(s.dir)
  ])]

  for (const d of candidates) {
    const nh = applyDir(s.body[0], d)
    if (!willCollide(gs.settings, nh, [gs.player, gs.ai])) {
      return d
    }
  }
  // if none safe, keep direction if possible else any safe
  const forward = applyDir(s.body[0], s.dir)
  if (!willCollide(gs.settings, forward, [gs.player, gs.ai])) return s.dir
  for (const d of ['up','down','left','right'] as Direction[]) {
    const nh = applyDir(s.body[0], d)
    if (!willCollide(gs.settings, nh, [gs.player, gs.ai])) return d
  }
  return s.dir
}

function applyDir(p: Cell, d: Direction): Cell {
  const off = DIRS[d]
  return { r: p.r + off.r, c: p.c + off.c }
}

export function stepGame(gs: GameState): GameState {
  if (gs.gameOver) return gs
  let state = { ...gs }

  // AI respawn timer
  if (!state.ai.alive && state.aiRespawnIn > 0) {
    state.aiRespawnIn -= 1
    return state
  }
  if (!state.ai.alive && state.aiRespawnIn <= 0 && state.settings.aiEnabled) {
    // respawn at safe random location
    const pos = randomEmptyCell(state.settings, [state.player.body])
    state.ai = { body: [pos], dir: 'right', alive: true }
  }

  // Compute next directions
  const playerNext = applyDir(state.player.body[0], state.player.dir)
  const aiDir = state.settings.aiEnabled ? getNextDirectionAI(state) : state.ai.dir
  const aiNext = applyDir(state.ai.body[0], aiDir)

  // Collisions for player
  const playerCollision = willCollide(state.settings, playerNext, [state.player, state.ai], undefined)
  if (playerCollision) {
    state.gameOver = true
    state.highScore = Math.max(state.highScore, state.score)
    if (typeof localStorage !== 'undefined') localStorage.setItem('snakeHigh', String(state.highScore))
    return state
  }

  // Collisions for AI
  const aiCollision = state.settings.aiEnabled && willCollide(state.settings, aiNext, [state.player, state.ai], undefined)

  const playerGrow = eq(playerNext, state.food)
  const aiGrow = state.settings.aiEnabled && eq(aiNext, state.food)

  state.player = advanceSnake(state.player, playerNext, playerGrow)

  if (state.settings.aiEnabled) {
    if (aiCollision) {
      state.ai = { ...state.ai, alive: false }
      state.aiRespawnIn = 8 // short delay
    } else {
      state.ai = advanceSnake({ ...state.ai, dir: aiDir }, aiNext, aiGrow)
    }
  }

  // Food eaten rules: if both try to eat, prioritize player, then spawn new food
  if (playerGrow || aiGrow) {
    if (playerGrow) state.score += 1
    const occupied = [state.player.body]
    if (state.settings.aiEnabled && state.ai.alive) occupied.push(state.ai.body)
    state.food = randomEmptyCell(state.settings, occupied)
  }

  return state
}

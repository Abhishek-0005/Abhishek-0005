import React from 'react'

export default function Board({
  gridSize,
  snake,
  food,
  isGameOver,
  direction,
  onMouseMove,
  onMouseDown,
  onMouseUp,
  onMouseLeave,
  onContextMenu,
}) {
  const cells = []
  const snakeSet = new Set(snake.map((p) => `${p.x},${p.y}`))
  const headKey = `${snake[0].x},${snake[0].y}`
  const foodKey = `${food.x},${food.y}`

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const key = `${x},${y}`
      let cls = 'cell'
      if (snakeSet.has(key)) cls += ' cell-snake'
      if (key === headKey) {
        cls += ' cell-snake--head'
        if (direction?.x === 1) cls += ' head--right'
        else if (direction?.x === -1) cls += ' head--left'
        else if (direction?.y === 1) cls += ' head--down'
        else if (direction?.y === -1) cls += ' head--up'
      }
      if (key === foodKey) cls += ' cell-food'
      cells.push(<div key={key} className={cls} aria-hidden="true" />)
    }
  }

  return (
    <div
      className={`board ${isGameOver ? 'board--gameover' : ''}`}
      role="grid"
      aria-label="Snake board"
      style={{
        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        gridTemplateRows: `repeat(${gridSize}, 1fr)`,
        ['--grid-size']: gridSize,
      }}
      onMouseMove={onMouseMove}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onContextMenu={onContextMenu}
    >
      {cells}
    </div>
  )
}

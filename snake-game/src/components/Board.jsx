import React from 'react'

export default function Board({ gridSize, snake, food, isGameOver }) {
  const cells = []
  const snakeSet = new Set(snake.map((p) => `${p.x},${p.y}`))
  const foodKey = `${food.x},${food.y}`

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const key = `${x},${y}`
      let cls = 'cell'
      if (snakeSet.has(key)) cls += ' cell-snake'
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
      }}
    >
      {cells}
    </div>
  )
}

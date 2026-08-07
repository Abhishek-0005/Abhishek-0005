import React from 'react'

// snakes: array of { id, body: [{x,y}], direction, kind: 'player'|'ai', aiIndex?: number }
export default function Board({
  cols,
  rows,
  snakes = [],
  food,
  isGameOver,
  onMouseMove,
  onMouseDown,
  onMouseUp,
  onMouseLeave,
  onContextMenu,
}) {
  const cells = []

  // Build quick lookup maps for classes per cell
  const snakeSets = snakes.map((s) => new Set(s.body.map((p) => `${p.x},${p.y}`)))
  const headKeys = snakes.map((s) => (s.body[0] ? `${s.body[0].x},${s.body[0].y}` : null))
  const foodKey = food ? `${food.x},${food.y}` : null

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const key = `${x},${y}`
      let cls = 'cell'
      let headDirCls = ''

      snakes.forEach((s, idx) => {
        if (snakeSets[idx].has(key)) {
          cls += ' cell-snake'
          if (s.kind === 'player') cls += ' cell-snake--player'
          else cls += ` cell-snake--ai cell-snake--ai-${s.aiIndex ?? 0}`
          if (headKeys[idx] === key) {
            cls += ' cell-snake--head'
            const d = s.direction
            if (d?.x === 1) headDirCls = ' head--right'
            else if (d?.x === -1) headDirCls = ' head--left'
            else if (d?.y === 1) headDirCls = ' head--down'
            else if (d?.y === -1) headDirCls = ' head--up'
          }
        }
      })

      if (foodKey && key === foodKey) cls += ' cell-food'
      cells.push(<div key={key} className={cls + headDirCls} aria-hidden="true" />)
    }
  }

  return (
    <div
      className={`board ${isGameOver ? 'board--gameover' : ''}`}
      role="grid"
      aria-label="Snake board"
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        ['--grid-cols']: cols,
        ['--grid-rows']: rows,
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

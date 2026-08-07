import React from 'react'
import { DIRECTIONS } from '../utils/game.js'

export default function Controls({ onDirection, onPause, onRestart }) {
  return (
    <div className="controls" aria-label="Controls">
      <div className="dpad" role="group" aria-label="D-pad">
        <button className="btn" onClick={() => onDirection(DIRECTIONS.UP)} aria-label="Move up">▲</button>
        <div className="hrow">
          <button className="btn" onClick={() => onDirection(DIRECTIONS.LEFT)} aria-label="Move left">◀</button>
          <button className="btn" onClick={() => onDirection(DIRECTIONS.RIGHT)} aria-label="Move right">▶</button>
        </div>
        <button className="btn" onClick={() => onDirection(DIRECTIONS.DOWN)} aria-label="Move down">▼</button>
      </div>
      <div className="actions" role="group" aria-label="Game actions">
        <button className="btn" onClick={onPause} aria-label="Pause or resume">Pause/Resume</button>
        <button className="btn" onClick={onRestart} aria-label="Restart game">Restart</button>
      </div>
    </div>
  )
}

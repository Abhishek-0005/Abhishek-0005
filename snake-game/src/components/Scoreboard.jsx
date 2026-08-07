import React from 'react'

export default function Scoreboard({ score, highScore, onRestart, onPause, isPaused, mouseEnabled, onToggleMouse }) {
  return (
    <div className="scoreboard" role="status" aria-live="polite">
      <div className="scores">
        <span>Score: <strong>{score}</strong></span>
        <span>High: <strong>{highScore}</strong></span>
      </div>
      <div className="score-actions">
        <button className="btn" onClick={onPause} aria-label={isPaused ? 'Resume game' : 'Pause game'}>
          {isPaused ? 'Resume' : 'Pause'}
        </button>
        <button className="btn" onClick={onRestart} aria-label="Restart game">Restart</button>
        <button className="btn" onClick={onToggleMouse} aria-pressed={mouseEnabled} aria-label="Toggle mouse control">
          Mouse: {mouseEnabled ? 'On' : 'Off'}
        </button>
      </div>
    </div>
  )
}

import React from 'react'

export default function Scoreboard({ score, highScore, onRestart, onPause, isPaused }) {
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
      </div>
    </div>
  )
}

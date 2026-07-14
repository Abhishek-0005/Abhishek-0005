import React, { useEffect, useState } from 'react'
import { evaluate } from './lib/evaluate.js'

const buttons = [
  { label: 'C', action: 'clear', className: 'btn-danger' },
  { label: '(', action: 'input', value: '(', className: 'btn-operator' },
  { label: ')', action: 'input', value: ')', className: 'btn-operator' },
  { label: '⌫', action: 'backspace' },

  { label: '7', action: 'input', value: '7' },
  { label: '8', action: 'input', value: '8' },
  { label: '9', action: 'input', value: '9' },
  { label: '÷', action: 'input', value: '/' , className: 'btn-operator'},

  { label: '4', action: 'input', value: '4' },
  { label: '5', action: 'input', value: '5' },
  { label: '6', action: 'input', value: '6' },
  { label: '×', action: 'input', value: '*', className: 'btn-operator' },

  { label: '1', action: 'input', value: '1' },
  { label: '2', action: 'input', value: '2' },
  { label: '3', action: 'input', value: '3' },
  { label: '−', action: 'input', value: '-', className: 'btn-operator' },

  { label: '0', action: 'input', value: '0' },
  { label: '.', action: 'input', value: '.' },
  { label: '=', action: 'equals', className: 'btn-accent btn-wide' },
  { label: '+', action: 'input', value: '+', className: 'btn-operator' },
]

export default function App() {
  const [expr, setExpr] = useState('')
  const [result, setResult] = useState('0')
  const [error, setError] = useState('')

  const append = (val) => {
    setExpr((e) => e + val)
    setError('')
  }

  const clear = () => {
    setExpr('')
    setResult('0')
    setError('')
  }

  const backspace = () => {
    setExpr((e) => e.slice(0, -1))
    setError('')
  }

  const equals = () => {
    try {
      const val = evaluate(expr === '' ? '0' : expr)
      setResult(String(val))
      setError('')
    } catch (err) {
      setError(err.message || 'Error')
    }
  }

  useEffect(() => {
    const onKey = (e) => {
      const key = e.key
      if ((key >= '0' && key <= '9') || key === '.' || key === '+' || key === '-' || key === '*' || key === '/' || key === '(' || key === ')') {
        append(key)
        e.preventDefault()
      } else if (key === 'Enter' || key === '=') {
        equals(); e.preventDefault()
      } else if (key === 'Backspace') {
        backspace(); e.preventDefault()
      } else if (key === 'Escape') {
        clear(); e.preventDefault()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="container">
      <div className="calculator" role="application" aria-label="Calculator">
        <div className="display">
          <div className="expr" aria-live="polite">{expr || '\u00A0'}</div>
          {error ? (
            <div className="error" aria-live="assertive">{error}</div>
          ) : (
            <div className="result" aria-live="polite">{result}</div>
          )}
          <div className="keyboard-hint">Keys: 0–9 . + - * / ( )  Enter =  Backspace  Esc</div>
        </div>
        <div className="grid">
          {buttons.map((b) => (
            <button
              key={b.label}
              className={[b.className].filter(Boolean).join(' ')}
              onClick={() => {
                if (b.action === 'input') append(b.value)
                else if (b.action === 'equals') equals()
                else if (b.action === 'clear') clear()
                else if (b.action === 'backspace') backspace()
              }}
              aria-label={b.action === 'input' ? `Insert ${b.value}` : b.label}
            >
              {b.label}
            </button>
          ))}
        </div>
        <div className="footer">
          <span>React + Vite</span>
          <a className="link" href="https://github.com/Abhishek-0005/Abhishek-0005/tree/feat/react-calculator/apps/calculator" target="_blank" rel="noreferrer">Source</a>
        </div>
      </div>
    </div>
  )
}

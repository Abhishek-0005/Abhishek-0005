import { useEffect, useRef } from 'react'

// A stable interval that updates the callback and delay without stale closures
export function useInterval(callback, delay) {
  const savedCallback = useRef(callback)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (delay == null) return
    const id = setInterval(() => savedCallback.current && savedCallback.current(), delay)
    return () => clearInterval(id)
  }, [delay])
}

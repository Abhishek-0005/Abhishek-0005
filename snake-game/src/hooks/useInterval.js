import { useEffect, useRef } from 'react'

export function useInterval(callback, delay) {
  const savedCallback = useRef()
  const delayRef = useRef(delay)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    delayRef.current = delay
  }, [delay])

  useEffect(() => {
    if (delayRef.current == null) return
    const id = setInterval(() => savedCallback.current && savedCallback.current(), delayRef.current)
    return () => clearInterval(id)
  }, [delayRef.current])
}

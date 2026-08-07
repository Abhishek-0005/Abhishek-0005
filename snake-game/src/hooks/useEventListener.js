import { useEffect, useRef } from 'react'

export function useEventListener(type, handler, target = window, options) {
  const saved = useRef(handler)
  useEffect(() => {
    saved.current = handler
  }, [handler])

  useEffect(() => {
    const tgt = target && 'current' in target ? target.current : target
    if (!tgt?.addEventListener) return
    const listener = (e) => saved.current && saved.current(e)
    tgt.addEventListener(type, listener, options)
    return () => tgt.removeEventListener(type, listener, options)
  }, [type, target, options])
}

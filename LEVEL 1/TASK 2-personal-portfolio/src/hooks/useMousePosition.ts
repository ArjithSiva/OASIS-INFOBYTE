import { useEffect, useState } from 'react'

interface Position {
  x: number
  y: number
}

export function useMousePosition() {
  const [position, setPosition] = useState<Position>({ x: -100, y: -100 })

  useEffect(() => {
    const handleMove = (e: MouseEvent) => setPosition({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', handleMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  return position
}

export function useFinePointer() {
  const [isFine, setIsFine] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(hover: hover) and (pointer: fine)')
    setIsFine(query.matches)
    const listener = (e: MediaQueryListEvent) => setIsFine(e.matches)
    query.addEventListener('change', listener)
    return () => query.removeEventListener('change', listener)
  }, [])

  return isFine
}

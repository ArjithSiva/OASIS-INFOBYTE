import { useEffect, useRef, useState, type ElementType } from 'react'

interface TypewriterTextProps {
  text: string
  as?: ElementType
  className?: string
  /** Milliseconds per character. Kept fast by design. */
  speedMs?: number
  /** Delay before typing starts — used to stagger multiple fields. */
  startDelayMs?: number
}

// Fast character-by-character reveal with a settling glow, used for the
// Quest Board's title/tagline when its content swaps between projects.
// Respects prefers-reduced-motion by showing the full text immediately.
export function TypewriterText({
  text,
  as: Tag = 'span',
  className = '',
  speedMs = 16,
  startDelayMs = 0,
}: TypewriterTextProps) {
  const [count, setCount] = useState(0)
  const reduceMotion = useRef(
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    if (reduceMotion.current) {
      setCount(text.length)
      return
    }

    setCount(0)
    if (!text) return

    let i = 0
    let intervalId: ReturnType<typeof setInterval> | undefined
    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        i += 1
        setCount(i)
        if (i >= text.length && intervalId) {
          clearInterval(intervalId)
        }
      }, speedMs)
    }, startDelayMs)

    return () => {
      clearTimeout(timeoutId)
      if (intervalId) clearInterval(intervalId)
    }
  }, [text, speedMs, startDelayMs])

  const done = count >= text.length

  return (
    <Tag className={`${className} ${done ? 'type-glow' : ''}`} key={text}>
      {text.slice(0, count)}
      {!done && <span className="typewriter-cursor" aria-hidden="true" />}
    </Tag>
  )
}

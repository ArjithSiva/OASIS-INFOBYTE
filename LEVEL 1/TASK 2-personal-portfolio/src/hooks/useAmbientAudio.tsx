import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'

// Placeholder ambient loop — swap public/audio/ambient.mp3 for your own track
// whenever you like; the path and looping behavior here won't need to change.
const AUDIO_SRC = `${import.meta.env.BASE_URL}audio/ambient.mp3`

interface AmbientAudioContextValue {
  enabled: boolean
  volume: number
  toggle: () => void
  setVolume: (v: number) => void
}

const AmbientAudioContext = createContext<AmbientAudioContextValue | null>(null)

// Single shared <audio> element lives here — Sidebar (desktop) and MobileNav
// each render their own mute button + WakeSlider, but both control the same
// track through this context rather than creating a duplicate <audio> each
// (which would otherwise play two overlapping copies at once).
export function AudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [enabled, setEnabled] = useState(false)
  const [volume, setVolume] = useState(0.3)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = volume
    if (enabled) {
      audio.play().catch(() => {
        // Browser blocked autoplay-with-sound; require another explicit tap.
        setEnabled(false)
      })
    } else {
      audio.pause()
    }
  }, [enabled, volume])

  return (
    <AmbientAudioContext.Provider
      value={{
        enabled,
        volume,
        toggle: () => setEnabled((v) => !v),
        // Dragging the slider is itself a real user gesture — treat it as
        // "I want to hear this" rather than requiring a separate explicit
        // unmute tap first.
        setVolume: (v: number) => {
          setVolume(v)
          setEnabled(true)
        },
      }}
    >
      <audio ref={audioRef} src={AUDIO_SRC} loop preload="none" />
      {children}
    </AmbientAudioContext.Provider>
  )
}

export function useAmbientAudio() {
  const ctx = useContext(AmbientAudioContext)
  if (!ctx) throw new Error('useAmbientAudio must be used within an AudioProvider')
  return ctx
}

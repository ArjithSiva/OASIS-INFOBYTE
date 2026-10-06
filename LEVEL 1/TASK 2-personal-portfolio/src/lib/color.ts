import type { Mode } from '../hooks/useTheme'

// A few library components (MagicBento's particle/glow effects) bake their
// accent color into inline styles via `rgba(${rgb}, alpha)` JS templates
// rather than a live CSS var() reference, so they can't just be handed
// `var(--color-accent-3)` — they need the actual numbers, resolved for
// whichever theme is active right now. Kept in sync with the accent-3
// tokens in src/index.css by hand since these have to be literal numbers.
const ACCENT_3_RGB: Record<Mode, string> = {
  shadow: '168, 85, 247', // #a855f7
  system: '34, 195, 255', // #22c3ff
}

export function accentRgb(mode: Mode): string {
  return ACCENT_3_RGB[mode]
}

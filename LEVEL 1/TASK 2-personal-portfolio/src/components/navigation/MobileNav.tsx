import { sections, guildSection } from '../../data/sections'
import { hunterNetworkQuickLinks } from '../../data/hunterNetwork'
import { useTheme } from '../../hooks/useTheme'
import { useAmbientAudio } from '../../hooks/useAmbientAudio'
import { ThemeToggle } from '../ui/ThemeToggle'
import WakeSlider from '../audio/WakeSlider'
import { Volume2, VolumeX } from 'lucide-react'
import StaggeredMenu from './StaggeredMenu'

// Mobile-only nav (desktop keeps the Sidebar/LineSidebar). Colors are
// passed in explicitly per theme rather than as CSS custom properties,
// since StaggeredMenu drives some of them through GSAP color tweens,
// which need a literal parseable color string rather than a var()
// reference.
const THEME_COLORS = {
  shadow: {
    layers: ['#1c0a35', '#7c3aed'],
    accent: '#a855f7',
    button: '#f3ecff',
    buttonOpen: '#a855f7',
  },
  system: {
    layers: ['#bfe3f7', '#0ea5ec'],
    accent: '#0ea5ec',
    button: '#0a2f6b',
    buttonOpen: '#0ea5ec',
  },
} as const

export function MobileNav() {
  const { mode } = useTheme()
  const theme = THEME_COLORS[mode]
  const audio = useAmbientAudio()

  const items = [...sections, guildSection].map((section) => ({
    label: section.label,
    ariaLabel: `Go to ${section.label}`,
    link: `#${section.id}`,
  }))

  const socialItems = hunterNetworkQuickLinks.map((contact) => ({
    label: contact.platform,
    link: contact.href,
  }))

  return (
    <div className="lg:hidden h-16">
      <StaggeredMenu
        isFixed
        position="right"
        items={items}
        socialItems={socialItems}
        displaySocials
        displayItemNumbering
        colors={[...theme.layers]}
        accentColor={theme.accent}
        menuButtonColor={theme.button}
        openMenuButtonColor={theme.buttonOpen}
        changeMenuColorOnOpen
        footer={
          <div className="flex flex-col gap-4 w-full">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={audio.toggle}
                aria-pressed={audio.enabled}
                aria-label={audio.enabled ? 'Mute background audio' : 'Play background audio'}
                className="flex h-8 w-8 shrink-0 items-center justify-center transition-colors"
                style={{ color: theme.accent }}
              >
                {audio.enabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
              <WakeSlider
                value={Math.round(audio.volume * 100)}
                onChange={(v) => audio.setVolume(v / 100)}
                height={28}
                bars={30}
                gap={2}
                fillColor={theme.accent}
                trackColor={theme.layers[0]}
                ariaLabel="Ambient audio volume"
              />
            </div>
            <ThemeToggle />
          </div>
        }
      />
    </div>
  )
}

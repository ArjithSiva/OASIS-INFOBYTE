import { sections, guildSection } from '../../data/sections'
import { hunterNetworkQuickLinks } from '../../data/hunterNetwork'
import { useActiveSection } from '../../hooks/useActiveSection'
import { useAmbientAudio } from '../../hooks/useAmbientAudio'
import { ThemeToggle } from '../ui/ThemeToggle'
import WakeSlider from '../audio/WakeSlider'
import { Volume2, VolumeX } from 'lucide-react'
import LineSidebar from '../LineSidebar'

const allSections = [...sections, guildSection]
const allIds = allSections.map((s) => s.id)

export function Sidebar() {
  const active = useActiveSection(allIds)
  const audio = useAmbientAudio()

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <nav
      aria-label="Section navigation"
      className="hidden lg:flex fixed left-0 top-0 h-screen w-64 flex-col justify-between px-8 py-10 z-40"
    >
      <div>
        <button
          onClick={() => scrollTo('awakening')}
          className="font-display text-lg font-bold tracking-widest text-ink hover:text-accent-3 transition-colors"
        >
          ARJITH A
        </button>

        <div className="mt-16">
          <LineSidebar
            items={allSections.map((s) => s.label)}
            defaultActive={Math.max(0, allSections.findIndex((s) => s.id === active))}
            onItemClick={(index: number) => scrollTo(allSections[index].id)}
            accentColor="var(--color-accent-3)"
            textColor="var(--color-ink-faint)"
            markerColor="var(--color-line-strong)"
            itemGap={24}
            fontSize={0.7}
            className="font-mono tracking-[0.18em] uppercase"
          />
        </div>
      </div>

      <div>
        {/* Volume lives here now, above the theme toggle — the floating
            AudioPlayer widget is gone. */}
        <div className="flex items-center gap-3 mb-6">
          <button
            type="button"
            onClick={audio.toggle}
            aria-pressed={audio.enabled}
            aria-label={audio.enabled ? 'Mute background audio' : 'Play background audio'}
            className="flex h-8 w-8 shrink-0 items-center justify-center text-ink-faint hover:text-accent-3 transition-colors"
          >
            {audio.enabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
          </button>
          <WakeSlider
            value={Math.round(audio.volume * 100)}
            onChange={(v) => audio.setVolume(v / 100)}
            height={28}
            bars={20}
            gap={3}
            fillColor="var(--color-accent-3)"
            trackColor="var(--color-line-strong)"
            ariaLabel="Ambient audio volume"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4 mb-8">
          {hunterNetworkQuickLinks.map((contact) => (
            <a
              key={contact.platform}
              href={contact.href}
              target={contact.href.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
              aria-label={contact.platform}
              title={contact.platform}
              className="text-ink-faint hover:text-accent-3 transition-colors"
            >
              <contact.icon size={16} />
            </a>
          ))}
        </div>
        <ThemeToggle compact />
      </div>
    </nav>
  )
}

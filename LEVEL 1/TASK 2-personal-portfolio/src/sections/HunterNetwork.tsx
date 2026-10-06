import { SectionHeading } from '../components/ui/SectionHeading'
import { SpotlightCard } from '../components/ui/SpotlightCard'
import { hunterNetwork } from '../data/hunterNetwork'
import { useTheme } from '../hooks/useTheme'
import { accentRgb } from '../lib/color'

export function HunterNetwork() {
  const { mode } = useTheme()

  return (
    <section id="hunter-network" className="relative px-6 py-28 md:py-36">
      <div className="max-w-5xl mx-auto">
        <SectionHeading index="09" eyebrow="Hunter Frequencies" title="Hunter Network" />
        <p className="mt-6 text-ink-muted max-w-xl">Every channel this account transmits on.</p>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {hunterNetwork.map((contact, i) => (
            <SpotlightCard
              key={contact.platform}
              href={contact.href}
              target={contact.href.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
              spotlightColor={`rgba(${accentRgb(mode)}, 0.35)`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <contact.icon size={20} className="text-accent-3 shrink-0" />
              <div className="min-w-0">
                <p className="font-display font-bold text-ink truncate">{contact.hunterName}</p>
                <p className="font-mono text-[0.62rem] tracking-[0.18em] uppercase text-ink-faint">{contact.platform}</p>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  )
}

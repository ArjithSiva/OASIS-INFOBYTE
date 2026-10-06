import { SectionHeading } from '../components/ui/SectionHeading'
import LogoLoop from '../components/logos/LogoLoop'
import { gearLogos } from '../data/tools'

export function Gear() {
  return (
    <section id="gear" className="relative py-28 md:py-36 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6">
        <SectionHeading index="04" eyebrow="Hunter Gear" title="Skill Runes" />
        <p className="mt-6 text-ink-muted max-w-xl">
          Frameworks, software, and tools — the gear loadout behind the languages in the Skill Tree.
        </p>
      </div>
      <div className="mt-14 lg:pl-10">
        <LogoLoop logos={gearLogos} speed={70} logoHeight={30} gap={56} fadeOut fadeOutColor="var(--color-void)" scaleOnHover ariaLabel="Frameworks, software, and tools" />
      </div>
    </section>
  )
}

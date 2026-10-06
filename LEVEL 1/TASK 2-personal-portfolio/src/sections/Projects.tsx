import { SectionHeading } from '../components/ui/SectionHeading'
import { ProjectSlider } from '../components/projects/ProjectSlider'

export function Projects() {
  return (
    <section id="quests" className="relative px-6 py-28 md:py-36">
      <div className="max-w-4xl mx-auto">
        <SectionHeading index="05" eyebrow="Gate Raid" title="Quests" />
        <p className="mt-6 text-ink-muted max-w-xl">
          Drag, or use the arrows — six shipped or in-progress projects, most of them running for
          real clients and organizations rather than sitting in a repo.
        </p>
        <div className="mt-14">
          <ProjectSlider />
        </div>
      </div>
    </section>
  )
}

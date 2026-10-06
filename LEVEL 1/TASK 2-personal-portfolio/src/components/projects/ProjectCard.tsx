import type { Project } from '../../data/projects'
import { TechTag } from '../ui/TechTag'
import { Button } from '../ui/Button'
import { TypewriterText } from '../ui/TypewriterText'

// Pure content — no panel/frame of its own. ProjectSlider renders one
// persistent SystemPanel and swaps this in and out as its content, so the
// outer "quest board" frame never moves when the project changes.
export function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="flex flex-col h-full">
      {project.featured && (
        <span className="eyebrow mb-4 inline-flex w-fit items-center gap-2 border border-line-strong px-2.5 py-1 rounded-sm">
          Featured Quest
        </span>
      )}

      <TypewriterText
        as="p"
        text={project.tagline}
        className="font-mono text-xs tracking-widest uppercase text-accent-3 mb-2"
        speedMs={10}
      />
      <TypewriterText
        as="h3"
        text={project.title}
        className="font-display text-2xl md:text-3xl font-bold text-ink mb-4"
        speedMs={22}
        startDelayMs={project.tagline.length * 10 + 80}
      />

      <p className="text-ink-muted leading-relaxed text-sm md:text-base mb-6 max-w-2xl">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {project.stack.map((tech) => (
          <TechTag key={tech}>{tech}</TechTag>
        ))}
      </div>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-line">
        <span className="font-mono text-xs text-ink-faint">{project.status}</span>
        <div className="flex gap-3">
          {project.liveUrl && (
            <Button href={project.liveUrl} target="_blank" rel="noreferrer" variant="secondary">
              Live Site
            </Button>
          )}
          {project.sourceUrl && (
            <Button href={project.sourceUrl} target="_blank" rel="noreferrer" variant="ghost">
              Source
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, type PanInfo } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { projects } from '../../data/projects'
import { ProjectCard } from './ProjectCard'
import { SystemPanel } from '../ui/SystemPanel'

// The "quest board": one persistent SystemPanel (the outer frame never
// moves or remounts when paging between projects) with the inner content
// swapping via a fast fade-out → typewriter fade-in, rather than the old
// physically-sliding carousel. A swipe still works — it rubber-bands and
// snaps back to the same spot (dragSnapToOrigin) instead of carrying the
// card away, so the frame genuinely stays put either way.
// The "quest board": one persistent SystemPanel (the outer frame never
// moves or remounts when paging between projects) with the inner content
// swapping via a fast fade-out → typewriter fade-in, rather than the old
// physically-sliding carousel. A swipe still works — it rubber-bands and
// snaps back to the same spot (dragSnapToOrigin) instead of carrying the
// card away, so the frame genuinely stays put either way.
//
// Height is fixed to whichever quest has the most content, so paging never
// resizes the box: every project is rendered once, stacked in the same
// grid cell (invisible, `visibility:hidden` so it still takes up layout
// space) — CSS Grid sizes that row to the tallest child automatically.
// The actual visible/interactive/animated content sits absolutely
// positioned on top, filling whatever height that established.
export function ProjectSlider() {
  const [index, setIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const project = projects[index]

  const goTo = (next: number) => {
    setIndex(Math.max(0, Math.min(projects.length - 1, next)))
  }

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const threshold = 70
    if (info.offset.x < -threshold) goTo(index + 1)
    else if (info.offset.x > threshold) goTo(index - 1)
  }

  // Auto-advance every ~20s, looping back to the first quest after the
  // last. Paused on hover so it doesn't yank the card away mid-read, and
  // skipped entirely for prefers-reduced-motion. Re-running this effect
  // whenever `index` changes (manual nav included) restarts the 20s
  // window from scratch, so a manual click doesn't get cut short by an
  // advance that was already half-elapsed.
  useEffect(() => {
    if (projects.length <= 1 || isPaused) return
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % projects.length)
    }, 20000)
    return () => window.clearInterval(id)
  }, [index, isPaused])

  return (
    <div onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
      <SystemPanel className="p-8 md:p-10">
        <div className="relative">
          {/* Sizing stack — invisible, establishes the fixed height */}
          <div className="grid" aria-hidden="true">
            {projects.map((p) => (
              <div key={p.id} className="invisible" style={{ gridArea: '1 / 1' }}>
                <ProjectCard project={p} />
              </div>
            ))}
          </div>

          {/* Visible, interactive, animated content */}
          <div className="absolute inset-0">
            <motion.div
              drag={projects.length > 1 ? 'x' : false}
              dragElastic={0.15}
              dragConstraints={{ left: 0, right: 0 }}
              dragSnapToOrigin
              onDragEnd={handleDragEnd}
              className="h-full cursor-grab active:cursor-grabbing"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="h-full"
                >
                  <ProjectCard project={project} />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </SystemPanel>

      <div className="mt-8 flex items-center justify-between">
        <div className="flex gap-3">
          <button
            onClick={() => goTo(index - 1)}
            disabled={index === 0}
            aria-label="Previous quest"
            className="h-10 w-10 flex items-center justify-center border border-line-strong text-ink disabled:opacity-30 hover:border-accent hover:text-accent-3 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => goTo(index + 1)}
            disabled={index === projects.length - 1}
            aria-label="Next quest"
            className="h-10 w-10 flex items-center justify-center border border-line-strong text-ink disabled:opacity-30 hover:border-accent hover:text-accent-3 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <span className="font-mono text-xs tracking-widest text-ink-faint">
          {String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
        </span>
      </div>

      <div className="mt-5 flex gap-1.5" role="tablist" aria-label="Select quest">
        {projects.map((p, i) => (
          <button
            key={p.id}
            role="tab"
            aria-selected={i === index}
            aria-label={`Show project ${p.title}`}
            onClick={() => goTo(i)}
            className={`h-1 rounded-full transition-all duration-300 ${
              i === index ? 'w-8 bg-accent-3' : 'w-3 bg-line hover:bg-line-strong'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

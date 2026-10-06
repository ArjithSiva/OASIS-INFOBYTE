import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { SectionHeading } from '../components/ui/SectionHeading'
import { Button } from '../components/ui/Button'
import { SystemPanel } from '../components/ui/SystemPanel'
import { experience, education, certifications, achievements } from '../data/experience'
import { OPEN_RESUME_VIEWER_EVENT, RESUME_VIEWER_STATE_EVENT } from '../lib/events'

const RESUME_PATH = `${import.meta.env.BASE_URL}resume.pdf`

export function Resume() {
  const [viewerOpen, setViewerOpen] = useState(false)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const openButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onOpenRequest = () => setViewerOpen(true)
    window.addEventListener(OPEN_RESUME_VIEWER_EVENT, onOpenRequest)
    return () => window.removeEventListener(OPEN_RESUME_VIEWER_EVENT, onOpenRequest)
  }, [])

  useEffect(() => {
    window.dispatchEvent(new CustomEvent(RESUME_VIEWER_STATE_EVENT, { detail: viewerOpen }))
    if (!viewerOpen) return
    const trigger = openButtonRef.current
    closeButtonRef.current?.focus({ preventScroll: true })
    document.body.style.overflow = 'hidden'

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setViewerOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
      // Stay exactly where the viewer was opened from (e.g. Awakening's
      // "View Resume") — don't jump the page to Record on close.
      trigger?.focus({ preventScroll: true })
    }
  }, [viewerOpen])
  return (
    <>
    <section id="record" className="relative px-6 py-28 md:py-36">
      <div className="max-w-4xl mx-auto">
        <SectionHeading index="08" eyebrow="Hunter Record" title="Record" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mt-14 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 pb-8 border-b border-line-strong"
        >
          <div>
            <h3 className="font-display text-2xl md:text-3xl font-normal uppercase tracking-wide text-ink">Arjith A</h3>
            <p className="font-mono text-xs tracking-[0.18em] uppercase text-accent-3 mt-2">
              Full Stack Developer
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button ref={openButtonRef} onClick={() => setViewerOpen(true)} variant="secondary" icon={false}>
              View Resume
            </Button>
            <Button href={RESUME_PATH} download="Arjith-A-Resume.pdf">
              Download Resume
            </Button>
          </div>
        </motion.div>

        <div className="mt-12 grid md:grid-cols-2 gap-x-12 gap-y-12">
          <RecordBlock title="Experience">
            {experience.map((role) => (
              <div key={role.org} className="mb-6 last:mb-0">
                <p className="font-mono text-[0.65rem] tracking-widest uppercase text-ink-faint">
                  {role.period}
                </p>
                <p className="text-ink font-semibold mt-1">{role.role}</p>
                <p className="text-accent-3 text-sm">{role.org}</p>
                <ul className="mt-3 space-y-2">
                  {role.points.map((point) => (
                    <li key={point} className="text-ink-muted text-sm leading-relaxed pl-4 relative">
                      <span className="absolute left-0 top-2 h-1 w-1 rounded-full bg-accent" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </RecordBlock>

          <RecordBlock title="Education">
            <p className="text-ink font-semibold">{education.degree}</p>
            <p className="text-accent-3 text-sm mt-1">{education.school}</p>
            <p className="text-ink-muted text-sm mt-2">{education.detail}</p>
          </RecordBlock>

          <RecordBlock title="Certifications">
            <ul className="space-y-2">
              {certifications.map((cert) => (
                <li key={cert} className="text-ink-muted text-sm pl-4 relative">
                  <span className="absolute left-0 top-2 h-1 w-1 rounded-full bg-accent" />
                  {cert}
                </li>
              ))}
            </ul>
          </RecordBlock>

          <RecordBlock title="Achievements">
            <ul className="space-y-2">
              {achievements.map((item) => (
                <li key={item} className="text-ink-muted text-sm leading-relaxed pl-4 relative">
                  <span className="absolute left-0 top-2 h-1 w-1 rounded-full bg-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </RecordBlock>
        </div>
      </div>
    </section>

    <AnimatePresence>
      {viewerOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-label="Resume preview"
          className="fixed inset-0 z-50 flex items-center justify-center bg-void/80 backdrop-blur-sm p-4 sm:p-8"
          onClick={(e) => {
            if (e.target === e.currentTarget) setViewerOpen(false)
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-3xl h-[85vh]"
          >
            <SystemPanel className="flex flex-col overflow-hidden" fullHeight>
              <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-line shrink-0">
                <p className="font-mono text-xs tracking-[0.18em] uppercase text-ink-faint">Resume Preview</p>
                <div className="flex items-center gap-3">
                  <Button href={RESUME_PATH} download="Arjith-A-Resume.pdf" variant="ghost" icon={false}>
                    Download
                  </Button>
                  <button
                    ref={closeButtonRef}
                    onClick={() => setViewerOpen(false)}
                    aria-label="Close resume preview"
                    className="p-2 text-ink-faint hover:text-accent-3 transition-colors focus-visible:outline-2"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
              <iframe src={RESUME_PATH} title="Arjith A's resume" className="flex-1 w-full bg-surface" />
            </SystemPanel>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  )
}

function RecordBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5 }}
    >
      <h4 className="font-mono text-xs tracking-[0.22em] uppercase text-ink-faint pb-3 border-b border-line mb-5">
        {title}
      </h4>
      {children}
    </motion.div>
  )
}

import { motion } from 'framer-motion'
import { Button } from '../components/ui/Button'
import TextType from '../components/TextType'
import StrokeText from '../components/effects/StrokeText'
import { useTheme } from '../hooks/useTheme'
import { OPEN_RESUME_VIEWER_EVENT } from '../lib/events'

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.16, delayChildren: 0.1 },
  },
} as const

const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
} as const

export function Hero() {
  const { mode } = useTheme()
  const strokeColors =
    mode === 'shadow' ? { stroke: '#a855f7', fill: '#f3ecff' } : { stroke: '#0892d0', fill: '#0a1f3d' }

  const openResume = () => {
    window.dispatchEvent(new CustomEvent(OPEN_RESUME_VIEWER_EVENT))
  }

  return (
    <section
      id="awakening"
      className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden"
    >
      <motion.div variants={container} initial="hidden" animate="show" className="max-w-3xl">
        <motion.div variants={item} className="mb-8 inline-flex items-center gap-3 border border-line-strong px-4 py-2">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-3 animate-pulse-slow" />
          <span className="eyebrow">System Initialized</span>
        </motion.div>

        <motion.div variants={item} className="w-full max-w-[90vw] sm:max-w-xl md:max-w-2xl mx-auto">
          <StrokeText
            key={mode}
            text="ARJITH A"
            strokeColor={strokeColors.stroke}
            fillColor={strokeColors.fill}
            strokeWidth={1.4}
            drawDuration={1.1}
            fillDelay={0.1}
            stagger={0.06}
            fontSize={100}
            fontFamily="'Cinzel', serif"
            fontWeight={400}
            letterSpacing={-1}
            trigger="mount"
            fillMode="wipe"
            hideStrokeAfterFill
          />
        </motion.div>

        <motion.div
          variants={item}
          className="font-mono mt-4 text-sm sm:text-base tracking-[0.3em] uppercase text-accent-3 h-6 flex justify-center"
        >
          <TextType
            text={["Full Stack Developer", "Software Engineer", "Problem Solver"]}
            typingSpeed={75}
            pauseDuration={1500}
            showCursor={true}
            cursorCharacter="|"
          />
        </motion.div>

        <motion.p variants={item} className="mt-6 text-ink-muted text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
          I build the software behind real businesses — clinic billing systems, temple databases,
          and the odd wearable — and turn ideas into things people actually use.
        </motion.p>

        <motion.div variants={item} className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button onClick={openResume}>View Resume</Button>
          <Button
            href="https://github.com/ArjithSiva"
            target="_blank"
            rel="noreferrer"
            variant="secondary"
          >
            GitHub
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-ink-faint"
      >
        <span className="font-mono text-[0.65rem] tracking-[0.2em] uppercase">Scroll</span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          className="h-6 w-px bg-line-strong"
        />
      </motion.div>
    </section>
  )
}

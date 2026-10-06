import { motion } from 'framer-motion'

interface SectionHeadingProps {
  index: string
  eyebrow: string
  title: string
  align?: 'left' | 'center'
}

export function SectionHeading({ index, eyebrow, title, align = 'left' }: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={align === 'center' ? 'text-center' : 'text-left'}
    >
      <p className="eyebrow flex items-center gap-3" style={{ justifyContent: align === 'center' ? 'center' : 'flex-start' }}>
        <span className="text-ink-faint">{index}</span>
        <span className="h-px w-8 bg-line-strong" />
        <span>{eyebrow}</span>
      </p>
      <h2 className="font-display mt-3 text-3xl sm:text-4xl md:text-5xl font-normal uppercase tracking-wide text-ink">
        {title}
      </h2>
    </motion.div>
  )
}

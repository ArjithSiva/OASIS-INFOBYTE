import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { SystemPanel } from './SystemPanel'

interface SystemToastProps {
  message: string
  open: boolean
  onClose: () => void
  /** Auto-dismiss after this many ms. Set 0 to disable. */
  duration?: number
}

export function SystemToast({ message, open, onClose, duration = 6000 }: SystemToastProps) {
  useEffect(() => {
    if (!open || duration <= 0) return
    const id = window.setTimeout(onClose, duration)
    return () => window.clearTimeout(id)
  }, [open, duration, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -24, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -16, x: '-50%' }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="fixed top-6 left-1/2 z-[300] w-[min(92vw,26rem)]"
          role="status"
          aria-live="polite"
        >
          <SystemPanel size="sm" className="relative p-4 pr-10">
            <p className="font-mono text-xs leading-relaxed text-ink">
              <span className="text-accent-3">[NOTIFICATION:</span> {message}
              <span className="text-accent-3">]</span>
            </p>
            <button
              type="button"
              onClick={onClose}
              aria-label="Dismiss notification"
              className="absolute top-3 right-3 text-ink-faint hover:text-accent-3 transition-colors"
            >
              <X size={14} />
            </button>
          </SystemPanel>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

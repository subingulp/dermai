// Bottom-sheet modal. It renders inside the phone frame (via a portal) and
// closes with Escape or a tap on the dimmed background.

import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { usePortalHost } from '../state/PortalContext'
import { ease } from './motionPresets'

export default function Modal({ open, onClose, labelledBy, children }) {
  const host = usePortalHost()

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!host) return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            className="modal__sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            initial={{ y: 48, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1, transition: { duration: 0.32, ease } }}
            exit={{ y: 32, opacity: 0, transition: { duration: 0.18 } }}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    host,
  )
}

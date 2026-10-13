import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { useDeviceRoot } from '../layout/DeviceContext';

/** Dialog that stays inside the phone frame. Esc or a tap on the dimmed area closes it. */
export default function Modal({ open, onClose, labelledBy, children }) {
  const root = useDeviceRoot();
  const sheet = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', onKey);
    const t = setTimeout(() => sheet.current?.querySelector('button')?.focus(), 60);
    return () => {
      window.removeEventListener('keydown', onKey);
      clearTimeout(t);
    };
  }, [open, onClose]);

  if (!root) return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div className="modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
          <div className="modal__scrim" onClick={onClose} />
          <motion.div
            ref={sheet}
            className="modal__sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            initial={{ y: 40, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.98, transition: { duration: 0.16 } }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    root,
  );
}

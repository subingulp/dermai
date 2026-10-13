import { motion } from 'motion/react';

const STAR = 'M12 2 C12 9 15 12 22 12 C15 12 12 15 12 22 C12 15 9 12 2 12 C9 12 12 9 12 2 Z';

/** Four-point star outline. `tone` picks the stroke colour from the design. */
export function Star({ size = 24, tone = 'navy', className = '', style }) {
  const stroke = tone === 'yellow' ? '#f8de88' : '#172b53';
  return (
    <svg className={className} style={style} width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d={STAR} stroke={stroke} strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

/** Large star with two small dots — the yellow "sparkles" cluster in the illustrations. */
export function SparkleCluster({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" fill="none" aria-hidden="true">
      <path
        d="M15 4 C15 12 18 15 26 15 C18 15 15 18 15 26 C15 18 12 15 4 15 C12 15 15 12 15 4 Z"
        stroke="#f8de88"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="5" cy="6" r="1.5" fill="#f8de88" />
      <circle cx="26" cy="5" r="1.2" fill="#f8de88" />
    </svg>
  );
}

/** Gentle twinkle. `reduce` turns the animation off. */
export function Twinkle({ children, reduce, delay = 0, style }) {
  return (
    <motion.div
      style={style}
      animate={reduce ? undefined : { scale: [1, 1.18, 1], opacity: [1, 0.65, 1], rotate: [0, 8, 0] }}
      transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      {children}
    </motion.div>
  );
}

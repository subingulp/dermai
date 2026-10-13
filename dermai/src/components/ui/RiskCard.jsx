import { motion } from 'motion/react';
import { riseIn } from '../../animations';

export default function RiskCard({ risk, onView, actionLabel = 'View Analysis →', footer }) {
  return (
    <motion.section className="risk" variants={riseIn} aria-label="AI Risk Assessment">
      <h3>✦ AI Risk Assessment</h3>
      <p>{risk.headline}</p>
      {footer && <small>{footer}</small>}
      {onView && (
        <button type="button" className="risk__link" onClick={onView}>
          {actionLabel}
        </button>
      )}
    </motion.section>
  );
}

import { FlaskConical } from 'lucide-react';
import { motion } from 'motion/react';
import { compareAround } from '../../utils/analysis';
import { fmtShort } from '../../utils/dates';
import { riseIn } from '../../animations';

/** One skincare event plus how skin measurements looked before and after. Never claims cause. */
export default function RoutineCompareCard({ routine, records, action }) {
  const cmp = compareAround(records, routine.date);
  return (
    <motion.article className="routine" variants={riseIn} layout>
      <div className="routine__head">
        <span className="routine__icon">
          <FlaskConical size={20} strokeWidth={2} aria-hidden="true" />
        </span>
        <div>
          <small>{fmtShort(routine.date)}</small>
          <h4>
            {routine.action} {routine.name}
          </h4>
        </div>
        {action}
      </div>

      {cmp ? (
        <>
          <div className="routine__compare">
            {cmp.top.map((c) => (
              <div key={c.key}>
                <small>{c.label}</small>
                <strong>
                  {c.from}% → {c.to}%
                </strong>
              </div>
            ))}
          </div>
          <p className="routine__text">Skin measurements changed after this routine was recorded.</p>
          <p className="routine__fine">
            Historical comparison · {fmtShort(cmp.before.date)} to {fmtShort(cmp.after.date)}. Changes do not establish cause.
          </p>
        </>
      ) : (
        <p className="routine__text">
          Not enough photos around {fmtShort(routine.date)} to compare yet. Add a photo after this date to see how your measurements looked.
        </p>
      )}
    </motion.article>
  );
}

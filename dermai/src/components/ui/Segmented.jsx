import { motion } from 'motion/react';

/** Pill-shaped selector (7D / 1M / 3M / 6M). The navy pill slides between options. */
export default function Segmented({ options, value, onChange, id = 'seg', label }) {
  return (
    <div className="seg" role="tablist" aria-label={label}>
      {options.map((o) => {
        const active = o.key === value;
        return (
          <button
            key={o.key}
            type="button"
            role="tab"
            aria-selected={active}
            className={`seg__btn${active ? ' is-active' : ''}`}
            onClick={() => onChange(o.key)}
          >
            {active && <motion.span layoutId={`${id}-pill`} className="seg__pill" transition={{ type: 'spring', stiffness: 500, damping: 36 }} />}
            <span className="seg__label">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}

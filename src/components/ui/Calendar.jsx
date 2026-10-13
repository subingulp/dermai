import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { fmtMonth, fromISO, todayISO, toISO } from '../../utils/dates';

const WEEKDAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

function buildWeeks(year, month) {
  const offset = (new Date(year, month, 1).getDay() + 6) % 7; // week starts on Monday
  const days = new Date(year, month + 1, 0).getDate();
  const cells = Array(offset).fill(null);
  for (let d = 1; d <= days; d++) cells.push(toISO(new Date(year, month, d)));
  while (cells.length % 7) cells.push(null);
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

/**
 * Month header + date picker. By default it shows the selected week and the days after it
 * (like the Figma design); "Show earlier days" reveals the rest of the month.
 */
export default function Calendar({ selected, onSelect, recordDates }) {
  const today = todayISO();
  const sel = fromISO(selected);
  const now = fromISO(today);
  const [cursor, setCursor] = useState({ y: sel.getFullYear(), m: sel.getMonth() });
  const [expanded, setExpanded] = useState(false);

  const weeks = useMemo(() => buildWeeks(cursor.y, cursor.m), [cursor]);
  const selIdx = weeks.findIndex((w) => w.includes(selected));
  const startIdx = expanded || selIdx < 0 ? 0 : selIdx;
  const hidden = !expanded && selIdx > 0;
  const visible = weeks.slice(startIdx);

  const isCurrentMonth = cursor.y === now.getFullYear() && cursor.m === now.getMonth();
  const monthsBack = (now.getFullYear() - cursor.y) * 12 + (now.getMonth() - cursor.m);

  const move = (delta) => {
    setExpanded(false);
    setCursor(({ y, m }) => {
      const d = new Date(y, m + delta, 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    });
  };

  return (
    <div className="cal">
      <div className="cal__month">
        <p aria-live="polite">{fmtMonth(cursor.y, cursor.m)}</p>
        <div className="cal__nav">
          <button type="button" aria-label="Previous month" disabled={monthsBack >= 12} onClick={() => move(-1)}>
            <ChevronLeft size={18} />
          </button>
          <button type="button" aria-label="Next month" disabled={isCurrentMonth} onClick={() => move(1)}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="cal__card">
        <div className="cal__row cal__row--labels" aria-hidden="true">
          {WEEKDAYS.map((w) => (
            <span key={w}>{w}</span>
          ))}
        </div>
        <AnimatePresence initial={false}>
          {visible.map((week, wi) => (
            <motion.div
              key={`${cursor.y}-${cursor.m}-${startIdx + wi}`}
              className="cal__row"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 38 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22 }}
            >
              {week.map((iso, di) => {
                if (!iso) return <span key={di} />;
                const isSel = iso === selected;
                const future = iso > today;
                const has = recordDates.has(iso);
                const day = Number(iso.slice(-2));
                return (
                  <button
                    key={iso}
                    type="button"
                    className={`cal__day${isSel ? ' is-selected' : ''}${iso === today ? ' is-today' : ''}`}
                    disabled={future}
                    aria-pressed={isSel}
                    aria-label={`${fromISO(iso).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}${has ? ', has a photo' : ''}`}
                    onClick={() => onSelect(iso)}
                  >
                    {isSel && (
                      <motion.span layoutId="cal-selected" className="cal__sel" transition={{ type: 'spring', stiffness: 520, damping: 34 }} />
                    )}
                    <span className="cal__num">{day}</span>
                    {isSel ? <i className="cal__accent" /> : has ? <i className="cal__dot" /> : null}
                  </button>
                );
              })}
            </motion.div>
          ))}
        </AnimatePresence>
        {(hidden || (expanded && selIdx > 0)) && (
          <button type="button" className="cal__more" onClick={() => setExpanded((e) => !e)} aria-expanded={expanded}>
            {expanded ? 'Show less' : 'Show earlier days'}
            <ChevronDown size={14} style={{ transform: expanded ? 'rotate(180deg)' : 'none' }} />
          </button>
        )}
      </div>
    </div>
  );
}

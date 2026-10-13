// Two-row calendar from the design: the week of the viewed date plus the next
// week. Days after the demo "today" are greyed out and can't be selected.
// Days that already have a photo get a small dot.

import { motion } from 'motion/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { DEMO_TODAY } from '../data/mock'
import { addDays, dayOfMonth, formatMonthYear, mondayOf, sameMonth } from '../utils/date'

const DOW = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']

function Day({ iso, selected, marked, future, small, onSelect }) {
  const cls = ['calendar__day', selected && 'calendar__day--selected', future && 'calendar__day--future', small && 'calendar__day--small']
    .filter(Boolean)
    .join(' ')
  return (
    <button
      type="button"
      className={cls}
      disabled={future}
      aria-pressed={selected}
      aria-label={`${iso}${marked ? ', has a photo' : ''}`}
      onClick={() => onSelect(iso)}
    >
      {selected && (
        <motion.span
          layoutId="calendar-selected"
          className="calendar__sel"
          transition={{ type: 'spring', stiffness: 460, damping: 34 }}
        />
      )}
      <span className="calendar__num">{dayOfMonth(iso)}</span>
      {marked && <span className="calendar__dot" />}
    </button>
  )
}

export default function Calendar({ selected, viewDate, onViewDate, onSelect, markedDates }) {
  const monday = mondayOf(viewDate)
  const week = Array.from({ length: 7 }, (_, i) => addDays(monday, i))
  const nextMonday = addDays(monday, 7)
  const next = Array.from({ length: 7 }, (_, i) => addDays(nextMonday, i))
  const isFuture = (iso) => iso > DEMO_TODAY
  const canGoNext = nextMonday <= DEMO_TODAY

  return (
    <div>
      <div className="calendar__month">
        <span>{formatMonthYear(addDays(monday, 3))}</span>
        <div className="calendar__arrows">
          <button type="button" className="calendar__arrow" aria-label="Previous week" onClick={() => onViewDate(addDays(monday, -7))}>
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            className="calendar__arrow"
            aria-label="Next week"
            disabled={!canGoNext}
            onClick={() => onViewDate(addDays(monday, 7))}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="calendar" style={{ marginTop: 8 }}>
        <div className="calendar__row">
          {week.map((iso, i) => (
            <div className="calendar__col" key={iso}>
              <span className="calendar__dow">{DOW[i]}</span>
              <Day
                iso={iso}
                selected={iso === selected}
                marked={markedDates.has(iso)}
                future={isFuture(iso)}
                onSelect={onSelect}
              />
            </div>
          ))}
        </div>
        <div className="calendar__row">
          {next.map((iso) =>
            sameMonth(iso, monday) ? (
              <Day
                key={iso}
                iso={iso}
                small
                selected={iso === selected}
                marked={markedDates.has(iso)}
                future={isFuture(iso)}
                onSelect={onSelect}
              />
            ) : (
              <span key={iso} />
            ),
          )}
        </div>
      </div>
    </div>
  )
}

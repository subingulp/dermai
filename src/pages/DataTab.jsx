import { useMemo, useState } from 'react'
import { LayoutGroup, motion } from 'motion/react'
import { FlaskConical, ImageOff } from 'lucide-react'
import { RoutineComparison, Timeline, TrendCard } from '../components/DataParts'
import { Badge, Button, EmptyState } from '../components/ui'
import { item, stagger } from '../components/motionPresets'
import { DEMO_TODAY, METRICS } from '../data/mock'
import { useApp } from '../state/AppContext'
import { formatShort } from '../utils/date'
import { RANGES, rangeStart } from '../utils/insights'

export default function DataTab({ nav }) {
  const { records, routines } = useApp()
  const [rangeId, setRangeId] = useState('1M')
  const [showAll, setShowAll] = useState(false)

  const range = RANGES.find((r) => r.id === rangeId)
  const start = rangeStart(range)

  const inRange = useMemo(() => records.filter((r) => r.date >= start), [records, start])
  const timeline = showAll ? inRange : inRange.slice(-4)
  const events = useMemo(
    () => routines.filter((r) => r.date >= start && r.date <= DEMO_TODAY).sort((a, b) => b.date.localeCompare(a.date)),
    [routines, start],
  )

  return (
    <div className="scroll">
      <motion.div className="pad stack-26" variants={stagger} initial="hidden" animate="show">
        <motion.header className="stack-8" variants={item}>
          <h1 className="h1" style={{ fontSize: 26 }}>
            My Skin Data
          </h1>
          <p className="small" style={{ fontSize: 13 }}>
            See how your skin changes over time ✦
          </p>
        </motion.header>

        <motion.div variants={item}>
          <LayoutGroup id="range">
            <div className="segmented" role="group" aria-label="Date range">
              {RANGES.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  className="segmented__btn"
                  aria-pressed={r.id === rangeId}
                  onClick={() => setRangeId(r.id)}
                >
                  {r.id === rangeId && (
                    <motion.span
                      layoutId="range-pill"
                      className="segmented__pill"
                      transition={{ type: 'spring', stiffness: 460, damping: 36 }}
                    />
                  )}
                  <span className="segmented__label">{r.label}</span>
                </button>
              ))}
            </div>
          </LayoutGroup>
        </motion.div>

        <section className="section" aria-label="Skin trends">
          <motion.div className="stack-8" variants={item}>
            <div className="row-between">
              <h2 className="h2">Skin Trends</h2>
              <Badge tone="pale">AI MEASURED</Badge>
            </div>
            <p className="tiny">
              {formatShort(start)}–{formatShort(DEMO_TODAY)}, {DEMO_TODAY.slice(0, 4)} · Illustrative measurements. pp =
              percentage points; changes are neutral observations.
            </p>
          </motion.div>
          <motion.div className="stack-16" variants={stagger} initial="hidden" animate="show" key={rangeId}>
            {METRICS.map((m) => (
              <TrendCard key={m.key} metric={m} records={records} range={range} />
            ))}
          </motion.div>
        </section>

        <section className="section" aria-label="Skin timeline">
          <motion.div className="row-between" variants={item}>
            <h2 className="h2">Skin Timeline</h2>
            {inRange.length > 4 && (
              <button type="button" className="link" onClick={() => setShowAll((v) => !v)}>
                {showAll ? 'Show less' : 'View all →'}
              </button>
            )}
          </motion.div>
          {timeline.length ? (
            <>
              <Timeline
                records={timeline}
                expanded={showAll}
                onOpen={(record) => nav.go('result', { record, saved: true })}
              />
              <p className="tiny">Tap a photo to explore that day&apos;s analysis.</p>
            </>
          ) : (
            <EmptyState icon={ImageOff} title="No photos in this period">
              Choose a longer range or take a new photo.
            </EmptyState>
          )}
        </section>

        <section className="section" aria-label="Skincare and skin changes">
          <motion.h2 className="h2" variants={item}>
            Skincare &amp; Skin Changes
          </motion.h2>
          {events.length ? (
            <motion.div className="stack-16" variants={stagger} initial="hidden" animate="show" key={`ev-${rangeId}`}>
              {events.map((r) => (
                <RoutineComparison key={r.id} routine={r} records={records} />
              ))}
            </motion.div>
          ) : (
            <motion.div variants={item}>
              <EmptyState
                icon={FlaskConical}
                title="No routine changes in this period"
                action={
                  <Button variant="secondary" size="sm" block={false} onClick={() => nav.go('routine')}>
                    Add a routine
                  </Button>
                }
              >
                Record a product or routine and DermAI will show how your measurements moved around that date.
              </EmptyState>
            </motion.div>
          )}
        </section>
      </motion.div>
    </div>
  )
}

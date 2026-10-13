import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { ScanFace } from 'lucide-react'
import Calendar from '../components/Calendar'
import { PhotoCard, RiskCard } from '../components/Cards'
import Illustration from '../components/Illustration'
import MetricsGrid from '../components/MetricCard'
import { Badge, Button, EmptyState } from '../components/ui'
import { item, stagger } from '../components/motionPresets'
import { DEMO_TODAY } from '../data/mock'
import { latestRecord, recordForDate, useApp } from '../state/AppContext'
import { formatShort, greeting } from '../utils/date'

export default function MainTab({ nav }) {
  const { records, selectedDate, dispatch } = useApp()
  const [viewDate, setViewDate] = useState(selectedDate)
  const marked = useMemo(() => new Set(records.map((r) => r.date)), [records])

  const record = recordForDate(records, selectedDate)
  const latest = latestRecord(records)
  const isToday = selectedDate === DEMO_TODAY
  const dayTitle = isToday ? "Today's Skin" : `${formatShort(selectedDate)} Skin`

  return (
    <div className="scroll">
      <motion.div className="pad stack-26" variants={stagger} initial="hidden" animate="show">
        <motion.div className="stack-16" variants={item}>
          <div className="row-between">
            <span className="brand" style={{ fontSize: 16 }}>
              DermAI
            </span>
            <Badge>YOUR DAILY MOMENT</Badge>
          </div>
          <h1 className="h1" style={{ fontSize: 29 }}>
            {greeting()} ♡
          </h1>
          <Calendar
            selected={selectedDate}
            viewDate={viewDate}
            onViewDate={setViewDate}
            onSelect={(date) => dispatch({ type: 'SELECT_DATE', date })}
            markedDates={marked}
          />
        </motion.div>

        <motion.section className="invite" variants={item} aria-label="Take a photo">
          <div className="invite__row">
            <div className="invite__copy">
              <h2 className="h1" style={{ fontSize: 24 }}>
                How&apos;s your skin today?
              </h2>
              <p className="small" style={{ fontSize: 13 }}>
                Take a photo to start your AI analysis.
              </p>
            </div>
            <Illustration variant="none" scale={0.37} />
          </div>
          <Button onClick={() => nav.go('capture')}>＋ Take a Photo</Button>
        </motion.section>

        <section className="section" aria-label={dayTitle}>
          <motion.div className="stack-8" variants={item}>
            <h2 className="h2">{dayTitle}</h2>
            <p className="small">AI-generated from your latest skin photo · demo values</p>
          </motion.div>
          {record ? (
            <MetricsGrid key={record.id} metrics={record.metrics} />
          ) : (
            <motion.div variants={item}>
              <EmptyState
                icon={ScanFace}
                title={`No photo on ${formatShort(selectedDate)}`}
                action={
                  <Button variant="secondary" size="sm" block={false} onClick={() => nav.go('capture')}>
                    Take a Photo
                  </Button>
                }
              >
                Pick a date with a dot, or add a photo for this day.
              </EmptyState>
            </motion.div>
          )}
        </section>

        {record && <RiskCard record={record} onOpen={() => nav.go('risk', { record })} />}

        {latest && (
          <section className="section" aria-label="Your latest photo">
            <motion.h2 className="h2" variants={item}>
              Your latest photo
            </motion.h2>
            <PhotoCard record={latest} onOpen={() => nav.go('result', { record: latest, saved: true })} />
          </section>
        )}
      </motion.div>
    </div>
  )
}

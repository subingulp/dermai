// Pieces of the Data tab: trend chart card, photo timeline, routine comparison.

import { useMemo } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ArrowUpRight, FlaskConical } from 'lucide-react'
import { DEMO_TODAY } from '../data/mock'
import { formatShort } from '../utils/date'
import { changeOverRange, compareRoutine, describeChange, rangeLength } from '../utils/insights'
import { downsample, seriesFor } from '../utils/series'
import { MetricIcon } from './MetricCard'
import { CountUp } from './ui'
import { item } from './motionPresets'

function ChartTip({ active, payload }) {
  if (!active || !payload?.length) return null
  const { date, value } = payload[0].payload
  return (
    <div className="chart-tip">
      {formatShort(date)} · {Math.round(value)}%
    </div>
  )
}

export function TrendCard({ metric, records, range }) {
  const reduce = useReducedMotion()
  const data = useMemo(
    () => downsample(seriesFor(metric.key, records, DEMO_TODAY, rangeLength(range))),
    [metric.key, records, range],
  )
  const current = Math.round(data[data.length - 1].value)
  const delta = changeOverRange(metric.key, records, range)
  const ticks = [0, 1, 2, 3].map((i) => data[Math.round((i * (data.length - 1)) / 3)].date)
  const last = data.length - 1

  return (
    <motion.article className="card trend" variants={item} aria-label={`${metric.label} trend`}>
      <div className="trend__head">
        <h3 className="h3">{metric.label}</h3>
        <MetricIcon name={metric.icon} size={18} />
      </div>
      <div className="trend__now">
        <span className="trend__value">
          <CountUp value={current} />
        </span>
        <span className="tiny">{describeChange(delta, range.label)}</span>
      </div>
      <div className="trend__chart" key={range.id}>
        <ResponsiveContainer width="100%" height={90}>
          <LineChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
            <CartesianGrid vertical={false} stroke="#dce6f1" />
            <XAxis dataKey="date" hide />
            <YAxis
              domain={[0, 60]}
              ticks={[0, 30, 60]}
              width={24}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 9, fill: '#66768c' }}
            />
            <Tooltip content={<ChartTip />} cursor={{ stroke: '#bed4ec' }} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#172b53"
              strokeWidth={1.7}
              isAnimationActive={!reduce}
              animationDuration={900}
              activeDot={{ r: 4, fill: '#172b53' }}
              dot={(p) =>
                p.index === last ? (
                  <circle key="last" cx={p.cx} cy={p.cy} r={4} fill="#f8de88" stroke="#172b53" strokeWidth={1.5} />
                ) : (
                  <g key={p.index} />
                )
              }
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="trend__axis">
        {ticks.map((d, i) => (
          <span key={`${d}-${i}`}>{formatShort(d)}</span>
        ))}
      </div>
    </motion.article>
  )
}

export function Timeline({ records, onOpen, expanded }) {
  const latest = records[records.length - 1]
  return (
    <div className={`timeline ${expanded ? 'timeline--wrap' : ''}`}>
      {records.map((r) => (
        <motion.button
          key={r.id}
          type="button"
          className={`tl-card ${r.id === latest?.id ? 'tl-card--latest' : ''}`}
          onClick={() => onOpen(r)}
          whileTap={{ scale: 0.95 }}
          whileHover={{ y: -2 }}
          layout
          aria-label={`Open analysis from ${formatShort(r.date)}`}
        >
          <img src={r.photoUrl} alt="" />
          <span className="tl-card__date">{formatShort(r.date)}</span>
          <ArrowUpRight size={13} />
        </motion.button>
      ))}
    </div>
  )
}

export function RoutineComparison({ routine, records }) {
  const cmp = compareRoutine(routine, records)
  return (
    <motion.article className="card routine" variants={item}>
      <div className="routine__event">
        <div className="routine__icon">
          <FlaskConical size={20} />
        </div>
        <div>
          <p className="tiny">{formatShort(routine.date)}</p>
          <p className="routine__name">Added {routine.name}</p>
        </div>
      </div>

      {cmp ? (
        <>
          <div className="routine__compare">
            {cmp.rows.map((row) => (
              <div key={row.key}>
                <p className="tiny">{row.label}</p>
                <p className="routine__nums">
                  {row.before}% → {row.after}%
                </p>
              </div>
            ))}
          </div>
          <p className="small">Skin measurements changed after this routine was recorded.</p>
          <p className="routine__fine">
            Historical comparison · {formatShort(cmp.beforeDate)} to {formatShort(cmp.afterDate)}. Changes do not
            establish cause.
          </p>
        </>
      ) : (
        <p className="small">
          Not enough photos after {formatShort(routine.date)} yet. Add a few more photos to see a comparison.
        </p>
      )}
    </motion.article>
  )
}

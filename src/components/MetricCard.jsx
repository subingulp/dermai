import { motion } from 'motion/react'
import { Droplet, Sparkles, Sun, Waves } from 'lucide-react'
import { METRICS } from '../data/mock'
import { CountUp } from './ui'
import { ease, item, stagger } from './motionPresets'

const ICONS = { sun: Sun, sparkles: Sparkles, droplet: Droplet, waves: Waves }

export function MetricIcon({ name, size = 16 }) {
  const Icon = ICONS[name] ?? Sun
  return <Icon size={size} strokeWidth={2} aria-hidden="true" />
}

export function MetricCard({ metric, value }) {
  return (
    <motion.div className="card metric" variants={item}>
      <div className="metric__head">
        <span>{metric.label}</span>
        <MetricIcon name={metric.icon} />
      </div>
      <p className="metric__value" aria-label={`${metric.label} ${value} percent`}>
        <CountUp value={value} />
      </p>
      <div className="metric__track" aria-hidden="true">
        <motion.div
          className="metric__fill"
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.9, ease, delay: 0.2 }}
        />
      </div>
    </motion.div>
  )
}

// 2 x 2 grid of the four AI-generated measurements.
export default function MetricsGrid({ metrics }) {
  return (
    <motion.div className="metrics-grid" variants={stagger} initial="hidden" animate="show">
      {METRICS.map((m) => (
        <MetricCard key={m.key} metric={m} value={metrics[m.key]} />
      ))}
    </motion.div>
  )
}

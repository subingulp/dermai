// Cards shared by several screens: AI Risk Assessment card, photo record card,
// and a photo with detected-region overlays.

import { motion } from 'motion/react'
import { formatShort } from '../utils/date'
import { DEMO_TODAY } from '../data/mock'
import { item } from './motionPresets'

export const dayLabel = (record) =>
  `${record.date === DEMO_TODAY ? 'Today' : formatShort(record.date)}, ${record.time}`

export function RiskCard({ record, onOpen, linkLabel = 'View Analysis →' }) {
  const Tag = onOpen ? motion.button : motion.div
  return (
    <Tag
      type={onOpen ? 'button' : undefined}
      className="risk-card"
      variants={item}
      onClick={onOpen}
      whileTap={onOpen ? { scale: 0.985 } : undefined}
    >
      <span className="risk-card__title">✦ AI Risk Assessment</span>
      <span className="risk-card__text">{record.risk.headline}</span>
      {onOpen ? (
        <span className="risk-card__link">{linkLabel}</span>
      ) : (
        <span className="tiny" style={{ color: 'rgba(255,255,255,.75)' }}>
          {record.risk.note}
        </span>
      )}
    </Tag>
  )
}

export function PhotoCard({ record, onOpen, title = 'Last analyzed' }) {
  return (
    <motion.button type="button" className="card photo-card" onClick={onOpen} variants={item} whileTap={{ scale: 0.985 }}>
      <img className="photo-card__img" src={record.photoUrl} alt="Your skin photo" />
      <span className="photo-card__body">
        <span className="photo-card__title">{title}</span>
        <span className="small">{dayLabel(record)}</span>
        <span className="photo-card__link">View Details →</span>
      </span>
    </motion.button>
  )
}

// A photo with optional boxes drawn over the regions the (mock) AI "found".
export function RegionPhoto({ src, regions = [], showRegions = false, alt }) {
  return (
    <div className="region-photo">
      <img src={src} alt={alt} />
      {showRegions &&
        regions.map((r) => (
          <motion.div
            key={r.id}
            className="region-photo__box"
            style={{ left: `${r.x * 100}%`, top: `${r.y * 100}%`, width: `${r.w * 100}%`, height: `${r.h * 100}%` }}
            initial={{ opacity: 0, scale: 1.15 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.45 }}
          >
            <span className="region-photo__tag">Region {r.id}</span>
          </motion.div>
        ))}
    </div>
  )
}

// A zoomed crop of the first region (step 3 of the pipeline).
export function RoiThumb({ record }) {
  const r = record.regions[0]
  const cx = (r.x + r.w / 2) * 100
  const cy = (r.y + r.h / 2) * 100
  return (
    <span
      className="roi-thumb"
      style={{ backgroundImage: `url(${record.photoUrl})`, backgroundPosition: `${cx}% ${cy}%` }}
      role="img"
      aria-label="Cropped region of interest"
    />
  )
}

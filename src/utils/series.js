// Turns a handful of "anchor" measurements into a smooth daily series,
// so the charts have something to draw. Real data will replace this later.

import { ANCHORS } from '../data/anchors'
import { addDays, diffDays } from './date'

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))

// Value for one metric on one day (linear between anchors + a tiny wiggle).
export function baseValue(metricKey, iso) {
  const anchors = ANCHORS[metricKey]
  const first = anchors[0]
  const last = anchors[anchors.length - 1]
  if (diffDays(iso, first[0]) <= 0) return first[1]
  if (diffDays(iso, last[0]) >= 0) return last[1]

  let value = last[1]
  let nearest = Infinity
  for (let i = 0; i < anchors.length - 1; i++) {
    const [d0, v0] = anchors[i]
    const [d1, v1] = anchors[i + 1]
    if (diffDays(iso, d0) >= 0 && diffDays(iso, d1) <= 0) {
      const t = diffDays(iso, d0) / diffDays(d1, d0)
      value = v0 + (v1 - v0) * t
    }
  }
  for (const [d] of anchors) nearest = Math.min(nearest, Math.abs(diffDays(iso, d)))

  // The wiggle fades to zero at anchor days so anchored values stay exact.
  const wiggle = Math.sin(diffDays(iso, first[0]) * 1.7) * 1.3 * Math.min(1, nearest / 2)
  return value + wiggle
}

// Daily series ending at `endISO`, covering `days` days.
// Days that have a saved photo record use that record's measured value.
export function seriesFor(metricKey, records, endISO, days) {
  const byDate = new Map(records.map((r) => [r.date, r.metrics[metricKey]]))
  const out = []
  for (let i = days - 1; i >= 0; i--) {
    const date = addDays(endISO, -i)
    const value = byDate.has(date) ? byDate.get(date) : baseValue(metricKey, date)
    out.push({ date, value: Math.round(clamp(value, 0, 100) * 10) / 10 })
  }
  return out
}

// Keep charts light: at most `max` points.
export function downsample(points, max = 60) {
  if (points.length <= max) return points
  const step = (points.length - 1) / (max - 1)
  return Array.from({ length: max }, (_, i) => points[Math.round(i * step)])
}

// Value on a given day using the same rules as seriesFor.
export function valueOn(metricKey, records, iso) {
  const rec = records.find((r) => r.date === iso)
  return rec ? rec.metrics[metricKey] : Math.round(baseValue(metricKey, iso))
}

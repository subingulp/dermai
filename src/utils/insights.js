// Numbers the Data tab needs: range windows, change over a range, and the
// before/after comparison for a skincare routine.

import { DEMO_TODAY, METRICS } from '../data/mock'
import { addDays, diffDays, parseISO, toISO } from './date'
import { valueOn } from './series'

export const RANGES = [
  { id: '7D', label: '7D', days: 7 },
  { id: '1M', label: '1M', months: 1 },
  { id: '3M', label: '3M', months: 3 },
  { id: '6M', label: '6M', months: 6 },
]

function monthsAgo(iso, n) {
  const d = parseISO(iso)
  const day = d.getDate()
  d.setDate(1)
  d.setMonth(d.getMonth() - n)
  const last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
  d.setDate(Math.min(day, last))
  return toISO(d)
}

// First day of the selected range, counted back from the demo "today".
export function rangeStart(range) {
  return range.days ? addDays(DEMO_TODAY, -range.days) : monthsAgo(DEMO_TODAY, range.months)
}

export const rangeLength = (range) => diffDays(DEMO_TODAY, rangeStart(range)) + 1

// Percentage-point change between the start of the range and today.
export function changeOverRange(metricKey, records, range) {
  const now = Math.round(valueOn(metricKey, records, DEMO_TODAY))
  const then = Math.round(valueOn(metricKey, records, rangeStart(range)))
  return now - then
}

export function describeChange(delta, rangeLabel) {
  const arrow = delta < 0 ? '↓' : delta > 0 ? '↑' : '→'
  return `${arrow} ${Math.abs(delta)} pp vs previous ${rangeLabel}`
}

// Compare the days just before and after a routine was recorded.
// Returns null until enough days have passed (we need data 5 days later).
export function compareRoutine(routine, records) {
  const beforeDate = addDays(routine.date, -2)
  const afterDate = addDays(routine.date, 5)
  if (afterDate > DEMO_TODAY) return null
  return {
    beforeDate,
    afterDate,
    rows: METRICS.map((m) => ({
      key: m.key,
      label: m.label,
      before: Math.round(valueOn(m.key, records, beforeDate)),
      after: Math.round(valueOn(m.key, records, afterDate)),
    })),
  }
}

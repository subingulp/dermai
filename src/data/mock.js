// Mock data for the DermAI frontend demo.
// Everything here is placeholder content. No real AI model is connected.

import skinPhoto from '../assets/skin-photo.jpg'
import { baseValue } from '../utils/series'

// The demo "today". It matches the September 2026 calendar in the Figma design.
// Change this constant to move the whole demo to another date.
export const DEMO_TODAY = '2026-09-22'

export const METRICS = [
  { key: 'redness', label: 'Redness', icon: 'sun' },
  { key: 'trouble', label: 'Trouble', icon: 'sparkles' },
  { key: 'dryness', label: 'Dryness', icon: 'droplet' },
  { key: 'oiliness', label: 'Oiliness', icon: 'waves' },
]

export const RISK_COPY = {
  none: {
    headline: 'No notable high-risk region detected.',
    note: 'An AI observation of this photo, not a diagnosis.',
  },
  review: {
    headline: 'One region may be worth a closer look.',
    note: 'An AI observation of this photo, not a diagnosis. Consider asking a dermatologist.',
  },
}

export const ROUTINE_CATEGORIES = ['Cleanser', 'Moisturizer', 'Serum', 'Sunscreen', 'Treatment', 'Other']

const REGION_A = { id: 'A', x: 0.48, y: 0.5, w: 0.34, h: 0.34 }

function seedRecord(date, time) {
  const metrics = {}
  for (const m of METRICS) metrics[m.key] = Math.round(baseValue(m.key, date))
  return {
    id: `rec-${date}`,
    date,
    time,
    photoUrl: skinPhoto,
    metrics,
    risk: { level: 'none', ...RISK_COPY.none },
    regions: [REGION_A],
    isMock: true,
    userAdded: false,
  }
}

export const SEED_RECORDS = [
  seedRecord('2026-07-14', '09:12'),
  seedRecord('2026-08-04', '20:41'),
  seedRecord('2026-08-18', '08:55'),
  seedRecord('2026-09-01', '09:03'),
  seedRecord('2026-09-08', '19:20'),
  seedRecord('2026-09-15', '10:47'),
  seedRecord('2026-09-22', '14:32'),
]

export const SEED_ROUTINES = [
  { id: 'routine-retinol', name: 'Retinol', category: 'Treatment', date: '2026-09-10', userAdded: false },
]

export const DEFAULT_REGION = REGION_A
export const SAMPLE_PHOTO = skinPhoto

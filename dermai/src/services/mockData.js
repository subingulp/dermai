// Seed data for the demo. Everything here is FAKE and exists only to show the UI.
import sampleSkin from '../assets/skin-sample.jpg';
import { addDays, todayISO } from '../utils/dates';
import { hashString, seeded } from '../utils/hash';

const WEEKS = 26;

// Hand-written first 8 weekly values (index 0 = today) so the numbers match the Figma design,
// older weeks are generated with a little repeatable noise.
const HAND = {
  redness: [18, 20, 21, 23, 25, 31, 30, 29],
  trouble: [24, 23, 22, 22, 21, 29, 28, 27],
  dryness: [31, 32, 32, 33, 34, 34, 35, 35],
  oiliness: [42, 42, 43, 43, 44, 45, 45, 46],
};
const BASE_OLD = { redness: 28, trouble: 26, dryness: 36, oiliness: 46 };

const valueFor = (metric, i) => {
  if (i < HAND[metric].length) return HAND[metric][i];
  return BASE_OLD[metric] + Math.round(Math.sin(i * 1.7 + metric.length) * 2);
};

export function makeRegion(seed) {
  const rnd = seeded(seed);
  return {
    x: 38 + rnd() * 26, // % from left
    y: 40 + rnd() * 24, // % from top
    w: 24 + rnd() * 6,
    h: 24 + rnd() * 6,
    label: 'Region A',
  };
}

export function makeRisk(seed) {
  // About 1 in 4 mock results shows the "worth monitoring" wording so both states can be seen.
  const monitor = seed % 4 === 0;
  return monitor
    ? {
        level: 'monitor',
        headline: 'One region may be worth monitoring.',
        detail: 'An AI observation of this photo, not a diagnosis.',
      }
    : {
        level: 'none',
        headline: 'No notable high-risk region detected.',
        detail: 'An AI observation of this photo, not a diagnosis.',
      };
}

export function buildSeedRecords() {
  const today = todayISO();
  const records = [];
  for (let i = 0; i < WEEKS; i++) {
    const date = addDays(today, -7 * i);
    const seed = hashString(`seed-${i}`);
    records.push({
      id: `rec-seed-${i}`,
      date,
      time: i === 0 ? '14:32' : `${String(9 + (i % 9)).padStart(2, '0')}:${String((i * 7) % 60).padStart(2, '0')}`,
      imageUrl: sampleSkin,
      metrics: {
        redness: valueFor('redness', i),
        trouble: valueFor('trouble', i),
        dryness: valueFor('dryness', i),
        oiliness: valueFor('oiliness', i),
      },
      region: makeRegion(seed),
      risk: i === 9 ? makeRisk(4) : makeRisk(1),
      source: 'demo-seed',
      mock: true,
    });
  }
  return records; // newest first
}

export function buildSeedRoutines(records) {
  // Place the events between two weekly photos so the before/after comparison has data.
  return [
    { id: 'rt-seed-1', action: 'Added', name: 'Retinol', date: addDays(records[5].date, 2) },
    { id: 'rt-seed-2', action: 'Stopped', name: 'Foaming cleanser', date: addDays(records[12].date, 3) },
  ];
}

import { addDays } from './dates';
import { METRICS, RANGES } from '../data/metrics';

/** Records inside the last N days (inclusive), oldest first — ready for charts. */
export function recordsInRange(records, rangeKey, today) {
  const { days } = RANGES.find((r) => r.key === rangeKey);
  const from = addDays(today, -days);
  return records
    .filter((r) => r.date >= from && r.date <= today)
    .sort((a, b) => (a.date === b.date ? a.time.localeCompare(b.time) : a.date.localeCompare(b.date)));
}

/** Change in percentage points between the first and last record of a series. */
export function deltaPP(series, key) {
  if (series.length < 2) return null;
  return series[series.length - 1].metrics[key] - series[0].metrics[key];
}

export function describeDelta(delta, rangeKey) {
  if (delta === null) return 'Not enough photos yet';
  if (delta === 0) return `→ no change vs previous ${rangeKey}`;
  const arrow = delta < 0 ? '↓' : '↑';
  return `${arrow} ${Math.abs(delta)} pp vs previous ${rangeKey}`;
}

/** Most recent record for each date (a date can have several photos). */
export function latestPerDate(records) {
  const map = new Map();
  for (const r of records) {
    const cur = map.get(r.date);
    if (!cur || r.time > cur.time) map.set(r.date, r);
  }
  return map;
}

/**
 * Compare skin measurements around a routine event:
 * "before" = latest photo on/before the event date, "after" = first photo after it.
 * This is a historical comparison only; it never claims the routine caused the change.
 */
export function compareAround(records, eventDate) {
  const sorted = [...records].sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
  const before = [...sorted].reverse().find((r) => r.date <= eventDate);
  const after = sorted.find((r) => r.date > eventDate);
  if (!before || !after) return null;
  const changes = METRICS.map(({ key, label }) => ({
    key,
    label,
    from: before.metrics[key],
    to: after.metrics[key],
    diff: after.metrics[key] - before.metrics[key],
  }));
  // Show the two metrics that moved the most, like the two columns in the design.
  const top = [...changes].sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff)).slice(0, 2);
  return { before, after, top };
}

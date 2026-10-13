/**
 * Frontend service layer.
 *
 * Every function here is a MOCK. Each one notes the real endpoint it will become once the
 * FastAPI backend exists. The rest of the app only talks to this file, so swapping mocks for
 * real `fetch` calls later means editing this file only.
 *
 * Nothing in here calls the network.
 */
import { store } from './mockStore';
import { makeRegion, makeRisk } from './mockData';
import { hashString, seeded } from '../utils/hash';
import { todayISO } from '../utils/dates';

export const IS_MOCK = true;

const sleep = (ms, signal) =>
  new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(new DOMException('Aborted', 'AbortError'));
    const t = setTimeout(resolve, ms);
    signal?.addEventListener('abort', () => {
      clearTimeout(t);
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });

// Add ?mockError=history (or analyze / routine) to the URL to see the error states.
const shouldFail = (what) => new URLSearchParams(window.location.search).get('mockError') === what;

const clone = (x) => JSON.parse(JSON.stringify(x));

/** GET /api/skin-history */
export async function getSkinHistory() {
  await sleep(550);
  if (shouldFail('history')) throw new Error('Mock history request failed.');
  return store.records.map((r) => ({ ...r }));
}

/** GET /api/skin-history/:id */
export async function getSkinRecord(id) {
  await sleep(200);
  const rec = store.records.find((r) => r.id === id);
  if (!rec) throw new Error('Record not found.');
  return { ...rec };
}

/** GET /api/skincare */
export async function getSkincare() {
  await sleep(300);
  return clone(store.routines);
}

/** POST /api/skincare */
export async function addSkincare({ action, name, date }) {
  await sleep(250);
  if (shouldFail('routine')) throw new Error('Mock routine request failed.');
  const entry = { id: `rt-${Date.now()}`, action, name: name.trim(), date };
  store.routines.push(entry);
  return { ...entry };
}

/** DELETE /api/skincare/:id  (not in the first endpoint list, added for the remove button) */
export async function deleteSkincare(id) {
  await sleep(200);
  const i = store.routines.findIndex((r) => r.id === id);
  if (i >= 0) store.routines.splice(i, 1);
  return { id };
}

export const ANALYSIS_STAGES = [
  { id: 'received', label: 'Receiving photo', until: 15 },
  { id: 'region', label: 'Detecting regions', until: 45 },
  { id: 'measure', label: 'Measuring skin features', until: 85 },
  { id: 'risk', label: 'Preparing assessment', until: 100 },
];

/**
 * POST /api/analyze   (multipart image upload)
 *
 * Pipeline the real backend will run:
 *   Skin Photo -> Automatic Region Detection -> ROI Crop -> Few-shot Learning Model -> AI Risk Assessment
 *
 * The mock waits a few seconds, reports progress, then invents numbers from the file name/size.
 * The result is flagged `mock: true` and must always be shown as demonstration data.
 */
export async function analyzePhoto(file, { imageUrl, onProgress, signal } = {}) {
  if (file.name.toLowerCase().includes('fail') || shouldFail('analyze')) {
    await sleep(900, signal);
    throw new Error('Mock analysis failed.');
  }

  const steps = 40;
  for (let i = 1; i <= steps; i++) {
    await sleep(110, signal); // ~4.4 s total
    const pct = Math.round((i / steps) * 100);
    const stage = ANALYSIS_STAGES.findIndex((s) => pct <= s.until);
    onProgress?.({ pct, stageIndex: stage === -1 ? ANALYSIS_STAGES.length - 1 : stage });
  }

  const seed = hashString(`${file.name}|${file.size}|${file.lastModified}`);
  const rnd = seeded(seed);
  const now = new Date();
  const record = {
    id: `rec-${now.getTime()}`,
    date: todayISO(),
    time: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
    imageUrl,
    metrics: {
      redness: 10 + Math.round(rnd() * 30),
      trouble: 10 + Math.round(rnd() * 30),
      dryness: 15 + Math.round(rnd() * 30),
      oiliness: 20 + Math.round(rnd() * 30),
    },
    region: makeRegion(seed),
    risk: makeRisk(seed),
    source: 'upload',
    mock: true,
  };
  store.records.unshift(record);
  return { ...record };
}

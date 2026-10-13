// In-memory "database" that stands in for the future FastAPI backend.
// It lives only as long as the browser tab, on purpose: no real health data is persisted.
import { buildSeedRecords, buildSeedRoutines } from './mockData';

const records = buildSeedRecords();
const routines = buildSeedRoutines(records);

export const store = { records, routines };

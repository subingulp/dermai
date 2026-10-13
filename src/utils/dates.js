// Dates are stored as local "YYYY-MM-DD" strings so there are no timezone surprises.
const pad = (n) => String(n).padStart(2, '0');

export const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const fromISO = (s) => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
};
export const todayISO = () => toISO(new Date());
export const addDays = (iso, n) => {
  const d = fromISO(iso);
  d.setDate(d.getDate() + n);
  return toISO(d);
};

const shortFmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit' });
const monthFmt = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' });

export const fmtShort = (iso) => shortFmt.format(fromISO(iso)); // "Sep 22"
export const fmtMonth = (y, m) => monthFmt.format(new Date(y, m, 1)); // "September 2026"
export const fmtDateTime = (iso, time) => `${fmtShort(iso)}, ${time}`; // "Sep 22, 14:32"
export const fmtRelative = (iso, time) => (iso === todayISO() ? `Today, ${time}` : fmtDateTime(iso, time));

export const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
};

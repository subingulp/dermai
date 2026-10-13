// Small date helpers. All dates in the app are plain "YYYY-MM-DD" strings,
// which avoids time-zone surprises when comparing or sorting them.

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const MONTHS_LONG = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export const toISO = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export const parseISO = (iso) => {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export const addDays = (iso, n) => {
  const d = parseISO(iso)
  d.setDate(d.getDate() + n)
  return toISO(d)
}

export const diffDays = (a, b) => Math.round((parseISO(a) - parseISO(b)) / 86400000)

export const mondayOf = (iso) => addDays(iso, -((parseISO(iso).getDay() + 6) % 7))

export const dayOfMonth = (iso) => parseISO(iso).getDate()

export const formatShort = (iso) => {
  const d = parseISO(iso)
  return `${MONTHS_SHORT[d.getMonth()]} ${String(d.getDate()).padStart(2, '0')}`
}

export const formatMonthYear = (iso) => {
  const d = parseISO(iso)
  return `${MONTHS_LONG[d.getMonth()]} ${d.getFullYear()}`
}

export const sameMonth = (a, b) => a.slice(0, 7) === b.slice(0, 7)

export const nowTime = () => {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export const greeting = () => {
  const h = new Date().getHours()
  if (h < 5) return 'Good evening'
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

// (monthsAgo lives in insights.js; kept here: nothing extra)

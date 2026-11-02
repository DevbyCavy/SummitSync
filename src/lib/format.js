const dateFmt = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
const monthFmt = new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' });

// Parse YYYY-MM[-DD] as a local date so formatting never shifts by timezone.
function parse(iso) {
  const [y, m = 1, d = 1] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function formatDate(iso) {
  const d = parse(iso);
  return Number.isNaN(d.getTime()) ? iso : dateFmt.format(d);
}

export function formatMonth(iso) {
  const d = parse(iso);
  return Number.isNaN(d.getTime()) ? iso : monthFmt.format(d);
}

export function formatRange(start, end) {
  if (!end || end === start) return formatDate(start);
  return `${formatDate(start)} – ${formatDate(end)}`;
}

export function todayIso() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const shortMonth = new Intl.DateTimeFormat('en-GB', { month: 'short' });

/** { day: '12', month: 'NOV' } for a date badge. */
export function dateBadge(iso) {
  const d = parse(iso);
  return { day: String(d.getDate()), month: shortMonth.format(d).toUpperCase() };
}

/** Friendly countdown: "Happening now", "Today", "Tomorrow", "In 12 days", "In 3 weeks"… */
export function countdown(start, end = start) {
  const DAY = 86400000;
  const today = parse(todayIso()).getTime();
  const s = parse(start).getTime();
  const e = parse(end || start).getTime();
  if (today >= s && today <= e) return s === e ? 'Today' : 'Happening now';
  const days = Math.round((s - today) / DAY);
  if (days === 1) return 'Tomorrow';
  if (days < 14) return `In ${days} days`;
  if (days < 60) return `In ${Math.round(days / 7)} weeks`;
  return `In ${Math.round(days / 30)} months`;
}

/** Upcoming (not yet finished) events, soonest first. */
export function upcomingEvents(events, limit = Infinity) {
  const today = todayIso();
  return [...events]
    .filter((e) => (e.endDate || e.startDate) >= today)
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
    .slice(0, limit);
}

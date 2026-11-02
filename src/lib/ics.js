// "Add to my calendar": builds a standard .ics invite (works with Google, Outlook and Apple calendars).

const esc = (s = '') => String(s).replace(/\\/g, '\\\\').replace(/([,;])/g, '\\$1').replace(/\r?\n/g, '\\n');
const compact = (iso) => iso.replace(/-/g, '');

/** All-day events: DTEND is exclusive, so it's the day after the last day. */
function dayAfter(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  const next = new Date(Date.UTC(y, m - 1, d + 1));
  return next.toISOString().slice(0, 10).replace(/-/g, '');
}

export function eventToIcs(event) {
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const location = [event.venue, event.city, 'Zimbabwe'].filter((p) => p && p !== 'TBC').join(', ');
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Summit Sync//MICE Calendar//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${event.id}@summitsync.co.zw`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${compact(event.startDate)}`,
    `DTEND;VALUE=DATE:${dayAfter(event.endDate || event.startDate)}`,
    `SUMMARY:${esc(event.name)}`,
    location && `LOCATION:${esc(location)}`,
    `DESCRIPTION:${esc(`${event.category ? `${event.category} · ` : ''}Listed on the Summit Sync MICE Calendar.`)}`,
    event.link && `URL:${event.link}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean);
  return lines.join('\r\n');
}

/** Triggers a download of the event's .ics file. */
export function downloadIcs(event) {
  const blob = new Blob([eventToIcs(event)], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${event.name.replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-').toLowerCase() || 'event'}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

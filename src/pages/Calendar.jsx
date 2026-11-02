import { useMemo, useState } from 'react';
import { ExternalLink, MapPin } from 'lucide-react';
import Seo from '../components/Seo.jsx';
import PageHeader from '../components/layout/PageHeader.jsx';
import { formatRange, todayIso } from '../lib/format.js';
import events from '../content/calendar.json';

// TODO(open): if the calendar lives on an external platform, link the hero button there and drop this page (§13.2).

const ALL = 'All';

export default function Calendar() {
  const [showPast, setShowPast] = useState(false);
  const [category, setCategory] = useState(ALL);
  const today = todayIso();

  const categories = useMemo(() => [ALL, ...new Set(events.map((e) => e.category).filter(Boolean))], []);

  const visible = useMemo(
    () =>
      [...events]
        .sort((a, b) => a.startDate.localeCompare(b.startDate))
        .filter((e) => showPast || (e.endDate || e.startDate) >= today)
        .filter((e) => category === ALL || e.category === category),
    [showPast, category, today]
  );

  return (
    <>
      <Seo title="MICE Calendar" description="Upcoming meetings, incentives, conferences and exhibitions in Zimbabwe's MICE industry." />
      <PageHeader eyebrow="Industry Calendar" title="The MICE Calendar">
        Upcoming conferences, exhibitions and industry gatherings across Zimbabwe.
      </PageHeader>

      <section aria-label="Events" className="container-content section">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={category === c}
                onClick={() => setCategory(c)}
                className={`rounded-full border-[1.5px] px-4 py-1.5 text-sm font-medium transition-colors ${
                  category === c
                    ? 'border-white bg-white text-night-900'
                    : 'border-white/20 text-white/80 hover:border-white/60'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              checked={showPast}
              onChange={(e) => setShowPast(e.target.checked)}
              className="h-4 w-4 accent-brand-orange"
            />
            Show past events
          </label>
        </div>

        {visible.length === 0 ? (
          <p className="mt-10 text-white/60">No events to show. Check back soon or adjust the filters.</p>
        ) : (
          <ul className="mt-10 divide-y divide-white/10 border-y border-white/10">
            {visible.map((e) => {
              const past = (e.endDate || e.startDate) < today;
              return (
                <li key={e.id} className={`grid grid-cols-1 gap-2 py-6 md:grid-cols-[14rem_1fr_auto] md:items-center md:gap-6 ${past ? 'opacity-60' : ''}`}>
                  <p className="font-normal text-brand-orange">{formatRange(e.startDate, e.endDate)}</p>
                  <div>
                    <h2 className="font-sans text-lg font-bold">{e.name}</h2>
                    <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/50">
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={15} aria-hidden="true" />
                        {[e.venue, e.city].filter(Boolean).join(', ')}
                      </span>
                      {e.category && <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium text-white/80">{e.category}</span>}
                      {past && <span className="text-xs font-medium uppercase">Past event</span>}
                    </p>
                  </div>
                  {e.link && (
                    <a
                      href={e.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-orange hover:underline"
                    >
                      Event details <ExternalLink size={14} aria-hidden="true" />
                      <span className="sr-only">for {e.name} (opens in a new tab)</span>
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </>
  );
}

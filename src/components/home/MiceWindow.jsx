import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, CalendarPlus, ExternalLink, MapPin, Plus } from 'lucide-react';
import Modal from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';
import SmartLink, { siteLink } from '../ui/SmartLink.jsx';
import { countdown, dateBadge, formatRange, upcomingEvents } from '../../lib/format.js';
import { downloadIcs } from '../../lib/ics.js';
import events from '../../content/calendar.json';

const ROTATE_MS = 5500;
const LIST_EVENT_URL = '/contact?topic=event-listing';

/**
 * The hero's "MICE Window": the next three events from calendar.json, rotating automatically
 * (paused on hover/focus and under reduced motion). Click an event for details, an .ics
 * "Add to my calendar" download and the event's own link. Past events drop off by themselves.
 */
export default function MiceWindow({ className = '', style }) {
  const upcoming = upcomingEvents(events, 3);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [open, setOpen] = useState(null);
  const reduceMotion = useRef(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const calendarUrl = siteLink('calendar');

  useEffect(() => {
    if (upcoming.length < 2 || paused || open || reduceMotion.current) return undefined;
    const t = setInterval(() => setIndex((i) => (i + 1) % upcoming.length), ROTATE_MS);
    return () => clearInterval(t);
  }, [upcoming.length, paused, open]);

  const event = upcoming[index];

  return (
    <div
      className={`glass flex w-full max-w-sm flex-col rounded-2xl p-4 ${className}`}
      style={style}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="flex items-center justify-between">
        <p className="text-[0.65rem] font-medium uppercase tracking-[0.25em] text-brand-orange">
          MICE Window · {event ? 'Up next' : 'Calendar'}
        </p>
        {upcoming.length > 1 && (
          <div className="-my-2 -mr-1 flex" role="group" aria-label="Choose event">
            {upcoming.map((e, i) => (
              <button
                key={e.id}
                type="button"
                aria-label={`Show ${e.name}`}
                aria-current={i === index ? 'true' : undefined}
                onClick={() => setIndex(i)}
                // 24px touch target around a small visual dot.
                className="group/dot flex h-6 min-w-6 items-center justify-center px-1"
              >
                <span
                  aria-hidden="true"
                  className={`block h-1.5 rounded-full transition-all duration-500 ${i === index ? 'w-5 bg-brand-orange' : 'w-1.5 bg-white/30 group-hover/dot:bg-white/60'}`}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {event ? (
        <button
          type="button"
          onClick={() => setOpen(event)}
          aria-label={`${event.name}, ${formatRange(event.startDate, event.endDate)}: view details`}
          className="group mt-3 flex w-full gap-4 rounded-xl p-1 text-left transition-colors hover:bg-white/5"
        >
          {/* key → re-mount on change so the slide-in animation replays */}
          <span key={event.id} className="anim-text-next flex w-full gap-4">
            <span className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-brand-orange text-white">
              <span className="text-2xl font-light leading-none">{dateBadge(event.startDate).day}</span>
              <span className="mt-1 text-[0.6rem] font-medium tracking-[0.2em]">{dateBadge(event.startDate).month}</span>
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="line-clamp-2 font-normal leading-snug text-white">{event.name}</span>
              <span className="mt-0.5 inline-flex items-center gap-1 truncate text-xs text-white/60">
                <MapPin size={12} aria-hidden="true" className="shrink-0" />
                {[event.venue !== 'TBC' && event.venue, event.city].filter(Boolean).join(', ')}
                {event.category && ` · ${event.category}`}
              </span>
              <span className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-brand-orange">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-orange" aria-hidden="true" />
                {countdown(event.startDate, event.endDate)}
                <ArrowUpRight
                  size={13}
                  aria-hidden="true"
                  className="ml-1 text-white/50 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </span>
            </span>
          </span>
        </button>
      ) : (
        <p className="mt-3 text-sm text-white/70">No upcoming events listed yet. Organising one? Get it on the calendar.</p>
      )}

      <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3 text-[0.65rem] font-medium uppercase tracking-[0.2em]">
        <Link to={LIST_EVENT_URL} className="tap-area inline-flex items-center gap-1 text-white/80 hover:text-white">
          <Plus size={12} aria-hidden="true" /> List your event
        </Link>
        <SmartLink url={calendarUrl} className={calendarUrl ? 'tap-area inline-flex items-center gap-1 text-white/80 hover:text-white' : 'text-white/35'}>
          Full calendar{calendarUrl ? <ArrowUpRight size={12} aria-hidden="true" /> : ' · soon'}
        </SmartLink>
      </div>

      <EventModal event={open} onClose={() => setOpen(null)} />
    </div>
  );
}

function EventModal({ event, onClose }) {
  if (!event) return null;
  const badge = dateBadge(event.startDate);
  return (
    <Modal open onClose={onClose} labelledBy="event-title" className="max-w-lg">
      <div className="p-6 sm:p-8">
        <div className="flex items-start gap-5">
          <span className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-2xl bg-brand-orange text-white">
            <span className="text-3xl font-light leading-none">{badge.day}</span>
            <span className="mt-1 text-xs font-medium tracking-[0.2em]">{badge.month}</span>
          </span>
          <div className="min-w-0 pr-8">
            {event.category && (
              <p className="text-[0.7rem] font-medium uppercase tracking-[0.25em] text-brand-orange">{event.category}</p>
            )}
            <h2 id="event-title" className="mt-1 text-2xl leading-tight">
              {event.name}
            </h2>
            <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-brand-orange">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" aria-hidden="true" />
              {countdown(event.startDate, event.endDate)}
            </p>
          </div>
        </div>

        <dl className="mt-6 grid grid-cols-1 gap-3 border-y border-white/10 py-5 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-[0.65rem] uppercase tracking-[0.2em] text-white/40">When</dt>
            <dd className="mt-1 text-white/85">{formatRange(event.startDate, event.endDate)}</dd>
          </div>
          <div>
            <dt className="text-[0.65rem] uppercase tracking-[0.2em] text-white/40">Where</dt>
            <dd className="mt-1 text-white/85">{[event.venue === 'TBC' ? 'Venue TBC' : event.venue, event.city].filter(Boolean).join(', ')}</dd>
          </div>
        </dl>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={() => downloadIcs(event)}>
            <CalendarPlus size={16} aria-hidden="true" /> Add to my calendar
          </Button>
          {event.link && (
            <Button variant="outline" href={event.link} target="_blank" rel="noopener noreferrer">
              Event website <ExternalLink size={14} aria-hidden="true" />
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}

import { highlights } from '../../content/services.json';

const ITEMS = ['Summit Sync Magazine', 'Summit Sync Weekly', 'The Architects of MICE', ...highlights.map((h) => h.title)];

/**
 * Endless ticker of the platform's offerings between the hero and Services.
 * Decorative (the same words appear in the Services section), so hidden from screen readers.
 * The list is rendered twice and the track slides by -50% for a seamless loop; pauses on hover.
 */
export default function Marquee() {
  const row = (copy) =>
    ITEMS.map((item, i) => (
      <span key={`${copy}-${i}`} className="flex items-center gap-10 pr-10">
        <span className={i % 2 ? 'text-white/25' : 'text-white/80'}>{item}</span>
        <span className="text-brand-orange">✦</span>
      </span>
    ));

  return (
    <div aria-hidden="true" className="marquee overflow-hidden border-y border-white/10 bg-night-950 py-6 md:py-8">
      <div className="marquee-track flex w-max whitespace-nowrap text-3xl font-extralight tracking-tight md:text-5xl">
        {row('a')}
        {row('b')}
      </div>
    </div>
  );
}

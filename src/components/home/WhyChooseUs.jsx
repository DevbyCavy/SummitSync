import { Megaphone, Network, Target, TrendingUp } from 'lucide-react';
import why from '../../content/why.json';

// Icon names usable in why.json.
const ICONS = { target: Target, megaphone: Megaphone, network: Network, 'trending-up': TrendingUp };

export default function WhyChooseUs() {
  return (
    <section id="why-us" aria-labelledby="why-title" className="bg-night-950">
      <div className="container-content section grid grid-cols-1 gap-14 lg:grid-cols-[2fr_3fr] lg:gap-20">
        {/* Heading column stays pinned while the points scroll past (desktop). */}
        <div className="lg:sticky lg:top-32 lg:self-start">
          <p data-reveal="fade" className="eyebrow mb-4">
            {why.eyebrow}
          </p>
          <h2 id="why-title" data-reveal="up" className="h2-section">
            {/* Break after each sentence so lines never split mid-phrase on narrow screens. */}
            {why.heading.split(/(?<=\.)\s+/).map((sentence) => (
              <span key={sentence} className="block">
                {sentence}
              </span>
            ))}
          </h2>
          <p data-reveal="up" style={{ '--d': '150ms' }} className="muted mt-6 max-w-md text-base">
            {why.description}
          </p>
        </div>

        <ul className="grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2">
          {why.points.map((point, i) => {
            const Icon = ICONS[point.icon] ?? Target;
            return (
              <li
                key={point.title}
                data-reveal="up"
                style={{ '--d': `${i * 130}ms` }}
                className="group relative border-t border-white/10 pt-6"
              >
                <span
                  aria-hidden="true"
                  className="absolute -top-px left-0 h-px w-full origin-left scale-x-0 bg-brand-orange transition-transform duration-700 ease-out group-hover:scale-x-100"
                />
                <div className="flex items-center justify-between">
                  <span className="text-xs tabular-nums text-white/40">{String(i + 1).padStart(2, '0')}</span>
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-brand-orange transition-all duration-500 group-hover:rotate-[360deg] group-hover:border-brand-orange group-hover:bg-brand-orange group-hover:text-white">
                    <Icon size={18} aria-hidden="true" />
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-normal text-white">{point.title}</h3>
                <p className="muted mt-3 transition-colors duration-500 group-hover:text-white/80">{point.text}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

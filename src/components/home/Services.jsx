import { useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import SectionTitle from '../ui/SectionTitle.jsx';
import IconButton from '../ui/IconButton.jsx';
import Img from '../ui/Img.jsx';
import SmartLink, { siteLink } from '../ui/SmartLink.jsx';
import { highlights, cards } from '../../content/services.json';

// The arrows cycle the highlight text only; the numbered service rows below are static.
export default function Services() {
  const [{ index, dir }, setState] = useState({ index: 0, dir: 0 });
  const featured = highlights[index];

  const step = (d) => setState((s) => ({ index: (s.index + d + highlights.length) % highlights.length, dir: d }));
  // New text slides in from the side the visitor is moving towards.
  const enter = dir > 0 ? 'anim-text-next' : dir < 0 ? 'anim-text-prev' : '';

  return (
    <section id="services" aria-labelledby="services-title">
      <div className="container-content section">
        <SectionTitle id="services-title" eyebrow="What we do">
          Our Services
        </SectionTitle>

        <div data-reveal="up" style={{ '--d': '150ms' }} className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-[1fr_auto] md:items-end">
          <div aria-live="polite" className="max-w-2xl overflow-hidden">
            <div key={index} className={enter}>
              <h3 className="text-2xl font-normal text-white md:text-3xl">{featured.title}</h3>
              <p className="muted mt-3 text-base">{featured.summary}</p>
            </div>
          </div>
          <div className="flex items-center gap-3" role="group" aria-label="Browse services">
            <span className="mr-2 text-sm tabular-nums text-white/50" aria-hidden="true">
              <span key={index} className="anim-fade-in inline-block">
                {String(index + 1).padStart(2, '0')}
              </span>{' '}
              / {String(highlights.length).padStart(2, '0')}
            </span>
            <IconButton solid label="Previous service" onClick={() => step(-1)} className="active:scale-90">
              <ArrowLeft size={20} aria-hidden="true" />
            </IconButton>
            <IconButton solid label="Next service" onClick={() => step(1)} className="active:scale-90">
              <ArrowRight size={20} aria-hidden="true" />
            </IconButton>
          </div>
        </div>

        <ol className="mt-16 border-b border-white/10">
          {cards.map((card, i) => (
            <li
              key={card.id}
              data-reveal="up"
              style={{ '--d': `${i * 120}ms` }}
              // Phone: title on top, text + small square photo side by side. Tablet: text left, photo
              // right. Desktop: title | text | photo in one row. Photos stay square and equal-sized.
              className="group relative grid grid-cols-[1fr_6.5rem] items-start gap-5 border-t border-white/10 py-8 sm:grid-cols-[1fr_9rem] md:grid-cols-[1fr_11rem] md:grid-rows-[auto_1fr] md:gap-x-10 md:py-10 lg:grid-cols-[1fr_1fr_13rem] lg:grid-rows-1"
            >
              {/* Orange line sweeps across the row's top border on hover. */}
              <span
                aria-hidden="true"
                className="absolute -top-px left-0 h-px w-full origin-left scale-x-0 bg-brand-orange transition-transform duration-700 ease-out group-hover:scale-x-100"
              />
              <h3 className="col-span-2 text-2xl font-light text-white transition-transform duration-500 ease-out group-hover:translate-x-2 md:col-span-1 md:text-3xl lg:col-start-1 lg:row-start-1">
                <span className="text-brand-orange">{String(i + 1).padStart(2, '0')}.</span> {card.title}
              </h3>
              <div className="col-start-1 md:row-start-2 lg:col-start-2 lg:row-start-1">
                <p className="muted transition-colors duration-500 group-hover:text-white/80">{card.summary}</p>
                {/* `linkTo` names a site.json link (magazine/calendar); empty there = shown dimmed, not clickable. */}
                {(card.linkTo || card.link) && (
                  <SmartLink
                    url={card.linkTo ? siteLink(card.linkTo) : card.link}
                    className={`link-caps mt-5 ${card.linkTo && !siteLink(card.linkTo) ? 'text-white/40 hover:text-white/40' : ''}`}
                  >
                    {card.linkLabel || 'Learn more'}
                    {card.linkTo && !siteLink(card.linkTo) ? (
                      <span className="normal-case tracking-normal">· coming soon</span>
                    ) : (
                      <ArrowUpRight size={14} aria-hidden="true" />
                    )}
                  </SmartLink>
                )}
              </div>
              {/* Square (1:1) images, all the same size; unveil on scroll, zoom on hover. */}
              <div
                data-reveal="clip"
                style={{ '--d': `${200 + i * 120}ms` }}
                className="col-start-2 row-start-2 aspect-square w-full overflow-hidden rounded-lg md:row-span-2 md:row-start-1 lg:col-start-3 lg:row-span-1"
              >
                <div className="h-full w-full">
                  <Img
                    src={card.image}
                    alt=""
                    width={600}
                    height={600}
                    sizes="(min-width: 1024px) 208px, (min-width: 768px) 176px, 144px"
                    className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

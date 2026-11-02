import { ArrowUpRight, Mail, Sparkles } from 'lucide-react';
import Button from '../ui/Button.jsx';
import Img from '../ui/Img.jsx';
import { LogoMark } from '../ui/Logo.jsx';
import SmartLink, { linkProps, siteLink } from '../ui/SmartLink.jsx';
import { goToNewsletter } from '../../lib/newsletter.js';
import pubs from '../../content/publications.json';
import LatestFeed from './LatestFeed.jsx';

const [magazine, ...supporting] = pubs.items;
const ICONS = { weekly: Mail, features: Sparkles };

/**
 * Magazine cover. Uses `cover` from publications.json when set (e.g. "/images/magazine/issue-01.webp");
 * until then renders a designed placeholder cover in the brand style.
 * TODO(open): replace with the real issue cover.
 */
function MagazineCover({ cover, lines = [] }) {
  if (cover) {
    return (
      <Img src={cover} alt={`${magazine.title} cover`} width={600} height={800} sizes="240px" className="h-full w-full rounded-md" />
    );
  }
  return (
    <div aria-hidden="true" className="relative flex h-full w-full flex-col overflow-hidden rounded-md bg-gradient-to-br from-brand-purple via-night-800 to-[#7a3530] p-5 text-white">
      <LogoMark className="absolute -bottom-10 -right-12 h-56 w-56 text-white/10" />
      <span className="text-[0.55rem] font-medium uppercase tracking-[0.35em] text-brand-orange">The Architects of MICE</span>
      <span className="mt-2 text-3xl font-extralight leading-none tracking-tight">Summit Sync</span>
      <span className="mt-1 text-[0.6rem] font-medium uppercase tracking-[0.4em] text-white/70">Magazine</span>
      <span className="mt-auto space-y-1.5">
        {lines.map((line) => (
          <span key={line} className="block border-l border-brand-orange pl-2 text-[0.65rem] text-white/85">
            {line}
          </span>
        ))}
      </span>
      <span className="mt-4 flex items-center justify-between text-[0.55rem] uppercase tracking-[0.25em] text-white/60">
        <span>Issue 01</span>
        <span className="rounded-full border border-white/30 px-2 py-0.5">Coming soon</span>
      </span>
    </div>
  );
}

function SupportingCard({ item, index }) {
  const Icon = ICONS[item.id] ?? Sparkles;
  const url = item.linkTo ? siteLink(item.linkTo) : '';
  const ready = item.action === 'subscribe' || !!url;

  const cta =
    item.action === 'subscribe' ? (
      <button type="button" onClick={goToNewsletter} className="link-caps">
        {item.cta} <ArrowUpRight size={14} aria-hidden="true" />
      </button>
    ) : (
      <SmartLink url={url} className={`link-caps ${ready ? '' : 'text-white/40 hover:text-white/40'}`}>
        {item.cta}
        {ready ? <ArrowUpRight size={14} aria-hidden="true" /> : <span className="normal-case tracking-normal">· coming soon</span>}
      </SmartLink>
    );

  return (
    <li
      data-reveal="up"
      style={{ '--d': `${150 + index * 130}ms` }}
      className="group relative flex flex-col rounded-2xl border border-white/10 bg-night-800/60 p-7 transition-colors duration-500 hover:border-white/20 hover:bg-night-800 md:p-8"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs tabular-nums text-white/40">{String(index + 2).padStart(2, '0')}</span>
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-brand-orange transition-all duration-500 group-hover:border-brand-orange group-hover:bg-brand-orange group-hover:text-white">
          <Icon size={18} aria-hidden="true" />
        </span>
      </div>
      <p className="mt-6 text-[0.7rem] font-medium uppercase tracking-[0.25em] text-brand-orange">{item.tag}</p>
      <h3 className="mt-2 text-2xl font-light text-white">{item.title}</h3>
      <p className="muted mt-3 flex-1">{item.text}</p>
      <div className="mt-6">{cta}</div>
    </li>
  );
}

export default function Publications() {
  const magazineUrl = siteLink(magazine.linkTo);

  return (
    <section id="publications" aria-labelledby="publications-title">
      <div className="container-content section">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-end lg:gap-20">
          <div>
            <p data-reveal="fade" className="eyebrow mb-4">
              {pubs.eyebrow}
            </p>
            <h2 id="publications-title" data-reveal="up" className="h2-section max-w-lg">
              {pubs.heading}
            </h2>
          </div>
          <p data-reveal="up" style={{ '--d': '150ms' }} className="lead text-white/70">
            {pubs.description}
          </p>
        </div>

        <ul className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-[1.35fr_1fr] lg:grid-rows-2">
          {/* The Magazine is the hero of the section. */}
          <li
            data-reveal="up"
            className="group relative grid grid-cols-1 overflow-hidden rounded-2xl border border-white/10 bg-night-800 sm:grid-cols-[1fr_1.1fr] lg:row-span-2 lg:grid-cols-1"
          >
            <div className="relative flex items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_30%_20%,rgba(245,118,39,0.22),transparent_60%),radial-gradient(ellipse_at_80%_90%,rgba(93,62,100,0.6),transparent_60%)] px-8 py-12 lg:py-16">
              {/* Stacked "issues" for depth; the front cover straightens on hover. */}
              <div className="relative aspect-[3/4] w-44 sm:w-48 lg:w-56">
                <div className="absolute inset-0 translate-x-6 rotate-[8deg] rounded-md bg-white/5 ring-1 ring-white/10 transition-transform duration-700 ease-out group-hover:translate-x-9 group-hover:rotate-[12deg]" />
                <div className="absolute inset-0 translate-x-3 rotate-[4deg] rounded-md bg-white/10 ring-1 ring-white/10 transition-transform duration-700 ease-out group-hover:translate-x-5 group-hover:rotate-[6deg]" />
                <div className="relative h-full w-full -rotate-[3deg] shadow-2xl shadow-black/50 transition-transform duration-700 ease-out group-hover:-translate-y-1 group-hover:rotate-0">
                  <MagazineCover cover={magazine.cover} lines={magazine.coverLines} />
                </div>
              </div>
            </div>
            <div className="flex flex-col p-7 md:p-9">
              <p className="text-[0.7rem] font-medium uppercase tracking-[0.25em] text-brand-orange">{magazine.tag}</p>
              <h3 className="mt-2 text-3xl font-light text-white md:text-4xl">{magazine.title}</h3>
              <p className="muted mt-4 max-w-md text-base">{magazine.text}</p>
              <div className="mt-8">
                <Button {...linkProps(magazineUrl)}>
                  {magazine.cta}
                  {magazineUrl && <ArrowUpRight size={16} aria-hidden="true" />}
                </Button>
                {!magazineUrl && <span className="ml-3 text-xs text-white/40">First issue coming soon</span>}
              </div>
            </div>
          </li>

          {supporting.map((item, i) => (
            <SupportingCard key={item.id} item={item} index={i} />
          ))}
        </ul>

        {/* Newest items first: Weekly editions, features and coverage. */}
        <LatestFeed />
      </div>
    </section>
  );
}

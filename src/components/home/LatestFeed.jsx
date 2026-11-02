import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import Img from '../ui/Img.jsx';
import SmartLink, { siteLink } from '../ui/SmartLink.jsx';
import ProjectLightbox from './ProjectLightbox.jsx';
import { scrollToSection } from '../layout/navLinks.js';
import { formatDate } from '../../lib/format.js';
import { goToNewsletter } from '../../lib/newsletter.js';
import latest from '../../content/latest.json';
import projects from '../../content/projects.json';

const LIMIT = 4;

/**
 * "Latest": the newest items first, merged from latest.json (Weekly editions, features, issues)
 * and dated Industry Coverage events (projects.json). Grows automatically as content is added.
 */
const FEED = [
  ...latest,
  ...projects
    .filter((p) => p.date)
    .map((p) => ({ id: p.id, type: 'Coverage', title: p.title, date: p.date, location: p.location, excerpt: p.description, image: p.cover, project: p, cta: 'View coverage' })),
]
  .sort((a, b) => b.date.localeCompare(a.date))
  .slice(0, LIMIT);

function Card({ item, index, onOpenProject }) {
  const url = item.linkTo ? siteLink(item.linkTo) : item.link || '';
  // Coverage opens the photo lightbox; Weekly jumps to the sign-up; others follow their link (or wait).
  const onClick = item.project ? () => onOpenProject(item.project) : item.action === 'subscribe' ? goToNewsletter : null;
  const live = Boolean(onClick || url);

  const body = (
    <>
      <span className="relative block aspect-[4/3] overflow-hidden rounded-xl">
        <Img
          src={item.image}
          alt=""
          width={800}
          height={600}
          sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 100vw"
          className={`h-full w-full transition-transform duration-700 ease-out ${live ? 'group-hover:scale-105' : ''}`}
        />
        <span className="glass absolute left-3 top-3 rounded-full px-3 py-1 text-[0.6rem] font-medium uppercase tracking-[0.2em] text-white">
          {item.type}
        </span>
      </span>
      <span className="mt-4 block text-xs text-white/50">
        {[formatDate(item.date), item.location].filter(Boolean).join(' · ')}
      </span>
      <span className="mt-1.5 line-clamp-2 text-lg font-normal leading-snug text-white">{item.title}</span>
      {item.excerpt && <span className="muted mt-2 line-clamp-2">{item.excerpt}</span>}
      <span className={`link-caps mt-4 ${live ? '' : 'text-white/40 hover:text-white/40'}`}>
        {item.cta || 'Read more'}
        {live ? <ArrowUpRight size={14} aria-hidden="true" /> : <span className="normal-case tracking-normal">· coming soon</span>}
      </span>
    </>
  );

  const cls = 'group block w-full text-left';
  return (
    <li data-reveal="up" style={{ '--d': `${index * 110}ms` }} className="w-[80%] shrink-0 snap-start sm:w-auto">
      {onClick ? (
        <button type="button" onClick={onClick} className={cls}>
          {body}
        </button>
      ) : (
        <SmartLink url={url} className={cls}>
          {body}
        </SmartLink>
      )}
    </li>
  );
}

export default function LatestFeed() {
  const [project, setProject] = useState(null);
  if (!FEED.length) return null;

  return (
    <div className="mt-20">
      <div className="flex flex-wrap items-end gap-x-8 gap-y-3">
        <div>
          <p data-reveal="fade" className="eyebrow mb-3">
            Latest
          </p>
          <h3 data-reveal="up" className="text-2xl font-light text-white md:text-3xl">
            Newest from Summit Sync
          </h3>
        </div>
        <span aria-hidden="true" data-reveal="line" style={{ '--d': '200ms' }} className="mb-3 hidden h-px flex-1 bg-white/15 sm:block" />
        <Link to="/#coverage" onClick={(e) => scrollToSection(e, 'coverage', '/')} className="link-caps mb-2">
          All coverage <ArrowDown size={14} aria-hidden="true" />
        </Link>
      </div>

      {/* Phones: swipeable row (next card peeks in). Tablet: 2×2 grid. Desktop: 4 across. */}
      <ul className="no-scrollbar -mx-6 mt-10 flex snap-x snap-mandatory scroll-px-6 gap-4 overflow-x-auto px-6 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4">
        {FEED.map((item, i) => (
          <Card key={item.id} item={item} index={i} onOpenProject={setProject} />
        ))}
      </ul>

      <ProjectLightbox project={project} onClose={() => setProject(null)} />
    </div>
  );
}

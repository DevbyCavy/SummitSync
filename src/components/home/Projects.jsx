import { useState } from 'react';
import SectionTitle from '../ui/SectionTitle.jsx';
import Img from '../ui/Img.jsx';
import { ArrowUpRight } from 'lucide-react';
import ProjectLightbox from './ProjectLightbox.jsx';
import { formatDate } from '../../lib/format.js';
import projects from '../../content/projects.json';

/*
 * Desktop masonry on an 8-row grid (§6.4):
 *   col 1: tall, tall   col 2: short, tall, short   col 3: tall, tall
 * Placement follows projects.json order (first 7 items).
 */
const PLACEMENT = [
  'md:col-start-1 md:row-start-1 md:row-span-4',
  'md:col-start-1 md:row-start-5 md:row-span-4',
  'md:col-start-2 md:row-start-1 md:row-span-2',
  'md:col-start-2 md:row-start-3 md:row-span-4',
  'md:col-start-2 md:row-start-7 md:row-span-2',
  'md:col-start-3 md:row-start-1 md:row-span-4',
  'md:col-start-3 md:row-start-5 md:row-span-4',
];

/** Industry Coverage: photo gallery of events from the field (content: projects.json). */
export default function Projects() {
  const [selected, setSelected] = useState(null);
  const items = projects.slice(0, PLACEMENT.length);

  return (
    <section id="coverage" aria-labelledby="coverage-title">
      <div className="container-content section">
        <SectionTitle id="coverage-title" eyebrow="From the Field">
          Industry Coverage
        </SectionTitle>
        <p data-reveal="up" style={{ '--d': '150ms' }} className="muted mt-6 max-w-xl text-base">
          Moments from the conferences, exhibitions and industry gatherings shaping Zimbabwe&apos;s business events landscape.
        </p>

        {/* Hovering one tile dims the others (spotlight). */}
        <ul className="group/grid mt-12 grid grid-cols-2 gap-3 md:h-[min(80vw,780px)] md:grid-cols-3 md:grid-rows-8">
          {items.map((project, i) => (
            // Tiles unveil one after another. The clip animates the wrapper <div>, leaving the
            // button's own hover transitions untouched.
            <li
              key={project.id}
              data-reveal="clip"
              style={{ '--d': `${i * 90}ms` }}
              // Phones: the first project is a wide featured tile so the other six pair up evenly.
              className={`${i === 0 ? 'col-span-2 aspect-[16/10] md:col-span-1' : 'aspect-square'} md:aspect-auto ${PLACEMENT[i]}`}
            >
              <div className="h-full w-full">
              <button
                type="button"
                onClick={() => setSelected(project)}
                className="group relative block h-full w-full overflow-hidden rounded-xl bg-night-800 text-left transition-opacity duration-500 group-hover/grid:opacity-40 hover:!opacity-100 focus-visible:!opacity-100"
                aria-label={`${project.title} — view details`}
              >
                <Img
                  src={project.cover}
                  alt=""
                  width={600}
                  height={800}
                  sizes="(min-width: 768px) 33vw, 50vw"
                  className="h-full w-full saturate-[0.85] transition duration-700 ease-out group-hover:scale-110 group-hover:saturate-[1.15] group-focus-visible:scale-110"
                />
                <span
                  aria-hidden="true"
                  className="absolute right-4 top-4 inline-flex h-10 w-10 -rotate-45 scale-50 items-center justify-center rounded-full bg-white text-night-900 opacity-0 transition duration-500 ease-out group-hover:rotate-0 group-hover:scale-100 group-hover:opacity-100"
                >
                  <ArrowUpRight size={18} />
                </span>
                {/* Caption appears on hover; touch screens (no hover) always show it. */}
                <span className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-night-950/95 via-night-950/40 to-transparent p-3 text-white opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 sm:p-5 [@media(hover:none)]:opacity-100">
                  <span className="translate-y-4 text-sm font-normal leading-snug transition-transform duration-500 ease-out group-hover:translate-y-0 md:text-lg [@media(hover:none)]:translate-y-0">
                    {project.title}
                  </span>
                  {(project.date || project.location) && (
                    <span className="mt-1 translate-y-4 text-xs text-white/70 transition-transform delay-75 duration-500 ease-out group-hover:translate-y-0 md:text-sm [@media(hover:none)]:translate-y-0">
                      {[project.date && formatDate(project.date), project.location].filter(Boolean).join(' · ')}
                    </span>
                  )}
                </span>
              </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <ProjectLightbox project={selected} onClose={() => setSelected(null)} />
    </section>
  );
}

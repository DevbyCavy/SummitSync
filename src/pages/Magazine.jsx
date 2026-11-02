import Seo from '../components/Seo.jsx';
import PageHeader from '../components/layout/PageHeader.jsx';
import Img from '../components/ui/Img.jsx';
import { formatMonth } from '../lib/format.js';
import issues from '../content/magazine.json';

// TODO(open): if the magazine lives on an external platform, link the hero button there and drop this page (§13.2).

export default function Magazine() {
  const sorted = [...issues].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <>
      <Seo title="Magazine" description="Read the Summit Sync magazine: industry stories, expert insights and profiles from Zimbabwe's MICE industry." />
      <PageHeader eyebrow="MICE Publication" title="The Summit Sync Magazine">
        Industry stories, expert insights and inspiring profiles spotlighting the people and businesses shaping the MICE landscape.
      </PageHeader>

      <section aria-label="Magazine issues" className="container-content section">
        {sorted.length === 0 ? (
          <p>New issues are coming soon.</p>
        ) : (
          <ul className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
            {sorted.map((issue) => {
              const external = /^https?:\/\//.test(issue.url);
              return (
                <li key={issue.id}>
                  <a
                    href={issue.url}
                    target="_blank"
                    rel={external ? 'noopener noreferrer' : 'noopener'}
                    className="group block"
                  >
                    <Img
                      src={issue.cover}
                      alt={`Cover of ${issue.title}`}
                      width={600}
                      height={800}
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      className="w-full rounded-sm shadow-md transition-transform duration-300 group-hover:-translate-y-1 motion-reduce:transition-none"
                    />
                    <h2 className="mt-4 font-sans text-lg font-normal">{issue.title}</h2>
                    <p className="text-sm text-white/50">{formatMonth(issue.date)}</p>
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </>
  );
}

import { Link } from 'react-router-dom';
import { ArrowDown } from 'lucide-react';
import Img from '../ui/Img.jsx';
import useParallax from '../../lib/useParallax.js';
import { scrollToSection } from '../layout/navLinks.js';

// The four pillars of MICE, shown in the reference's "stats row" style.
const PILLARS = [
  { letter: 'M', label: 'Meetings', text: 'Corporate meetings, board retreats and industry forums.' },
  { letter: 'I', label: 'Incentives', text: 'Reward travel and experiences that motivate high-performing teams.' },
  { letter: 'C', label: 'Conferences', text: 'Local and international conferences, summits and congresses.' },
  { letter: 'E', label: 'Exhibitions', text: 'Trade shows and expos that put brands in front of the right buyers.' },
];

export default function About() {
  const parallaxRef = useParallax(0.12);
  return (
    <section id="about" aria-labelledby="about-title">
      <div className="container-content section">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-20">
          <div>
            <p data-reveal="fade" className="eyebrow mb-4">
              About Us
            </p>
            <h2 id="about-title" data-reveal="up" className="h2-section max-w-md">
              Bringing the MICE Industry Into Focus.
            </h2>
          </div>
          <div>
            <p data-reveal="up" style={{ '--d': '150ms' }} className="lead">
              Summit Sync is a media and industry platform connecting and showcasing Zimbabwe&apos;s Meetings, Incentives,
              Conferences and Exhibitions industry.
            </p>
            <p data-reveal="up" style={{ '--d': '300ms' }} className="muted mt-5">
              Through our publication, industry calendar, directory and networking initiatives, we bring together the people,
              businesses and ideas shaping the business events landscape. Our goal is to make the industry more visible,
              connected and accessible, creating opportunities for collaboration and growth.
            </p>
            <Link
              to="/#why-us"
              data-reveal="fade"
              style={{ '--d': '450ms' }}
              onClick={(e) => scrollToSection(e, 'why-us', '/')}
              className="link-caps mt-8"
            >
              Why Summit Sync <ArrowDown size={14} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <ul className="mt-20 grid grid-cols-2 gap-y-10 border-y border-white/10 py-12 md:grid-cols-4">
          {PILLARS.map(({ letter, label, text }, i) => (
            // Hairline dividers between columns: 2-up on phones, 4-up from tablet.
            // Each column rises in turn; its orange dot pops in just after.
            <li
              key={letter}
              data-reveal="up"
              style={{ '--d': `${i * 140}ms` }}
              className={`group ${i % 2 ? 'border-l border-white/10 pl-6' : ''} ${i === 2 ? 'md:border-l md:border-white/10 md:pl-6' : ''}`}
            >
              <p className="text-[0.7rem] font-medium uppercase tracking-[0.25em] text-white/50">{label}</p>
              <p
                aria-hidden="true"
                className="mt-4 text-6xl font-extralight leading-none text-white transition-colors duration-500 group-hover:text-brand-orange md:text-7xl"
              >
                {letter}
                <span className="pop-dot inline-block text-brand-orange">.</span>
              </p>
              <p className="muted mt-4 max-w-[15rem] text-xs">{text}</p>
            </li>
          ))}
        </ul>

        {/* Wide photo banner: unveils upward, then the photo drifts with parallax. */}
        <div data-reveal="clip" className="relative mt-20 aspect-[4/5] overflow-hidden rounded-2xl sm:aspect-[16/9] lg:aspect-[21/9]">
          {/* Single wrapper child: the unveil clip animates this layer (see index.css). */}
          <div className="absolute inset-0">
            <div ref={parallaxRef} className="absolute inset-x-0 -inset-y-[18%] will-change-transform">
              <Img
                src="/images/about/about.webp"
                alt="Delegates in discussion around a banquet table at a busy, blue-lit conference hall"
                width={1536}
                height={1024}
                sizes="(min-width: 1240px) 1160px, 100vw"
                className="h-full w-full"
              />
            </div>
            <div aria-hidden="true" className="absolute inset-0 bg-night-950/55" />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(ellipse_50%_55%_at_50%_50%,rgba(18,9,20,0.7),transparent)]"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
              <p style={{ '--cd': '500ms' }} className="reveal-child text-4xl font-light tracking-tight text-white md:text-6xl">
                Summit Sync
              </p>
              <p style={{ '--cd': '650ms' }} className="reveal-child mt-3 max-w-md text-sm text-white/75">
                Making Zimbabwe&apos;s business events industry more visible, connected and accessible.
              </p>
              <p
                style={{ '--cd': '850ms' }}
                className="reveal-child mt-6 text-[0.7rem] font-medium uppercase tracking-[0.3em] text-brand-orange"
              >
                The Architects of MICE
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { Link, useLocation } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
import Logo from '../ui/Logo.jsx';
import Button from '../ui/Button.jsx';
import NewsletterForm from '../forms/NewsletterForm.jsx';
import { useSignup } from '../forms/SignupModal.jsx';
import { scrollToSection } from './navLinks.js';
import SmartLink, { siteLink } from '../ui/SmartLink.jsx';
import site from '../../content/site.json';

// In-page sections (`id`), pages (`to`) and site.json links (`linkTo`), shown as one inline row.
const LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'publications', label: 'Publications' },
  { id: 'services', label: 'Services' },
  { id: 'about', label: 'About Us' },
  { id: 'why-us', label: 'Why Summit Sync' },
  { id: 'coverage', label: 'Industry Coverage' },
  { linkTo: 'magazine', label: 'Magazine' },
  { linkTo: 'calendar', label: 'MICE Calendar' },
  { to: '/contact', label: 'Contact' },
];

// Inline SVG social icons (lucide dropped brand icons).
const icons = {
  linkedin: (
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11H3v-11Zm6.5 0h3.8v1.5h.06c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.77 2.65 4.77 6.1v5.45h-4v-4.83c0-1.15-.02-2.63-1.6-2.63-1.6 0-1.85 1.25-1.85 2.55v4.91h-3.95v-11Z" />
  ),
  email: <path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm9 7.2L4 7.3V17h16V7.3l-8 4.9ZM5.2 7 12 11.1 18.8 7H5.2Z" />,
  facebook: (
    <path d="M13.5 21v-7.5h2.53l.38-2.94H13.5V8.69c0-.85.24-1.43 1.46-1.43h1.56V4.63a20.9 20.9 0 0 0-2.27-.12c-2.25 0-3.79 1.37-3.79 3.9v2.17H7.92v2.94h2.54V21h3.04Z" />
  ),
};

function SocialLink({ name, href, label }) {
  // TODO(open): real social URLs (§13.3). Empty links fall back to "#".
  const external = href && !href.startsWith('mailto:');
  return (
    <a
      href={href || '#'}
      aria-label={label}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/80 transition-colors hover:border-brand-orange hover:bg-brand-orange hover:text-white"
    >
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
        {icons[name]}
      </svg>
    </a>
  );
}

function ColumnTitle({ id, children }) {
  return (
    <h2 id={id} className="text-[0.7rem] font-medium uppercase tracking-[0.25em] text-brand-orange">
      {children}
    </h2>
  );
}

export default function Footer() {
  const { pathname } = useLocation();
  const openSignup = useSignup();
  const tel = `tel:${site.phone.replace(/\s+/g, '')}`;

  return (
    <footer className="border-t border-white/10 bg-night-950">
      {/* Call to action */}
      <div className="container-content flex flex-col gap-8 border-b border-white/10 py-16 md:flex-row md:items-end md:justify-between md:py-20">
        <div className="max-w-2xl">
          <p className="eyebrow mb-4">
            Join the network
          </p>
          <h2 className="h2-section">
            Be part of Zimbabwe&apos;s MICE story.
          </h2>
          <p className="muted mt-4 max-w-lg text-base">
            Connect with venues, suppliers, planners and decision-makers shaping the business events industry.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <Button onClick={openSignup}>Sign Up</Button>
          <Button variant="outline" to="/contact">
            Contact Us
          </Button>
        </div>
      </div>

      {/*
       * Centred columns divided by hairlines.
       * Phone: brand, contact, newsletter stacked. Tablet: brand across the top, then contact | newsletter.
       * Desktop: contact | brand | newsletter.
       */}
      <div className="container-content grid grid-cols-1 text-center md:grid-cols-2 lg:grid-cols-3">
        <div className="border-b border-white/10 px-6 py-12 md:border-b-0 md:border-r lg:border-r-0">
          <ColumnTitle id="footer-contact">Contact Us</ColumnTitle>
          <ul className="mt-5 space-y-2 text-sm text-white/70">
            <li>
              <a href={tel} className="tap-area hover:text-white">
                {site.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="tap-area hover:text-white">
                {site.email}
              </a>
            </li>
            <li>{site.location}</li>
          </ul>
        </div>

        <div className="order-first flex flex-col items-center border-b border-white/10 px-6 py-12 md:col-span-2 lg:order-none lg:col-span-1 lg:border-x lg:border-b-0">
          <Link to="/" aria-label="Summit Sync — home" onClick={(e) => scrollToSection(e, 'home', pathname)}>
            <Logo light className="h-20" />
          </Link>
          <p className="muted mt-4 max-w-xs">
            Connecting and showcasing Zimbabwe&apos;s Meetings, Incentives, Conferences and Exhibitions industry.
          </p>
          <div className="mt-5 flex gap-3">
            <SocialLink name="linkedin" href={site.socials.linkedin} label="Summit Sync on LinkedIn" />
            <SocialLink name="facebook" href={site.socials.facebook} label="Summit Sync on Facebook" />
            <SocialLink name="email" href={site.socials.email || `mailto:${site.email}`} label={`Email ${site.email}`} />
          </div>
        </div>

        {/* id="newsletter": target of the "Get the Weekly" / "Subscribe free" buttons. */}
        <div id="newsletter" className="scroll-mt-28 px-6 py-12">
          <ColumnTitle id="newsletter-label">Summit Sync Weekly</ColumnTitle>
          <p className="muted mx-auto mt-5 max-w-xs">
            Your regular dose of MICE industry updates, news and opportunities, every week in your inbox.
          </p>
          <div className="mx-auto mt-5 max-w-sm text-left">
            <NewsletterForm />
          </div>
          <p className="mt-3 text-xs text-white/40">
            No spam. Unsubscribe any time.{' '}
            <Link to="/privacy" className="underline hover:text-white">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>

      {/* Inline site links */}
      <nav aria-label="Footer" className="border-t border-white/10">
        <ul className="container-content flex flex-wrap justify-center gap-x-8 gap-y-3 py-8 text-sm">
          {LINKS.map((l) => (
            <li key={l.label}>
              {l.linkTo ? (
                // Not linked until a URL is set in site.json → shown dimmed and inert.
                <SmartLink
                  url={siteLink(l.linkTo)}
                  className={siteLink(l.linkTo) ? 'tap-area text-white/60 transition-colors hover:text-white' : 'text-white/30'}
                >
                  {l.label}
                </SmartLink>
              ) : l.to ? (
                <Link to={l.to} className="tap-area text-white/60 transition-colors hover:text-white">
                  {l.label}
                </Link>
              ) : (
                <Link
                  to={l.id === 'home' ? '/' : `/#${l.id}`}
                  onClick={(e) => scrollToSection(e, l.id, pathname)}
                  className="tap-area text-white/60 transition-colors hover:text-white"
                >
                  {l.label}
                </Link>
              )}
            </li>
          ))}
          <li>
            <button type="button" onClick={openSignup} className="tap-area text-white/60 transition-colors hover:text-white">
              Join the Network
            </button>
          </li>
        </ul>
      </nav>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-content flex flex-col items-center gap-4 py-6 text-center text-xs uppercase tracking-[0.15em] text-white/40 sm:flex-row sm:justify-between sm:text-left">
          <p>© {new Date().getFullYear()} Summit Sync. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="tap-area hover:text-white">
              Privacy Policy
            </Link>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="group inline-flex items-center gap-2 hover:text-white"
            >
              Back to top
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 transition-transform duration-300 group-hover:-translate-y-1">
                <ArrowUp size={14} aria-hidden="true" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

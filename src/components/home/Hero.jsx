import { useRef } from 'react';
import { ArrowDown } from 'lucide-react';
import Button from '../ui/Button.jsx';
import IconButton from '../ui/IconButton.jsx';
import Img from '../ui/Img.jsx';
import { linkProps, siteLink } from '../ui/SmartLink.jsx';
import MiceWindow from './MiceWindow.jsx';
import useParallax from '../../lib/useParallax.js';
import { goToNewsletter } from '../../lib/newsletter.js';

/** One headline line that rises out of a mask. */
function Line({ delay, className = '', children }) {
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <span className={`anim-rise ${className}`} style={{ '--d': delay }}>
        {children}
      </span>
    </span>
  );
}

export default function Hero() {
  const magazineUrl = siteLink('magazine');
  const parallaxRef = useParallax(0.15);
  const glowRef = useRef(null);
  const frame = useRef(0);

  // Soft orange light that follows the pointer (written straight to CSS vars, no re-renders).
  const onPointerMove = (e) => {
    if (e.pointerType !== 'mouse' || frame.current) return;
    const { clientX, clientY, currentTarget } = e;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      const box = currentTarget.getBoundingClientRect();
      glowRef.current?.style.setProperty('--mx', `${clientX - box.left}px`);
      glowRef.current?.style.setProperty('--my', `${clientY - box.top}px`);
      glowRef.current?.style.setProperty('opacity', '1');
    });
  };

  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      onPointerMove={onPointerMove}
      onPointerLeave={() => glowRef.current?.style.setProperty('opacity', '0')}
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden"
    >
      {/* Full-bleed photo: parallax on the wrapper, slow zoom-out on the image. */}
      <div ref={parallaxRef} className="absolute inset-x-0 -bottom-[5%] -top-[20%] -z-20 will-change-transform">
        <Img
          src="/images/hero/hero.webp"
          alt="Conference stage lit in purple, with a podium, the Zimbabwean flag and banquet tables set for guests"
          width={1672}
          height={941}
          sizes="100vw"
          eager
          className="anim-ken-burns h-full w-full"
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-night-950/80 via-night-950/65 to-night-900"
      />
      {/* Extra darkening behind the headline, where the stage backdrop is brightest. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_45%_at_50%_45%,rgba(18,9,20,0.55),transparent)]"
      />
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-700"
        style={{ background: 'radial-gradient(500px circle at var(--mx, 50%) var(--my, 50%), rgba(245,118,39,0.16), transparent 70%)' }}
      />

      <div className="container-content flex flex-1 flex-col items-center justify-center pb-10 pt-32 text-center">
        <p className="eyebrow anim-fade-up" style={{ '--d': '300ms' }}>
          The Architects of MICE
        </p>
        <h1 id="hero-title" className="h1-hero mt-6">
          <Line delay="450ms">Connecting an Industry.</Line>
          <Line delay="620ms" className="text-white/80">
            Shaping Its Future
          </Line>
        </h1>
      </div>

      <div className="container-content grid grid-cols-1 items-end gap-8 pb-12 lg:grid-cols-[1fr_auto_1fr] lg:pb-14">
        <div className="anim-fade-up max-w-md" style={{ '--d': '950ms' }}>
          <p className="text-xl font-normal text-white">Zimbabwe&apos;s MICE industry, in focus.</p>
          <p className="muted mt-3 text-white/70">
            Stories, insights and the people behind the business events shaping our region, through our magazine, weekly
            newsletter and industry spotlights.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {/* Magazine destination comes from site.json → links; empty = "coming soon" (not clickable). */}
            <Button {...linkProps(magazineUrl)}>Explore the Magazine</Button>
            <Button variant="outline" onClick={goToNewsletter}>
              Get the Weekly
            </Button>
          </div>
        </div>

        <IconButton
          solid
          size="lg"
          label="Scroll to services"
          className="anim-scroll-cue hidden justify-self-center lg:inline-flex"
          style={{ '--d': '1300ms' }}
          onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <ArrowDown size={22} aria-hidden="true" />
        </IconButton>

        <MiceWindow className="anim-slide-in-right justify-self-start lg:justify-self-end" style={{ '--d': '1150ms' }} />
      </div>
    </section>
  );
}

import { useEffect, useRef } from 'react';

/**
 * Parallax: shifts the element vertically as its parent crosses the viewport, so it scrolls
 * slower than the page. Give the element extra height (e.g. -inset-y-[20%]) so edges never show.
 * Writes the transform directly (no re-renders) and is disabled under reduced motion.
 */
export default function useParallax(factor = 0.15) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    let frame = 0;
    const update = () => {
      frame = 0;
      const box = el.parentElement.getBoundingClientRect();
      const fromCentre = box.top + box.height / 2 - window.innerHeight / 2;
      el.style.transform = `translate3d(0, ${(-fromCentre * factor).toFixed(1)}px, 0)`;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [factor]);

  return ref;
}

import { useEffect } from 'react';

const SELECTOR = '[data-reveal]:not(.is-visible)';

/**
 * Site-wide scroll reveals. Watches every element with a `data-reveal` attribute (including ones
 * added later, e.g. after a route change or filter) and adds `.is-visible` once it enters the
 * viewport. The animation itself lives in index.css. Mount once, in App.
 */
export default function useRevealOnScroll() {
  useEffect(() => {
    const showAll = () => document.querySelectorAll(SELECTOR).forEach((el) => el.classList.add('is-visible'));

    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      showAll();
      const mo = new MutationObserver(showAll);
      mo.observe(document.body, { childList: true, subtree: true });
      return () => mo.disconnect();
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );

    const observeNew = (root) => {
      if (root.matches?.(SELECTOR)) io.observe(root);
      root.querySelectorAll?.(SELECTOR).forEach((el) => io.observe(el));
    };
    observeNew(document);

    const mo = new MutationObserver((mutations) => {
      mutations.forEach((m) => m.addedNodes.forEach((node) => node.nodeType === 1 && observeNew(node)));
    });
    mo.observe(document.body, { childList: true, subtree: true });

    // Safety net: after a fast jump (End key, anchor link, fling) the observer can miss elements,
    // leaving them invisible. Once scrolling settles, reveal anything on screen or already scrolled past.
    let settle = 0;
    const revealPassed = () => {
      document.querySelectorAll(SELECTOR).forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight) {
          el.classList.add('is-visible');
          io.unobserve(el);
        }
      });
    };
    const onScroll = () => {
      clearTimeout(settle);
      settle = setTimeout(revealPassed, 150);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    const initial = setTimeout(revealPassed, 600);

    return () => {
      io.disconnect();
      mo.disconnect();
      clearTimeout(settle);
      clearTimeout(initial);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);
}

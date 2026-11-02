import { useEffect, useState } from 'react';

/** Returns the id of the section currently crossing the upper-middle band of the viewport. */
export default function useActiveSection(ids, enabled = true) {
  const [active, setActive] = useState('');
  const key = ids.join(',');

  useEffect(() => {
    if (!enabled) {
      setActive('');
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    key
      .split(',')
      .map((id) => document.getElementById(id))
      .filter(Boolean)
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [key, enabled]);

  return active;
}

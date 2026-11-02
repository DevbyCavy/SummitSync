// Follows the page order (publisher-first).
export const NAV_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'publications', label: 'Publications' },
  { id: 'services', label: 'Services' },
  { id: 'about', label: 'About Us' },
];

/**
 * Click handler for in-page anchors. On the home page it smooth-scrolls without a route change;
 * elsewhere the Link navigates to "/#id" and App's ScrollManager scrolls after mount.
 */
export function scrollToSection(e, id, pathname, after) {
  if (pathname === '/') {
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      if (id === 'home') window.scrollTo({ top: 0, behavior: 'smooth' });
      else el.scrollIntoView({ behavior: 'smooth' });
      window.history.replaceState(null, '', id === 'home' ? '/' : `/#${id}`);
    }
  }
  after?.();
}

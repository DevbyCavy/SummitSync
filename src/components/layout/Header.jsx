import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Logo from '../ui/Logo.jsx';
import Button from '../ui/Button.jsx';
import MobileMenu from './MobileMenu.jsx';
import { useSignup } from '../forms/SignupModal.jsx';
import useActiveSection from '../../lib/useActiveSection.js';
import { NAV_LINKS, scrollToSection } from './navLinks.js';

const SECTION_IDS = NAV_LINKS.map((l) => l.id);

/**
 * Fixed header. On the home page it floats transparently over the full-bleed hero photo,
 * then turns into a dark frosted bar once the page scrolls. Sub-pages always get the bar.
 */
export default function Header() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const openSignup = useSignup();
  const active = useActiveSection(SECTION_IDS, isHome);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  const solid = scrolled || !isHome;

  return (
    <header
      className={`anim-header-in fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid ? 'border-b border-white/10 bg-night-900/80 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="container-content flex h-20 items-center justify-between gap-6">
        <Link to="/" aria-label="Summit Sync — home" onClick={(e) => scrollToSection(e, 'home', pathname)}>
          <Logo light className="h-14" />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1 lg:gap-2">
            {NAV_LINKS.map(({ id, label }) => (
              <li key={id}>
                <Link
                  to={id === 'home' ? '/' : `/#${id}`}
                  onClick={(e) => scrollToSection(e, id, pathname)}
                  aria-current={active === id ? 'location' : undefined}
                  className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                    active === id ? 'bg-white font-medium text-night-900' : 'text-white/80 hover:text-white'
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Button onClick={openSignup} className="px-5 py-2">
            Sign Up
          </Button>
          <Button variant="outline" to="/contact" className="px-5 py-2">
            Contact Us
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full text-white lg:hidden"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen(true)}
        >
          <Menu size={26} aria-hidden="true" />
        </button>
      </div>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} active={active} onSignup={openSignup} />
    </header>
  );
}

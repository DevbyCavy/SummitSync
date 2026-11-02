import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import Logo from '../ui/Logo.jsx';
import Button from '../ui/Button.jsx';
import { NAV_LINKS, scrollToSection } from './navLinks.js';

/** Full-screen slide-in menu below the desktop breakpoint (<1024px). */
export default function MobileMenu({ open, onClose, active, onSignup }) {
  const { pathname } = useLocation();
  const closeRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    closeRef.current?.focus();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  // Portalled to <body>: the header's backdrop-filter would otherwise contain this fixed overlay.
  return createPortal(
    <div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      inert={open ? undefined : ''}
      className={`fixed inset-0 z-[55] flex flex-col bg-night-900 transition-transform duration-300 lg:hidden motion-reduce:transition-none ${
        open ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="container-content flex h-20 items-center justify-between">
        <Logo light className="h-14" />
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full text-white"
        >
          <X size={26} aria-hidden="true" />
        </button>
      </div>
      <nav aria-label="Mobile" className="container-content flex flex-1 flex-col gap-8 pt-6">
        <ul className="flex flex-col gap-5">
          {NAV_LINKS.map(({ id, label }) => (
            <li key={id}>
              <Link
                to={id === 'home' ? '/' : `/#${id}`}
                onClick={(e) => scrollToSection(e, id, pathname, onClose)}
                className={`font-display text-4xl font-light tracking-tight ${active === id ? 'text-brand-orange' : 'text-white'}`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex max-w-sm flex-col gap-3">
          <Button
            onClick={() => {
              onClose();
              onSignup();
            }}
          >
            Sign Up
          </Button>
          <Button variant="outline" to="/contact" onClick={onClose}>
            Contact Us
          </Button>
        </div>
      </nav>
    </div>,
    document.body
  );
}

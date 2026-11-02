import { useLayoutEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/layout/Header.jsx';
import Footer from './components/layout/Footer.jsx';
import { ToastProvider } from './components/ui/Toast.jsx';
import { SignupProvider } from './components/forms/SignupModal.jsx';
import Seo from './components/Seo.jsx';
import ScrollProgress from './components/ui/ScrollProgress.jsx';
import useRevealOnScroll from './lib/useRevealOnScroll.js';
import Home from './pages/Home.jsx';
import Magazine from './pages/Magazine.jsx';
import Calendar from './pages/Calendar.jsx';
import Contact from './pages/Contact.jsx';
import Privacy from './pages/Privacy.jsx';
import NotFound from './pages/NotFound.jsx';

function ScrollManager() {
  const { pathname, hash } = useLocation();
  // Layout effect: the new page's DOM is already committed, so the target section exists and we
  // can jump before paint. Instant, because CSS smooth scrolling would animate from the old page's position.
  useLayoutEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'instant' });
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [pathname, hash]);
  return null;
}

export default function App() {
  const { pathname } = useLocation();
  useRevealOnScroll();

  return (
    <ToastProvider>
      <SignupProvider>
        <Seo organization />
        <ScrollManager />
        <ScrollProgress />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-white focus:px-4 focus:text-night-900 focus:py-2"
        >
          Skip to content
        </a>
        <Header />
        {/* Keyed by path so each page fades in on navigation. */}
        <main id="main" key={pathname} className="anim-page">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/magazine" element={<Magazine />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </SignupProvider>
    </ToastProvider>
  );
}

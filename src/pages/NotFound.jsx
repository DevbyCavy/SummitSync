import { Helmet } from 'react-helmet-async';
import Seo from '../components/Seo.jsx';
import Button from '../components/ui/Button.jsx';
import { LogoMark } from '../components/ui/Logo.jsx';

export default function NotFound() {
  return (
    <section className="relative overflow-hidden">
      <Seo title="Page not found" />
      <Helmet>
        <meta name="robots" content="noindex" />
      </Helmet>
      <LogoMark aria-hidden="true" className="pointer-events-none absolute -right-20 top-0 h-[28rem] w-[28rem] text-white/5" />
      <div className="container-content relative flex min-h-[70vh] flex-col items-start justify-center pb-20 pt-36">
        <p className="eyebrow">Error 404</p>
        <h1 className="h1-hero mt-3">This page has left the venue.</h1>
        <p className="mt-5 max-w-xl text-white/70">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
        <Button to="/" className="mt-8">
          Back home
        </Button>
      </div>
    </section>
  );
}

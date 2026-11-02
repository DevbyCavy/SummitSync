import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import site from '../content/site.json';

const SITE_URL = (import.meta.env.VITE_SITE_URL || site.url).replace(/\/$/, '');

/**
 * Per-page title, description, canonical and social tags.
 * Render once with `organization` (in App) to emit the JSON-LD Organization schema.
 */
export default function Seo({ title, description = site.description, organization = false }) {
  const { pathname } = useLocation();

  if (organization) {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: site.name,
      url: SITE_URL,
      logo: `${SITE_URL}/images/brand/logo.png`,
      telephone: site.phone,
      email: site.email,
      address: { '@type': 'PostalAddress', addressLocality: 'Harare', addressCountry: 'ZW' },
      sameAs: [site.socials.linkedin, site.socials.facebook].filter(Boolean),
    };
    return (
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>
    );
  }

  const fullTitle = title ? `${title} | ${site.name}` : `${site.name} — ${site.tagline}`;
  const url = `${SITE_URL}${pathname}`;
  const image = `${SITE_URL}/og-image.jpg`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={site.name} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}

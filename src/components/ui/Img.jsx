import { useState } from 'react';

const WIDTHS = [480, 960, 1600];

/** "/images/a/b.webp" → "/images/a/b-480.webp 480w, ..." (variants made by `npm run images`). */
function srcSetFor(src) {
  if (!src.endsWith('.webp')) return undefined;
  const stem = src.slice(0, -5);
  return WIDTHS.map((w) => `${stem}-${w}.webp ${w}w`).join(', ');
}

/**
 * Responsive WebP image with explicit dimensions. Until real photos are supplied
 * (TODO(open): §13.4) a missing file falls back to a solid placeholder block, matching the layout.
 */
export default function Img({ src, alt, width, height, sizes = '100vw', tone = 'dark', eager = false, className = '', ...props }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        role={alt ? 'img' : undefined}
        aria-label={alt || undefined}
        aria-hidden={alt ? undefined : true}
        className={`${
          tone === 'light' ? 'bg-gradient-to-br from-cream to-[#F8D9C4]' : 'bg-gradient-to-br from-brand-purple to-[#24122A]'
        } ${className}`}
        style={{ aspectRatio: width && height ? `${width} / ${height}` : undefined }}
      />
    );
  }

  return (
    <img
      src={src}
      srcSet={srcSetFor(src)}
      sizes={sizes}
      alt={alt}
      width={width}
      height={height}
      loading={eager ? 'eager' : 'lazy'}
      // React 18 only passes the attribute through in lowercase.
      fetchpriority={eager ? 'high' : undefined}
      decoding={eager ? 'sync' : 'async'}
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
      {...props}
    />
  );
}

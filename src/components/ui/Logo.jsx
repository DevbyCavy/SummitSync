// Logo assets are generated from the client's logo by `npm run logo` (scripts/make-logo.mjs).
// TODO(open): swap for SVG versions when the client supplies a vector logo (§13.4).

const MARK_MASK = '/images/brand/mark-mask.png';

/** The "S" mark silhouette, filled with the current text colour (used for the hero watermark). */
export function LogoMark({ className = '', style, ...props }) {
  return (
    <span
      className={`block bg-current ${className}`}
      style={{
        WebkitMask: `url(${MARK_MASK}) center / contain no-repeat`,
        mask: `url(${MARK_MASK}) center / contain no-repeat`,
        ...style,
      }}
      {...props}
    />
  );
}

/** Full logo (mark + "SummitSync" wordmark + tagline). `light` = white version for purple backgrounds. */
export default function Logo({ light = false, className = 'h-16' }) {
  return (
    <img
      src={light ? '/images/brand/logo-white.png' : '/images/brand/logo.png'}
      alt="Summit Sync — specialist M.I.C.E services"
      width={598}
      height={430}
      className={`w-auto ${className}`}
    />
  );
}

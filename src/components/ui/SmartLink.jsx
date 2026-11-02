import { Link } from 'react-router-dom';
import site from '../../content/site.json';

/** URL for a named site link (e.g. "magazine") from site.json; empty string = not ready yet. */
export function siteLink(key) {
  return site.links?.[key] ?? '';
}

/** Props for <Button>: internal path → `to`, full URL → new tab, empty → inert "coming soon" button. */
export function linkProps(url) {
  if (!url) return { 'aria-disabled': true, title: 'Coming soon' };
  if (/^https?:\/\//.test(url)) return { href: url, target: '_blank', rel: 'noopener noreferrer' };
  return { to: url };
}

/**
 * Link that adapts to its URL: router Link for internal paths, new-tab anchor for external URLs,
 * and a non-interactive element (marked "coming soon") when the URL is empty.
 */
export default function SmartLink({ url, className = '', children, ...props }) {
  if (!url) {
    return (
      <span aria-disabled="true" title="Coming soon" className={`cursor-default ${className}`} {...props}>
        {children}
      </span>
    );
  }
  if (/^https?:\/\//.test(url)) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className={className} {...props}>
        {children}
      </a>
    );
  }
  return (
    <Link to={url} className={className} {...props}>
      {children}
    </Link>
  );
}

import { Link } from 'react-router-dom';

const base =
  'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-60 aria-disabled:cursor-default';

const variants = {
  primary: 'btn-shine bg-brand-orange text-white hover:bg-brand-orange-light',
  // Light pill, as used for the active item in the reference navigation.
  light: 'bg-white text-night-900 hover:bg-cream',
  // Thin white outline for secondary actions on dark backgrounds.
  outline: 'border border-white/40 bg-transparent text-white hover:border-white hover:bg-white hover:text-night-900',
};
// Older variant names map onto the dark-theme styles.
variants.secondary = variants.outline;
variants['outline-dark'] = variants.outline;
variants['outline-light'] = variants.outline;

/** Renders a router Link (`to`), an anchor (`href`) or a button. */
export default function Button({ variant = 'primary', to, href, className = '', children, ...props }) {
  const cls = `${base} ${variants[variant]} ${className}`;
  if (to) {
    return (
      <Link to={to} className={cls} {...props}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={cls} {...props}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" className={cls} {...props}>
      {children}
    </button>
  );
}

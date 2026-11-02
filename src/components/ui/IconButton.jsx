/**
 * Circular icon button (Services arrows, hero scroll cue). `label` is required for screen readers.
 * `solid` = white disc with dark icon (reference style); default = thin white outline.
 */
export default function IconButton({ label, solid = false, size = 'md', className = '', children, ...props }) {
  const dims = size === 'lg' ? 'h-14 w-14' : 'h-11 w-11';
  const tone = solid
    ? 'bg-white text-night-900 hover:bg-brand-orange hover:text-white'
    : 'border border-white/40 text-white hover:border-brand-orange hover:bg-brand-orange';
  return (
    <button
      type="button"
      aria-label={label}
      className={`inline-flex shrink-0 items-center justify-center rounded-full transition-colors ${dims} ${tone} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

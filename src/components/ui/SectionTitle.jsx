/**
 * Large light heading followed by a hairline that runs to the right edge (reference style).
 * On scroll the eyebrow fades in, the heading rises and the hairline draws itself from the left.
 */
export default function SectionTitle({ children, id, eyebrow, className = '' }) {
  return (
    <div className={`flex items-end gap-8 ${className}`}>
      <div className="min-w-0 sm:shrink-0">
        {eyebrow && (
          <p data-reveal="fade" className="eyebrow mb-4">
            {eyebrow}
          </p>
        )}
        <h2 id={id} data-reveal="up" className="h2-section max-w-xl">
          {children}
        </h2>
      </div>
      <span
        aria-hidden="true"
        data-reveal="line"
        style={{ '--d': '250ms' }}
        className="mb-3 hidden h-px flex-1 bg-white/15 sm:block"
      />
    </div>
  );
}

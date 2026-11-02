/** Title band for sub-pages (clears the fixed header). Large light heading + hairline, as on the home page. */
export default function PageHeader({ eyebrow, title, children }) {
  return (
    <div className="border-b border-white/10 bg-night-950">
      <div className="container-content pb-14 pt-36 md:pb-20 md:pt-44">
        {eyebrow && <p className="eyebrow anim-fade-up">{eyebrow}</p>}
        <div className="mt-4 flex items-end gap-8">
          <h1 className="anim-fade-up min-w-0 font-light sm:shrink-0" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.05, '--d': '120ms' }}>
            {title}
          </h1>
          <span aria-hidden="true" data-reveal="line" style={{ '--d': '350ms' }} className="mb-4 hidden h-px flex-1 bg-white/15 sm:block" />
        </div>
        {children && <div className="lead anim-fade-up mt-6 max-w-2xl text-white/70" style={{ '--d': '250ms' }}>{children}</div>}
      </div>
    </div>
  );
}

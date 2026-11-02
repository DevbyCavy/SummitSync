/** Scrolls to the Summit Sync Weekly sign-up in the footer and puts the cursor in the email box. */
export function goToNewsletter() {
  const block = document.getElementById('newsletter');
  if (!block) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  block.scrollIntoView({ behavior: reduce ? 'instant' : 'smooth', block: 'center' });
  // Focus once the smooth scroll has (mostly) finished; preventScroll avoids a second jump.
  setTimeout(() => block.querySelector('input[type="email"]')?.focus({ preventScroll: true }), reduce ? 0 : 700);
}

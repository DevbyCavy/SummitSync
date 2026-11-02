import useForm from '../../lib/useForm.js';
import { FieldError, Honeypot, Spinner } from './FormParts.jsx';

// §13.5 resolved: "Subscribe" (clearer than the layout's "Email", and matches the accessible name).
const BUTTON_LABEL = 'Subscribe';

export default function NewsletterForm() {
  const { values, errors, sending, field, handleSubmit } = useForm({
    endpoint: 'newsletter',
    initial: { email: '' },
    rules: { email: { required: true, email: true, max: 255, label: 'Email' } },
    successMessage: "You're subscribed to Summit Sync Weekly. Look out for the next issue!",
  });
  const email = field('email');

  return (
    <form onSubmit={handleSubmit} noValidate className="relative" aria-labelledby="newsletter-label">
      <div className="flex rounded-full border border-white/15 bg-white/5 p-1 focus-within:border-brand-orange">
        <label htmlFor={email.id} className="sr-only">
          Email address for newsletter
        </label>
        <input
          {...email}
          type="email"
          autoComplete="email"
          placeholder="Your email"
          className="min-w-0 flex-1 rounded-full bg-transparent px-4 py-2 font-normal text-white placeholder:text-white/40 focus:outline-none"
        />
        <button
          type="submit"
          disabled={sending}
          className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-5 py-2 font-medium text-white transition-colors hover:bg-brand-orange-light disabled:opacity-60"
        >
          {sending && <Spinner />}
          {BUTTON_LABEL}
        </button>
      </div>
      <div className="[&_.field-error]:text-white">
        <FieldError id={`${email.id}-error`} message={errors.email} />
      </div>
      <Honeypot {...field('website')} value={values.website} />
    </form>
  );
}

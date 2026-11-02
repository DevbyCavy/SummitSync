import { Loader2 } from 'lucide-react';

/** Hidden honeypot input. Bots fill it; the API silently discards those submissions. */
export function Honeypot({ value, onChange }) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Website
        <input type="text" name="website" tabIndex={-1} autoComplete="off" value={value} onChange={onChange} />
      </label>
    </div>
  );
}

export function FieldError({ id, message }) {
  if (!message) return null;
  return (
    <p id={id} className="field-error">
      {message}
    </p>
  );
}

/** Labelled input/textarea/select with inline error. `f` is the result of useForm().field(name). */
export function Field({ label, f, error, as = 'input', required = false, className = '', children, ...props }) {
  const Tag = as;
  return (
    <div className={className}>
      <label htmlFor={f.id} className="mb-1.5 block pl-1 text-sm font-normal text-white/80">
        {label}
        {required && <span className="text-brand-orange"> *</span>}
      </label>
      <Tag className="field" required={required} {...f} {...props}>
        {children}
      </Tag>
      <FieldError id={`${f.id}-error`} message={error} />
    </div>
  );
}

export function Spinner() {
  return <Loader2 size={18} className="animate-spin" aria-hidden="true" />;
}

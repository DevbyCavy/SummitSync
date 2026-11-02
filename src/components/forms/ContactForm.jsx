import useForm from '../../lib/useForm.js';
import Button from '../ui/Button.jsx';
import { Field, Honeypot, Spinner } from './FormParts.jsx';

const RULES = {
  name: { required: true, max: 120, label: 'Name' },
  email: { required: true, email: true, max: 255, label: 'Email' },
  phone: { max: 40, label: 'Phone' },
  organisation: { max: 160, label: 'Organisation' },
  subject: { max: 160, label: 'Subject' },
  message: { required: true, max: 5000, label: 'Message' },
};

/** `preset` pre-fills fields, e.g. subject + template for an event listing request. */
export default function ContactForm({ preset = {} }) {
  const { values, errors, sending, field, handleSubmit } = useForm({
    endpoint: 'contact',
    initial: { name: '', email: '', phone: '', organisation: '', subject: '', message: '', ...preset },
    rules: RULES,
    successMessage: "Thanks for getting in touch — we'll get back to you shortly.",
  });

  return (
    <form onSubmit={handleSubmit} noValidate className="relative grid grid-cols-1 gap-5 sm:grid-cols-2">
      <Field label="Name" f={field('name')} error={errors.name} required autoComplete="name" />
      <Field label="Email" f={field('email')} error={errors.email} required type="email" autoComplete="email" />
      <Field label="Phone" f={field('phone')} error={errors.phone} type="tel" autoComplete="tel" />
      <Field label="Organisation" f={field('organisation')} error={errors.organisation} autoComplete="organization" />
      <Field label="Subject" f={field('subject')} error={errors.subject} className="sm:col-span-2" />
      <Field label="Message" f={field('message')} error={errors.message} required as="textarea" rows={6} className="sm:col-span-2" />
      <Honeypot {...field('website')} value={values.website} />
      <div className="sm:col-span-2">
        <Button type="submit" disabled={sending}>
          {sending && <Spinner />}
          {sending ? 'Sending…' : 'Send message'}
        </Button>
      </div>
    </form>
  );
}

import { createContext, useCallback, useContext, useState } from 'react';
import Modal from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';
import useForm from '../../lib/useForm.js';
import { Field, Honeypot, Spinner } from './FormParts.jsx';

// TODO(open): "Sign Up" defaults to joining the industry network (§7.3, §13.1).
// If the client means newsletter only, point the header button at the footer newsletter form instead.

export const ROLES = ['Venue', 'Supplier', 'Planner', 'Corporate', 'Media', 'Other'];

const SignupContext = createContext(() => {});

export function useSignup() {
  return useContext(SignupContext);
}

export function SignupProvider({ children }) {
  const [open, setOpen] = useState(false);
  const openSignup = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);

  return (
    <SignupContext.Provider value={openSignup}>
      {children}
      <Modal open={open} onClose={close} labelledBy="signup-title" className="max-w-lg">
        <SignupForm onDone={close} />
      </Modal>
    </SignupContext.Provider>
  );
}

function SignupForm({ onDone }) {
  const { values, errors, sending, field, handleSubmit } = useForm({
    endpoint: 'signup',
    initial: { name: '', email: '', organisation: '', role: 'Other' },
    rules: {
      name: { required: true, max: 120, label: 'Name' },
      email: { required: true, email: true, max: 255, label: 'Email' },
      organisation: { max: 160, label: 'Organisation' },
    },
    successMessage: "Welcome to the Summit Sync network! We'll be in touch.",
    onSuccess: onDone,
  });

  return (
    <div className="p-6 sm:p-8">
      <p className="eyebrow">Join the network</p>
      <h2 id="signup-title" className="mt-1 text-4xl">
        Sign Up
      </h2>
      <p className="mt-2 text-sm text-white/60">
        Join the Summit Sync industry network and connect with Zimbabwe&apos;s event professionals, venues and suppliers.
      </p>
      <form onSubmit={handleSubmit} noValidate className="relative mt-6 grid grid-cols-1 gap-4">
        <Field label="Name" f={field('name')} error={errors.name} required autoComplete="name" />
        <Field label="Email" f={field('email')} error={errors.email} required type="email" autoComplete="email" />
        <Field label="Organisation" f={field('organisation')} error={errors.organisation} autoComplete="organization" />
        <Field label="I am a…" f={field('role')} as="select">
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </Field>
        <Honeypot {...field('website')} value={values.website} />
        <Button type="submit" disabled={sending} className="mt-2">
          {sending && <Spinner />}
          {sending ? 'Sending…' : 'Join the network'}
        </Button>
      </form>
    </div>
  );
}

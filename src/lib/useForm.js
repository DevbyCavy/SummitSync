import { useState } from 'react';
import { post } from './api.js';
import { validate } from './validators.js';
import { useToast } from '../components/ui/Toast.jsx';

/**
 * Shared form state for the three API forms: validation, sending state, toasts, reset on success.
 * `website` is the honeypot field and is always sent.
 */
export default function useForm({ endpoint, initial, rules, successMessage, onSuccess }) {
  const [values, setValues] = useState({ ...initial, website: '' });
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const toast = useToast();

  function field(name) {
    return {
      name,
      id: `${endpoint}-${name}`,
      value: values[name],
      onChange: (e) => {
        setValues((v) => ({ ...v, [name]: e.target.value }));
        if (errors[name]) setErrors(({ [name]: _removed, ...rest }) => rest);
      },
      'aria-invalid': errors[name] ? true : undefined,
      'aria-describedby': errors[name] ? `${endpoint}-${name}-error` : undefined,
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const found = validate(values, rules);
    setErrors(found);
    if (Object.keys(found).length) {
      e.currentTarget.querySelector(`[name="${Object.keys(found)[0]}"]`)?.focus();
      return;
    }
    setSending(true);
    try {
      const payload = Object.fromEntries(Object.entries(values).map(([k, v]) => [k, typeof v === 'string' ? v.trim() : v]));
      await post(endpoint, payload);
      toast({ type: 'success', message: successMessage });
      setValues({ ...initial, website: '' });
      onSuccess?.();
    } catch (err) {
      toast({ type: 'error', message: err.message });
    } finally {
      setSending(false);
    }
  }

  return { values, errors, sending, field, handleSubmit };
}

const BASE = import.meta.env.VITE_API_BASE || '/api';

/** POST JSON to a PHP endpoint. Resolves to the parsed body; throws an Error with a user-facing message. */
export async function post(endpoint, data) {
  let res;
  try {
    res = await fetch(`${BASE}/${endpoint}.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch {
    throw new Error('Network error. Please check your connection and try again.');
  }
  const body = await res.json().catch(() => ({}));
  if (res.status === 429) throw new Error('Too many requests. Please try again in a few minutes.');
  if (!res.ok || !body.ok) throw new Error(body.error || 'Something went wrong. Please try again.');
  return body;
}

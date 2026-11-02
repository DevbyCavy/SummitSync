export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Validate a values object against rules: { field: { required, email, max, label } }.
 * Returns { field: message } for each failing field.
 */
export function validate(values, rules) {
  const errors = {};
  for (const [field, rule] of Object.entries(rules)) {
    const value = (values[field] ?? '').toString().trim();
    const label = rule.label || field;
    if (rule.required && !value) errors[field] = `${label} is required.`;
    else if (value && rule.email && !EMAIL_RE.test(value)) errors[field] = 'Please enter a valid email address.';
    else if (value && rule.max && value.length > rule.max) errors[field] = `${label} must be ${rule.max} characters or fewer.`;
  }
  return errors;
}

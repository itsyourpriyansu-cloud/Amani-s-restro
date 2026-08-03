const NAME_PATTERN = /^[A-Za-z' -]+$/;

/** Shared first-name validation for any guest-facing or staff-facing coupon form. */
export const validateFirstName = (name) => {
  const trimmed = String(name || '').trim();
  if (!trimmed) return 'Enter your first name';
  if (trimmed.length < 2 || trimmed.length > 50 || !NAME_PATTERN.test(trimmed)) {
    return 'Name should contain at least 2 characters';
  }
  return '';
};

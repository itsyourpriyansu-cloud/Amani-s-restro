/**
 * Deterministic prototype coupon code generator.
 * NOT a real coupon system — no backend validation, redeemable only within this prototype.
 */
export const createPrototypeCouponCode = ({ restaurantPrefix = 'MGR', discountValue = 15, requestId = '' }) => {
  const hash = Array.from(String(requestId)).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const letters =
    String.fromCharCode(65 + (hash % 26)) + String.fromCharCode(65 + ((hash * 7) % 26));
  const digits = String(hash % 100).padStart(2, '0');
  return `${restaurantPrefix}${discountValue}-${letters}${digits}`;
};

export const computeValidUntilDate = (fromDate, validityDays) => {
  const date = new Date(fromDate);
  date.setDate(date.getDate() + validityDays);
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

/**
 * Returns both a machine-comparable ISO expiry (for status derivation) and
 * the human-readable display string, computed from the same date.
 */
export const computeExpiryDates = (fromDate, validityDays) => {
  const date = new Date(fromDate);
  date.setDate(date.getDate() + validityDays);
  return {
    iso: date.toISOString(),
    display: date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
  };
};

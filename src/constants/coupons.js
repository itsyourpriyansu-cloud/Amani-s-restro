/**
 * Derived ledger status for a coupon/request row shown in the Manager Portal
 * Coupon & Loyalty Management module. Distinct from COUPON_REQUEST_STATUS
 * (the underlying pre/post-issuance lifecycle) — this is the presentation
 * status computed at read time from request + coupon + current date.
 */
export const COUPON_LEDGER_STATUS = {
  AWAITING_REVIEW: 'AWAITING_REVIEW',
  ACTIVE: 'ACTIVE',
  EXPIRING_SOON: 'EXPIRING_SOON',
  REDEEMED: 'REDEEMED',
  EXPIRED: 'EXPIRED',
  REVOKED: 'REVOKED',
  DECLINED: 'DECLINED',
};

export const EXPIRING_SOON_WINDOW_DAYS = 7;

export const couponStatusTheme = {
  [COUPON_LEDGER_STATUS.ACTIVE]: { label: 'Active', text: '#137A4A', background: '#E8F7EF', border: '#BDE8D0' },
  [COUPON_LEDGER_STATUS.EXPIRING_SOON]: { label: 'Expiring Soon', text: '#9A5A08', background: '#FFF4DD', border: '#F2D097' },
  [COUPON_LEDGER_STATUS.REDEEMED]: { label: 'Redeemed', text: '#316B54', background: '#EEF5F1', border: '#CEE0D7' },
  [COUPON_LEDGER_STATUS.EXPIRED]: { label: 'Expired', text: '#A22940', background: '#FDEBED', border: '#F3BBC5' },
  [COUPON_LEDGER_STATUS.REVOKED]: { label: 'Revoked', text: '#6E6260', background: '#F1EEEC', border: '#DCD5D1' },
  [COUPON_LEDGER_STATUS.AWAITING_REVIEW]: { label: 'Awaiting Review', text: '#77510A', background: '#FFF7E6', border: '#F0D8A8' },
  [COUPON_LEDGER_STATUS.DECLINED]: { label: 'Declined', text: '#6E6260', background: '#F1EEEC', border: '#DCD5D1' },
};

export const LEDGER_STATUS_TABS = [
  { id: 'ALL', label: 'All' },
  { id: COUPON_LEDGER_STATUS.ACTIVE, label: 'Active' },
  { id: COUPON_LEDGER_STATUS.EXPIRING_SOON, label: 'Expiring Soon' },
  { id: COUPON_LEDGER_STATUS.REDEEMED, label: 'Redeemed' },
  { id: COUPON_LEDGER_STATUS.EXPIRED, label: 'Expired' },
  { id: COUPON_LEDGER_STATUS.REVOKED, label: 'Revoked' },
  { id: COUPON_LEDGER_STATUS.AWAITING_REVIEW, label: 'Awaiting Review' },
];

export const REVOKE_REASONS = [
  'Duplicate coupon',
  'Issued in error',
  'Eligibility not valid',
  'Fraud concern',
  'Customer requested cancellation',
  'Replaced with another coupon',
  'Other',
];

export const COUPON_PERMISSIONS = [
  'COUPON_VIEW',
  'COUPON_SEARCH',
  'COUPON_REDEEM',
  'COUPON_ISSUE',
  'COUPON_RESEND',
  'COUPON_REVOKE',
  'COUPON_EXTEND_EXPIRY',
  'COUPON_REVEAL_PHONE',
  'COUPON_VIEW_AUDIT',
];

export const ROLE_PERMISSIONS = {
  GENERAL_MANAGER: [...COUPON_PERMISSIONS],
  SHIFT_MANAGER: ['COUPON_VIEW', 'COUPON_SEARCH', 'COUPON_REDEEM', 'COUPON_RESEND', 'COUPON_ISSUE', 'COUPON_VIEW_AUDIT'],
  CASHIER: ['COUPON_VIEW', 'COUPON_SEARCH', 'COUPON_REDEEM'],
  WAITER: [],
};

export const hasCouponPermission = (role, permission) => (ROLE_PERMISSIONS[role] || []).includes(permission);

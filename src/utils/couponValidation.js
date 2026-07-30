import { COUPON_LEDGER_STATUS, EXPIRING_SOON_WINDOW_DAYS } from '../constants/coupons';

const PRE_ISSUANCE_REVIEW_STATUSES = ['CUSTOMER_CONFIRMED_SENT', 'AWAITING_RESTAURANT_REVIEW', 'VERIFIED', 'WHATSAPP_OPENED', 'FORM_STARTED'];

/**
 * Derives the presentation ledger status for a coupon request row.
 * Status is computed at read time from request + coupon + current date —
 * never stored separately, so the ledger can never drift out of sync with
 * the underlying coupon requests.
 */
export const computeCouponLedgerStatus = (request, now = new Date()) => {
  if (!request) return null;
  if (request.status === 'DECLINED') return COUPON_LEDGER_STATUS.DECLINED;
  if (!request.coupon) {
    if (PRE_ISSUANCE_REVIEW_STATUSES.includes(request.status)) return COUPON_LEDGER_STATUS.AWAITING_REVIEW;
    return null;
  }

  const coupon = request.coupon;
  if (coupon.revocation) return COUPON_LEDGER_STATUS.REVOKED;
  if (coupon.redemption) return COUPON_LEDGER_STATUS.REDEEMED;

  const expiresAt = coupon.expiresAt ? new Date(coupon.expiresAt) : null;
  if (expiresAt && now.getTime() > expiresAt.getTime()) return COUPON_LEDGER_STATUS.EXPIRED;

  if (expiresAt) {
    const msRemaining = expiresAt.getTime() - now.getTime();
    const daysRemaining = msRemaining / (1000 * 60 * 60 * 24);
    if (daysRemaining <= EXPIRING_SOON_WINDOW_DAYS) return COUPON_LEDGER_STATUS.EXPIRING_SOON;
  }

  return COUPON_LEDGER_STATUS.ACTIVE;
};

export const daysUntil = (isoDate, now = new Date()) => {
  const target = new Date(isoDate);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
};

/**
 * Pure validation for whether a coupon can be redeemed right now.
 * Does not mutate state — the redemption drawer confirms separately.
 */
export const validateCouponForRedemption = (request, now = new Date()) => {
  const blockingReasons = [];
  const warnings = [];

  if (!request) {
    return { valid: false, status: 'NOT_FOUND', blockingReasons: ['No coupon found for this code or number'], warnings: [] };
  }

  const ledgerStatus = computeCouponLedgerStatus(request, now);

  if (ledgerStatus === COUPON_LEDGER_STATUS.AWAITING_REVIEW) {
    return { valid: false, status: 'AWAITING_REVIEW', blockingReasons: ['The guest request is still awaiting eligibility review.'], warnings: [] };
  }
  if (ledgerStatus === COUPON_LEDGER_STATUS.DECLINED) {
    return { valid: false, status: 'DECLINED', blockingReasons: ['This coupon request was declined.'], warnings: [] };
  }
  if (!request.coupon) {
    return { valid: false, status: 'NOT_ISSUED', blockingReasons: ['This coupon has not been issued yet.'], warnings: [] };
  }
  if (ledgerStatus === COUPON_LEDGER_STATUS.REVOKED) {
    blockingReasons.push('Coupon has been revoked');
    return { valid: false, status: 'REVOKED', blockingReasons, warnings };
  }
  if (ledgerStatus === COUPON_LEDGER_STATUS.REDEEMED) {
    blockingReasons.push('Coupon has already been redeemed');
    return { valid: false, status: 'ALREADY_REDEEMED', blockingReasons, warnings };
  }
  if (ledgerStatus === COUPON_LEDGER_STATUS.EXPIRED) {
    blockingReasons.push('Coupon validity period has passed');
    return { valid: false, status: 'EXPIRED', blockingReasons, warnings };
  }
  if (!request.consent?.fulfilmentGranted) {
    blockingReasons.push('Coupon-fulfilment consent was not recorded for this request');
  }
  if (!request.orderReference?.invoiceId) {
    blockingReasons.push('No source invoice is linked to this coupon');
  }

  if (ledgerStatus === COUPON_LEDGER_STATUS.EXPIRING_SOON) {
    warnings.push(`Expires in ${daysUntil(request.coupon.expiresAt, now)} days`);
  }

  return {
    valid: blockingReasons.length === 0,
    status: blockingReasons.length === 0 ? 'VALID' : 'BLOCKED',
    blockingReasons,
    warnings,
  };
};

import { computeCouponLedgerStatus } from '../utils/couponValidation';

/** Normalizes a phone-like query: strips spaces, +, hyphens, brackets. */
const normalizePhoneQuery = (q) => q.replace(/[\s+\-()]/g, '');

export const rowMatchesQuery = (request, rawQuery) => {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return true;

  const phoneQuery = normalizePhoneQuery(query);
  const haystacks = [
    request.requestId,
    request.customer?.firstName,
    request.orderReference?.invoiceId,
    request.orderReference?.orderId,
    request.coupon?.code,
  ].filter(Boolean).map((v) => v.toLowerCase());

  if (haystacks.some((v) => v.includes(query))) return true;

  if (/^\d{3,}$/.test(phoneQuery)) {
    const fullMobile = request.customer?.formattedMobile || '';
    if (fullMobile.includes(phoneQuery)) return true;
  }

  return false;
};

/**
 * Builds the coupon ledger from the shared couponRequests array — a
 * presentation-only projection, not a duplicated data source.
 */
export const getCouponLedger = (couponRequests, { statusFilter = 'ALL', search = '', sortBy = 'issuedAt', sortDir = 'desc', now = new Date() } = {}) => {
  let rows = couponRequests
    .filter((r) => r.status !== 'CANCELLED')
    .map((r) => ({ request: r, ledgerStatus: computeCouponLedgerStatus(r, now) }))
    .filter((row) => row.ledgerStatus !== null);

  if (statusFilter !== 'ALL') {
    rows = rows.filter((row) => row.ledgerStatus === statusFilter);
  }

  if (search.trim()) {
    rows = rows.filter((row) => rowMatchesQuery(row.request, search));
  }

  const getSortValue = (row) => {
    switch (sortBy) {
      case 'issuedAt': return row.request.coupon?.issuedAt ? new Date(row.request.coupon.issuedAt).getTime() : new Date(row.request.createdAt).getTime();
      case 'expiresAt': return row.request.coupon?.expiresAt ? new Date(row.request.coupon.expiresAt).getTime() : 0;
      case 'status': return row.ledgerStatus;
      case 'guestName': return row.request.customer?.firstName?.toLowerCase() || '';
      case 'couponCode': return row.request.coupon?.code || '';
      case 'redeemedAt': return row.request.coupon?.redemption?.redeemedAt ? new Date(row.request.coupon.redemption.redeemedAt).getTime() : 0;
      default: return 0;
    }
  };

  rows.sort((a, b) => {
    const av = getSortValue(a);
    const bv = getSortValue(b);
    if (av < bv) return sortDir === 'asc' ? -1 : 1;
    if (av > bv) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  return rows;
};

export const paginate = (rows, page, pageSize) => {
  const start = (page - 1) * pageSize;
  return rows.slice(start, start + pageSize);
};

export const computeCouponStats = (couponRequests, now = new Date()) => {
  const withCoupon = couponRequests.filter((r) => r.status !== 'CANCELLED' && r.coupon);
  const ledgerRows = couponRequests
    .filter((r) => r.status !== 'CANCELLED')
    .map((r) => ({ request: r, ledgerStatus: computeCouponLedgerStatus(r, now) }));

  const active = ledgerRows.filter((row) => row.ledgerStatus === 'ACTIVE').length;
  const expiringSoon = ledgerRows.filter((row) => row.ledgerStatus === 'EXPIRING_SOON').length;
  const redeemed = ledgerRows.filter((row) => row.ledgerStatus === 'REDEEMED').length;
  const issuedCount = withCoupon.length;
  const totalClaimed = couponRequests.filter((r) => r.status !== 'CANCELLED').length;

  const attributedRevenuePaise = withCoupon.reduce((sum, r) => sum + (r.coupon?.attributedOrderRevenuePaise || 0), 0);

  return {
    totalClaimed,
    active,
    expiringSoon,
    redeemed,
    issuedCount,
    redemptionRatePct: issuedCount > 0 ? Math.round((redeemed / issuedCount) * 1000) / 10 : 0,
    attributedRevenuePaise,
  };
};

import { formatCurrency } from './formatters';
import { loyaltyCouponConfig } from '../config/loyaltyCouponConfig';

/** Whole-rupee formatting (Indian digit grouping via en-IN locale) for compact stat cards. */
export const formatWholeRupees = (paiseOrRupees, { fromPaise = false } = {}) => {
  const rupees = fromPaise ? (Number(paiseOrRupees) || 0) / 100 : Number(paiseOrRupees) || 0;
  return formatCurrency(rupees, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

export const formatRupeesFromPaise = (paise) => formatCurrency((Number(paise) || 0) / 100);

export const toPaise = (rupees) => Math.round((Number(rupees) || 0) * 100);

/** Formats a coupon/campaign offer as "15% OFF" or "₹100 OFF" depending on discount type. */
export const formatDiscountLabel = ({ discountType, discountValue }) => {
  if (discountType === 'FLAT') return `${formatWholeRupees(discountValue)} OFF`;
  return `${discountValue}% OFF`;
};

/**
 * Computes the rupee discount amount for a given bill subtotal and offer,
 * shared by the redemption preview and the real redemption handler so the
 * two never drift apart. Flat discounts are capped at the subtotal.
 */
export const computeDiscountAmount = (subtotal, { discountType, discountValue }) => {
  if (discountType === 'FLAT') {
    return Math.min(Number(discountValue) || 0, subtotal);
  }
  return Math.round(subtotal * ((Number(discountValue) || 0) / 100) * 100) / 100;
};

/** Friendly campaign name, falling back to the fixed milestone config name or the raw campaign id. */
export const getCampaignLabel = (couponOffer) => {
  if (couponOffer?.name) return couponOffer.name;
  if (couponOffer?.campaignId === loyaltyCouponConfig.id) return loyaltyCouponConfig.name;
  return couponOffer?.campaignId || 'Custom Campaign';
};

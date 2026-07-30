import { restaurantConfig } from '../config/restaurantConfig';

/**
 * Normalize a raw Indian mobile number input into a validated 10-digit form.
 * Strips spaces, hyphens, brackets, a leading 0, and a repeated +91/91 prefix.
 */
export const parseIndianMobile = (rawInput) => {
  let digits = String(rawInput || '').replace(/[^\d]/g, '');

  if (digits.length === 12 && digits.startsWith('91')) {
    digits = digits.slice(2);
  } else if (digits.length === 11 && digits.startsWith('0')) {
    digits = digits.slice(1);
  }

  const isValid = /^[6-9]\d{9}$/.test(digits);

  return {
    digits10: digits.slice(0, 10),
    isValid: isValid && digits.length === 10,
    e164: `91${digits}`,
  };
};

export const maskMobile = (digits10) => {
  const clean = String(digits10 || '').replace(/[^\d]/g, '');
  if (clean.length < 4) return '******';
  return `******${clean.slice(-4)}`;
};

/**
 * Builds the customer -> restaurant coupon claim message.
 */
export const buildCouponClaimMessage = ({
  firstName,
  discountValue,
  milestoneVisits,
  invoiceNumber,
  orderNumber,
  requestId,
}) => {
  return [
    `Hi ${restaurantConfig.name}! My name is ${firstName}.`,
    `I'd like to claim my ${discountValue}% OFF Regular Guest coupon after completing ${milestoneVisits} visits.`,
    '',
    `Invoice: ${invoiceNumber}`,
    orderNumber ? `Order: ${orderNumber}` : null,
    `Coupon Request: ${requestId}`,
    '',
    'Please help me complete the coupon request.',
  ]
    .filter(Boolean)
    .join('\n');
};

/**
 * Builds the restaurant -> customer coupon-ready reply message (manager side).
 */
export const buildCouponReplyMessage = ({ firstName, code, discountType = 'PERCENTAGE', discountValue, validUntil, campaignName = 'Regular Guest' }) => {
  const offerLabel = discountType === 'FLAT' ? `₹${discountValue} OFF` : `${discountValue}% OFF`;
  return [
    `Hi ${firstName}! Your ${restaurantConfig.name} ${campaignName} coupon is ready.`,
    `Coupon Code: ${code}`,
    `Offer: ${offerLabel}`,
    `Valid Until: ${validUntil}`,
    '',
    'Please show this code during your next eligible visit. Terms apply.',
  ].join('\n');
};

export const createWhatsAppUrl = (message, businessNumber = restaurantConfig.whatsapp.businessNumber) => {
  return `https://wa.me/${businessNumber}?text=${encodeURIComponent(message)}`;
};

/**
 * Opens a WhatsApp deep link only in direct response to a user action (button click),
 * so browser popup blockers don't suppress it. Falls back to same-tab navigation
 * if the popup was blocked.
 */
export const openWhatsAppUrl = (whatsappUrl) => {
  const newWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  if (!newWindow) {
    window.location.href = whatsappUrl;
  }
};

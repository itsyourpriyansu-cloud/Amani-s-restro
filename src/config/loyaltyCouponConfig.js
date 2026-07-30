/**
 * Frontend prototype settings for the Regular Guest WhatsApp coupon milestone.
 * Single source of truth for coupon copy, eligibility rule, and conditions text
 * shared by the Customer PWA and the Manager Portal.
 */
export const loyaltyCouponConfig = {
  id: 'REGULAR_GUEST_15',
  name: 'Regular Guest Coupon',
  milestoneVisits: 5,
  discountType: 'PERCENTAGE',
  discountValue: 15,
  requestChannel: 'WHATSAPP',
  eligibilityLabel: '5 completed visits',
  active: true,
  validityDays: 30,
  onePerMilestone: true,
  allowCombination: false,
};

export const loyaltyCouponConditions = [
  'Available after five completed visits',
  'One Regular Guest coupon per eligible milestone',
  'Coupon validity is configured by the restaurant',
  'Cannot be combined with another coupon unless configured',
  'Subject to restaurant terms and availability',
  'Coupon is issued only after the WhatsApp request is reviewed',
  'Coupon eligibility is linked to the completed visit or invoice',
  'Marketing consent is not required to claim the coupon',
];

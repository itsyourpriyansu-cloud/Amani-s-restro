import api, { mockApiDelay } from './api';

export const cartService = {
  // Validate cart items availability and pricing with backend
  async validateCart(items) {
    try {
      // Production: return await api.post('/cart/validate', { items });
      return await mockApiDelay({ isValid: true, items });
    } catch (error) {
      console.error("Cart validation error:", error);
      throw error;
    }
  },

  // Apply discount voucher / promo code
  async applyPromoCode(code) {
    try {
      const validPromos = {
        'MANGAMMA10': { discountPercent: 10, code: 'MANGAMMA10', description: '10% off your order' },
        'BIRYANI10': { discountPercent: 10, code: 'BIRYANI10', description: '10% off Biryanis' },
        'WELCOME20': { discountPercent: 20, code: 'WELCOME20', description: '20% Welcome Feast Discount' }
      };

      const promo = validPromos[code.trim().toUpperCase()];
      if (promo) {
        return await mockApiDelay({ success: true, promo });
      } else {
        return await mockApiDelay({ success: false, message: 'Invalid or expired promo code' }, 300);
      }
    } catch (error) {
      console.error("Error applying promo code:", error);
      throw error;
    }
  }
};

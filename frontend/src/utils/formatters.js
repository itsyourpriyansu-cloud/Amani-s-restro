import { restaurantConfig } from '../config/restaurantConfig';

/**
 * Format any numerical currency amount according to restaurant configuration.
 */
export const formatCurrency = (amount, options = {}) => {
  const numericAmount = Number(amount) || 0;
  const locale = options.locale || restaurantConfig.currencyLocale || 'en-IN';
  const currency = options.currency || restaurantConfig.currencyCode || 'INR';

  const defaultFractionDigits = options.minimumFractionDigits !== undefined 
    ? options.minimumFractionDigits 
    : restaurantConfig.invoicePriceDecimals;

  const formatterOptions = {
    style: 'currency',
    currency,
    minimumFractionDigits: defaultFractionDigits,
    maximumFractionDigits: options.maximumFractionDigits !== undefined 
      ? options.maximumFractionDigits 
      : defaultFractionDigits,
    ...options,
  };

  return new Intl.NumberFormat(locale, formatterOptions).format(numericAmount);
};

/**
 * Format prices for menu items, food cards, and compact lists.
 * Shows whole rupees without paise when no fraction exists (e.g. ₹90, ₹140, ₹1,250).
 */
export const formatMenuPrice = (amount) => {
  const numericAmount = Number(amount) || 0;
  const hasDecimals = numericAmount % 1 !== 0;
  const decimals = hasDecimals ? (restaurantConfig.invoicePriceDecimals || 2) : (restaurantConfig.menuPriceDecimals || 0);

  return formatCurrency(numericAmount, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

/**
 * Format financial invoice totals, bills, payments, and financial reports.
 * Always displays two decimal places (e.g. ₹1,250.00, ₹50,708.00, ₹272.62).
 */
export const formatInvoiceAmount = (amount) => {
  const numericAmount = Number(amount) || 0;
  const decimals = restaurantConfig.invoicePriceDecimals !== undefined ? restaurantConfig.invoicePriceDecimals : 2;

  return formatCurrency(numericAmount, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

/**
 * Format date in Asia/Kolkata timezone (e.g., "27 Jul 2026").
 */
export const formatDate = (dateInput) => {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return String(dateInput);

  return new Intl.DateTimeFormat('en-GB', {
    timeZone: restaurantConfig.timezone || 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

/**
 * Format time in Asia/Kolkata timezone (e.g., "5:54 PM").
 */
export const formatTime = (dateInput) => {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return String(dateInput);

  return new Intl.DateTimeFormat('en-US', {
    timeZone: restaurantConfig.timezone || 'Asia/Kolkata',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
};

/**
 * Format date and time combined (e.g., "27 Jul 2026, 5:54 PM").
 */
export const formatDateTime = (dateInput) => {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return String(dateInput);

  const datePart = formatDate(date);
  const timePart = formatTime(date);
  return `${datePart}, ${timePart}`;
};

/**
 * Format salary/wages for staff members.
 * e.g., "₹18,000/month" or "₹18,000 per month".
 */
export const formatSalary = (amount, period = restaurantConfig.payrollDisplay.defaultSalaryPeriod || 'month', options = {}) => {
  const numericAmount = Number(amount) || 0;
  const formattedAmount = formatCurrency(numericAmount, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const periodLabel = period === 'month' ? (options.longForm ? 'per month' : '/month')
    : period === 'hour' ? (options.longForm ? 'per hour' : '/hour')
    : period;

  return `${formattedAmount} ${periodLabel}`.trim();
};

/**
 * Derives a dynamic invoice number from the active order/bill reference
 * (e.g. billId 'BILL-1048' or orderId 'ORD-1048' -> 'INV-1048').
 */
export const deriveInvoiceNumber = (activeOrder) => {
  const source = activeOrder?.billId || activeOrder?.orderId || 'ORD-1048';
  return `INV-${source.replace(/^[A-Z]+-/, '')}`;
};

export const generateOrderId = () => {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${restaurantConfig.invoiceRules.invoicePrefix || 'INV'}-${randomNum}`;
};

export const calculateCartTotals = (items = [], tipPercentage = 0, discountAmount = 0, packagingCharge = 0, customTipAmount = null) => {
  const subtotal = items.reduce((acc, item) => {
    const itemPrice = (item.price || 0) + (item.selectedCustomizations?.reduce((cAcc, opt) => cAcc + (opt.price || 0), 0) || 0);
    return acc + (itemPrice * (item.quantity || 1));
  }, 0);

  const taxableAmount = Math.max(0, subtotal - discountAmount + (restaurantConfig.billingPolicy.packagingChargeEnabled ? packagingCharge : 0));
  const totalTaxRate = (restaurantConfig.taxStructure.totalRate || 5) / 100;
  const gst = taxableAmount * totalTaxRate; // GST @ 5%
  const cgst = gst * ((restaurantConfig.taxStructure.cgstRate || 2.5) / (restaurantConfig.taxStructure.totalRate || 5));
  const sgst = gst * ((restaurantConfig.taxStructure.sgstRate || 2.5) / (restaurantConfig.taxStructure.totalRate || 5));
  const total = taxableAmount + gst; // Total bill amount before tip

  const tipAmount = customTipAmount !== null && customTipAmount !== undefined && customTipAmount !== ''
    ? Number(customTipAmount) || 0
    : (subtotal * tipPercentage) / 100;

  const totalPayable = total + tipAmount;

  return {
    subtotal: Math.max(0, subtotal),
    discountAmount: Math.max(0, discountAmount),
    packagingCharge: Math.max(0, packagingCharge),
    taxableAmount,
    tax: gst,
    vat: 0,
    gst,
    cgst,
    sgst,
    total,
    tipAmount: Math.max(0, tipAmount),
    totalPayable: Math.max(0, totalPayable),
    grandTotal: Math.max(0, totalPayable),
    itemCount: items.reduce((acc, item) => acc + (item.quantity || 1), 0),
  };
};

export const restaurantConfig = {
  // Brand identity — the single source of truth for restaurant name/branding.
  // Every module should read from here instead of hardcoding restaurant strings.
  id: 'AMANIS-KITCHEN',
  name: "Amani's Kitchen",
  nativeName: '',
  parentCompany: "Amani's Group",
  parentCompanyLabel: "Amani's Kitchen",
  establishedYear: 2024,
  logo: '/Amanis Logo Final.svg',

  tagline: 'A Taste of the South, Made With Heart.',

  shortDescription:
    "Established in 2024, Amani's Kitchen brings authentic South Indian heirloom recipes and heartfelt hospitality to every table.",

  aboutStory:
    "Established in 2024, Amani's Kitchen was created to bring timeless South Indian recipes and memorable dining experiences to every table. From traditional spices to heartfelt hospitality, our journey is driven by one simple promise — to serve food that brings people together.",

  contact: {
    phone: '8886911773',
    email: 'contact@amaniskitchen.com',
    website: 'www.amaniskitchen.com',
    socialHandle: '/amaniskitchen',
  },

  branding: {
    primaryColor: '#742F1C',
    actionColor: '#C89552',
    backgroundColor: '#FDFBF7',
  },

  countryCode: 'IN',
  countryName: 'India',

  currencyCode: 'INR',
  currencySymbol: '₹',
  currencyLocale: 'en-IN',

  menuPriceDecimals: 0,
  invoicePriceDecimals: 2,

  timezone: 'Asia/Kolkata',
  dateFormat: 'DD MMM YYYY',
  timeFormat: '12-hour',

  taxStructure: {
    taxName: 'GST',
    totalRate: 5,
    cgstRate: 2.5,
    sgstRate: 2.5,
    pricesIncludeTax: false,
  },

  billingPolicy: {
    serviceChargeEnabled: false,
    voluntaryTipEnabled: true,
    defaultTipPercentage: 0,
    tipOptions: [0, 5, 10],
    packagingChargeEnabled: true,
  },

  invoiceRules: {
    documentTitle: 'Tax Invoice',
    invoicePrefix: 'INV',
    gstin: '36ABCDE1234F1Z5',
    fssaiNumber: '12345678901234',
  },

  payrollDisplay: {
    defaultSalaryPeriod: 'month',
    currencyCode: 'INR',
  },

  // WhatsApp coupon-request prototype destination — the restaurant's business
  // number, kept in one place so no component hardcodes it directly.
  whatsapp: {
    countryCode: '91',
    businessNumber: '918886911773',
    displayNumber: '+91 88869 11773',
  },
};

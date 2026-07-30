import { DISHES, CATEGORIES, RESTAURANT_INFO } from '../utils/mockData';
import { dashboardMockData } from '../utils/managerMockData';
import { restaurantConfig } from '../config/restaurantConfig';
import { formatDateTime } from '../utils/formatters';

export { dashboardMockData };

// Storage Keys
const EMPLOYEES_STORAGE_KEY = 'mangamma_employees';
const SETTINGS_STORAGE_KEY = 'mangamma_manager_settings';
const RESERVATIONS_STORAGE_KEY = 'mangamma_reservations';
const AUDIT_LOG_STORAGE_KEY = 'mangamma_audit_logs';

export const INITIAL_EMPLOYEES = [
  {
    id: 'staff-1',
    name: 'Rahul Sharma',
    role: 'Waiter',
    email: 'rahul.s@mangammaruchulu.in',
    phone: '+91 98401 11223',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    shift: 'Morning Shift (09:00 - 18:00)',
    status: 'Clocked In',
    salary: 18000,
    salaryPeriod: 'month',
    overtimeRate: 120,
    joinDate: '2021-03-15',
    department: 'Floor Service'
  },
  {
    id: 'staff-2',
    name: 'Ananya Reddy',
    role: 'Waiter',
    email: 'ananya.r@mangammaruchulu.in',
    phone: '+91 98402 22334',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    shift: 'Morning Shift (09:00 - 18:00)',
    status: 'Clocked In',
    salary: 18000,
    salaryPeriod: 'month',
    overtimeRate: 120,
    joinDate: '2022-01-10',
    department: 'Floor Service'
  },
  {
    id: 'staff-3',
    name: 'Imran Khan',
    role: 'Counter',
    email: 'imran.k@mangammaruchulu.in',
    phone: '+91 98403 33445',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    shift: 'Shift A (08:30 - 17:30)',
    status: 'Clocked In',
    salary: 22000,
    salaryPeriod: 'month',
    overtimeRate: 140,
    joinDate: '2020-06-01',
    department: 'Counter & Cash'
  },
  {
    id: 'staff-4',
    name: 'Sneha Patel',
    role: 'Kitchen Staff',
    email: 'sneha.p@mangammaruchulu.in',
    phone: '+91 98404 44556',
    avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=200&q=80',
    shift: 'Mid Shift (10:00 - 19:00)',
    status: 'Clocked In',
    salary: 24000,
    salaryPeriod: 'month',
    overtimeRate: 150,
    joinDate: '2023-04-12',
    department: 'Kitchen'
  },
  {
    id: 'staff-5',
    name: 'Priya Nair',
    role: 'Head Chef',
    email: 'priya.n@mangammaruchulu.in',
    phone: '+91 98405 55667',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    shift: 'Off Today',
    status: 'On Leave',
    salary: 35000,
    salaryPeriod: 'month',
    overtimeRate: 200,
    joinDate: '2022-08-18',
    department: 'Kitchen'
  }
];

export const INITIAL_SETTINGS = {
  restaurantName: RESTAURANT_INFO.name,
  tagline: RESTAURANT_INFO.tagline,
  established: RESTAURANT_INFO.established,
  address: RESTAURANT_INFO.address,
  phone: "+91 (80) 4123-8888",
  email: "contact@mangammaruchulu.in",
  country: restaurantConfig.countryName,
  countryCode: restaurantConfig.countryCode,
  currency: restaurantConfig.currencySymbol,
  currencyCode: restaurantConfig.currencyCode,
  currencyLocale: restaurantConfig.currencyLocale,
  timezone: restaurantConfig.timezone,
  dateFormat: restaurantConfig.dateFormat,
  timeFormat: restaurantConfig.timeFormat,
  taxRate: restaurantConfig.taxStructure.totalRate, // 5% GST
  cgstRate: restaurantConfig.taxStructure.cgstRate,
  sgstRate: restaurantConfig.taxStructure.sgstRate,
  vatRate: 0,
  pricesIncludeTax: restaurantConfig.taxStructure.pricesIncludeTax,
  serviceCharge: 0,
  serviceChargeEnabled: restaurantConfig.billingPolicy.serviceChargeEnabled,
  voluntaryTipEnabled: restaurantConfig.billingPolicy.voluntaryTipEnabled,
  defaultTipPercentage: restaurantConfig.billingPolicy.defaultTipPercentage,
  tipSuggestions: restaurantConfig.billingPolicy.tipOptions,
  gstin: restaurantConfig.invoiceRules.gstin,
  fssai: restaurantConfig.invoiceRules.fssaiNumber,
  documentTitle: restaurantConfig.invoiceRules.documentTitle,
  invoicePrefix: restaurantConfig.invoiceRules.invoicePrefix,
  defaultSalaryPeriod: restaurantConfig.payrollDisplay.defaultSalaryPeriod,
  operatingHours: {
    monday: "07:30 AM - 10:30 PM",
    tuesday: "07:30 AM - 10:30 PM",
    wednesday: "07:30 AM - 10:30 PM",
    thursday: "07:30 AM - 11:00 PM",
    friday: "07:30 AM - 11:30 PM",
    saturday: "07:00 AM - 11:30 PM",
    sunday: "07:00 AM - 10:30 PM"
  },
  receiptHeader: "Dhanyavadamulu / Thank you for dining at Mangamma Ruchulu!",
  receiptFooter: "Please visit us again! A Journey of Tradition. A Legacy of Flavour.",
  autoPrintReceipt: true,
  lowStockAlertThreshold: 5,
  kitchenDelayAlertMinutes: 15,
  enableOnlineOrders: true,
};

export const INITIAL_RESERVATIONS = [
  {
    id: 'res-301',
    guestName: 'Kalyan Sundaram',
    phone: '+91 98409 01234',
    partySize: 4,
    date: new Date().toISOString().split('T')[0],
    time: '19:30',
    tableNumber: '04',
    section: 'Main Dining Room',
    status: 'Confirmed',
    notes: 'Family dinner. Requested Chicken Dum Biryani & Sweet Lassi ready.'
  },
  {
    id: 'res-302',
    guestName: 'Dr. Meenakshi Raman',
    phone: '+91 98401 23456',
    partySize: 6,
    date: new Date().toISOString().split('T')[0],
    time: '20:00',
    tableNumber: 'VIP-1',
    section: 'VIP Lounge',
    status: 'Confirmed',
    notes: 'VIP Guests. Andhra Feast menu preference.'
  },
  {
    id: 'res-303',
    guestName: 'Arjun Menon',
    phone: '+91 98407 89012',
    partySize: 2,
    date: new Date().toISOString().split('T')[0],
    time: '21:00',
    tableNumber: '07',
    section: 'Patio Garden',
    status: 'Checked-in',
    notes: 'Outdoor dining preference.'
  }
];

export const INITIAL_AUDIT_LOGS = [
  {
    id: 'log-1',
    action: 'Daily Shift Reconciliation',
    user: 'Sundaram Pillai',
    timestamp: '27 Jul 2026, 5:54 PM',
    details: 'Reconciled 186 completed orders totalling ₹50,708.00 gross sales.',
    type: 'finance'
  },
  {
    id: 'log-2',
    action: 'Cash Till Drawer Audit',
    user: 'Imran Khan',
    timestamp: '27 Jul 2026, 4:30 PM',
    details: 'Verified cash drawer collection ₹7,688.00 against 31 transactions.',
    type: 'finance'
  },
  {
    id: 'log-3',
    action: 'Staff Shift Check-in',
    user: 'Rahul Sharma',
    timestamp: '27 Jul 2026, 9:00 AM',
    details: 'Clocked in for floor waiter shift.',
    type: 'staff'
  }
];

// Analytics Mock Data matching dashboardMockData
export const REPORTS_MOCK_DATA = {
  salesOverview: {
    grossSales: dashboardMockData.grossSales,
    netRevenue: dashboardMockData.netCollected,
    totalOrders: dashboardMockData.completedOrders,
    avgTicket: dashboardMockData.averageOrderValue,
    taxCollected: Math.round(dashboardMockData.grossSales * 0.05),
    vatCollected: 0,
    discountsGiven: dashboardMockData.discounts,
    tipsCollected: 0
  },
  hourlyTraffic: dashboardMockData.hourlySales.map(h => ({ hour: h.time, orders: h.orders, sales: h.amount })),
  paymentSplit: dashboardMockData.paymentBreakdown,
  categoryPerformance: [
    { name: 'Biryanis & Rice Specials', sales: 21760.00, count: 68, color: 'bg-rose-500' },
    { name: 'Thalis & Curries', sales: 16768.00, count: 69, color: 'bg-amber-500' },
    { name: 'Starters & Tandoor', sales: 7560.00, count: 54, color: 'bg-emerald-500' },
    { name: 'Refreshing Drinks', sales: 4620.00, count: 77, color: 'bg-purple-500' }
  ],
  topDishes: dashboardMockData.popularItems,
  staffPerformance: dashboardMockData.activeStaff
};

// Storage Access Helper Functions
export const getStoredEmployees = () => {
  try {
    const data = localStorage.getItem(EMPLOYEES_STORAGE_KEY);
    return data ? JSON.parse(data) : INITIAL_EMPLOYEES;
  } catch (e) {
    console.error("Error reading employees from localStorage", e);
    return INITIAL_EMPLOYEES;
  }
};

export const setStoredEmployees = (employees) => {
  try {
    localStorage.setItem(EMPLOYEES_STORAGE_KEY, JSON.stringify(employees));
  } catch (e) {
    console.error("Error saving employees to localStorage", e);
  }
};

export const getStoredManagerSettings = () => {
  try {
    const data = localStorage.getItem(SETTINGS_STORAGE_KEY);
    return data ? JSON.parse(data) : INITIAL_SETTINGS;
  } catch (e) {
    console.error("Error reading settings from localStorage", e);
    return INITIAL_SETTINGS;
  }
};

export const setStoredManagerSettings = (settings) => {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error("Error saving settings to localStorage", e);
  }
};

export const getStoredReservations = () => {
  try {
    const data = localStorage.getItem(RESERVATIONS_STORAGE_KEY);
    return data ? JSON.parse(data) : INITIAL_RESERVATIONS;
  } catch (e) {
    console.error("Error reading reservations from localStorage", e);
    return INITIAL_RESERVATIONS;
  }
};

export const setStoredReservations = (reservations) => {
  try {
    localStorage.setItem(RESERVATIONS_STORAGE_KEY, JSON.stringify(reservations));
  } catch (e) {
    console.error("Error saving reservations to localStorage", e);
  }
};

export const getStoredAuditLogs = () => {
  try {
    const data = localStorage.getItem(AUDIT_LOG_STORAGE_KEY);
    return data ? JSON.parse(data) : INITIAL_AUDIT_LOGS;
  } catch (e) {
    console.error("Error reading audit logs from localStorage", e);
    return INITIAL_AUDIT_LOGS;
  }
};

export const addAuditLog = (action, details, type = 'system', user = 'Sundaram Pillai') => {
  const currentLogs = getStoredAuditLogs();
  const newLog = {
    id: `log-${Date.now()}`,
    action,
    user,
    timestamp: formatDateTime(new Date()),
    details,
    type
  };
  const updated = [newLog, ...currentLogs];
  try {
    localStorage.setItem(AUDIT_LOG_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Error saving audit log", e);
  }
  return updated;
};

export const dashboardMockData = {
  dateLabel: 'Today, 27 July 2026',
  reportingPeriod: '12:00 AM – 5:54 PM',
  comparisonLabel: 'Compared with previous Monday',
  lastUpdated: '5:54 PM',

  completedOrders: 186,
  pendingOrders: 4,
  cancelledOrders: 7,

  grossSales: 50708,
  discounts: 2150,
  refunds: 640,
  netCollected: 47918,

  averageOrderValue: 272.62,

  paymentBreakdown: [
    { method: 'UPI', amount: 30420, transactions: 112, percentage: 60.0, color: 'bg-primary' },
    { method: 'Card', amount: 12600, transactions: 43, percentage: 24.8, color: 'bg-secondary' },
    { method: 'Cash', amount: 7688, transactions: 31, percentage: 15.2, color: 'bg-saffron-600' },
  ],

  hourlySales: [
    { time: '11 AM', amount: 4200, orders: 15, percentage: 8.3 },
    { time: '12 PM', amount: 7100, orders: 26, percentage: 14.0 },
    { time: '1 PM', amount: 9800, orders: 36, percentage: 19.3 },
    { time: '2 PM', amount: 6600, orders: 24, percentage: 13.0 },
    { time: '3 PM', amount: 3200, orders: 12, percentage: 6.3 },
    { time: '4 PM', amount: 5800, orders: 21, percentage: 11.4 },
    { time: '5 PM', amount: 14008, orders: 52, percentage: 27.6 },
  ],

  popularItems: [
    { rank: 1, name: 'Chicken Dum Biryani', quantity: 68, revenue: 17000, contribution: '30.8%' },
    { rank: 2, name: 'Gobi 65', quantity: 54, revenue: 11880, contribution: '21.5%' },
    { rank: 3, name: 'Aritaku Bojanam (Veg)', quantity: 46, revenue: 11500, contribution: '20.8%' },
    { rank: 4, name: 'Sweet Lassi', quantity: 77, revenue: 7700, contribution: '13.9%' },
    { rank: 5, name: 'Paneer Butter Masala', quantity: 23, revenue: 7153, contribution: '13.0%' },
  ],

  activeStaff: [
    {
      id: 'staff-1',
      name: 'Rahul Sharma',
      role: 'Waiter',
      status: 'On Shift',
      ordersHandled: 48,
      salesHandled: 13240,
      avgOrderValue: 275.83,
    },
    {
      id: 'staff-2',
      name: 'Ananya Reddy',
      role: 'Waiter',
      status: 'On Shift',
      ordersHandled: 44,
      salesHandled: 11980,
      avgOrderValue: 272.27,
    },
    {
      id: 'staff-3',
      name: 'Imran Khan',
      role: 'Counter',
      status: 'On Shift',
      ordersHandled: 51,
      salesHandled: 14388,
      avgOrderValue: 282.12,
    },
    {
      id: 'staff-4',
      name: 'Sneha Patel',
      role: 'Waiter',
      status: 'On Shift',
      ordersHandled: 43,
      salesHandled: 11100,
      avgOrderValue: 258.14,
    },
  ],

  unavailableStaff: [
    {
      id: 'staff-5',
      name: 'Priya Nair',
      role: 'Waiter',
      status: 'On Leave',
    },
  ],

  drillDownMockDetails: {
    transactions: [
      { id: 'TXN-901', time: '5:42 PM', table: 'Table 04', items: '2x Chicken Dum Biryani, 2x Sweet Lassi', method: 'UPI', amount: 700, status: 'Completed' },
      { id: 'TXN-902', time: '5:30 PM', table: 'Table 08', items: '1x Aritaku Bojanam (Veg), 1x Paneer Butter Masala', method: 'Card', amount: 510, status: 'Completed' },
      { id: 'TXN-903', time: '5:15 PM', table: 'Table 02', items: '3x Gobi 65, 3x Sweet Lassi', method: 'Cash', amount: 600, status: 'Completed' },
      { id: 'TXN-904', time: '4:50 PM', table: 'Table 11', items: '4x Chicken Dum Biryani', method: 'UPI', amount: 1280, status: 'Completed' },
      { id: 'TXN-905', time: '4:25 PM', table: 'Table 05', items: '2x Aritaku Bojanam (Veg), 2x Gobi 65', method: 'Card', amount: 720, status: 'Completed' },
    ],
    completedOrders: [
      { id: 'ORD-8101', time: '5:40 PM', server: 'Rahul Sharma', table: 'Table 04', amount: 700, itemsCount: 4 },
      { id: 'ORD-8100', time: '5:28 PM', server: 'Ananya Reddy', table: 'Table 08', amount: 510, itemsCount: 2 },
      { id: 'ORD-8099', time: '5:10 PM', server: 'Imran Khan', table: 'Counter POS', amount: 600, itemsCount: 6 },
      { id: 'ORD-8098', time: '4:45 PM', server: 'Sneha Patel', table: 'Table 11', amount: 1280, itemsCount: 4 },
    ],
    hourlyTransactions: [
      { timeBucket: '11:00 AM – 12:00 PM', orders: 15, sales: 4200, peakItem: 'Gobi 65' },
      { timeBucket: '12:00 PM – 01:00 PM', orders: 26, sales: 7100, peakItem: 'Aritaku Bojanam (Veg)' },
      { timeBucket: '01:00 PM – 02:00 PM', orders: 36, sales: 9800, peakItem: 'Chicken Dum Biryani' },
      { timeBucket: '02:00 PM – 03:00 PM', orders: 24, sales: 6600, peakItem: 'Paneer Butter Masala' },
      { timeBucket: '03:00 PM – 04:00 PM', orders: 12, sales: 3200, peakItem: 'Sweet Lassi' },
      { timeBucket: '04:00 PM – 05:00 PM', orders: 21, sales: 5800, peakItem: 'Gobi 65' },
      { timeBucket: '05:00 PM – 05:54 PM', orders: 52, sales: 14008, peakItem: 'Chicken Dum Biryani' },
    ],
    paymentRecords: [
      { method: 'UPI Settlement', gateway: 'PhonePe / GPay PG', totalAmount: 30420, count: 112, status: 'Reconciled' },
      { method: 'Card Terminal', gateway: 'HDFC POS Terminal', totalAmount: 12600, count: 43, status: 'Reconciled' },
      { method: 'Cash Till Drawer', gateway: 'POS Drawer #01', totalAmount: 7688, count: 31, status: 'Reconciled' },
    ],
    itemOrders: [
      { name: 'Chicken Dum Biryani', price: 250, qtySold: 68, totalRevenue: 17000, category: 'Biryanis' },
      { name: 'Gobi 65', price: 220, qtySold: 54, totalRevenue: 11880, category: 'Chinese Veg Starters' },
      { name: 'Sweet Lassi', price: 100, qtySold: 77, totalRevenue: 7700, category: 'Refreshing Drinks' },
      { name: 'Aritaku Bojanam (Veg)', price: 250, qtySold: 46, totalRevenue: 11500, category: 'Meals' },
      { name: 'Paneer Butter Masala', price: 311, qtySold: 23, totalRevenue: 7153, category: 'Main Course – Veg' },
    ],
    employeeActivity: [
      { name: 'Rahul Sharma', role: 'Waiter', shift: '09:00 AM - 06:00 PM', orders: 48, totalSales: 13240, avgOrder: 275.83 },
      { name: 'Ananya Reddy', role: 'Waiter', shift: '09:00 AM - 06:00 PM', orders: 44, totalSales: 11980, avgOrder: 272.27 },
      { name: 'Imran Khan', role: 'Counter Cashier', shift: '08:30 AM - 05:30 PM', orders: 51, totalSales: 14388, avgOrder: 282.12 },
      { name: 'Sneha Patel', role: 'Waiter', shift: '10:00 AM - 07:00 PM', orders: 43, totalSales: 11100, avgOrder: 258.14 },
    ]
  }
};

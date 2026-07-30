export const WAITER_PROFILE = {
  id: 'w-101',
  employeeId: 'STF-2024',
  name: 'Ananya Reddy',
  role: 'Senior Waiter & Terrace Lead',
  badge: 'MANGAMMA RUCHULU LEAD',
  avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
  onDuty: true,
  assignedSection: 'Main Dining Hall & Courtyard',
  currentShift: 'Morning Shift',
  shiftStartedAt: '09:00 AM',
  hoursWorked: 4.5,
  salary: 18000,
  salaryPeriod: 'month',
  shiftStats: {
    tablesServed: 18,
    avgServiceMinutes: 6.2,
    tipsEarned: 450,
    activeTablesCount: 5,
    customerRating: 4.95,
  }
};

export const INITIAL_WAITER_TABLES = [
  {
    tableNumber: '01',
    section: 'Indoor Main Hall',
    capacity: 2,
    status: 'available', // 'available' | 'seated' | 'cooking' | 'ready' | 'call_waiter' | 'bill_requested'
    serverName: 'Unassigned',
    guestCount: 0,
    activeOrderId: null,
    totalBill: 0,
    seatedMinutes: 0
  },
  {
    tableNumber: '02',
    section: 'Indoor Main Hall',
    capacity: 4,
    status: 'cooking',
    serverName: 'Ananya Reddy',
    guestCount: 3,
    activeOrderId: 'ORD-8942',
    totalBill: 640,
    seatedMinutes: 18
  },
  {
    tableNumber: '03',
    section: 'Indoor Main Hall',
    capacity: 2,
    status: 'available',
    serverName: 'Unassigned',
    guestCount: 0,
    activeOrderId: null,
    totalBill: 0,
    seatedMinutes: 0
  },
  {
    tableNumber: '04',
    section: 'Indoor Main Hall',
    capacity: 6,
    status: 'seated',
    serverName: 'Ananya Reddy',
    guestCount: 5,
    activeOrderId: null,
    totalBill: 0,
    seatedMinutes: 8
  },
  {
    tableNumber: '05',
    section: 'Outdoor Courtyard',
    capacity: 2,
    status: 'call_waiter',
    serverName: 'Ananya Reddy',
    guestCount: 2,
    activeOrderId: 'ORD-8941',
    totalBill: 510,
    seatedMinutes: 24
  },
  {
    tableNumber: '06',
    section: 'Outdoor Courtyard',
    capacity: 4,
    status: 'cooking',
    serverName: 'Rahul Sharma',
    guestCount: 4,
    activeOrderId: null,
    totalBill: 890,
    seatedMinutes: 32
  },
  {
    tableNumber: '07',
    section: 'Outdoor Courtyard',
    capacity: 2,
    status: 'available',
    serverName: 'Unassigned',
    guestCount: 0,
    activeOrderId: null,
    totalBill: 0,
    seatedMinutes: 0
  },
  {
    tableNumber: '08',
    section: 'Outdoor Courtyard',
    capacity: 4,
    status: 'cooking',
    serverName: 'Ananya Reddy',
    guestCount: 4,
    activeOrderId: 'ORD-8940',
    totalBill: 720,
    seatedMinutes: 14
  },
  {
    tableNumber: '09',
    section: 'Outdoor Courtyard',
    capacity: 6,
    status: 'bill_requested',
    serverName: 'Ananya Reddy',
    guestCount: 5,
    activeOrderId: null,
    totalBill: 1280,
    seatedMinutes: 48
  },
  {
    tableNumber: '10',
    section: 'Indoor Main Hall',
    capacity: 2,
    status: 'available',
    serverName: 'Unassigned',
    guestCount: 0,
    activeOrderId: null,
    totalBill: 0,
    seatedMinutes: 0
  },
  {
    tableNumber: '11',
    section: 'Indoor Main Hall',
    capacity: 4,
    status: 'seated',
    serverName: 'Sneha Patel',
    guestCount: 3,
    activeOrderId: null,
    totalBill: 0,
    seatedMinutes: 5
  },
  {
    tableNumber: '12',
    section: 'Outdoor Courtyard',
    capacity: 2,
    status: 'ready',
    serverName: 'Ananya Reddy',
    guestCount: 2,
    activeOrderId: 'ORD-8939',
    totalBill: 340,
    seatedMinutes: 28
  }
];

export const INITIAL_BILL_REQUESTS = [
  {
    id: 'bill-1',
    tableNumber: '09',
    guestCount: 5,
    serverName: 'Ananya Reddy',
    subtotal: 1219.05,
    tax: 60.95,
    cgst: 30.48,
    sgst: 30.47,
    vat: 0,
    grandTotal: 1280.00,
    paymentMethod: 'UPI / Card',
    splitRequested: false,
    requestedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    status: 'pending' // 'pending' | 'settled'
  },
  {
    id: 'bill-2',
    tableNumber: '14',
    guestCount: 2,
    serverName: 'Rahul Sharma',
    subtotal: 485.71,
    tax: 24.29,
    cgst: 12.15,
    sgst: 12.14,
    vat: 0,
    grandTotal: 510.00,
    paymentMethod: 'UPI / Contactless',
    splitRequested: true,
    requestedAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    status: 'pending'
  }
];

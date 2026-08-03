/**
 * Shared Restaurant Prototype Operational Dataset
 * Single source of truth for all frontend roles (Customer, Kitchen, Waiter, Counter, Manager).
 */

import biryaniVideo from '../assets/no_have_no_images.mp4';

export const SHARED_PROTOTYPE_IDS = {
  restaurantId: 'REST-001',
  tableId: 'TABLE-08',
  orderId: 'ORD-1048',
  orderItemId: 'ITEM-1048-01',
  kitchenTicketId: 'KOT-1048',
  billId: 'BILL-1048',
  paymentId: 'PAY-1048',
  guestFlowId: 'GF-220',
  issueId: 'ISSUE-208',
  reviewId: 'REV-1048'
};

export const RESTAURANT_TRUST_PROFILE = {
  restaurantId: 'REST-001',
  restaurantName: "Amani's Kitchen",
  shortKitchenIntroduction:
    'Authentic South Indian food prepared fresh for each service period using heirloom recipes and stone-ground spices.',

  chefProfile: {
    name: 'Chef Arjun Rao',
    role: 'Head Chef',
    experienceLabel: '12 years of professional kitchen experience',
    story:
      'Trained under heirloom master cooks across South India, Chef Arjun emphasizes hand-ground masalas, traditional stone cooking, and precise heat control.',
    image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=400&q=80',
    philosophy: 'Authentic South Indian flavors through fresh ingredients and traditional techniques.',
    speciality: 'South Indian Heirloom Curries & Signature Biryanis'
  },

  ingredientSourcing: [
    {
      label: 'Vegetables',
      description: 'Sourced daily from selected local suppliers'
    },
    {
      label: 'Dairy',
      description: 'Supplied by a licensed regional dairy partner'
    },
    {
      label: 'Spices',
      description: 'Prepared and stored in labelled kitchen batches'
    }
  ],

  hygieneAudit: {
    lastAuditDate: '18 Jul 2026',
    auditType: 'Internal hygiene review',
    status: 'Completed',
    nextReviewDate: '18 Aug 2026'
  },

  fssai: {
    number: '12345678901234',
    statusLabel: 'Restaurant-provided licence information'
  },

  kitchenSeparation: {
    vegetarianArea: true,
    nonVegetarianArea: true,
    description:
      'Vegetarian and non-vegetarian preparation areas use separate labelled equipment where configured.'
  },

  allergyPolicy: {
    summary: 'Allergy requests are reviewed by the kitchen before acceptance.',
    crossContactWarning:
      'The kitchen cannot guarantee a completely allergen-free environment.'
  },

  servicePromise: {
    title: 'Our service promise',
    description:
      'We show realistic preparation estimates and notify guests when expectations change.'
  },

  preparationAccuracy: {
    value: 86,
    label: 'Orders completed within the communicated preparation window',
    period: 'Last 30 days',
    sampleSize: 428,
    lastUpdated: '27 Jul 2026, 6:00 PM',
    calculationExplanation:
      'Calculated as the percentage of completed table orders where all items were ready and served within the preparation window displayed at order placement.'
  }
};

export const VERIFIED_CUSTOMER_PHOTOS = [
  {
    photoId: 'PHOTO-1048-1',
    orderId: 'ORD-1048',
    billId: 'BILL-1048',
    reviewId: 'REV-1048',
    verifiedOrder: true,
    submittedAt: '26 Jul 2026',
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80',
    caption: 'Fragrant Chicken Dum Biryani served hot'
  },
  {
    photoId: 'PHOTO-1043-1',
    orderId: 'ORD-1043',
    billId: 'BILL-1043',
    reviewId: 'REV-1043',
    verifiedOrder: true,
    submittedAt: '25 Jul 2026',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
    caption: 'Mutton Dum Biryani with fresh raita'
  }
];

export const VERIFIED_CUSTOMER_REVIEWS = [
  {
    reviewId: 'REV-1048',
    orderId: 'ORD-1048',
    billId: 'BILL-1048',
    rating: 5,
    reviewText: 'The biryani was fragrant and the updated preparation time was accurate.',
    submittedAt: '26 Jul 2026',
    verificationStatus: 'VERIFIED_COMPLETED_ORDER',
    displayName: 'Verified guest'
  },
  {
    reviewId: 'REV-1039',
    orderId: 'ORD-1039',
    billId: 'BILL-1039',
    rating: 4,
    reviewText: 'Great Aritaku Bojanam (Veg) meal. Kitchen load updates kept us informed about the short wait.',
    submittedAt: '25 Jul 2026',
    verificationStatus: 'VERIFIED_COMPLETED_ORDER',
    displayName: 'Verified guest'
  }
];

export const INITIAL_KITCHEN_LOAD = {
  status: 'BUSY', // 'NORMAL', 'BUSY', 'VERY_BUSY', 'PAUSED'
  activeTickets: 18,
  delayedTickets: 3,
  averagePreparationMinutes: 24,
  lastUpdated: '7:24 PM',
  customerMessage: 'Kitchen is currently busy. Longer preparation times are expected.'
};

export const INITIAL_PROTOTYPE_EMPLOYEES = [
  {
    id: 'staff-1',
    name: 'Rahul Sharma',
    role: 'Waiter',
    phone: '+91 98401 11223',
    email: 'rahul.s@mangammaruchulu.in',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    shift: 'Morning Shift (09:00 - 18:00)',
    status: 'On Shift',
    availability: 'On Shift',
    assignedTables: ['04', '08', '11'],
    assignedSection: 'Main Dining Hall',
    department: 'Floor Service',
    joinDate: '2021-03-15'
  },
  {
    id: 'staff-2',
    name: 'Ananya Reddy',
    role: 'Shift Manager',
    phone: '+91 98402 22334',
    email: 'ananya.r@mangammaruchulu.in',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    shift: 'Morning Shift (09:00 - 18:00)',
    status: 'On Shift',
    availability: 'On Shift',
    assignedTables: ['05', '09'],
    assignedSection: 'Window Bay',
    department: 'Floor Service',
    joinDate: '2022-01-10'
  },
  {
    id: 'staff-3',
    name: 'Imran Khan',
    role: 'Counter Staff',
    phone: '+91 98403 33445',
    email: 'imran.k@mangammaruchulu.in',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    shift: 'Full Shift (08:30 - 17:30)',
    status: 'On Shift',
    availability: 'On Shift',
    assignedTables: [],
    assignedSection: 'Billing Counter',
    department: 'Counter & Cash',
    joinDate: '2020-06-01'
  },
  {
    id: 'staff-4',
    name: 'Sneha Patel',
    role: 'Kitchen Staff',
    phone: '+91 98404 44556',
    email: 'sneha.p@mangammaruchulu.in',
    avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=200&q=80',
    shift: 'Mid Shift (10:00 - 19:00)',
    status: 'On Shift',
    availability: 'On Shift',
    assignedTables: [],
    assignedSection: 'Hot Kitchen & Tandoor',
    department: 'Kitchen',
    joinDate: '2023-04-12'
  },
  {
    id: 'staff-5',
    name: 'Chef Arjun Rao',
    role: 'Head Chef',
    phone: '+91 98405 55667',
    email: 'arjun.r@mangammaruchulu.in',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    shift: 'Full Day',
    status: 'On Shift',
    availability: 'On Shift',
    assignedTables: [],
    assignedSection: 'Main Kitchen',
    department: 'Kitchen',
    joinDate: '2022-08-18'
  }
];

export const INITIAL_INGREDIENTS = [
  {
    ingredientId: 'ING-PANEER',
    ingredientName: 'Paneer',
    status: 'AVAILABLE',
    affectedItems: ['mcveg-paneer-butter-masala'],
    affectedItemNames: ['Paneer Butter Masala']
  },
  {
    ingredientId: 'ING-CHICKEN',
    ingredientName: 'Chicken Stock',
    status: 'AVAILABLE',
    affectedItems: ['biryani-mutton-dum'],
    affectedItemNames: ['Mutton Dum Biryani']
  },
  {
    ingredientId: 'ING-BIRYANI-MASALA',
    ingredientName: 'Dum Biryani Masala Mix',
    status: 'AVAILABLE',
    affectedItems: ['biryani-chicken-dum', 'cveg-crispy-corn'],
    affectedItemNames: ['Chicken Dum Biryani', 'Crispy Corn Kernel']
  },
  {
    ingredientId: 'ING-CARROT',
    ingredientName: 'Fresh Carrot',
    status: 'AVAILABLE',
    affectedItems: ['dessert-carrot-halwa'],
    affectedItemNames: ['Carrot Halwa']
  }
];

export const INITIAL_PROTOTYPE_GUEST_FLOW = [
  {
    guestFlowId: 'GF-220',
    guestType: 'RESERVATION',
    guestName: 'Priya',
    maskedMobile: '******4821',
    partySize: 4,
    requestedDate: '27 Jul 2026',
    requestedTime: '8:00 PM',
    arrivalTime: '7:55 PM',
    expectedWaitMinutes: '20–25 minutes',
    estimateUpdatedAt: '7:40 PM',
    assignedTableId: 'TABLE-08',
    status: 'ARRIVED',
    repeatGuest: true,
    completedVisits: 5,
    specialRequests: ['Quiet section preferred', 'Birthday celebration'],
    seatingPreference: 'Quiet Section',
    internalNote: 'Regular guest - pre-assigned Table 08'
  },
  {
    guestFlowId: 'GF-221',
    guestType: 'WALK_IN',
    guestName: 'Ramesh Kumar',
    maskedMobile: '******3210',
    partySize: 2,
    requestedDate: '27 Jul 2026',
    requestedTime: '7:30 PM',
    arrivalTime: '7:30 PM',
    expectedWaitMinutes: '15–20 minutes',
    estimateUpdatedAt: '7:35 PM',
    assignedTableId: null,
    status: 'WAITING',
    repeatGuest: false,
    completedVisits: 1,
    specialRequests: ['High chair required'],
    seatingPreference: 'Main Hall',
    internalNote: 'Walk-in queue position 1'
  },
  {
    guestFlowId: 'GF-222',
    guestType: 'RESERVATION',
    guestName: 'Siddharth V',
    maskedMobile: '******2334',
    partySize: 6,
    requestedDate: '27 Jul 2026',
    requestedTime: '9:15 PM',
    arrivalTime: null,
    expectedWaitMinutes: '0 minutes',
    estimateUpdatedAt: '7:00 PM',
    assignedTableId: 'TABLE-09',
    status: 'CONFIRMED',
    repeatGuest: true,
    completedVisits: 3,
    specialRequests: ['Anniversary', 'Large Group'],
    seatingPreference: 'Window Bay',
    internalNote: 'Cake storage requested'
  },
  {
    guestFlowId: 'GF-223',
    guestType: 'WALK_IN',
    guestName: 'Anita Roy',
    maskedMobile: '******9912',
    partySize: 8,
    requestedDate: '27 Jul 2026',
    requestedTime: '7:45 PM',
    arrivalTime: '7:45 PM',
    expectedWaitMinutes: '25–30 minutes',
    estimateUpdatedAt: '7:45 PM',
    assignedTableId: null,
    groupedTableIds: ['TABLE-10', 'TABLE-11'],
    status: 'WAITING',
    repeatGuest: false,
    completedVisits: 0,
    specialRequests: ['Large Group', 'Wheelchair Access'],
    seatingPreference: 'Ground Floor',
    internalNote: 'Requires grouped seating for 8 guests'
  }
];

export const INITIAL_PROTOTYPE_ORDERS = [
  {
    orderId: 'ORD-1048',
    restaurantId: 'REST-001',
    tableId: 'TABLE-08',
    tableNumber: '08',
    kitchenTicketId: 'KOT-1048',
    billId: 'BILL-1048',
    paymentId: 'PAY-1048',
    guestFlowId: 'GF-220',
    customerSession: 'QR-T08-2707',
    orderStatus: 'PREPARING',
    kitchenStatus: 'IN_PROGRESS',
    billStatus: 'NOT_REQUESTED',
    paymentStatus: 'UNPAID',
    assignedWaiter: 'Rahul Sharma',
    placedAt: '7:18 PM',
    acceptedAt: '7:20 PM',
    prepStartedAt: '7:23 PM',
    previousEstimate: '7:38 PM',
    estimatedReadyAt: '7:46 PM',
    etaChangeReason: 'Biryani station handling higher order volume.',
    etaUpdatedAt: '7:31 PM',
    elapsedMinutes: 12,
    guestCount: 2,
    isDelayed: true,
    delayReason: 'Kitchen is handling higher order volume',
    items: [
      {
        orderItemId: 'ITEM-1048-01',
        id: 'item-1048-01',
        orderId: 'ORD-1048',
        dishId: 'biryani-chicken-dum',
        name: 'Chicken Dum Biryani',
        quantity: 2,
        unitPrice: 250,
        total: 500,
        station: 'BIRYANI_STATION',
        course: 'MAIN',
        courseAction: 'FIRE_NOW',
        status: 'READY',
        readinessStatus: 'READY',
        preparationStartedAt: '7:23 PM',
        expectedReadyAt: '7:38 PM',
        note: 'Extra raita, less oil',
        spiceLevel: 'MEDIUM',
        modifiers: ['Medium Spice', 'Extra Raita', 'No Onion']
      },
      {
        orderItemId: 'ITEM-1048-02',
        id: 'item-1048-02',
        orderId: 'ORD-1048',
        dishId: 'drink-sweet-lassi',
        name: 'Sweet Lassi',
        quantity: 2,
        unitPrice: 100,
        total: 200,
        station: 'BEVERAGE_STATION',
        course: 'BEVERAGE',
        courseAction: 'FIRE_NOW',
        status: 'READY',
        readinessStatus: 'READY',
        preparationStartedAt: '7:20 PM',
        expectedReadyAt: '7:25 PM',
        note: 'Less sweet',
        spiceLevel: 'MILD',
        modifiers: ['Less Sweet', 'Chilled']
      },
      {
        orderItemId: 'ITEM-1048-03',
        id: 'item-1048-03',
        orderId: 'ORD-1048',
        dishId: 'meals-aritaku-veg',
        name: 'Aritaku Bojanam (Veg)',
        quantity: 1,
        unitPrice: 250,
        total: 250,
        station: 'BIRYANI_STATION',
        course: 'MAIN',
        courseAction: 'FIRE_NOW',
        status: 'PREPARING',
        readinessStatus: 'PREPARING',
        preparationStartedAt: '7:24 PM',
        expectedReadyAt: '7:46 PM',
        note: 'Fresh banana leaf service',
        spiceLevel: 'MEDIUM',
        modifiers: ['Standard Spice']
      }
    ],
    subtotal: 950,
    tax: 47.5,
    tip: 0,
    total: 997.5
  },
  {
    orderId: 'ORD-1043',
    restaurantId: 'REST-001',
    tableId: 'TABLE-05',
    tableNumber: '05',
    kitchenTicketId: 'KOT-1043',
    billId: 'BILL-1043',
    paymentId: 'PAY-1043',
    customerSession: 'QR-T05-2707',
    orderStatus: 'PREPARING',
    kitchenStatus: 'IN_PROGRESS',
    billStatus: 'NOT_REQUESTED',
    paymentStatus: 'UNPAID',
    assignedWaiter: 'Ananya Reddy',
    placedAt: '6:50 PM',
    acceptedAt: '6:52 PM',
    prepStartedAt: '6:55 PM',
    previousEstimate: '7:10 PM',
    estimatedReadyAt: '7:22 PM',
    etaChangeReason: 'High kitchen queue for biryani orders',
    etaUpdatedAt: '7:05 PM',
    elapsedMinutes: 34,
    guestCount: 4,
    isDelayed: true,
    delayReason: 'Kitchen is handling higher order volume',
    items: [
      {
        orderItemId: 'ITEM-1043-01',
        id: 'item-1043-01',
        orderId: 'ORD-1043',
        dishId: 'biryani-mutton-dum',
        name: 'Mutton Dum Biryani',
        quantity: 2,
        unitPrice: 381,
        total: 762,
        station: 'BIRYANI_STATION',
        course: 'MAIN',
        courseAction: 'FIRE_NOW',
        status: 'PREPARING',
        readinessStatus: 'PREPARING',
        preparationStartedAt: '6:55 PM',
        expectedReadyAt: '7:22 PM',
        note: 'Extra spicy',
        spiceLevel: 'HOT',
        modifiers: ['Extra Spicy', 'Raita Separate']
      },
      {
        orderItemId: 'ITEM-1043-02',
        id: 'item-1043-02',
        orderId: 'ORD-1043',
        dishId: 'mcveg-paneer-butter-masala',
        name: 'Paneer Butter Masala',
        quantity: 1,
        unitPrice: 311,
        total: 311,
        station: 'CURRY_STATION',
        course: 'MAIN',
        courseAction: 'FIRE_NOW',
        status: 'READY',
        readinessStatus: 'READY',
        preparationStartedAt: '6:55 PM',
        expectedReadyAt: '7:10 PM',
        note: '',
        spiceLevel: 'MEDIUM',
        modifiers: ['Medium Spice']
      },
      {
        orderItemId: 'ITEM-1043-03',
        id: 'item-1043-03',
        orderId: 'ORD-1043',
        dishId: 'dessert-carrot-halwa',
        name: 'Carrot Halwa',
        quantity: 2,
        unitPrice: 120,
        total: 240,
        station: 'DESSERT_STATION',
        course: 'DESSERT',
        courseAction: 'HOLD',
        status: 'QUEUED',
        readinessStatus: 'HOLD',
        preparationStartedAt: null,
        expectedReadyAt: 'After Main Course',
        note: 'Serve after main course',
        spiceLevel: 'MILD',
        modifiers: ['Extra Nuts']
      }
    ],
    subtotal: 1313,
    tax: 65.65,
    tip: 0,
    total: 1378.65
  },
  {
    orderId: 'ORD-1044',
    restaurantId: 'REST-001',
    tableId: 'TABLE-04',
    tableNumber: '04',
    kitchenTicketId: 'KOT-1044',
    billId: 'BILL-1044',
    paymentId: 'PAY-1044',
    customerSession: 'QR-T04-2707',
    orderStatus: 'BILL_REQUESTED',
    kitchenStatus: 'COMPLETED',
    billStatus: 'REQUESTED',
    paymentStatus: 'UNPAID',
    assignedWaiter: 'Rahul Sharma',
    placedAt: '6:55 PM',
    acceptedAt: '6:57 PM',
    prepStartedAt: '7:00 PM',
    previousEstimate: '7:12 PM',
    estimatedReadyAt: '7:12 PM',
    elapsedMinutes: 29,
    guestCount: 3,
    isDelayed: false,
    items: [
      { orderItemId: 'ITEM-1044-01', id: 'item-1044-01', orderId: 'ORD-1044', dishId: 'biryani-chicken-dum', name: 'Chicken Dum Biryani', quantity: 2, unitPrice: 250, total: 500, station: 'BIRYANI_STATION', course: 'MAIN', status: 'SERVED', readinessStatus: 'READY', modifiers: [] },
      { orderItemId: 'ITEM-1044-02', id: 'item-1044-02', orderId: 'ORD-1044', dishId: 'mcveg-paneer-butter-masala', name: 'Paneer Butter Masala', quantity: 1, unitPrice: 311, total: 311, station: 'CURRY_STATION', course: 'MAIN', status: 'SERVED', readinessStatus: 'READY', modifiers: [] },
      { orderItemId: 'ITEM-1044-03', id: 'item-1044-03', orderId: 'ORD-1044', dishId: 'drink-sweet-lassi', name: 'Sweet Lassi', quantity: 3, unitPrice: 100, total: 300, station: 'BEVERAGE_STATION', course: 'BEVERAGE', status: 'SERVED', readinessStatus: 'READY', modifiers: [] }
    ],
    subtotal: 1111,
    tax: 55.55,
    tip: 0,
    total: 1166.55
  },
  {
    orderId: 'ORD-1039',
    restaurantId: 'REST-001',
    tableId: 'TABLE-02',
    tableNumber: '02',
    kitchenTicketId: 'KOT-1039',
    billId: 'BILL-1039',
    paymentId: 'PAY-1039',
    customerSession: 'QR-T02-2707',
    orderStatus: 'COMPLETED',
    kitchenStatus: 'COMPLETED',
    billStatus: 'PAID',
    paymentStatus: 'MISMATCH',
    assignedWaiter: 'Imran Khan',
    placedAt: '6:15 PM',
    acceptedAt: '6:17 PM',
    prepStartedAt: '6:20 PM',
    previousEstimate: '6:30 PM',
    estimatedReadyAt: '6:30 PM',
    elapsedMinutes: 65,
    guestCount: 2,
    isDelayed: false,
    items: [
      { orderItemId: 'ITEM-1039-01', id: 'item-1039-01', orderId: 'ORD-1039', dishId: 'meals-aritaku-veg', name: 'Aritaku Bojanam (Veg)', quantity: 2, unitPrice: 250, total: 500, station: 'BIRYANI_STATION', course: 'MAIN', status: 'SERVED', readinessStatus: 'READY', modifiers: [] },
      { orderItemId: 'ITEM-1039-02', id: 'item-1039-02', orderId: 'ORD-1039', dishId: 'drink-sweet-lassi', name: 'Sweet Lassi', quantity: 2, unitPrice: 100, total: 200, station: 'BEVERAGE_STATION', course: 'BEVERAGE', status: 'SERVED', readinessStatus: 'READY', modifiers: [] },
      { orderItemId: 'ITEM-1039-03', id: 'item-1039-03', orderId: 'ORD-1039', dishId: 'cveg-crispy-corn', name: 'Crispy Corn Kernel', quantity: 1, unitPrice: 250, total: 250, station: 'STARTER_STATION', course: 'STARTER', status: 'SERVED', readinessStatus: 'READY', modifiers: [] }
    ],
    subtotal: 950,
    tax: 47.5,
    tip: 0,
    total: 997.5,
    invoiceTotal: 997.5,
    paymentRecorded: 977.5,
    mismatchDifference: 20.00,
    mismatchNote: 'Cash rounding dispute of ₹20'
  }
];

export const INITIAL_PROTOTYPE_TABLES = [
  { tableId: 'TABLE-01', tableNumber: '01', capacity: 2, status: 'Available', guestCount: 0, currentOrderId: null, assignedWaiter: null, timeInState: '25m' },
  { tableId: 'TABLE-02', tableNumber: '02', capacity: 2, status: 'Dining', guestCount: 2, currentOrderId: 'ORD-1039', assignedWaiter: 'Rahul Sharma', timeInState: '45m' },
  { tableId: 'TABLE-03', tableNumber: '03', capacity: 4, status: 'Available', guestCount: 0, currentOrderId: null, assignedWaiter: null, timeInState: '1h 10m' },
  { tableId: 'TABLE-04', tableNumber: '04', capacity: 4, status: 'Bill Requested', guestCount: 3, currentOrderId: 'ORD-1044', assignedWaiter: 'Rahul Sharma', timeInState: '15m' },
  { tableId: 'TABLE-05', tableNumber: '05', capacity: 6, status: 'Food Preparing', guestCount: 4, currentOrderId: 'ORD-1043', assignedWaiter: 'Ananya Reddy', timeInState: '34m' },
  { tableId: 'TABLE-06', tableNumber: '06', capacity: 4, status: 'Reserved', guestCount: 4, currentOrderId: null, assignedWaiter: 'Ananya Reddy', timeInState: 'Reserv. 8:00 PM' },
  { tableId: 'TABLE-07', tableNumber: '07', capacity: 2, status: 'Cleaning', guestCount: 0, currentOrderId: null, assignedWaiter: 'Rahul Sharma', timeInState: '5m' },
  { tableId: 'TABLE-08', tableNumber: '08', capacity: 4, status: 'Food Preparing', guestCount: 2, currentOrderId: 'ORD-1048', assignedWaiter: 'Rahul Sharma', timeInState: '12m' },
  { tableId: 'TABLE-09', tableNumber: '09', capacity: 6, status: 'Occupied', guestCount: 5, currentOrderId: null, assignedWaiter: 'Ananya Reddy', timeInState: '8m' },
  { tableId: 'TABLE-10', tableNumber: '10', capacity: 4, status: 'Available', guestCount: 0, currentOrderId: null, assignedWaiter: null, timeInState: '40m' },
  { tableId: 'TABLE-11', tableNumber: '11', capacity: 4, status: 'Ordering', guestCount: 3, currentOrderId: null, assignedWaiter: 'Rahul Sharma', timeInState: '6m' },
  { tableId: 'TABLE-12', tableNumber: '12', capacity: 8, status: 'Available', guestCount: 0, currentOrderId: null, assignedWaiter: null, timeInState: '2h' }
];

export const INITIAL_PROTOTYPE_BILLS = [
  {
    billId: 'BILL-1048',
    tableId: 'TABLE-08',
    tableNumber: '08',
    orderId: 'ORD-1048',
    orderIds: ['ORD-1048'],
    subtotal: 950,
    discount: 0,
    discountReason: null,
    discountApprovedBy: null,
    compItems: [],
    packagingCharge: 20,
    gst: 48.5,
    invoiceTotal: 1018.5,
    amount: 1018.5,
    paymentStatus: 'UNPAID',
    paidAmount: 0,
    balanceDue: 1018.5,
    billRequestTime: '7:40 PM',
    waitingDurationMinutes: 5,
    assignedCounter: 'Imran Khan',
    status: 'PENDING_PAYMENT',
    paymentRecords: [],
    refundRecords: [],
    reconciliationStatus: 'PARTIALLY_PAID',
    reconciliationDifference: 1018.5,
    isVoided: false,
    splitMode: 'NONE',
    splitDetails: null
  },
  {
    billId: 'BILL-1044',
    tableId: 'TABLE-04',
    tableNumber: '04',
    orderId: 'ORD-1044',
    orderIds: ['ORD-1044'],
    subtotal: 1111,
    discount: 50,
    discountReason: 'Service Delay Recovery',
    discountApprovedBy: 'Ananya Reddy',
    compItems: [],
    packagingCharge: 0,
    gst: 53.05,
    invoiceTotal: 1114.05,
    amount: 1114.05,
    paymentStatus: 'UNPAID',
    paidAmount: 0,
    balanceDue: 1114.05,
    billRequestTime: '7:15 PM',
    waitingDurationMinutes: 9,
    assignedCounter: 'Imran Khan',
    status: 'PENDING_PAYMENT',
    paymentRecords: [],
    refundRecords: [],
    reconciliationStatus: 'PARTIALLY_PAID',
    reconciliationDifference: 1114.05,
    isVoided: false,
    splitMode: 'NONE',
    splitDetails: null
  },
  {
    billId: 'BILL-1039',
    tableId: 'TABLE-02',
    tableNumber: '02',
    orderId: 'ORD-1039',
    orderIds: ['ORD-1039'],
    subtotal: 950,
    discount: 0,
    discountReason: null,
    discountApprovedBy: null,
    compItems: [],
    packagingCharge: 0,
    gst: 47.5,
    invoiceTotal: 997.5,
    amount: 997.5,
    paymentStatus: 'MISMATCH',
    paidAmount: 977.5,
    balanceDue: 20.00,
    billRequestTime: '6:40 PM',
    waitingDurationMinutes: 44,
    assignedCounter: 'Imran Khan',
    status: 'MISMATCH_REVIEW',
    paymentRecords: [
      { paymentId: 'PAY-1039-1', method: 'CASH', amount: 977.5, payerName: 'Guest 1', paidAt: '6:50 PM' }
    ],
    refundRecords: [],
    reconciliationStatus: 'MISMATCH',
    reconciliationDifference: 20.00,
    mismatchNote: 'Cash rounding difference of ₹20',
    isVoided: false,
    splitMode: 'NONE',
    splitDetails: null
  }
];

export const INITIAL_PROTOTYPE_ISSUES = [
  {
    issueId: 'ISSUE-208',
    orderId: 'ORD-1048',
    tableId: 'TABLE-08',
    tableNumber: '08',
    category: 'MISSING_ITEM',
    categoryLabel: 'Missing Item',
    affectedItemId: 'item-1048-03',
    affectedItemName: 'Aritaku Bojanam (Veg)',
    description: 'Aritaku Bojanam (Veg) shown in order summary was missing from the tray delivered to table.',
    priority: 'HIGH',
    status: 'ACTION_IN_PROGRESS', // REPORTED, ACKNOWLEDGED, OWNER_ASSIGNED, ACTION_IN_PROGRESS, WAITING_FOR_CUSTOMER, RESOLVED, REOPENED, CLOSED
    statusLabel: 'Replacement being prepared',
    reportedAt: '7:42 PM',
    assignedOwner: 'Rahul Sharma (Waiter)',
    assignedRole: 'Waiter',
    acceptedAt: '7:44 PM',
    recoveryAction: 'A replacement Veg Meals / Thali is being prepared. Updated estimate: 12 minutes.',
    estimatedActionMinutes: 12,
    customerConfirmed: false,
    resolutionFeedback: null,
    timeline: [
      { time: '7:42 PM', text: 'Issue reported by customer (Missing Item)' },
      { time: '7:44 PM', text: 'Accepted by Rahul Sharma (Waiter)' },
      { time: '7:46 PM', text: 'Replacement approved by Shift Manager' },
      { time: '7:47 PM', text: 'Kitchen started replacement preparation' }
    ]
  },
  {
    issueId: 'ISSUE-209',
    orderId: 'ORD-1043',
    tableId: 'TABLE-05',
    tableNumber: '05',
    category: 'EXCESSIVE_DELAY',
    categoryLabel: 'Excessive Delay',
    affectedItemId: 'item-1043-01',
    affectedItemName: 'Mutton Dum Biryani',
    description: 'Biryani order taking over 30 minutes. Customer requested immediate check with head chef.',
    priority: 'HIGH',
    status: 'OWNER_ASSIGNED',
    statusLabel: 'Ananya is personally handling this',
    reportedAt: '7:12 PM',
    assignedOwner: 'Ananya Reddy (Shift Manager)',
    assignedRole: 'Shift Manager',
    acceptedAt: '7:15 PM',
    recoveryAction: 'Kitchen priority rush tag assigned to ticket #KOT-1043.',
    estimatedActionMinutes: 8,
    customerConfirmed: false,
    resolutionFeedback: null,
    timeline: [
      { time: '7:12 PM', text: 'Issue reported by customer (Excessive Delay)' },
      { time: '7:15 PM', text: 'Assigned to Ananya Reddy (Shift Manager)' }
    ]
  }
];

export const INITIAL_PROTOTYPE_CUSTOMER_MEMORY = {
  customerMemoryId: 'MEM-001',
  maskedMobile: '******4821',
  consent: {
    favourites: true,
    spicePreference: true,
    dietaryPreference: true,
    allergyInformation: false,
    pastOrders: true,
    preferredSection: false,
    celebrations: false,
    loyalty: true
  },
  favourites: ['biryani-chicken-dum', 'drink-sweet-lassi'],
  spicePreference: 'MEDIUM',
  dietaryPreference: 'VEGETARIAN',
  allergies: [],
  preferredSection: 'Window Bay',
  celebrations: [],
  loyaltyBalance: 120,
  consentUpdatedAt: '27 Jul 2026, 8:20 PM'
};

export const INITIAL_PROTOTYPE_RESERVATIONS = [
  {
    id: 'RES-501',
    guestName: 'Ramesh Kumar',
    phone: '+91 98765 43210',
    date: '2026-07-27',
    time: '20:00',
    guestCount: 4,
    tableNumber: '06',
    status: 'Confirmed',
    specialRequest: 'High chair required for child & quiet seating near window'
  },
  {
    id: 'RES-502',
    guestName: 'Siddharth V',
    phone: '+91 98111 22334',
    date: '2026-07-27',
    time: '21:15',
    guestCount: 6,
    tableNumber: '09',
    status: 'Pending',
    specialRequest: 'Birthday celebration - cake storage requested'
  }
];

export const MOCK_PERMISSIONS = {
  MANAGER: ['MENU_ARCHIVE', 'EMPLOYEE_ARCHIVE', 'TABLE_CLOSE', 'ORDER_CANCEL', 'BILL_VOID', 'STOCK_TOGGLE'],
  COUNTER_STAFF: ['BILL_VOID', 'PAYMENT_PROCESS', 'TABLE_CLOSE'],
  WAITER: ['ORDER_CREATE', 'TABLE_STATUS_UPDATE', 'BILL_REQUEST'],
  HEAD_CHEF: ['STOCK_TOGGLE', 'KOT_STATUS_UPDATE']
};

export const INITIAL_PROTOTYPE_AUDIT_LOGS = [
  {
    actionId: 'AUD-1001',
    actionType: 'TABLE_SESSION_CLOSED',
    entityType: 'TABLE',
    entityId: 'TABLE-07',
    entityLabel: 'Table 07',
    reason: 'Guest finished meal and receipt cleared',
    note: 'Routine table cleaning completed',
    performedBy: 'Rahul Sharma (Waiter)',
    performedAt: '27 Jul 2026, 7:10 PM'
  },
  {
    actionId: 'AUD-1002',
    actionType: 'ITEM_STOCK_UPDATED',
    entityType: 'MENU_ITEM',
    entityId: 'cveg-gobi-65',
    entityLabel: 'Gobi 65',
    reason: 'Evening batch sold out',
    note: 'Marked Temporarily Unavailable',
    performedBy: 'Chef Arjun Rao (Head Chef)',
    performedAt: '27 Jul 2026, 6:45 PM'
  }
];

export const PROTOTYPE_VISIT_MILESTONES = [
  {
    id: 'VISIT-1',
    visitCount: 1,
    title: 'First Visit',
    benefit: 'Welcome note & complimentary herbal drink',
    statusLevel: 'New Guest',
    conditions: {
      eligibility: 'Available on your 1st completed order',
      validity: 'Valid for 30 days',
      applicability: 'Dine-in or Takeaway',
      confirmationRequired: 'No advance booking required',
      subjectToAvailability: false
    }
  },
  {
    id: 'VISIT-3',
    visitCount: 3,
    title: 'Returning Guest',
    benefit: 'Early notice about regional food festivals',
    statusLevel: 'Returning Guest',
    conditions: {
      eligibility: 'Earned after 3 completed visits',
      validity: 'Valid for 60 days',
      applicability: 'Dine-in only',
      confirmationRequired: 'In-app event subscription',
      subjectToAvailability: true
    }
  },
  {
    id: 'VISIT-5',
    visitCount: 5,
    title: 'Regular Guest',
    benefit: 'Complimentary chef-selected side dish or dessert',
    statusLevel: 'Regular Guest',
    conditions: {
      eligibility: 'Earned after 5 completed visits',
      validity: 'Valid for 45 days',
      applicability: 'Dine-in with eligible main order',
      confirmationRequired: 'Redeem before order placement with staff',
      subjectToAvailability: true
    }
  },
  {
    id: 'VISIT-10',
    visitCount: 10,
    title: 'Community Member',
    benefit: 'Invitation to selected chef-preview evenings',
    statusLevel: 'Community Member',
    conditions: {
      eligibility: 'Earned after 10 completed visits',
      validity: 'Valid for 90 days',
      applicability: 'Dine-in special preview session',
      confirmationRequired: 'Advance confirmation required (12 prototype seats shown)',
      subjectToAvailability: true
    }
  }
];

export const INITIAL_PROTOTYPE_CUSTOMER_MEMBERSHIP = {
  customerMemoryId: 'MEM-001',
  maskedMobile: '******4821',
  completedVisits: 5,
  statusLevel: 'Regular Guest',
  statusEarnedReason: 'Recognized after 5 completed visits.',
  communityMemberSince: '14 May 2026',
  regionalEventsAttended: 2,
  chefPreviewsAttended: 1,
  favouriteDishesCount: 3,
  referredGuestsCount: 1,
  referralRecognition: {
    referrerCredit: 'Recognition applied toward next milestone (10 visits)',
    friendVisited: true,
    friendName: 'Anil K.',
    completedVisitId: 'ORD-1039'
  },
  celebrationPreferences: {
    day: 14,
    month: 8,
    occasionType: 'Birthday',
    guestNote: 'Window bay table preferred if available'
  },
  favouriteDishAlerts: [
    { dishId: 'biryani-chicken-dum', dishName: 'Chicken Dum Biryani', preferenceChannel: 'In-app' },
    { dishId: 'drink-sweet-lassi', dishName: 'Sweet Lassi', preferenceChannel: 'In-app' }
  ],
  activeHospitalityBenefits: [
    {
      benefitId: 'BEN-501',
      milestoneId: 'VISIT-5',
      title: 'Complimentary Chef-Selected Dessert',
      description: 'Chef-selected dessert (Carrot Halwa) after 5 completed visits.',
      status: 'Eligible', // 'Eligible', 'Redeemed', 'Expired', 'Not Currently Available'
      redeemedAt: null,
      validUntil: '30 Aug 2026',
      conditionsText: 'Subject to restaurant availability and prior confirmation with staff before ordering. Applies to dine-in orders.'
    }
  ]
};

export const INITIAL_CHEF_PREVIEWS = [
  {
    id: 'PREV-201',
    eventTitle: 'Monsoon Andhra Spice Tasting',
    date: '10 Aug 2026',
    time: '7:30 PM',
    totalSeats: 12,
    availableSeats: 4,
    dietaryTheme: 'Vegetarian & Regional Andhra Fusion',
    chefNote: 'Chef Arjun presents 4 seasonal trial recipes for guest feedback.',
    status: 'REQUEST_INVITATION'
  },
  {
    id: 'PREV-202',
    eventTitle: 'Heirloom Grains Preview',
    date: '25 Aug 2026',
    time: '8:00 PM',
    totalSeats: 12,
    availableSeats: 2,
    dietaryTheme: 'Millet & Hand-Pounded Spice Heritage',
    chefNote: 'Traditional Telangana recipe revival with slow-clay-pot cooking.',
    status: 'REQUEST_INVITATION'
  }
];

export const INITIAL_REGIONAL_FOOD_FESTIVALS = [
  {
    id: 'FEST-101',
    title: 'Andhra Food Week',
    period: '01 Aug – 07 Aug 2026',
    description: 'Guntur spice roasts, Gongura delicacies, and traditional Rayalaseema ragi mudde.',
    accessLevel: 'Early access for returning guests'
  },
  {
    id: 'FEST-102',
    title: 'Millet Menu Weekend',
    period: '15 Aug – 17 Aug 2026',
    description: 'Ragi sangati specials, Foxtail millet khichdi, and ragi malt desserts.',
    accessLevel: 'Community Member preview'
  }
];

export const SIGNATURE_DISH_STORIES = {
  'biryani-chicken-dum': {
    signatureDish: true,
    socialStory: {
      verticalVideo: biryaniVideo,
      videoDurationSeconds: 10,
      origin: 'A regional Andhra classic, Chicken Dum Biryani is layered rice and spiced chicken sealed and slow-cooked over a low flame for deep, even flavour.',
      chefNote: 'Best enjoyed immediately while the dum seal is freshly opened at the table.',
      ingredientStory: 'Long-grain rice and hand-ground biryani masala prepared in controlled morning batches, dum-cooked to order in heavy-bottomed handis.',
      suggestedStoryTemplate: 'Trying the signature Chicken Dum Biryani at Mangamma Ruchulu.',
      restaurantTag: '@MangammaRuchulu',
      locationLabel: 'Hyderabad, Telangana'
    }
  },
  'biryani-mutton-dum': {
    signatureDish: true,
    socialStory: {
      verticalVideo: 'https://assets.mixkit.co/videos/preview/mixkit-cooking-fresh-vegetables-in-a-pan-41551-large.mp4',
      videoDurationSeconds: 12,
      origin: 'A vibrant Andhra-style preparation featuring layered spices, slow-cooked tender mutton, and fragrant long-grain rice.',
      chefNote: 'Steeped for 4 hours to lock rich aromatic essential oils into every grain.',
      ingredientStory: 'Tender mutton and hand-pounded whole spices sourced daily, cooked in brass handis.',
      suggestedStoryTemplate: 'Experiencing authentic Mutton Dum Biryani at Mangamma Ruchulu.',
      restaurantTag: '@MangammaRuchulu',
      locationLabel: 'Hyderabad, Telangana'
    }
  },
  'meals-aritaku-veg': {
    signatureDish: true,
    socialStory: {
      verticalVideo: 'https://assets.mixkit.co/videos/preview/mixkit-pouring-sauce-on-a-plated-dish-42861-large.mp4',
      videoDurationSeconds: 10,
      origin: 'A traditional Andhra banana-leaf meal featuring six balanced flavors: sweet, sour, salty, bitter, pungent, and astringent.',
      chefNote: 'Served on fresh banana leaves with stone-ground chutney and warm rasam.',
      ingredientStory: 'Organic lentils, fresh farm vegetables, and morning-ground sambar powder.',
      suggestedStoryTemplate: 'Enjoying the traditional Aritaku Bojanam (Veg) feast at Mangamma Ruchulu.',
      restaurantTag: '@MangammaRuchulu',
      locationLabel: 'Hyderabad, Telangana'
    }
  },
  'dessert-carrot-halwa': {
    signatureDish: true,
    socialStory: {
      verticalVideo: 'https://assets.mixkit.co/videos/preview/mixkit-adding-garnishes-to-a-finished-dish-42858-large.mp4',
      videoDurationSeconds: 8,
      origin: 'A rich, slow-cooked dessert of grated carrot simmered in milk and finished with ghee and nuts.',
      chefNote: 'Finished with a generous garnish of roasted cashews while still warm.',
      ingredientStory: 'Fresh carrots grated daily and simmered slowly with pure reduced milk.',
      suggestedStoryTemplate: 'Ending the meal with Carrot Halwa at Mangamma Ruchulu.',
      restaurantTag: '@MangammaRuchulu',
      locationLabel: 'Hyderabad, Telangana'
    }
  }
};

export const INITIAL_PROTOTYPE_FEEDBACKS = [
  {
    feedbackId: 'FDB-1048',
    orderId: 'ORD-1048',
    billId: 'BILL-1048',
    tableNumber: '08',
    customerMemoryId: 'MEM-001',
    ratings: {
      food: 4,
      service: 3,
      speed: 2,
      cleanliness: 5,
      value: 4
    },
    memorableDishId: 'biryani-chicken-dum',
    memorableDishName: 'Chicken Dum Biryani',
    improvementCategories: ['PREPARATION_SPEED'],
    improvementCategoriesLabels: ['Preparation Speed'],
    comment: 'The food was good, but the updated delay notice arrived too late.',
    feedbackRoute: 'PRIVATE_MANAGER_REVIEW',
    routeReason: 'Preparation speed rated 2/5 requiring private operational follow-up.',
    assignedManager: 'Ananya Reddy (Shift Manager)',
    status: 'Reviewing', // 'New', 'Reviewing', 'Contacted Guest', 'Action Recorded', 'Closed'
    managerNotes: 'Shift manager reviewing KOT preparation timestamps with kitchen lead.',
    submittedAt: '27 Jul 2026, 8:14 PM',
    publicReviewChoice: 'KEPT_PRIVATE',
    verifiedOrder: true
  },
  {
    feedbackId: 'FDB-1039',
    orderId: 'ORD-1039',
    billId: 'BILL-1039',
    tableNumber: '02',
    customerMemoryId: 'MEM-002',
    ratings: {
      food: 5,
      service: 5,
      speed: 4,
      cleanliness: 5,
      value: 4
    },
    memorableDishId: 'meals-aritaku-veg',
    memorableDishName: 'Aritaku Bojanam (Veg)',
    improvementCategories: [],
    improvementCategoriesLabels: [],
    comment: 'Great Aritaku Bojanam (Veg) meal. Kitchen load updates kept us informed about the short wait.',
    feedbackRoute: 'STANDARD_LOG',
    routeReason: 'Positive ratings across all operational categories.',
    assignedManager: 'Rahul Sharma',
    status: 'Closed',
    managerNotes: 'Compliment logged in shift report.',
    submittedAt: '25 Jul 2026, 6:50 PM',
    publicReviewChoice: 'PUBLISHED_PUBLIC',
    verifiedOrder: true
  }
];

export const INITIAL_PROTOTYPE_UGC = [
  {
    participationId: 'UGC-1048',
    orderId: 'ORD-1048',
    billId: 'BILL-1048',
    customerMemoryId: 'MEM-001',
    dishId: 'biryani-chicken-dum',
    dishName: 'Chicken Dum Biryani',
    mediaType: 'PHOTO',
    mediaPreview: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80',
    captionText: 'Trying the signature Chicken Dum Biryani at Mangamma Ruchulu!',
    socialHandle: '@priya_foodie',
    permissions: {
      submittedForParticipation: true,
      restaurantRepostAllowed: false, // Unselected by default as specified!
      inAppGalleryAllowed: true,
      displayNameAllowed: false
    },
    rewardConditionsAccepted: true,
    participationCreditGranted: true,
    permissionGrantedAt: '27 Jul 2026, 8:24 PM',
    permissionVersion: 'UGC-CONSENT-V1',
    status: 'SUBMITTED',
    displayName: 'Verified Guest'
  }
];

export const COUPON_REQUEST_STATUS = {
  ELIGIBLE: 'ELIGIBLE',
  FORM_STARTED: 'FORM_STARTED',
  WHATSAPP_OPENED: 'WHATSAPP_OPENED',
  CUSTOMER_CONFIRMED_SENT: 'CUSTOMER_CONFIRMED_SENT',
  AWAITING_RESTAURANT_REVIEW: 'AWAITING_RESTAURANT_REVIEW',
  VERIFIED: 'VERIFIED',
  COUPON_ISSUED: 'COUPON_ISSUED',
  REDEEMED: 'REDEEMED',
  EXPIRED: 'EXPIRED',
  DECLINED: 'DECLINED',
  CANCELLED: 'CANCELLED',
};

// Historical prototype coupon requests shown in the Manager Portal demo.
// The active customer's own order (ORD-1048) intentionally has no seeded
// request so the Customer PWA starts from the fresh "eligible" state.
export const INITIAL_PROTOTYPE_COUPON_REQUESTS = [
  {
    requestId: 'CPN-REQ-2041',
    customer: { firstName: 'Ramesh', maskedMobile: '******3210', formattedMobile: '919876543210' },
    milestone: { completedVisits: 5, level: 'REGULAR_GUEST', eligible: true, unlockedAt: '26 Jul 2026, 8:05 PM' },
    orderReference: { orderId: 'ORD-1039', invoiceId: 'INV-1039', tableId: 'TABLE-02' },
    couponOffer: { campaignId: 'REGULAR_GUEST_15', discountType: 'PERCENTAGE', discountValue: 15 },
    consent: {
      fulfilmentGranted: true,
      fulfilmentGrantedAt: '26 Jul 2026, 8:06 PM',
      marketingGranted: false,
      marketingGrantedAt: null,
      consentVersion: 'WHATSAPP-COUPON-V1',
    },
    whatsapp: { deepLinkOpenedAt: '26 Jul 2026, 8:06 PM', customerConfirmedSentAt: '26 Jul 2026, 8:07 PM', restaurantConfirmedReceivedAt: null },
    status: 'CUSTOMER_CONFIRMED_SENT',
    coupon: null,
    declineReason: null,
    declineNote: null,
    createdAt: '26 Jul 2026, 8:06 PM',
    updatedAt: '26 Jul 2026, 8:07 PM',
    auditHistory: [
      { time: '26 Jul 2026, 8:06 PM', text: 'Request created and WhatsApp opened' },
      { time: '26 Jul 2026, 8:07 PM', text: 'Customer confirmed message sent' },
    ],
  },
  {
    requestId: 'CPN-REQ-2042',
    customer: { firstName: 'Anita', maskedMobile: '******9912', formattedMobile: '919876549912' },
    milestone: { completedVisits: 5, level: 'REGULAR_GUEST', eligible: true, unlockedAt: '25 Jul 2026, 7:15 PM' },
    orderReference: { orderId: 'ORD-1044', invoiceId: 'INV-1044', tableId: 'TABLE-04' },
    couponOffer: { campaignId: 'REGULAR_GUEST_15', discountType: 'PERCENTAGE', discountValue: 15 },
    consent: {
      fulfilmentGranted: true,
      fulfilmentGrantedAt: '25 Jul 2026, 7:16 PM',
      marketingGranted: true,
      marketingGrantedAt: '25 Jul 2026, 7:16 PM',
      consentVersion: 'WHATSAPP-COUPON-V1',
    },
    whatsapp: { deepLinkOpenedAt: '25 Jul 2026, 7:16 PM', customerConfirmedSentAt: '25 Jul 2026, 7:17 PM', restaurantConfirmedReceivedAt: '25 Jul 2026, 7:25 PM' },
    status: 'AWAITING_RESTAURANT_REVIEW',
    coupon: null,
    declineReason: null,
    declineNote: null,
    createdAt: '25 Jul 2026, 7:16 PM',
    updatedAt: '25 Jul 2026, 7:25 PM',
    auditHistory: [
      { time: '25 Jul 2026, 7:16 PM', text: 'Request created and WhatsApp opened' },
      { time: '25 Jul 2026, 7:17 PM', text: 'Customer confirmed message sent' },
      { time: '25 Jul 2026, 7:25 PM', text: 'Marked WhatsApp message received by Imran Khan' },
    ],
  },
  {
    requestId: 'CPN-REQ-2043',
    customer: { firstName: 'Siddharth', maskedMobile: '******2334', formattedMobile: '919811122334' },
    milestone: { completedVisits: 10, level: 'COMMUNITY_MEMBER', eligible: true, unlockedAt: '20 Jul 2026, 9:05 PM' },
    orderReference: { orderId: 'ORD-1031', invoiceId: 'INV-1031', tableId: 'TABLE-09' },
    couponOffer: { campaignId: 'REGULAR_GUEST_15', discountType: 'PERCENTAGE', discountValue: 15 },
    consent: {
      fulfilmentGranted: true,
      fulfilmentGrantedAt: '20 Jul 2026, 9:06 PM',
      marketingGranted: false,
      marketingGrantedAt: null,
      consentVersion: 'WHATSAPP-COUPON-V1',
    },
    whatsapp: { deepLinkOpenedAt: '20 Jul 2026, 9:06 PM', customerConfirmedSentAt: '20 Jul 2026, 9:07 PM', restaurantConfirmedReceivedAt: '20 Jul 2026, 9:20 PM' },
    status: 'VERIFIED',
    coupon: null,
    declineReason: null,
    declineNote: null,
    createdAt: '20 Jul 2026, 9:06 PM',
    updatedAt: '21 Jul 2026, 10:00 AM',
    auditHistory: [
      { time: '20 Jul 2026, 9:06 PM', text: 'Request created and WhatsApp opened' },
      { time: '20 Jul 2026, 9:07 PM', text: 'Customer confirmed message sent' },
      { time: '20 Jul 2026, 9:20 PM', text: 'Marked WhatsApp message received by Ananya Reddy' },
      { time: '21 Jul 2026, 10:00 AM', text: 'Eligibility verified by Ananya Reddy (Shift Manager)' },
    ],
  },
  {
    requestId: 'CPN-REQ-2044',
    customer: { firstName: 'Kavya', maskedMobile: '******5521', formattedMobile: '919845675521' },
    milestone: { completedVisits: 5, level: 'REGULAR_GUEST', eligible: true, unlockedAt: '18 Jul 2026, 8:40 PM' },
    orderReference: { orderId: 'ORD-1022', invoiceId: 'INV-1022', tableId: 'TABLE-06' },
    couponOffer: { campaignId: 'REGULAR_GUEST_15', discountType: 'PERCENTAGE', discountValue: 15 },
    consent: {
      fulfilmentGranted: true,
      fulfilmentGrantedAt: '18 Jul 2026, 8:41 PM',
      marketingGranted: true,
      marketingGrantedAt: '18 Jul 2026, 8:41 PM',
      consentVersion: 'WHATSAPP-COUPON-V1',
    },
    whatsapp: { deepLinkOpenedAt: '18 Jul 2026, 8:41 PM', customerConfirmedSentAt: '18 Jul 2026, 8:42 PM', restaurantConfirmedReceivedAt: '18 Jul 2026, 8:50 PM' },
    status: 'COUPON_ISSUED',
    coupon: {
      couponId: 'CPN-2044',
      code: 'MGR15-KQ18',
      requestId: 'CPN-REQ-2044',
      discountType: 'PERCENTAGE',
      discountValue: 15,
      status: 'ISSUED',
      issuedAt: '19 Jul 2026, 11:10 AM',
      validUntil: '18 Aug 2026',
      expiresAt: '2026-08-18T00:00:00.000Z',
      issuedBy: 'Sundaram Pillai',
      sentAt: null,
      redemption: null,
      revocation: null,
      attributedOrderRevenuePaise: 0,
    },
    declineReason: null,
    declineNote: null,
    createdAt: '18 Jul 2026, 8:41 PM',
    updatedAt: '19 Jul 2026, 11:10 AM',
    auditHistory: [
      { time: '18 Jul 2026, 8:41 PM', text: 'Request created and WhatsApp opened' },
      { time: '18 Jul 2026, 8:42 PM', text: 'Customer confirmed message sent' },
      { time: '18 Jul 2026, 8:50 PM', text: 'Marked WhatsApp message received by Imran Khan' },
      { time: '19 Jul 2026, 11:00 AM', text: 'Eligibility verified by Sundaram Pillai' },
      { time: '19 Jul 2026, 11:10 AM', text: 'Prototype coupon issued: MGR15-KQ18' },
    ],
  },
  {
    requestId: 'CPN-REQ-2045',
    customer: { firstName: 'Anil', maskedMobile: '******7788', formattedMobile: '919900127788' },
    milestone: { completedVisits: 5, level: 'REGULAR_GUEST', eligible: true, unlockedAt: '10 Jul 2026, 7:30 PM' },
    orderReference: { orderId: 'ORD-1010', invoiceId: 'INV-1010', tableId: 'TABLE-03' },
    couponOffer: { campaignId: 'REGULAR_GUEST_15', discountType: 'PERCENTAGE', discountValue: 15 },
    consent: {
      fulfilmentGranted: true,
      fulfilmentGrantedAt: '10 Jul 2026, 7:31 PM',
      marketingGranted: false,
      marketingGrantedAt: null,
      consentVersion: 'WHATSAPP-COUPON-V1',
    },
    whatsapp: { deepLinkOpenedAt: '10 Jul 2026, 7:31 PM', customerConfirmedSentAt: '10 Jul 2026, 7:32 PM', restaurantConfirmedReceivedAt: '10 Jul 2026, 7:40 PM' },
    status: 'REDEEMED',
    coupon: {
      couponId: 'CPN-2045',
      code: 'MGR15-AN07',
      requestId: 'CPN-REQ-2045',
      discountType: 'PERCENTAGE',
      discountValue: 15,
      status: 'REDEEMED',
      issuedAt: '11 Jul 2026, 9:00 AM',
      validUntil: '10 Aug 2026',
      expiresAt: '2026-08-10T00:00:00.000Z',
      issuedBy: 'Sundaram Pillai',
      sentAt: '11 Jul 2026, 9:05 AM',
      revocation: null,
      attributedOrderRevenuePaise: 99750,
      redemption: {
        redemptionId: 'RED-3001',
        couponId: 'CPN-2045',
        couponCode: 'MGR15-AN07',
        sourceBillId: 'BILL-1039',
        sourceInvoiceId: 'INV-1039',
        sourceOrderId: 'ORD-1039',
        subtotalPaise: 95000,
        discountPaise: 14250,
        finalPayablePaise: 99750,
        redeemedAt: '20 Jul 2026, 8:15 PM',
        redeemedBy: 'Imran Khan',
        redemptionChannel: 'MANAGER_PORTAL',
        status: 'COMPLETED',
      },
    },
    declineReason: null,
    declineNote: null,
    createdAt: '10 Jul 2026, 7:31 PM',
    updatedAt: '20 Jul 2026, 8:15 PM',
    auditHistory: [
      { time: '10 Jul 2026, 7:31 PM', text: 'Request created and WhatsApp opened' },
      { time: '11 Jul 2026, 9:00 AM', text: 'Prototype coupon issued: MGR15-AN07' },
      { time: '20 Jul 2026, 8:15 PM', text: 'Coupon redeemed on ORD-1039 by Imran Khan' },
    ],
  },
  {
    requestId: 'CPN-REQ-2050',
    customer: { firstName: 'Meera', maskedMobile: '******6602', formattedMobile: '919845556602' },
    milestone: { completedVisits: 5, level: 'REGULAR_GUEST', eligible: true, unlockedAt: '15 Jul 2026, 7:10 PM' },
    orderReference: { orderId: 'ORD-1015', invoiceId: 'INV-1015', tableId: 'TABLE-05' },
    couponOffer: { campaignId: 'REGULAR_GUEST_15', discountType: 'PERCENTAGE', discountValue: 15 },
    consent: {
      fulfilmentGranted: true,
      fulfilmentGrantedAt: '15 Jul 2026, 7:11 PM',
      marketingGranted: false,
      marketingGrantedAt: null,
      consentVersion: 'WHATSAPP-COUPON-V1',
    },
    whatsapp: { deepLinkOpenedAt: '15 Jul 2026, 7:11 PM', customerConfirmedSentAt: '15 Jul 2026, 7:12 PM', restaurantConfirmedReceivedAt: '15 Jul 2026, 7:20 PM' },
    status: 'COUPON_ISSUED',
    coupon: {
      couponId: 'CPN-2050',
      code: 'MGR15-ME31',
      requestId: 'CPN-REQ-2050',
      discountType: 'PERCENTAGE',
      discountValue: 15,
      status: 'ISSUED',
      issuedAt: '16 Jul 2026, 9:00 AM',
      validUntil: '2 Aug 2026',
      expiresAt: '2026-08-02T00:00:00.000Z',
      issuedBy: 'Sundaram Pillai',
      sentAt: '16 Jul 2026, 9:05 AM',
      redemption: null,
      revocation: null,
      attributedOrderRevenuePaise: 0,
    },
    declineReason: null,
    declineNote: null,
    createdAt: '15 Jul 2026, 7:11 PM',
    updatedAt: '16 Jul 2026, 9:00 AM',
    auditHistory: [
      { time: '15 Jul 2026, 7:11 PM', text: 'Request created and WhatsApp opened' },
      { time: '16 Jul 2026, 9:00 AM', text: 'Prototype coupon issued: MGR15-ME31' },
      { time: '16 Jul 2026, 9:05 AM', text: 'Coupon reply marked sent by Sundaram Pillai' },
    ],
  },
  {
    requestId: 'CPN-REQ-2051',
    customer: { firstName: 'Vikram', maskedMobile: '******4470', formattedMobile: '919845554470' },
    milestone: { completedVisits: 5, level: 'REGULAR_GUEST', eligible: true, unlockedAt: '1 Jun 2026, 8:00 PM' },
    orderReference: { orderId: 'ORD-0998', invoiceId: 'INV-0998', tableId: 'TABLE-02' },
    couponOffer: { campaignId: 'REGULAR_GUEST_15', discountType: 'PERCENTAGE', discountValue: 15 },
    consent: {
      fulfilmentGranted: true,
      fulfilmentGrantedAt: '1 Jun 2026, 8:01 PM',
      marketingGranted: false,
      marketingGrantedAt: null,
      consentVersion: 'WHATSAPP-COUPON-V1',
    },
    whatsapp: { deepLinkOpenedAt: '1 Jun 2026, 8:01 PM', customerConfirmedSentAt: '1 Jun 2026, 8:02 PM', restaurantConfirmedReceivedAt: '1 Jun 2026, 8:10 PM' },
    status: 'COUPON_ISSUED',
    coupon: {
      couponId: 'CPN-2051',
      code: 'MGR15-VK09',
      requestId: 'CPN-REQ-2051',
      discountType: 'PERCENTAGE',
      discountValue: 15,
      status: 'ISSUED',
      issuedAt: '2 Jun 2026, 10:00 AM',
      validUntil: '2 Jul 2026',
      expiresAt: '2026-07-02T00:00:00.000Z',
      issuedBy: 'Sundaram Pillai',
      sentAt: '2 Jun 2026, 10:05 AM',
      redemption: null,
      revocation: null,
      attributedOrderRevenuePaise: 0,
    },
    declineReason: null,
    declineNote: null,
    createdAt: '1 Jun 2026, 8:01 PM',
    updatedAt: '2 Jun 2026, 10:00 AM',
    auditHistory: [
      { time: '1 Jun 2026, 8:01 PM', text: 'Request created and WhatsApp opened' },
      { time: '2 Jun 2026, 10:00 AM', text: 'Prototype coupon issued: MGR15-VK09' },
    ],
  },
  {
    requestId: 'CPN-REQ-2052',
    customer: { firstName: 'Divya', maskedMobile: '******3391', formattedMobile: '919845553391' },
    milestone: { completedVisits: 5, level: 'REGULAR_GUEST', eligible: true, unlockedAt: '5 Jul 2026, 7:40 PM' },
    orderReference: { orderId: 'ORD-1002', invoiceId: 'INV-1002', tableId: 'TABLE-11' },
    couponOffer: { campaignId: 'REGULAR_GUEST_15', discountType: 'PERCENTAGE', discountValue: 15 },
    consent: {
      fulfilmentGranted: true,
      fulfilmentGrantedAt: '5 Jul 2026, 7:41 PM',
      marketingGranted: true,
      marketingGrantedAt: '5 Jul 2026, 7:41 PM',
      consentVersion: 'WHATSAPP-COUPON-V1',
    },
    whatsapp: { deepLinkOpenedAt: '5 Jul 2026, 7:41 PM', customerConfirmedSentAt: '5 Jul 2026, 7:42 PM', restaurantConfirmedReceivedAt: '5 Jul 2026, 7:50 PM' },
    status: 'COUPON_ISSUED',
    coupon: {
      couponId: 'CPN-2052',
      code: 'MGR15-DV22',
      requestId: 'CPN-REQ-2052',
      discountType: 'PERCENTAGE',
      discountValue: 15,
      status: 'ISSUED',
      issuedAt: '6 Jul 2026, 10:00 AM',
      validUntil: '5 Aug 2026',
      expiresAt: '2026-08-05T00:00:00.000Z',
      issuedBy: 'Sundaram Pillai',
      sentAt: '6 Jul 2026, 10:05 AM',
      redemption: null,
      revocation: {
        reason: 'Duplicate coupon',
        note: 'Guest already had an active Regular Guest coupon from an earlier visit.',
        revokedBy: 'Sundaram Pillai',
        revokedAt: '10 Jul 2026, 11:00 AM',
      },
      attributedOrderRevenuePaise: 0,
    },
    declineReason: null,
    declineNote: null,
    createdAt: '5 Jul 2026, 7:41 PM',
    updatedAt: '10 Jul 2026, 11:00 AM',
    auditHistory: [
      { time: '5 Jul 2026, 7:41 PM', text: 'Request created and WhatsApp opened' },
      { time: '6 Jul 2026, 10:00 AM', text: 'Prototype coupon issued: MGR15-DV22' },
      { time: '10 Jul 2026, 11:00 AM', text: 'Revoked by Sundaram Pillai: Duplicate coupon' },
    ],
  },
  {
    requestId: 'CPN-REQ-2046',
    customer: { firstName: 'Farah', maskedMobile: '******3345', formattedMobile: '919812343345' },
    milestone: { completedVisits: 5, level: 'REGULAR_GUEST', eligible: true, unlockedAt: '8 Jul 2026, 6:50 PM' },
    orderReference: { orderId: 'ORD-1005', invoiceId: 'INV-1005', tableId: 'TABLE-07' },
    couponOffer: { campaignId: 'REGULAR_GUEST_15', discountType: 'PERCENTAGE', discountValue: 15 },
    consent: {
      fulfilmentGranted: true,
      fulfilmentGrantedAt: '8 Jul 2026, 6:51 PM',
      marketingGranted: false,
      marketingGrantedAt: null,
      consentVersion: 'WHATSAPP-COUPON-V1',
    },
    whatsapp: { deepLinkOpenedAt: '8 Jul 2026, 6:51 PM', customerConfirmedSentAt: '8 Jul 2026, 6:52 PM', restaurantConfirmedReceivedAt: '8 Jul 2026, 7:00 PM' },
    status: 'DECLINED',
    coupon: null,
    declineReason: 'Invoice not found',
    declineNote: 'Invoice number could not be matched to a completed order on file.',
    createdAt: '8 Jul 2026, 6:51 PM',
    updatedAt: '9 Jul 2026, 10:00 AM',
    auditHistory: [
      { time: '8 Jul 2026, 6:51 PM', text: 'Request created and WhatsApp opened' },
      { time: '8 Jul 2026, 7:00 PM', text: 'Marked WhatsApp message received by Imran Khan' },
      { time: '9 Jul 2026, 10:00 AM', text: 'Declined by Sundaram Pillai: Invoice not found' },
    ],
  },
];

export const INITIAL_PROTOTYPE_REMOVAL_REQUESTS = [
  {
    requestId: 'REM-301',
    participationId: 'UGC-1048',
    orderId: 'ORD-1048',
    customerMemoryId: 'MEM-001',
    requestReason: 'WITHDRAW_REPOST_PERMISSION',
    requestReasonLabel: 'Withdraw repost permission',
    details: 'Please remove my uploaded photo from any public marketing gallery.',
    status: 'Under Review', // 'Submitted', 'Under Review', 'Removed', 'Clarification Needed'
    submittedAt: '27 Jul 2026, 8:30 PM',
    reviewedBy: 'Ananya Reddy (Shift Manager)',
    resolutionNote: 'Image display disabled in RMS gallery.'
  }
];


// Service for initial mock kitchen orders and audio alerts

export const INITIAL_KITCHEN_ORDERS = [
  {
    orderId: 'ORD-8942',
    tableNumber: '02',
    serverName: 'Ramesh K.',
    guestCount: 3,
    status: 'received', // 'received' | 'preparing' | 'ready' | 'served'
    isRush: true,
    createdAt: new Date(Date.now() - 4 * 60 * 1000).toISOString(), // 4 min ago
    elapsedSeconds: 240,
    specialNotes: 'ALLERGY WARNING: Customer has GLUTEN SENSITIVITY. Use separate cooking equipment.',
    items: [
      {
        id: 'k-item-1',
        dishId: 'cveg-gobi-65',
        name: 'Gobi 65',
        quantity: 2,
        station: 'Starter & Tandoor Station',
        isDone: false,
        selectedOptions: ['Extra Spicy', 'No Onion'],
        notes: 'Serve piping hot'
      },
      {
        id: 'k-item-2',
        dishId: 'cveg-crispy-corn',
        name: 'Crispy Corn Kernel',
        quantity: 1,
        station: 'Starter & Tandoor Station',
        isDone: true,
        selectedOptions: ['Extra Crispy'],
        notes: ''
      }
    ]
  },
  {
    orderId: 'ORD-8941',
    tableNumber: '05',
    serverName: 'Ananya N.',
    guestCount: 2,
    status: 'preparing',
    isRush: false,
    createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(), // 12 min ago
    elapsedSeconds: 720,
    specialNotes: 'Anniversary celebration! Serve dessert after main course.',
    items: [
      {
        id: 'k-item-3',
        dishId: 'biryani-chicken-special',
        name: 'Special Chicken Dum Biryani',
        quantity: 1,
        station: 'Biryani & Rice Station',
        isDone: true,
        selectedOptions: ['Extra Spicy'],
        notes: 'Extra onion raita on side'
      },
      {
        id: 'k-item-4',
        dishId: 'mcveg-mix-veg-curry',
        name: 'Mix Veg Curry with Lacha Paratha',
        quantity: 1,
        station: 'Curry & Gravy Station',
        isDone: false,
        selectedOptions: ['Extra Spicy'],
        notes: 'Flaky warm parathas'
      }
    ]
  },
  {
    orderId: 'ORD-8940',
    tableNumber: '08',
    serverName: 'Priya S.',
    guestCount: 4,
    status: 'preparing',
    isRush: false,
    createdAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(), // 8 min ago
    elapsedSeconds: 480,
    specialNotes: 'Kids at table - bring starters and dessert first.',
    items: [
      {
        id: 'k-item-5',
        dishId: 'cveg-crispy-corn',
        name: 'Crispy Corn Kernel',
        quantity: 2,
        station: 'Starter & Tandoor Station',
        isDone: true,
        selectedOptions: [],
        notes: 'Mild seasoning'
      },
      {
        id: 'k-item-6',
        dishId: 'cveg-paneer-65',
        name: 'Paneer 65',
        quantity: 2,
        station: 'Starter & Tandoor Station',
        isDone: false,
        selectedOptions: ['Extra Spicy'],
        notes: 'Extra crispy'
      }
    ]
  },
  {
    orderId: 'ORD-8939',
    tableNumber: '12',
    serverName: 'Vignesh I.',
    guestCount: 2,
    status: 'ready',
    isRush: false,
    createdAt: new Date(Date.now() - 18 * 60 * 1000).toISOString(), // 18 min ago
    elapsedSeconds: 1080,
    specialNotes: 'VIP Table. Prompt pickup required.',
    items: [
      {
        id: 'k-item-7',
        dishId: 'dessert-carrot-halwa',
        name: 'Carrot Halwa',
        quantity: 2,
        station: 'Beverage & Dessert Station',
        isDone: true,
        selectedOptions: [],
        notes: 'Fresh serving'
      },
      {
        id: 'k-item-8',
        dishId: 'drink-sweet-lassi',
        name: 'Sweet Lassi',
        quantity: 2,
        station: 'Beverage & Dessert Station',
        isDone: true,
        selectedOptions: ['Less Sweet'],
        notes: 'Served chilled'
      }
    ]
  },
  {
    orderId: 'ORD-8938',
    tableNumber: '14',
    serverName: 'Karthik S.',
    guestCount: 2,
    status: 'served',
    isRush: false,
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    elapsedSeconds: 1500,
    specialNotes: '',
    items: [
      {
        id: 'k-item-9',
        dishId: 'cveg-gobi-65',
        name: 'Gobi 65',
        quantity: 1,
        station: 'Starter & Tandoor Station',
        isDone: true,
        selectedOptions: [],
        notes: ''
      }
    ]
  }
];

export const INITIAL_ASSISTANCE_REQUESTS = [
  {
    id: 'req-1',
    tableNumber: '02',
    requestType: 'Request Extra Hot Drumstick Sambar & Coconut Chutney',
    status: 'pending', // 'pending' | 'resolved'
    timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString()
  },
  {
    id: 'req-2',
    tableNumber: '05',
    requestType: 'Request Chilled Sweet Lassi Glasses',
    status: 'pending',
    timestamp: new Date(Date.now() - 6 * 60 * 1000).toISOString()
  },
  {
    id: 'req-3',
    tableNumber: '08',
    requestType: 'Request Extra Banana Leaves & Napkins',
    status: 'resolved',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString()
  }
];

// Play a subtle digital chime for incoming order or status alert
export const playKitchenChime = () => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
    
    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.35);
  } catch (e) {
    // Audio context may be restricted before user interaction
  }
};

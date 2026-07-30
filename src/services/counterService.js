export const INITIAL_RECEIPTS = [
  {
    receiptNo: "INV-2026-0891",
    orderId: "ORD-8042",
    tableNumber: "03",
    serverName: "Kavitha Raman",
    cashierName: "Sundaram Pillai",
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    paymentMethod: "UPI / QR Code",
    referenceNo: "UPI-9823140921",
    subtotal: 1070.00,
    discount: 100.00,
    packagingCharge: 20.00,
    taxableAmount: 990.00,
    gst: 49.50,
    tax: 49.50,
    cgst: 24.75,
    sgst: 24.75,
    vat: 0,
    total: 1039.50,
    tip: 0.00,
    totalPayable: 1039.50,
    grandTotal: 1039.50,
    status: "paid",
    items: [
      { name: "Special Chicken Dum Biryani", quantity: 2, price: 300.00, total: 600.00 },
      { name: "Aritaku Bojanam (Veg)", quantity: 1, price: 250.00, total: 250.00 },
      { name: "Gobi 65", quantity: 1, price: 220.00, total: 220.00 }
    ]
  },
  {
    receiptNo: "INV-2026-0890",
    orderId: "ORD-8039",
    tableNumber: "07",
    serverName: "Arun Prakash",
    cashierName: "Sundaram Pillai",
    timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    paymentMethod: "Cash",
    tenderedAmount: 600.00,
    changeGiven: 86.55,
    subtotal: 489.00,
    discount: 0,
    packagingCharge: 0,
    taxableAmount: 489.00,
    gst: 24.45,
    tax: 24.45,
    cgst: 12.23,
    sgst: 12.22,
    vat: 0,
    total: 513.45,
    tip: 0.00,
    totalPayable: 513.45,
    grandTotal: 513.45,
    status: "paid",
    items: [
      { name: "Sweet Corn Soup", quantity: 2, price: 99.00, total: 198.00 },
      { name: "Dal Fry", quantity: 1, price: 181.00, total: 181.00 },
      { name: "Butter Milk", quantity: 2, price: 55.00, total: 110.00 }
    ]
  },
  {
    receiptNo: "INV-2026-0889",
    orderId: "ORD-8031",
    tableNumber: "12",
    serverName: "Priya Nair",
    cashierName: "Sundaram Pillai",
    timestamp: new Date(Date.now() - 140 * 60 * 1000).toISOString(),
    paymentMethod: "Credit Card",
    cardBrand: "Visa ending in 4921",
    subtotal: 862.00,
    discount: 50.00,
    packagingCharge: 0,
    taxableAmount: 812.00,
    gst: 40.60,
    tax: 40.60,
    cgst: 20.30,
    sgst: 20.30,
    vat: 0,
    total: 852.60,
    tip: 20.00,
    totalPayable: 872.60,
    grandTotal: 872.60,
    status: "paid",
    items: [
      { name: "Paneer Butter Masala", quantity: 2, price: 311.00, total: 622.00 },
      { name: "Carrot Halwa", quantity: 2, price: 120.00, total: 240.00 }
    ]
  }
];

export const INITIAL_REGISTER_SESSION = {
  registerId: "POS-REGISTER-01",
  cashierName: "Imran Khan",
  shiftStartTime: new Date(new Date().setHours(8, 0, 0, 0)).toISOString(),
  openingFloat: 2000.00,
  cashCollected: 7688.00,
  cardCollected: 12600.00,
  upiCollected: 30420.00,
  totalRefunds: 640.00,
  isDrawerOpen: false
};

export const getStoredReceipts = () => {
  try {
    const data = localStorage.getItem("counter_receipts");
    return data ? JSON.parse(data) : INITIAL_RECEIPTS;
  } catch (err) {
    console.error("Failed to load stored receipts", err);
    return INITIAL_RECEIPTS;
  }
};

export const setStoredReceipts = (receipts) => {
  try {
    localStorage.setItem("counter_receipts", JSON.stringify(receipts));
  } catch (err) {
    console.error("Failed to save receipts", err);
  }
};

export const getStoredRegisterSession = () => {
  try {
    const data = localStorage.getItem("counter_register_session");
    return data ? JSON.parse(data) : INITIAL_REGISTER_SESSION;
  } catch (err) {
    console.error("Failed to load register session", err);
    return INITIAL_REGISTER_SESSION;
  }
};

export const setStoredRegisterSession = (session) => {
  try {
    localStorage.setItem("counter_register_session", JSON.stringify(session));
  } catch (err) {
    console.error("Failed to save register session", err);
  }
};

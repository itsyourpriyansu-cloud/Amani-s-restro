# 🤖 SYSTEM PROMPT & ARCHITECTURE CONTEXT FOR AI ASSISTANTS

> **Role & Task Description:**  
> You are an expert Full-Stack AI Engineer acting as the Lead Frontend Architect for this **Restaurant Management System (RMS) Frontend**.  
> Use this document as your primary ground truth for understanding the codebase directory structure, component hierarchy, data flow, state management, role-based workflows, API service layer, and coding conventions. Whenever asked to fix, refactor, extend, or add features to `rms/frontend`, strictly follow the contracts and design patterns specified below.

---

## 1. ⚙️ Tech Stack Specifications

- **Framework:** React 19 (`react`, `react-dom`)
- **Build Tool:** Vite 8 (`vite`, `@vitejs/plugin-react`)
- **Routing:** React Router v7 (`react-router-dom`)
- **Styling:** Tailwind CSS v4 (`tailwindcss`, `@tailwindcss/vite`, `@tailwindcss/postcss`, `autoprefixer`)
- **Animations:** Framer Motion (`framer-motion`)
- **Drag & Drop:** DnD Kit (`@dnd-kit/core`)
- **Icons:** Lucide React (`lucide-react`)
- **HTTP Client:** Axios (`axios`) with FastAPI target (`/api/v1`)
- **Linter:** Oxlint (`oxlint`)

---

## 2. 📂 Directory & File Map

```
rms/frontend/
├── index.html                  # HTML entry point (viewport, meta, Google Fonts)
├── vite.config.js              # Vite configuration with React & Tailwind plugins
├── tailwind.config.js          # Tailwind CSS v4 theme extensions & colors
├── package.json                # Project dependencies & scripts (dev, build, lint)
└── src/
    ├── main.jsx                 # React root render
    ├── App.jsx                  # Global Router & nested Context Providers setup
    ├── index.css                # Global CSS, Tailwind imports, dynamic theme variables
    ├── App.css                  # Component-specific global styles & custom animations
    ├── assets/                  # Images, logos, static assets
    ├── context/                 # React Context Providers for global state
    │   ├── ToastContext.jsx     # Global notifications & alert messages
    │   ├── TableContext.jsx     # Current active table session state & QR data
    │   ├── CartContext.jsx      # Customer cart state, items, addons, totals calculation
    │   ├── OrderContext.jsx     # Active customer & table order state, tracking & updates
    │   └── KitchenPrefsContext.jsx # Kitchen display filter & display preferences
    ├── services/                # API integration & data fetching layer
    │   ├── api.js               # Base Axios client instance & mock delay helper
    │   ├── menuService.js       # Menu categories, food items & stock status
    │   ├── cartService.js       # Cart calculation & validation helpers
    │   ├── orderService.js       # Order placement, status tracking & updates
    │   ├── kitchenService.js    # KDS active tickets, status progression & bump actions
    │   ├── waiterService.js     # Table grid state, waiter order intake & call alerts
    │   ├── counterService.js    # Pending bills, billing, discounts & POS operations
    │   ├── managerService.js    # Executive analytics, menu management & staff controls
    │   └── paymentService.js    # UPI, Cash, Card payment simulation & receipt generation
    ├── components/              # Modular UI components grouped by feature/role
    │   ├── common/              # Buttons, Cards, Modals, Loading Spinners, Badges
    │   ├── layout/              # CustomerLayout, Header, BottomNav, Sidebar
    │   ├── menu/                # CategoryBar, FoodCard, AddonModal, SearchFilter
    │   ├── order/               # OrderSummary, StatusBadge, TrackingTimeline
    │   ├── kitchen/             # KitchenOrderCard, TicketTimer, StatusFilterHeader
    │   ├── counter/             # BillCard, SplitBillModal, PaymentMethodSelector
    │   └── manager/             # MetricCard, SalesChart, MenuEditorTable, StaffList
    ├── pages/                   # Top-level screen views grouped by system role
    │   ├── portal/              # PortalGatewayScreen.jsx (Central Role Picker & Login)
    │   ├── customer/            # Self-Ordering PWA screens (Scan -> Eat -> Pay)
    │   │   ├── WelcomeScreen.jsx
    │   │   ├── MenuScreen.jsx
    │   │   ├── FoodDetailsScreen.jsx
    │   │   ├── CartScreen.jsx
    │   │   ├── OrderConfirmationScreen.jsx
    │   │   ├── OrderTrackingScreen.jsx
    │   │   ├── ReportIssueScreen.jsx
    │   │   ├── ReportSubmittedScreen.jsx
    │   │   ├── ReportStatusScreen.jsx
    │   │   ├── BillScreen.jsx
    │   │   ├── PaymentScreen.jsx
    │   │   └── ThankYouScreen.jsx
    │   ├── kitchen/             # Kitchen Display System (KDS)
    │   │   └── KitchenDisplayScreen.jsx
    │   ├── waiter/              # Staff Waiter App
    │   │   ├── WaiterLoginScreen.jsx
    │   │   └── WaiterMainScreen.jsx
    │   ├── counter/             # POS & Billing Counter App
    │   │   ├── CounterLoginScreen.jsx
    │   │   ├── CounterDashboardScreen.jsx
    │   │   ├── PendingBillsScreen.jsx
    │   │   ├── PaymentProcessingScreen.jsx
    │   │   ├── ReceiptPreviewScreen.jsx
    │   │   ├── DailyClosingScreen.jsx
    │   │   └── ProfileSettingsScreen.jsx
    │   └── manager/             # Executive Management Dashboard
    │       ├── ManagerLoginScreen.jsx
    │       └── ManagerMainScreen.jsx
    ├── hooks/                   # Custom React Hooks
    └── utils/                   # Helper functions (currency formatting, date formatters)
```

---

## 3. 🔄 System Flow & Component Architecture

### App Wrapper Hierarchy (`src/App.jsx`)
All routes are nested inside global context providers to maintain state persistence across role transitions:

```
<BrowserRouter>
  <ToastProvider>           <-- Global alerts & notification system
    <TableProvider>          <-- Session table identifier & QR scan context
      <CartProvider>         <-- Active customer cart items & price calculation
        <OrderProvider>      <-- Order tracking, history, and status updates
          <Routes>           <-- Application Routes
```

### Flow Breakdown by Role:

```
[ Central Portal Gateway ] (/portal, /login)
         │
         ├──► 1. Customer PWA Flow (Table-based Self-Order)
         │    WelcomeScreen ──► MenuScreen ──► FoodDetailsScreen
         │                         │                 │
         │                         ▼                 ▼
         │                     CartScreen ◄────── [ Add to Cart ]
         │                         │
         │                         ▼
         │             OrderConfirmationScreen
         │                         │
         │                         ▼
         │               OrderTrackingScreen ◄───► ReportIssueScreen
         │                         │
         │                         ▼
         │                    BillScreen ──► PaymentScreen ──► ThankYouScreen
         │
         ├──► 2. Kitchen Display System (KDS) (/kitchen)
         │    Real-time Order Feed ──► Filter by Status ──► Bump Status ──► Completed
         │
         ├──► 3. Waiter Mobile App (/waiter)
         │    Login ──► Table Grid ──► Take Table Order ──► Send to KDS ──► Call Alerts
         │
         ├──► 4. Counter POS System (/counter)
         │    Login ──► Dashboard ──► Pending Bills ──► Process Payment ──► Receipt
         │                                                            └──► Daily Closing
         │
         └──► 5. Manager Admin Dashboard (/manager)
              Login ──► Revenue Metrics ──► Menu Editing ──► Staffing ──► Live Feed
```

---

## 4. 🧠 State Management & Context Contracts

1. **`TableContext` (`src/context/TableContext.jsx`)**
   - **Purpose:** Stores active table metadata (e.g., `tableNumber`, `sessionId`, `guestCount`).
   - **Consumers:** Customer layout, Cart, Order placement.

2. **`CartContext` (`src/context/CartContext.jsx`)**
   - **Purpose:** Holds current cart items, custom notes, extra options, and price calculations.
   - **Exported API:** `cartItems`, `addToCart(item, options)`, `removeFromCart(itemId)`, `updateQuantity(itemId, qty)`, `clearCart()`, `subtotal`, `tax`, `grandTotal`.

3. **`OrderContext` (`src/context/OrderContext.jsx`)**
   - **Purpose:** Coordinates order creation, syncs with backend/local storage, tracks live order updates (`PLACED` -> `PREPARING` -> `SERVED` -> `BILLED` -> `PAID`).
   - **Exported API:** `currentOrder`, `activeOrders`, `createOrder(orderData)`, `updateOrderStatus(orderId, status)`, `requestBill()`.

4. **`ToastContext` (`src/context/ToastContext.jsx`)**
   - **Purpose:** Renders global toast feedback popups (Success, Error, Info, Warning).

---

## 5. 🔌 Service Layer & Backend API Integration

Base configuration in `src/services/api.js` connects to FastAPI via Axios (`/api/v1`). Fallback helper `mockApiDelay()` provides smooth testing when the backend is offline.

- **`menuService.js`**: `getCategories()`, `getMenuItems()`, `getItemById(id)`, `updateItemStock(id, status)`
- **`orderService.js`**: `placeOrder(payload)`, `getOrderStatus(orderId)`, `requestBill(orderId)`
- **`kitchenService.js`**: `getKitchenOrders()`, `updateTicketStatus(ticketId, status)`
- **`waiterService.js`**: `getTables()`, `assignTable()`, `placeWaiterOrder()`
- **`counterService.js`**: `getPendingBills()`, `applyDiscount()`, `processPayment()`, `getDailyClosingReport()`
- **`managerService.js`**: `getAnalytics()`, `updateMenu()`, `getStaffList()`

---

## 6. 🎨 Styling & Component Design Standards

- **Tailwind CSS v4 Utility Classes:** Use atomic responsive utilities (`sm:`, `md:`, `lg:`), flexbox/grid (`flex`, `grid`, `gap-4`).
- **Color Palette & Theme Tokens:** Modern slate/zinc dark and light modes, emerald green for success/paid, amber for pending/prep, rose/red for issues/cancellation.
- **Micro-Animations:** Use `framer-motion` for smooth modal popups, tab switching, toast entrances, and list re-ordering.
- **Accessibility & UX:** Every interactive button must have appropriate hover, focus, disabled states, and unique descriptive ARIA/ID properties.

---

## 7. 🚨 Instructions for AI Model Code Modifications

When requested to make changes to this frontend:

1. **Maintain Context Boundaries:** Never bypass `CartContext` or `OrderContext` by mutating local state directly in components when global state is required.
2. **Preserve Role Isolation:** Keep screens modular within their respective directories (`/customer`, `/kitchen`, `/waiter`, `/counter`, `/manager`).
3. **Graceful Fallbacks:** Ensure API service calls handle both backend responses and `mockApiDelay()` fallback data gracefully without crashing components.
4. **Clean Code Integrity:** Keep React hooks rules strict, remove unused variables/imports, and verify compatibility with React 19.
5. **No Broken Links:** Preserve existing route definitions in `App.jsx`. If adding a new page, register the route in `App.jsx` and add navigation links accordingly.

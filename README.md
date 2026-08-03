# 🍽️ Restaurant Management System

A comprehensive, real-time web application designed to streamline restaurant operations across Customer, Waiter, Kitchen, Billing Counter, and Management workflows.

---

## ✨ Features & Role Views

- **📱 Customer Portal**:
  - QR Code digital menu browsing
  - Category filtering, item customization, & search
  - Real-time cart management & order placement
  - Order status tracking & digital bill settlement (UPI, Card, Cash)

- **👨‍🍳 Kitchen Display System (KDS)**:
  - Live order queue with real-time preparation status updates
  - Audio/Visual alerts for new orders
  - Timer indicators per order item to ensure timely preparation

- **🕴️ Waiter Interface**:
  - Real-time table occupancy & status overview
  - Direct order taking & item customization
  - Customer assistance & service notification dispatch

- **💵 Counter & Cashier Interface**:
  - POS order review and quick billing
  - Invoice generation, discount application, and receipt printing

- **📊 Manager Dashboard**:
  - Real-time analytics, revenue reporting, & sales insights
  - Menu management (pricing, availability, categories)
  - Staff performance tracking & operational overview

- **🚪 Portal Hub**:
  - Central role selection screen for quick access to all module views

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Framer Motion
- **Backend Setup**: Python (Virtual environment ready for API integration)

---

## 📁 Project Structure

```text
restaurant_management_system/
├── frontend/                # React + Vite application
│   ├── public/              # Static assets
│   ├── src/                 # Source code
│   │   ├── components/      # Reusable UI components & layouts
│   │   ├── context/         # Application state management
│   │   ├── pages/           # Customer, Kitchen, Waiter, Manager, Counter views
│   │   ├── services/        # API service layers
│   │   └── utils/           # Utility functions & mock data
│   ├── package.json         # Node dependencies & scripts
│   └── vite.config.js       # Vite configuration
├── backend/                 # Backend API service directory
│   └── README.md            # Backend setup instructions
└── README.md                # Root project documentation
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/restaurant_management_system.git
   cd restaurant_management_system
   ```

2. **Setup and Run Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Open Application**:
   Navigate to `http://localhost:5173` in your browser.

---

## 📜 Available Scripts (Frontend)

Inside the `frontend/` directory:

- `npm run dev`: Starts the local development server with Hot Module Replacement (HMR).
- `npm run build`: Compiles and bundles the application for production inside `dist/`.
- `npm run preview`: Previews the production build locally.

---

## 📄 License

This project is licensed under the MIT License.

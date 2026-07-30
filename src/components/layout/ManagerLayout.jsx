import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../../context/OrderContext';
import { RESTAURANT_INFO } from '../../utils/mockData';
import {
  UtensilsCrossed,
  LayoutDashboard,
  BookOpen,
  Grid,
  Badge,
  BarChart3,
  Bell,
  Settings,
  CircleUserRound,
  LogOut,
  Search,
  CalendarDays,
  CreditCard,
  RefreshCw,
  Users,
  LayoutGrid,
  PanelLeftClose,
  PanelLeftOpen,
  TicketCheck,
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'menu', label: 'Menu & Categories', icon: BookOpen },
  { id: 'tables', label: 'Tables', icon: Grid },
  { id: 'guestflow', label: 'Guest Flow', icon: Users },
  { id: 'couponManagement', label: 'Coupons & Loyalty', icon: TicketCheck },
  { id: 'employee', label: 'Employees', icon: Badge },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'profile', label: 'Profile', icon: CircleUserRound },
];

const ManagerLayout = ({ children, activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const { resetKitchenDemoData } = useOrder();
  const [search, setSearch] = useState('');
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background text-on-background">
      {/* Sidebar */}
      <aside className={`shrink-0 border-r border-outline-variant bg-surface-container-lowest flex flex-col transition-[width] duration-200 ${collapsed ? 'w-[72px]' : 'w-[228px]'}`}>
        <div className={`flex items-center gap-3 h-16 shrink-0 ${collapsed ? 'justify-center px-2' : 'px-5'}`}>
          <img
            src={RESTAURANT_INFO.logo || '/logo.png'}
            alt={RESTAURANT_INFO.name}
            className="w-9 h-9 rounded-full object-cover shrink-0 border border-outline-variant/40"
          />
          {!collapsed && (
            <div className="min-w-0">
              <h1 className="text-on-surface font-bold text-sm leading-tight truncate">{RESTAURANT_INFO.name}</h1>
              <p className="text-on-surface-variant text-[11px] font-medium">Manager Portal</p>
            </div>
          )}
        </div>

        <nav className="flex-1 px-3 py-1 space-y-1 overflow-y-auto overflow-x-hidden">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 h-11 rounded-xl transition-all ${collapsed ? 'justify-center px-0' : 'px-3'} ${
                  isActive ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span className={`text-sm truncate ${isActive ? 'font-semibold' : 'font-medium'}`}>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className={`py-3 border-t border-outline-variant space-y-1 ${collapsed ? 'px-2' : 'px-3'}`}>
          <button
            onClick={() => navigate('/portal')}
            title={collapsed ? 'Switch App / Portal Hub' : undefined}
            className={`flex w-full items-center gap-3 h-10 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all ${collapsed ? 'justify-center' : 'px-3'}`}
          >
            <LayoutGrid className="w-4.5 h-4.5 shrink-0" />
            {!collapsed && <span className="text-xs font-semibold truncate">Switch App / Portal Hub</span>}
          </button>

          <button
            onClick={resetKitchenDemoData}
            title={collapsed ? 'Reset Demo Data' : undefined}
            className={`flex w-full items-center gap-3 h-9 rounded-xl text-on-surface-variant/70 hover:bg-surface-container transition-all ${collapsed ? 'justify-center' : 'px-3'}`}
          >
            <RefreshCw className="w-4 h-4 shrink-0" />
            {!collapsed && <span className="text-[11px] font-medium truncate">Reset Demo Data</span>}
          </button>
          <button
            onClick={() => navigate('/portal')}
            title={collapsed ? 'Logout' : undefined}
            className={`flex w-full items-center gap-3 h-9 rounded-xl text-error/80 hover:bg-error/5 hover:text-error transition-all ${collapsed ? 'justify-center' : 'px-3'}`}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span className="text-[11px] font-medium truncate">Logout</span>}
          </button>

          <button
            onClick={() => setCollapsed((v) => !v)}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={`flex w-full items-center gap-3 h-9 rounded-xl text-on-surface-variant/60 hover:bg-surface-container hover:text-on-surface transition-all ${collapsed ? 'justify-center' : 'px-3'}`}
          >
            {collapsed ? <PanelLeftOpen className="w-4 h-4 shrink-0" /> : <PanelLeftClose className="w-4 h-4 shrink-0" />}
            {!collapsed && <span className="text-[11px] font-medium truncate">Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Main Column */}
      <main className="flex-1 flex flex-col min-w-0 bg-background overflow-y-auto">
        {/* Header */}
        <header className="h-[62px] shrink-0 border-b border-outline-variant bg-surface flex items-center justify-between gap-4 px-6 sticky top-0 z-10">
          <div className="flex items-center flex-1 min-w-0">
            <div className="relative w-full max-w-[420px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search orders, tables, guests or staff"
                className="w-full bg-surface-container-low border-none rounded-full pl-10 pr-4 h-10 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden md:flex flex-col items-end leading-tight">
              <span className="text-sm font-bold text-on-surface">Sundaram Pillai</span>
              <span className="text-[11px] text-on-surface-variant">General Manager</span>
            </div>

            <div className="flex items-center gap-0.5">
              <button
                onClick={() => navigate('/counter')}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container text-on-surface-variant transition-colors"
                title="Open Counter POS"
              >
                <CreditCard className="w-[18px] h-[18px]" />
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container text-on-surface-variant relative transition-colors"
                title="Notifications"
              >
                <Bell className="w-[18px] h-[18px]" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-surface" />
              </button>
              <button
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container text-on-surface-variant transition-colors"
                title="Today's Schedule"
              >
                <CalendarDays className="w-[18px] h-[18px]" />
              </button>
            </div>

            <button
              onClick={() => navigate('/portal')}
              className="flex items-center gap-2 h-10 px-4 rounded-xl bg-primary text-on-primary font-bold text-sm hover:opacity-90 transition-all"
              title="Return to App Hub"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">App Hub</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className="w-10 h-10 rounded-full border-2 border-outline-variant overflow-hidden shrink-0"
              title="Manager Profile"
            >
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                alt="Manager Avatar"
                className="w-full h-full object-cover"
              />
            </button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="px-7 py-7 max-w-[1600px] mx-auto w-full">{children}</div>
      </main>
    </div>
  );
};

export default ManagerLayout;

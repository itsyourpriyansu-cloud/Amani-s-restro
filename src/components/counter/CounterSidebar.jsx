import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useOrder } from '../../context/OrderContext';
import { RESTAURANT_INFO } from '../../utils/mockData';
import {
  LayoutDashboard,
  ListChecks,
  CreditCard,
  Receipt,
  BarChart3,
  User,
  Plus,
  ArrowLeft
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/counter', end: true, label: 'Dashboard', icon: LayoutDashboard },
  { to: '/counter/pending-bills', label: 'Pending Bills', icon: ListChecks },
  { to: '/counter/payment', label: 'Payments', icon: CreditCard },
  { to: '/counter/receipt', label: 'Receipts', icon: Receipt },
  { to: '/counter/daily-closing', label: 'Daily Closing', icon: BarChart3 },
  { to: '/counter/profile', label: 'Profile', icon: User },
];

const CounterSidebar = () => {
  const navigate = useNavigate();
  const { billRequests } = useOrder();
  const pendingCount = billRequests.filter((b) => b.status === 'pending').length;

  return (
    <aside className="hidden md:flex flex-col h-screen w-64 shrink-0 p-4 gap-2 border-r border-outline-variant/30 bg-surface-container-lowest">
      <button
        onClick={() => navigate('/portal')}
        className="flex items-center gap-1.5 px-2 py-1.5 -ml-1 mb-4 w-fit rounded-lg text-xs font-semibold text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors"
        title="Return to System Launchpad"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Portal</span>
      </button>

      <div className="mb-8 px-2">
        <h1 className="text-xl font-bold text-primary tracking-tight">{RESTAURANT_INFO.name}</h1>
        <p className="text-xs text-on-surface-variant opacity-70">Counter Management System</p>
      </div>

      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map(({ to, end, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-secondary-container text-on-secondary-container font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:translate-x-1'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                <span>{label}</span>
                {label === 'Pending Bills' && pendingCount > 0 && (
                  <span className="ml-auto text-[10px] font-bold bg-primary text-on-primary px-1.5 py-0.5 rounded-full">
                    {pendingCount}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={() => navigate('/counter/pending-bills')}
        className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary py-3 rounded-xl font-bold text-sm shadow-lg hover:brightness-110 active:scale-95 transition-all"
      >
        <Plus className="w-4 h-4" />
        <span>New Bill</span>
      </button>
    </aside>
  );
};

export default CounterSidebar;

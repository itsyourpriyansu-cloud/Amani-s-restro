import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { RESTAURANT_INFO } from '../../utils/mockData';
import {
  LayoutDashboard,
  History,
  ChefHat,
  BellRing,
  Settings,
  ArrowLeft,
  RotateCcw,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/kitchen', end: true, label: 'Live Dashboard', icon: LayoutDashboard },
  { to: '/kitchen/history', end: false, label: 'Order History', icon: History },
  { to: '/kitchen/summary', end: false, label: 'Item Summary', icon: ChefHat },
  { to: '/kitchen/assistance', end: false, label: 'Assistance Calls', icon: BellRing, badgeKey: 'assistance' },
  { to: '/kitchen/settings', end: false, label: 'Settings', icon: Settings },
];

const KitchenSidebar = ({
  pendingCallsCount = 0,
  onResetData,
  isCollapsed = false,
  onToggleCollapse
}) => {
  const navigate = useNavigate();

  return (
    <aside
      className={`hidden md:flex flex-col h-screen shrink-0 bg-white shadow-2xs z-30 transition-all duration-300 ${
        isCollapsed ? 'w-[72px] p-2.5' : 'w-[212px] p-3.5'
      }`}
    >
      {/* Top Header & Collapse Toggle */}
      <div className="flex items-center justify-between mb-4">
        {!isCollapsed && (
          <button
            onClick={() => navigate('/portal')}
            className="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            title="Return to System Launchpad"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Portal</span>
          </button>
        )}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className={`p-1.5 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors ${
              isCollapsed ? 'mx-auto' : 'ml-auto'
            }`}
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Brand Header */}
      {!isCollapsed ? (
        <div className="mb-6 px-2 flex items-center gap-3">
          <img
            src={RESTAURANT_INFO.logo || '/logo.png'}
            alt={RESTAURANT_INFO.name}
            className="w-10 h-10 rounded-full object-cover shrink-0 shadow-xs border border-gray-200"
          />
          <div>
            <h1 className="text-base font-extrabold text-[#A30F3B] tracking-tight leading-snug">
              {RESTAURANT_INFO.name}
            </h1>
            <p className="text-xs text-gray-500 font-medium">Kitchen Display System</p>
          </div>
        </div>
      ) : (
        <div className="mb-6 text-center">
          <img
            src={RESTAURANT_INFO.logo || '/logo.png'}
            alt={RESTAURANT_INFO.name}
            className="w-9 h-9 mx-auto rounded-full object-cover shadow-xs border border-gray-200"
          />
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map(({ to, end, label, icon: Icon, badgeKey }) => {
          const badgeCount = badgeKey === 'assistance' ? pendingCallsCount : 0;
          return (
            <NavLink
              key={to}
              to={to}
              end={end}
              title={isCollapsed ? label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 h-11 rounded-full text-sm transition-all ${
                  isActive
                    ? 'bg-[#F9E9EE] text-[#A30F3B] font-extrabold shadow-2xs'
                    : 'text-gray-600 font-semibold hover:bg-gray-100 hover:text-gray-900'
                } ${isCollapsed ? 'justify-center px-0' : ''}`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="relative shrink-0">
                    <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                    {isCollapsed && badgeCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 text-[9px] font-bold bg-[#A30F3B] text-white w-4 h-4 rounded-full flex items-center justify-center">
                        {badgeCount}
                      </span>
                    )}
                  </div>
                  {!isCollapsed && (
                    <>
                      <span className="truncate">{label}</span>
                      {badgeCount > 0 && (
                        <span className="ml-auto text-[11px] font-bold bg-[#A30F3B] text-white px-2 py-0.5 rounded-full">
                          {badgeCount}
                        </span>
                      )}
                    </>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Low-priority Reset Demo Data Button */}
      {onResetData && (
        <div className="pt-2 border-t border-gray-100">
          <button
            onClick={onResetData}
            title={isCollapsed ? 'Reset Demo Data' : undefined}
            className={`w-full flex items-center justify-center gap-2 py-2 rounded-full text-xs font-semibold text-gray-500 hover:text-[#A30F3B] hover:bg-[#F9E9EE] transition-all ${
              isCollapsed ? 'px-0 h-10' : 'px-3'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5 shrink-0" />
            {!isCollapsed && <span>Reset Demo Data</span>}
          </button>
        </div>
      )}
    </aside>
  );
};

export default KitchenSidebar;

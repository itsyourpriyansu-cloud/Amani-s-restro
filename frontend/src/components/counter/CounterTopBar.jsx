import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, CalendarDays, UserCircle2, LayoutGrid } from 'lucide-react';

const CounterTopBar = ({ title, subtitle, showSearch = true, searchPlaceholder = 'Search bills, tables, or orders...' }) => {
  const navigate = useNavigate();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000 * 30);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="flex items-center justify-between gap-4 h-16 px-6 border-b border-outline-variant/30 bg-surface-container-lowest shrink-0 shadow-sm">
      <div className="flex items-center gap-4 min-w-0">
        {title ? (
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-primary leading-tight truncate">{title}</h2>
            {subtitle && <p className="text-xs text-on-surface-variant truncate">{subtitle}</p>}
          </div>
        ) : (
          showSearch && (
            <div className="relative w-full max-w-md hidden lg:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                className="w-full pl-10 pr-4 py-2 bg-surface-container rounded-full border-none focus:ring-2 focus:ring-primary/30 text-sm outline-none"
              />
            </div>
          )
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
        </button>
        <button
          className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors hidden sm:flex"
          title={now.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
        >
          <CalendarDays className="w-5 h-5" />
        </button>
        <button
          onClick={() => navigate('/counter/profile')}
          className="p-1 ml-1 rounded-full border-2 border-primary/10 hover:border-primary/40 transition-colors"
          title="Profile"
        >
          <UserCircle2 className="w-8 h-8 text-primary" />
        </button>
        <button
          onClick={() => navigate('/portal')}
          className="ml-1 flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-on-primary font-bold text-xs hover:opacity-90 transition-all shadow-sm"
          title="Switch App"
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>App Hub</span>
        </button>
      </div>
    </header>
  );
};

export default CounterTopBar;

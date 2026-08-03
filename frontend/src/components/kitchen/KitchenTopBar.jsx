import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, BellOff, CalendarDays, UserCircle2, LayoutGrid, BellRing } from 'lucide-react';
import { useKitchenPrefs } from '../../context/KitchenPrefsContext';

const KitchenTopBar = ({
  title,
  subtitle,
  showSearch = true,
  searchPlaceholder = 'Search table, order or dish',
  staffAuth,
  pendingCallsCount = 0,
  onOpenAssistanceDrawer,
  searchQuery = '',
  setSearchQuery
}) => {
  const navigate = useNavigate();
  const { prefs, updatePref } = useKitchenPrefs();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000 * 30);
    return () => clearInterval(timer);
  }, []);

  const initials = (staffAuth?.name || 'Chef')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <header className="flex items-center justify-between gap-4 h-15 px-6 bg-white shrink-0 shadow-2xs z-20">
      {/* Title or Search */}
      <div className="flex items-center gap-4 min-w-0">
        {title ? (
          <div className="min-w-0">
            <h2 className="text-base font-bold text-gray-900 leading-tight truncate">{title}</h2>
            {subtitle && <p className="text-xs text-gray-500 truncate">{subtitle}</p>}
          </div>
        ) : (
          showSearch && (
            <div className="relative w-72 md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-10 pr-8 py-2 bg-gray-100 border-none rounded-full text-xs text-gray-900 placeholder-gray-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#A30F3B]/20 transition-all shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery && setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>
          )
        )}
      </div>

      {/* Global Controls & Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Assistance Calls Alert Icon */}
        <button
          onClick={onOpenAssistanceDrawer}
          className="relative p-2 text-gray-600 hover:text-[#A30F3B] hover:bg-gray-100 rounded-full transition-colors"
          title={`${pendingCallsCount} Assistance Calls`}
        >
          <BellRing className="w-5 h-5" />
          {pendingCallsCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#A30F3B] text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
              {pendingCallsCount}
            </span>
          )}
        </button>

        {/* Mute Audio */}
        <button
          onClick={() => updatePref('audioMuted', !prefs.audioMuted)}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
          title={prefs.audioMuted ? 'Unmute order alert sound' : 'Order alert sound enabled'}
        >
          {prefs.audioMuted ? <BellOff className="w-5 h-5 text-red-500" /> : <Bell className="w-5 h-5" />}
        </button>

        {/* Date Display */}
        <button
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors hidden sm:flex items-center gap-1.5 text-xs font-medium"
          title={now.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
        >
          <CalendarDays className="w-4 h-4" />
          <span>{now.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
        </button>

        {/* Staff User Avatar */}
        <button
          onClick={() => navigate('/kitchen/settings')}
          className="p-0.5 rounded-full hover:ring-2 hover:ring-[#A30F3B]/30 transition-all"
          title="Kitchen Settings"
        >
          {staffAuth ? (
            <span className="w-8 h-8 rounded-full bg-[#A30F3B] text-white flex items-center justify-center text-xs font-bold shadow-xs">
              {initials}
            </span>
          ) : (
            <UserCircle2 className="w-8 h-8 text-[#A30F3B]" />
          )}
        </button>

        {/* App Hub Launch Button */}
        <button
          onClick={() => navigate('/portal')}
          className="ml-1 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#A30F3B] text-white font-bold text-xs hover:bg-[#850c2f] transition-all shadow-xs"
          title="Switch App"
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>App Hub</span>
        </button>
      </div>
    </header>
  );
};

export default KitchenTopBar;

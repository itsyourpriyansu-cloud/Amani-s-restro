import React from 'react';
import { Home, LayoutGrid, Utensils, User, Store } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: Home, badgeKey: 'homeCount' },
  { id: 'tables', label: 'Tables', icon: LayoutGrid },
  { id: 'orders', label: 'Orders', icon: Utensils, badgeKey: 'readyCount' },
  { id: 'profile', label: 'Profile', icon: User },
  { id: '__hub__', label: 'App Hub', icon: Store, isPortal: true },
];

const WaiterBottomNav = ({
  activeTab,
  setActiveTab,
  readyCount = 0,
  requestsCount = 0,
  billsCount = 0
}) => {
  const navigate = useNavigate();

  const getBadgeCount = (key) => {
    if (key === 'readyCount') return readyCount;
    if (key === 'homeCount') return requestsCount + billsCount;
    return 0;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-surface-container-lowest/95 backdrop-blur-md border-t border-outline-variant/30 shadow-lg">
      <div className="max-w-md mx-auto px-2 h-16 flex items-center justify-around">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const count = item.badgeKey ? getBadgeCount(item.badgeKey) : 0;

          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => item.isPortal ? navigate('/portal') : setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center w-16 h-12 rounded-2xl transition-all ${
                item.isPortal
                  ? 'text-primary bg-primary/10'
                  : isActive
                    ? 'text-primary'
                    : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.5]' : 'stroke-[1.75]'}`} />
                {count > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-2 bg-primary text-on-primary text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-surface-container-lowest shadow-sm"
                  >
                    {count}
                  </motion.span>
                )}
              </div>
              <span className={`text-[10px] mt-1 tracking-tight ${isActive ? 'font-bold text-on-surface' : 'font-medium'}`}>
                {item.label}
              </span>

              {isActive && (
                <motion.div
                  layoutId="waiterNavIndicator"
                  className="absolute bottom-1 w-8 h-1 bg-primary rounded-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};

export default WaiterBottomNav;

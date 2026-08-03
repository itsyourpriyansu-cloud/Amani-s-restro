import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, ShoppingBag, ReceiptText, WalletCards } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useOrder } from '../../context/OrderContext';

const NAV_ITEMS = [
  { label: 'Menu', path: '/menu', icon: BookOpen },
  { label: 'Cart', path: '/cart', icon: ShoppingBag },
  { label: 'Orders', path: '/order-tracking', icon: ReceiptText },
  { label: 'Bill', path: '/bill', icon: WalletCards },
];

const BottomNavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { totals } = useCart();
  const { activeOrder } = useOrder();

  return (
    <nav
      aria-label="Customer navigation"
      className="fixed left-1/2 -translate-x-1/2 z-50 w-[calc(100%-20px)] sm:w-[calc(100%-32px)] max-w-[520px] rounded-[24px] p-[6px_8px] flex items-center select-none pointer-events-auto transition-all duration-200"
      style={{
        bottom: 'calc(12px + env(safe-area-inset-bottom))',
        minHeight: '68px',
        backgroundColor: 'rgba(253, 251, 247, 0.94)',
        border: '1.5px solid rgba(231, 218, 208, 0.9)',
        boxShadow: '0 16px 40px rgba(116, 47, 28, 0.12), 0 4px 12px rgba(26, 18, 13, 0.06)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <div className="grid grid-cols-4 items-center gap-1.5 w-full h-full">
        {NAV_ITEMS.map((item) => {
          const IconComponent = item.icon;
          const isActive =
            location.pathname === item.path ||
            (item.path === '/menu' && location.pathname.startsWith('/menu/')) ||
            (item.path === '/order-tracking' && location.pathname === '/order-confirmation') ||
            (item.path === '/bill' && location.pathname === '/payment');

          const cartBadge = item.path === '/cart' ? (totals?.itemCount || 0) : 0;
          const hasActiveOrder = item.path === '/order-tracking' && !!activeOrder;

          let ariaLabel = item.label;
          if (item.path === '/cart' && cartBadge > 0) {
            ariaLabel = `Cart, ${cartBadge} ${cartBadge === 1 ? 'item' : 'items'}`;
          } else if (item.path === '/order-tracking' && hasActiveOrder) {
            ariaLabel = 'Orders, active order in progress';
          }

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              aria-current={isActive ? 'page' : undefined}
              aria-label={ariaLabel}
              className={`relative min-h-[52px] w-full rounded-[18px] flex flex-col items-center justify-center gap-[3px] py-1.5 transition-all duration-200 ease-out active:scale-[0.93] focus-visible:outline-2 focus-visible:outline-[#742F1C] focus-visible:outline-offset-2 ${
                isActive
                  ? 'bg-[#742F1C] text-white shadow-[0_6px_18px_rgba(116,47,28,0.32)] border border-[#742F1C] active:bg-[#5B2314]'
                  : 'bg-transparent text-[#6E5D57] hover:text-[#742F1C] hover:bg-[#742F1C]/10 active:bg-[#742F1C]/18'
              }`}
            >
              <span className="relative flex items-center justify-center">
                <IconComponent
                  size={21}
                  strokeWidth={isActive ? 2.4 : 1.9}
                  className="transition-colors duration-150"
                  aria-hidden="true"
                />
                {cartBadge > 0 && (
                  <span
                    className={`absolute -top-1.5 -right-3 min-w-[18px] h-[18px] px-[5px] rounded-full flex items-center justify-center text-[10.5px] font-bold leading-none shadow-sm pointer-events-none ${
                      isActive
                        ? 'bg-[#C89552] text-[#2E1C0A] ring-2 ring-[#742F1C]'
                        : 'bg-[#742F1C] text-white ring-2 ring-white'
                    }`}
                  >
                    {cartBadge > 9 ? '9+' : cartBadge}
                  </span>
                )}
                {hasActiveOrder && cartBadge === 0 && (
                  <span
                    className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 animate-pulse pointer-events-none ${
                      isActive ? 'bg-[#C89552] ring-[#742F1C]' : 'bg-[#14383B] ring-white'
                    }`}
                    aria-hidden="true"
                  />
                )}
              </span>
              <span
                className={`text-[11.5px] sm:text-[12px] leading-none tracking-tight whitespace-nowrap transition-colors duration-150 ${
                  isActive ? 'text-white font-bold' : 'text-[#6E5D57] font-semibold'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavBar;


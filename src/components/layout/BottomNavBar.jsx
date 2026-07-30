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
      className="fixed left-1/2 -translate-x-1/2 z-50 w-[calc(100%-20px)] sm:w-[calc(100%-32px)] max-w-[520px] rounded-[24px] p-[8px_10px] flex items-center select-none pointer-events-auto transition-all duration-200"
      style={{
        bottom: 'calc(12px + env(safe-area-inset-bottom))',
        minHeight: '70px',
        backgroundColor: 'color-mix(in srgb, var(--color-surface) 98%, transparent)',
        border: '1px solid color-mix(in srgb, var(--color-outline-variant) 95%, transparent)',
        boxShadow: '0 14px 38px rgba(26, 18, 13, 0.16), 0 3px 10px rgba(26, 18, 13, 0.08)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
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
              className={`relative min-h-[54px] w-full rounded-[18px] flex flex-col items-center justify-center gap-[4px] py-1 transition-all duration-150 ease-out active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 ${
                isActive
                  ? 'bg-primary-container text-primary border border-primary/20 shadow-xs'
                  : 'bg-transparent text-on-surface-variant border border-transparent hover:text-on-surface hover:bg-surface-container/60'
              }`}
            >
              <span className="relative flex items-center justify-center">
                <IconComponent
                  size={22}
                  strokeWidth={isActive ? 2.3 : 1.8}
                  className="transition-colors duration-150"
                  aria-hidden="true"
                />
                {cartBadge > 0 && (
                  <span
                    className="absolute -top-1.5 -right-3 min-w-[18px] h-[18px] px-[5px] rounded-full flex items-center justify-center text-[10.5px] font-bold text-on-primary leading-none shadow-sm pointer-events-none bg-primary"
                  >
                    {cartBadge > 9 ? '9+' : cartBadge}
                  </span>
                )}
                {hasActiveOrder && cartBadge === 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-highlight ring-2 ring-surface animate-pulse pointer-events-none"
                    aria-hidden="true"
                  />
                )}
              </span>
              <span
                className={`text-[11.5px] sm:text-[12px] leading-none tracking-tight whitespace-nowrap ${
                  isActive ? 'text-primary font-bold' : 'text-on-surface-variant font-semibold'
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


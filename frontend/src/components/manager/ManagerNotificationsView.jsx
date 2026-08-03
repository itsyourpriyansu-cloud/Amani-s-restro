import React, { useMemo, useState } from 'react';
import { useOrder } from '../../context/OrderContext';
import { DISHES } from '../../utils/mockData';
import {
  CheckCheck,
  AlertTriangle,
  CheckCircle2,
  PackageX,
  UserPlus,
  Cog,
  BellOff,
  MoreVertical,
  Clock
} from 'lucide-react';

const timeAgo = (iso) => {
  if (!iso) return 'just now';
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.max(0, Math.round(diffMs / 60000));
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
};

const ManagerNotificationsView = () => {
  const { kitchenOrders, billRequests, assistanceRequests } = useOrder();
  const [filter, setFilter] = useState('all'); // 'all' | 'unread' | 'important'
  const [readIds, setReadIds] = useState(() => new Set());

  const storedDishes = useMemo(() => {
    const saved = localStorage.getItem('amani_menu_dishes');
    return saved ? JSON.parse(saved) : DISHES;
  }, []);

  const notifications = useMemo(() => {
    const items = [];

    kitchenOrders.filter((o) => o.isRush).forEach((o) => {
      items.push({
        id: `rush-${o.orderId}`,
        title: 'Kitchen Rush Alert',
        message: `Order ${o.orderId} for Table ${o.tableNumber} is flagged urgent and needs priority handling.`,
        time: o.createdAt,
        icon: AlertTriangle,
        tone: 'primary',
        important: true,
      });
    });

    billRequests.filter((b) => b.status === 'pending').forEach((b) => {
      items.push({
        id: `bill-${b.id}`,
        title: 'Payment Pending',
        message: `Table ${b.tableNumber} requested the bill — ₹${b.grandTotal?.toFixed(2)} awaiting settlement.`,
        time: b.requestedAt,
        icon: CheckCircle2,
        tone: 'secondary',
        important: false,
      });
    });

    assistanceRequests.filter((r) => r.status === 'pending').forEach((r) => {
      items.push({
        id: `assist-${r.id}`,
        title: 'Table Needs Assistance',
        message: `Table ${r.tableNumber} raised a "${r.requestType || 'general'}" request.`,
        time: r.timestamp,
        icon: AlertTriangle,
        tone: 'primary',
        important: true,
      });
    });

    storedDishes.filter((d) => d.inStock === false).forEach((d) => {
      items.push({
        id: `stock-${d.id}`,
        title: `Low Stock Alert: ${d.name}`,
        message: `${d.name} is currently marked out of stock. Update inventory or hide from menu.`,
        time: null,
        icon: PackageX,
        tone: 'warning',
        important: false,
      });
    });

    items.push({
      id: 'sys-update',
      title: 'System Update',
      message: 'Manager Portal v2.4.0 successfully deployed. New reporting widgets are now available.',
      time: null,
      icon: Cog,
      tone: 'muted',
      important: false,
    });

    items.push({
      id: 'staff-onboard',
      title: 'New Employee Added',
      message: 'A new team member recently completed onboarding and joined the roster.',
      time: null,
      icon: UserPlus,
      tone: 'muted',
      important: false,
    });

    return items;
  }, [kitchenOrders, billRequests, assistanceRequests, storedDishes]);

  const isRead = (id) => readIds.has(id);
  const markRead = (id) => setReadIds((prev) => new Set(prev).add(id));
  const markAllRead = () => setReadIds(new Set(notifications.map((n) => n.id)));

  const unreadCount = notifications.filter((n) => !isRead(n.id)).length;
  const importantCount = notifications.filter((n) => n.important).length;

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return !isRead(n.id);
    if (filter === 'important') return n.important;
    return true;
  });

  const toneClasses = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary-container/30 text-on-secondary-container',
    warning: 'bg-orange-50 text-orange-600',
    muted: 'bg-surface-container text-on-surface-variant',
  };

  return (
    <div className="space-y-6 max-w-4xl">

      {/* Page Header */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-on-surface tracking-tight">Notifications</h2>
          <p className="text-xs text-on-surface-variant mt-1">Real-time alerts from the kitchen, floor, and inventory systems.</p>
        </div>
        <button
          onClick={markAllRead}
          className="group flex items-center gap-2 px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-xl text-xs font-semibold text-on-surface hover:bg-surface-container-high transition-all active:scale-95 shadow-sm"
        >
          <CheckCheck className="w-4 h-4 text-primary group-hover:rotate-12 transition-transform" />
          Mark All as Read
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-2 border-b border-outline-variant">
        {[
          { id: 'all', label: 'All', count: notifications.length },
          { id: 'unread', label: 'Unread', count: unreadCount },
          { id: 'important', label: 'Important', count: importantCount },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-5 py-3 border-b-2 text-xs font-semibold transition-all flex items-center gap-2 ${
              filter === tab.id ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-on-surface-variant hover:text-primary hover:bg-surface-container'
            }`}
          >
            {tab.label}
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${filter === tab.id ? 'bg-primary text-on-primary' : 'bg-surface-container-highest text-on-surface-variant'}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Notification List */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((n) => {
            const Icon = n.icon;
            const read = isRead(n.id);
            return (
              <div
                key={n.id}
                onClick={() => markRead(n.id)}
                className={`group relative flex items-start gap-4 p-5 rounded-2xl shadow-sm border transition-all cursor-pointer ${
                  read
                    ? 'bg-surface-container-low/50 border-transparent opacity-80 hover:opacity-100 hover:bg-surface-container-lowest hover:border-outline-variant/40'
                    : n.important
                    ? 'bg-surface-container-lowest border-primary/20 hover:shadow-md hover:border-primary/40'
                    : 'bg-surface-container-lowest border-outline-variant/40 hover:shadow-md'
                }`}
              >
                {!read && n.important && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary rounded-l-2xl" />}
                <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${toneClasses[n.tone]}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className={`text-sm font-bold ${read ? 'text-on-surface-variant' : 'text-on-surface'}`}>{n.title}</h3>
                    <span className={`flex items-center gap-1 text-[11px] shrink-0 ${read ? 'text-on-surface-variant opacity-60' : 'text-on-surface-variant'}`}>
                      <Clock className="w-3 h-3" />
                      {timeAgo(n.time)}
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">{n.message}</p>
                  {!read && (
                    <div className="flex items-center gap-3 mt-2.5">
                      {n.important && (
                        <span className="px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container text-[10px] uppercase tracking-wide font-bold">
                          Important
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-primary font-bold text-[10px] uppercase tracking-wide">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        New
                      </span>
                    </div>
                  )}
                </div>
                <button className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg transition-colors" title="Options" onClick={(e) => e.stopPropagation()}>
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <BellOff className="w-16 h-16 text-on-surface-variant/20 mb-4" />
          <h3 className="text-base font-bold text-on-surface-variant mb-1">Clear Skies</h3>
          <p className="text-xs text-on-surface-variant">You're all caught up — no notifications here.</p>
        </div>
      )}
    </div>
  );
};

export default ManagerNotificationsView;

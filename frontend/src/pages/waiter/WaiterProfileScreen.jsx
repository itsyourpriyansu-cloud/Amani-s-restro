import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../../context/OrderContext';
import { useToast } from '../../context/ToastContext';
import { WAITER_PROFILE } from '../../services/waiterService';
import Modal from '../../components/common/Modal';
import {
  Pencil,
  Clock,
  Table2,
  Receipt,
  BellRing,
  CreditCard,
  User,
  Lock,
  Bell,
  Globe,
  HelpCircle,
  Info,
  ChevronRight,
  RotateCcw,
  ExternalLink,
  Shield,
  LogOut,
} from 'lucide-react';

const SETTINGS_ITEMS = [
  { id: 'edit', label: 'Edit Profile', icon: User },
  { id: 'password', label: 'Change Password', icon: Lock },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'language', label: 'Language', icon: Globe, value: 'English' },
  { id: 'help', label: 'Help & Support', icon: HelpCircle },
  { id: 'about', label: 'About', icon: Info },
];

const WaiterProfileScreen = () => {
  const navigate = useNavigate();
  const { waiterTables, kitchenOrders, assistanceRequests, billRequests, resetKitchenDemoData } = useOrder();
  const { showToast } = useToast();

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleReset = () => {
    resetKitchenDemoData();
    showToast('Demo floor plan & order data reset to default!', 'info');
  };

  const handleSettingClick = (label) => {
    showToast(`${label} — coming soon in this demo`, 'info');
  };

  const handleLogout = () => {
    setShowLogoutModal(false);
    navigate('/portal');
  };

  const STATS = [
    { id: 'tables', label: 'Tables', value: waiterTables.length, icon: Table2, bg: 'bg-primary-container/20 text-primary' },
    { id: 'orders', label: 'Orders', value: kitchenOrders.length, icon: Receipt, bg: 'bg-secondary-container/30 text-on-secondary-container' },
    { id: 'requests', label: 'Requests', value: assistanceRequests.length, icon: BellRing, bg: 'bg-error-container/40 text-on-error-container' },
    { id: 'bills', label: 'Bills', value: billRequests.length, icon: CreditCard, bg: 'bg-tertiary-container/40 text-on-tertiary-container' },
  ];

  return (
    <div className="space-y-4 pb-6">
      {/* Profile Header Card */}
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-5 shadow-md flex flex-col items-center text-center">
        <div className="relative">
          <img
            src={WAITER_PROFILE.avatar}
            alt={WAITER_PROFILE.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-surface-container-high shadow-md"
          />
          {WAITER_PROFILE.onDuty && (
            <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-surface-container-lowest shadow-sm" />
          )}
        </div>

        <h2 className="text-lg font-bold text-on-surface font-serif mt-3">
          {WAITER_PROFILE.name}
        </h2>

        <div className="flex items-center justify-center gap-1.5 mt-1.5">
          <span className="px-2.5 py-0.5 rounded-lg bg-surface-container text-on-surface-variant text-[10px] font-mono font-bold">
            {WAITER_PROFILE.employeeId}
          </span>
          <span className="px-2.5 py-0.5 rounded-lg bg-surface-container text-on-surface-variant text-[10px] font-mono font-bold">
            Waiter
          </span>
        </div>

        {WAITER_PROFILE.onDuty && (
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-wider">On Duty</span>
          </div>
        )}

        <button
          onClick={() => handleSettingClick('Edit Profile')}
          className="w-full mt-4 py-3 rounded-2xl border border-outline-variant text-on-surface font-bold text-xs flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
        >
          <Pencil className="w-3.5 h-3.5" />
          Edit Profile
        </button>
      </div>

      {/* Shift Information */}
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-4 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant/70">Shift Information</h3>
          <Clock className="w-4 h-4 text-secondary" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-0.5">
            <p className="text-[10px] text-on-surface-variant">Current Shift</p>
            <p className="text-sm font-bold text-on-surface">{WAITER_PROFILE.currentShift}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[10px] text-on-surface-variant">Start Time</p>
            <p className="text-sm font-bold text-on-surface">{WAITER_PROFILE.shiftStartedAt}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[10px] text-on-surface-variant">Hours Worked</p>
            <p className="text-sm font-bold text-on-surface">{WAITER_PROFILE.hoursWorked}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[10px] text-on-surface-variant">Assigned</p>
            <p className="text-sm font-bold text-on-surface truncate">{WAITER_PROFILE.assignedSection}</p>
          </div>
        </div>
      </div>

      {/* Quick Stats Bento */}
      <div className="grid grid-cols-2 gap-3">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.id} className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-3.5 shadow-sm space-y-2">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center ${stat.bg}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-2xl font-bold text-on-surface font-mono leading-none">{stat.value}</p>
                <p className="text-[11px] text-on-surface-variant mt-1">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Application Settings */}
      <div>
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant/70 px-1 mb-2">
          Application Settings
        </h3>
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl shadow-md divide-y divide-outline-variant/20 overflow-hidden">
          {SETTINGS_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleSettingClick(item.label)}
                className="w-full flex items-center justify-between p-3.5 hover:bg-surface-container-low transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-on-surface-variant" />
                  <span className="text-xs font-bold text-on-surface">{item.label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {item.value && <span className="text-[11px] text-on-surface-variant">{item.value}</span>}
                  <ChevronRight className="w-4 h-4 text-outline" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick System Shortcuts */}
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-4 shadow-md space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant/60 px-1">
          Quick System Shortcuts
        </h3>

        <button
          onClick={() => navigate('/kitchen')}
          className="w-full text-left p-3 rounded-2xl bg-surface-container-low hover:bg-surface-container text-on-surface font-bold text-xs border border-outline-variant/30 flex items-center justify-between transition-colors"
        >
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            <span>Open Kitchen KDS Display</span>
          </div>
          <ChevronRight className="w-4 h-4 text-outline" />
        </button>

        <button
          onClick={() => navigate('/menu')}
          className="w-full text-left p-3 rounded-2xl bg-surface-container-low hover:bg-surface-container text-on-surface font-bold text-xs border border-outline-variant/30 flex items-center justify-between transition-colors"
        >
          <div className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-secondary" />
            <span>Open Customer Order View</span>
          </div>
          <ChevronRight className="w-4 h-4 text-outline" />
        </button>

        <button
          onClick={handleReset}
          className="w-full text-left p-3 rounded-2xl bg-surface-container-low hover:bg-surface-container text-on-surface font-bold text-xs border border-outline-variant/30 flex items-center justify-between transition-colors"
        >
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-on-surface-variant" />
            <span>Reset Demo Data</span>
          </div>
          <ChevronRight className="w-4 h-4 text-outline" />
        </button>
      </div>

      {/* Logout */}
      <button
        onClick={() => setShowLogoutModal(true)}
        className="w-full py-3.5 bg-primary hover:opacity-90 text-on-primary font-bold rounded-2xl text-sm shadow-md flex items-center justify-center gap-2 transition-all"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </button>

      {/* Logout Confirmation */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Confirm Logout"
        position="bottom"
      >
        <div className="space-y-4">
          <p className="text-sm text-on-surface-variant text-center">
            Are you sure you want to log out of your shift? All unsynced orders will be lost.
          </p>
          <div className="space-y-2">
            <button
              onClick={handleLogout}
              className="w-full py-3.5 bg-primary hover:opacity-90 text-on-primary font-bold rounded-2xl text-sm transition-all"
            >
              Yes, Log Out
            </button>
            <button
              onClick={() => setShowLogoutModal(false)}
              className="w-full py-3.5 border border-outline-variant text-on-surface font-bold rounded-2xl text-sm transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default WaiterProfileScreen;

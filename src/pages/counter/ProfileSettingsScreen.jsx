import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../../context/OrderContext';
import CounterShell from '../../components/layout/CounterShell';
import {
  UserCircle2,
  Edit3,
  Lock,
  Printer,
  Sliders,
  BellRing,
  Globe,
  HelpCircle,
  Info,
  ChevronRight,
  LogOut,
  CheckCircle2
} from 'lucide-react';

const SETTINGS_GROUPS = [
  {
    title: 'Account Settings',
    items: [
      { icon: Edit3, label: 'Edit Profile', description: 'Update your personal information' },
      { icon: Lock, label: 'Change Password', description: 'Secure your access with a new password' },
    ],
  },
  {
    title: 'Device Settings',
    items: [
      { icon: Printer, label: 'Printer Settings', description: 'Manage thermal receipt printers' },
      { icon: Sliders, label: 'Terminal Calibration', description: 'Adjust screen and input sensitivity' },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { icon: BellRing, label: 'Notification Preferences', description: 'Configure sound and visual alerts' },
      { icon: Globe, label: 'Display Language', description: 'English (UK) - Current' },
    ],
  },
  {
    title: 'Support',
    items: [
      { icon: HelpCircle, label: 'Help & Support', description: 'Access manuals and contact IT' },
      { icon: Info, label: 'System Version', description: 'v2.4.8-premium (Latest)' },
    ],
  },
];

const ProfileSettingsScreen = () => {
  const navigate = useNavigate();
  const { registerSession } = useOrder();
  const [toast, setToast] = useState('');

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(''), 2200);
  };

  const handleLogout = () => {
    if (confirm(`Are you sure you want to log out of ${registerSession.cashierName}'s session?`)) {
      navigate('/counter/login');
    }
  };

  return (
    <CounterShell title="Profile & Settings" subtitle="Counter Module" showSearch={false}>
      <div className="p-8 max-w-5xl mx-auto space-y-8">
        {/* Profile Header Card */}
        <section className="relative rounded-3xl bg-surface-container-lowest overflow-hidden shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
          <div className="h-32 w-full bg-primary-container opacity-10 absolute top-0 left-0" />
          <div className="relative z-10 p-8 flex flex-col md:flex-row items-center md:items-end gap-8">
            <div className="w-32 h-32 rounded-3xl border-4 border-surface-container-lowest overflow-hidden shadow-[0px_10px_30px_rgba(0,0,0,0.08)] bg-surface-container-high flex items-center justify-center">
              <UserCircle2 className="w-20 h-20 text-primary" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-baseline gap-2 mb-1">
                <h2 className="text-3xl font-bold text-on-surface">{registerSession.cashierName}</h2>
                <span className="px-3 py-1 bg-primary text-on-primary rounded-full text-xs font-bold uppercase w-fit mx-auto md:mx-0">
                  Senior Cashier
                </span>
              </div>
              <p className="text-on-surface-variant">
                Register: <span className="font-bold text-on-surface">{registerSession.registerId}</span>
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6 p-4 bg-surface-container-low rounded-2xl border border-outline-variant w-full md:w-auto">
              <div>
                <p className="text-[10px] text-on-surface-variant uppercase mb-1">Shift Start</p>
                <p className="text-sm font-bold text-on-surface">
                  {new Date(registerSession.shiftStartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-on-surface-variant uppercase mb-1">Station</p>
                <p className="text-sm font-bold text-on-surface">Terminal #01</p>
              </div>
            </div>
          </div>
        </section>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SETTINGS_GROUPS.map((group) => (
            <div key={group.title} className="space-y-3">
              <h3 className="text-lg font-bold text-on-surface px-1">{group.title}</h3>
              <div className="grid gap-3">
                {group.items.map(({ icon: Icon, label, description }) => (
                  <button
                    key={label}
                    onClick={() => showToast(`Opening ${label}...`)}
                    className="group p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-[0px_4px_20px_rgba(0,0,0,0.03)] flex items-center gap-4 text-left w-full hover:-translate-y-0.5 hover:shadow-[0px_10px_25px_rgba(0,0,0,0.06)] transition-all"
                  >
                    <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary transition-colors group-hover:bg-primary group-hover:text-on-primary shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-on-surface">{label}</p>
                      <p className="text-xs text-on-surface-variant truncate">{description}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-on-surface-variant shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Logout Action */}
        <section className="pt-4 pb-4">
          <button
            onClick={handleLogout}
            className="w-full bg-primary text-on-primary py-4 px-8 rounded-2xl text-lg font-bold flex items-center justify-center gap-3 hover:brightness-110 active:scale-[0.98] transition-all shadow-[0px_10px_30px_rgba(0,0,0,0.08)]"
          >
            <LogOut className="w-5 h-5" />
            Logout Session
          </button>
          <p className="text-center mt-3 text-on-surface-variant text-[10px] uppercase tracking-widest">
            End current shift and secure terminal access
          </p>
        </section>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 bg-inverse-surface text-inverse-on-surface px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50">
          <CheckCircle2 className="w-5 h-5 text-secondary-fixed-dim" />
          <span>{toast}</span>
        </div>
      )}
    </CounterShell>
  );
};

export default ProfileSettingsScreen;

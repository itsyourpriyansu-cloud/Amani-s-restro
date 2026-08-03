import React, { useState } from 'react';
import { getStoredAuditLogs, addAuditLog, getStoredEmployees } from '../../services/managerService';
import { useOrder } from '../../context/OrderContext';
import { useToast } from '../../context/ToastContext';
import {
  Shield,
  Key,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  Users,
  Star,
  History,
  BadgeCheck
} from 'lucide-react';

const ManagerProfileView = () => {
  const { showToast } = useToast();
  const { receipts } = useOrder();
  const [auditLogs] = useState(() => getStoredAuditLogs());
  const [employees] = useState(() => getStoredEmployees());
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      showToast('Please fill in current and new passwords', 'error');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }

    addAuditLog('Manager Password Changed', 'Updated account security password', 'system', 'Sundaram Pillai');
    showToast('Password updated successfully', 'success');
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleToggle2FA = () => {
    const nextState = !twoFactorEnabled;
    setTwoFactorEnabled(nextState);
    addAuditLog('2FA Toggled', `Two-Factor Auth set to ${nextState ? 'Enabled' : 'Disabled'}`, 'system');
    showToast(`Two-Factor Authentication is now ${nextState ? 'Enabled' : 'Disabled'}`, 'info');
  };

  return (
    <div className="space-y-6">

      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
        <div className="flex flex-col md:flex-row items-center gap-5">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"
              alt="Manager Sundaram Pillai"
              className="w-28 h-28 rounded-2xl object-cover shadow-lg border-4 border-surface-container-lowest"
            />
            <div className="absolute -bottom-2 -right-2 bg-primary text-on-primary p-1.5 rounded-full shadow-md">
              <BadgeCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-on-surface">Sundaram Pillai</h2>
            <p className="text-on-surface-variant mb-2">General Manager</p>
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-semibold">
                <MapPin className="w-3 h-3 mr-1" /> Indiranagar Suite
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-surface-container-highest text-on-surface-variant text-xs font-semibold">
                ID: #MGR-8801
              </span>
            </div>
          </div>
        </div>

        <div className="px-3.5 py-2 rounded-xl bg-green-50 border border-green-200 text-green-900 text-xs font-bold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span>Active Manager Session</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline-variant flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3 text-primary">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <p className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">Receipts Processed</p>
          <h4 className="text-3xl font-bold text-primary mt-1">{receipts.length}</h4>
        </div>
        <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline-variant flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 bg-secondary-container/40 rounded-full flex items-center justify-center mb-3 text-secondary">
            <Users className="w-5 h-5" />
          </div>
          <p className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">Team Size</p>
          <h4 className="text-3xl font-bold text-on-surface mt-1">{employees.length}</h4>
        </div>
        <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline-variant flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-3 text-green-700">
            <Star className="w-5 h-5" />
          </div>
          <p className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">Avg Rating</p>
          <h4 className="text-3xl font-bold text-on-surface mt-1">4.9/5</h4>
        </div>
      </div>

      {/* Personal Info + Audit Trail & Security */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant">
            <h3 className="text-base font-bold text-on-surface mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-on-surface-variant font-semibold">Email Address</label>
                <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl border border-outline-variant">
                  <Mail className="w-4 h-4 text-primary" />
                  <span className="text-sm text-on-surface">sundaram.p@mangammaruchulu.in</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-on-surface-variant font-semibold">Phone Number</label>
                <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl border border-outline-variant">
                  <Phone className="w-4 h-4 text-primary" />
                  <span className="text-sm text-on-surface">+91 98401 23456</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/50">
              <div>
                <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                  <History className="w-4 h-4 text-primary" />
                  Manager Audit Trail &amp; Activity Log
                </h3>
                <p className="text-xs text-on-surface-variant">Security history of actions executed under this manager account.</p>
              </div>
              <span className="text-xs text-on-surface-variant">{auditLogs.length} Records</span>
            </div>

            <div className="divide-y divide-outline-variant/40 max-h-[420px] overflow-y-auto">
              {auditLogs.map((log) => (
                <div key={log.id} className="py-3 flex items-start justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-on-surface">{log.action}</span>
                      <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[10px] capitalize">
                        {log.type}
                      </span>
                    </div>
                    <p className="text-on-surface-variant">{log.details}</p>
                  </div>
                  <div className="text-right text-[10px] text-on-surface-variant shrink-0">
                    <div>{log.timestamp}</div>
                    <div className="font-semibold">{log.user}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant shadow-sm space-y-4">
            <h3 className="text-base font-bold text-on-surface flex items-center gap-2 pb-3 border-b border-outline-variant/50">
              <Key className="w-4 h-4 text-primary" />
              Security Credentials
            </h3>

            <form onSubmit={handlePasswordChange} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-on-surface mb-1">Current Password</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block font-semibold text-on-surface mb-1">New Password</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block font-semibold text-on-surface mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <button type="submit" className="w-full py-2 bg-on-surface hover:opacity-90 text-surface font-semibold rounded-xl transition-opacity mt-2">
                Update Password
              </button>
            </form>

            <div className="pt-3 border-t border-outline-variant/40 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="font-semibold text-on-surface">Two-Factor Authentication</span>
              </div>
              <button
                onClick={handleToggle2FA}
                className={`px-3 py-1 rounded-xl text-[11px] font-bold border transition-colors ${
                  twoFactorEnabled ? 'bg-green-50 text-green-800 border-green-300' : 'bg-surface-container text-on-surface-variant border-outline-variant'
                }`}
              >
                {twoFactorEnabled ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant shadow-sm space-y-2 text-xs text-on-surface-variant">
            <div className="flex items-center justify-between">
              <span>Software Build:</span>
              <span className="font-bold text-on-surface">v2.4.0 Executive</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Environment:</span>
              <span className="text-green-700 font-bold">Production Node</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Database Status:</span>
              <span className="text-on-surface font-bold">Connected (0ms ping)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerProfileView;

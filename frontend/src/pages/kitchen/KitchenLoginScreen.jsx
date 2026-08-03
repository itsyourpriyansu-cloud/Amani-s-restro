import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UtensilsCrossed,
  IdCard,
  Lock,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  ChefHat,
  Flame,
  ShieldCheck
} from 'lucide-react';
import { motion } from 'framer-motion';
import { RESTAURANT_INFO } from '../../utils/mockData';

const STAFF_PRESETS = [
  {
    role: 'Head Chef & Kitchen Manager',
    name: 'Chef Sundaram Pillai',
    employeeId: 'EMP-1001',
    pin: '1234',
    station: 'All',
    icon: ChefHat
  },
  {
    role: 'Starters & Tandoor Master',
    name: 'Chef Vignesh Iyer',
    employeeId: 'EMP-1002',
    pin: '2222',
    station: 'Starter & Tandoor Station',
    icon: Flame
  },
  {
    role: 'Biryani & Curry Lead',
    name: 'Chef Karthik Swaminathan',
    employeeId: 'EMP-1003',
    pin: '3333',
    station: 'Biryani & Rice Station',
    icon: UtensilsCrossed
  },
  {
    role: 'Expediter & Service Lead',
    name: 'Ananya Nair (Pass Lead)',
    employeeId: 'EMP-1004',
    pin: '4444',
    station: 'All',
    icon: ShieldCheck
  }
];

const KitchenLoginScreen = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [selectedPreset, setSelectedPreset] = useState(STAFF_PRESETS[0]);
  const [employeeId, setEmployeeId] = useState(STAFF_PRESETS[0].employeeId);
  const [pin, setPin] = useState(STAFF_PRESETS[0].pin);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleQuickSelect = (preset) => {
    setSelectedPreset(preset);
    setEmployeeId(preset.employeeId);
    setPin(preset.pin);
    setErrorMsg('');
  };

  const handlePinSubmit = (e) => {
    e?.preventDefault();
    setErrorMsg('');

    if (!pin) {
      setErrorMsg('Please enter your staff PIN.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const matchedPreset = STAFF_PRESETS.find((p) => p.pin === pin);

      if (matchedPreset || pin === '1234' || pin === '8888') {
        const staffData = matchedPreset || {
          role: selectedPreset.role,
          name: selectedPreset.name,
          pin,
          station: selectedPreset.station
        };

        onLoginSuccess(staffData);
      } else {
        setErrorMsg('Invalid Staff PIN. (Try Demo PIN: 1234)');
        setIsLoading(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-full flex flex-col justify-center items-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-surface-container-lowest border border-outline-variant/50 rounded-2xl p-6 sm:p-8 shadow-xl shadow-outline-variant/20 flex flex-col gap-6"
      >
        {/* Back to Portal */}
        <button
          type="button"
          onClick={() => navigate('/portal')}
          className="flex items-center gap-1.5 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors -mb-2 self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Portal</span>
        </button>

        {/* Brand Header */}
        <header className="flex flex-col items-center text-center gap-1">
          <img
            src={RESTAURANT_INFO.logo || '/Amanis Logo Final.svg'}
            alt={RESTAURANT_INFO.name}
            className="h-16 sm:h-[72px] w-auto max-w-[280px] object-contain mb-1"
          />
          <p className="font-body-md text-body-md text-on-surface-variant font-medium">
            Welcome Back, Kitchen Team
          </p>
        </header>

        {/* Quick Staff Select */}
        <div className="flex flex-wrap gap-2 justify-center">
          {STAFF_PRESETS.map((preset) => {
            const isSelected = selectedPreset.employeeId === preset.employeeId;
            const PresetIcon = preset.icon;
            return (
              <button
                key={preset.employeeId}
                type="button"
                onClick={() => handleQuickSelect(preset)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                  isSelected
                    ? 'bg-primary text-on-primary border-primary shadow-sm'
                    : 'bg-surface-container-low text-on-surface-variant border-outline-variant hover:bg-surface-container'
                }`}
                title={preset.role}
              >
                <PresetIcon className="w-3.5 h-3.5" />
                <span>{preset.name.split(' ')[1] || preset.name}</span>
              </button>
            );
          })}
        </div>

        {/* Login Form */}
        <form onSubmit={handlePinSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-label-md text-on-surface-variant px-1" htmlFor="employeeId">
              Employee ID
            </label>
            <div className="relative group">
              <IdCard className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors" />
              <input
                id="employeeId"
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="Enter your ID"
                className="w-full h-14 pl-11 pr-4 bg-surface-container-low border border-outline-variant rounded-xl font-body-md text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-label-md text-on-surface-variant px-1" htmlFor="pin">
              PIN / Password
            </label>
            <div className="relative group">
              <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors" />
              <input
                id="pin"
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••"
                className="w-full h-14 pl-11 pr-4 bg-surface-container-low border border-outline-variant rounded-xl font-body-md text-body-md tracking-[0.4em] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center justify-between px-1">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-outline text-primary focus:ring-primary/20 cursor-pointer"
              />
              <span className="font-label-md text-label-md text-on-surface-variant group-hover:text-on-surface transition-colors">
                Remember Me
              </span>
            </label>
            <button
              type="button"
              onClick={() => handleQuickSelect(selectedPreset)}
              className="font-label-md text-label-md text-primary font-bold hover:underline"
            >
              Forgot PIN?
            </button>
          </div>

          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-error-container/60 border border-error/30 rounded-xl text-xs text-on-error-container font-semibold flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </motion.div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 bg-primary text-on-primary rounded-2xl font-headline-md text-headline-md shadow-sm hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-1 disabled:opacity-70"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Login to KDS</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Station Banner */}
        <div className="h-24 rounded-xl relative overflow-hidden border border-outline-variant/30 bg-gradient-to-br from-primary to-primary-container flex items-center justify-center">
          <span className="font-label-md text-label-md text-on-primary/90 font-bold uppercase tracking-widest">
            Station: {selectedPreset.station}
          </span>
        </div>

        {/* Footer */}
        <footer className="flex flex-col items-center gap-2 pt-1">
          <div className="flex items-center gap-3 text-[11px] text-on-surface-variant opacity-70">
            <span>KDS Version 2.4.0</span>
            <span className="w-1 h-1 rounded-full bg-outline-variant" />
            <span>Amani's Kitchen Management</span>
          </div>
          <button
            onClick={() => navigate('/menu')}
            className="text-xs text-on-surface-variant hover:text-primary font-medium transition-colors"
          >
            ← Return to Customer Ordering Menu
          </button>
        </footer>
      </motion.div>
    </div>
  );
};

export default KitchenLoginScreen;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UtensilsCrossed,
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Info
} from 'lucide-react';
import { motion } from 'framer-motion';
import { RESTAURANT_INFO } from '../../utils/mockData';

const DEMO_EMPLOYEE_ID = 'waiter01';
const DEMO_PASSWORD = 'waiter123';

const WaiterLoginScreen = () => {
  const navigate = useNavigate();
  const [employeeId, setEmployeeId] = useState(DEMO_EMPLOYEE_ID);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/waiter');
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col items-center justify-between px-4 py-8 font-sans antialiased">
      {/* Branding Header */}
      <header className="w-full flex flex-col items-center mt-6">
        <div className="w-full max-w-md mb-4">
          <button
            onClick={() => navigate('/portal')}
            className="flex items-center gap-1.5 text-xs font-bold text-on-surface-variant hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Portal
          </button>
        </div>

        <img
          src={RESTAURANT_INFO.logo || '/logo.png'}
          alt={RESTAURANT_INFO.name}
          className="w-16 h-16 rounded-full object-cover shadow-lg mb-3 border border-outline-variant/30"
        />
        <h1 className="font-serif text-2xl font-bold text-primary tracking-tight">Mangamma Ruchulu</h1>
        <p className="text-[11px] text-on-surface-variant font-mono font-semibold uppercase tracking-widest mt-1">Staff Portal</p>
      </header>

      {/* Login Card */}
      <main className="w-full max-w-md my-8">
        <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-[0px_10px_30px_rgba(0,0,0,0.06)] border border-outline-variant/20 flex flex-col gap-5">
          <div className="text-center">
            <h2 className="text-xl font-serif font-bold text-on-surface">Welcome Back</h2>
            <p className="text-sm text-on-surface-variant mt-1">Please sign in to your shift</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-on-surface ml-1">Employee ID / Email</label>
              <div className="relative group">
                <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  placeholder="Enter your ID"
                  className="w-full h-14 pl-11 pr-4 bg-surface-container-low border border-outline-variant/40 rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm text-on-surface placeholder:text-on-surface-variant/60"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-on-surface ml-1">Password</label>
              <div className="relative group">
                <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-14 pl-11 pr-11 bg-surface-container-low border border-outline-variant/40 rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm text-on-surface placeholder:text-on-surface-variant/60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface active:scale-90 transition-all"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary"
                />
                <span className="text-xs font-semibold text-on-surface-variant group-hover:text-on-surface transition-colors">Remember Me</span>
              </label>
              <a href="#" onClick={(e) => e.preventDefault()} className="text-xs font-bold text-primary hover:underline">
                Forgot Password?
              </a>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full h-14 bg-primary hover:opacity-90 text-on-primary font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all mt-1"
            >
              <span>Login</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </form>

          <div className="flex items-center justify-center gap-2 py-1.5 bg-secondary-container/15 rounded-xl border border-secondary-container/40">
            <Info className="w-3.5 h-3.5 text-secondary" />
            <span className="text-[11px] font-semibold text-on-secondary-container">Terminal 04 Active • Floor A</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full flex flex-col items-center gap-2 mb-2">
        <div className="flex items-center gap-3">
          <a href="#" onClick={(e) => e.preventDefault()} className="text-[11px] text-on-surface-variant hover:text-primary transition-colors">Support</a>
          <span className="w-1 h-1 bg-outline-variant rounded-full" />
          <a href="#" onClick={(e) => e.preventDefault()} className="text-[11px] text-on-surface-variant hover:text-primary transition-colors">Privacy Policy</a>
          <span className="w-1 h-1 bg-outline-variant rounded-full" />
          <a href="#" onClick={(e) => e.preventDefault()} className="text-[11px] text-on-surface-variant hover:text-primary transition-colors">IT Status</a>
        </div>
        <p className="text-[10px] text-outline tracking-wide text-center">System Version 4.2.1 • Mangamma Ruchulu Restaurant Group</p>
      </footer>
    </div>
  );
};

export default WaiterLoginScreen;

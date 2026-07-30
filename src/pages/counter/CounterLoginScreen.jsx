import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Lock, Eye, EyeOff, LogIn, Store, ArrowLeft } from 'lucide-react';
import { RESTAURANT_INFO } from '../../utils/mockData';

const DEMO_EMPLOYEE_ID = 'counter01';
const DEMO_PASSWORD = 'counter123';

const CounterLoginScreen = () => {
  const navigate = useNavigate();
  const [employeeId, setEmployeeId] = useState(DEMO_EMPLOYEE_ID);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/counter');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <button
        onClick={() => navigate('/portal')}
        className="fixed top-6 left-6 flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/40 text-on-surface-variant hover:text-primary hover:border-primary/40 text-sm font-semibold shadow-sm transition-colors z-20"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Portal</span>
      </button>

      <div className="relative z-10 w-full max-w-[480px]">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 mb-6 rounded-full bg-primary flex items-center justify-center shadow-lg text-on-primary">
            <Store className="w-10 h-10" />
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05),0_8px_10px_-6px_rgba(0,0,0,0.05)] p-10 flex flex-col items-center">
          <header className="text-center mb-8">
            <h1 className="text-2xl font-bold text-on-surface tracking-tight mb-2">Welcome Back</h1>
            <p className="text-on-surface-variant text-sm font-medium">Counter Terminal &middot; {RESTAURANT_INFO.name}</p>
          </header>

          <form onSubmit={handleSubmit} className="w-full space-y-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="employee-id" className="text-on-surface text-sm font-semibold">
                Employee ID / Email
              </label>
              <div className="relative group">
                <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors" />
                <input
                  id="employee-id"
                  type="text"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  placeholder="Enter your ID or email"
                  className="w-full h-14 pl-12 pr-4 bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all text-on-surface placeholder:text-on-surface-variant/50 outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-on-surface text-sm font-semibold">
                Password
              </label>
              <div className="relative group">
                <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full h-14 pl-12 pr-12 bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all text-on-surface placeholder:text-on-surface-variant/50 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between py-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer"
                />
                <span className="text-on-surface-variant text-sm font-medium group-hover:text-on-surface transition-colors">
                  Remember Me
                </span>
              </label>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="text-primary text-sm font-semibold hover:underline decoration-2 underline-offset-4"
              >
                Forgot Password?
              </a>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full h-14 bg-primary text-on-primary font-bold text-lg rounded-lg shadow-md hover:brightness-110 transition-all flex items-center justify-center gap-2"
            >
              Login
              <LogIn className="w-5 h-5" />
            </motion.button>
          </form>

          {/* Quick Terminal Access Decorator */}
          <div className="mt-10 pt-8 border-t border-outline-variant w-full text-center">
            <p className="text-on-surface-variant text-xs mb-4">Quick Terminal Access</p>
            <div className="flex justify-center gap-3">
              {['1', '2', '3', '...'].map((n) => (
                <div
                  key={n}
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-surface-container text-on-surface-variant font-bold border border-outline-variant/30"
                >
                  {n}
                </div>
              ))}
            </div>
          </div>
        </div>

        <footer className="mt-8 text-center text-on-surface-variant/60 text-xs">
          &copy; {new Date().getFullYear()} {RESTAURANT_INFO.name} Restaurant Group. All Rights Reserved.
          <br />
          POS System Version 4.2.1-Stable
        </footer>
      </div>
    </div>
  );
};

export default CounterLoginScreen;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Headset,
  Loader2
} from 'lucide-react';
import { RESTAURANT_INFO } from '../../utils/mockData';

const DEMO_EMAIL = 'manager@amaniskitchen.com';
const DEMO_PASSWORD = 'manager123';

const ManagerLoginScreen = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState(DEMO_EMAIL);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both email and password to continue.');
      return;
    }

    setStatus('loading');

    setTimeout(() => {
      setStatus('success');
      setTimeout(() => navigate('/manager'), 700);
    }, 900);
  };

  return (
    <div className="min-h-screen flex items-stretch overflow-hidden bg-surface">
      {/* Left Side: Hero Image Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[8000ms] ease-out hover:scale-110"
          style={{ backgroundImage: `url(${RESTAURANT_INFO.heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/50 via-black/10 to-transparent mix-blend-multiply" />
        <div className="relative z-10 flex flex-col justify-end p-12 text-white">
          <h2 className="text-4xl font-bold tracking-tight mb-2">Uncompromising Quality</h2>
          <p className="text-lg opacity-90 max-w-md leading-relaxed">
            Managing the heritage and future of {RESTAURANT_INFO.name} through one unified digital experience.
          </p>
        </div>
      </div>

      {/* Right Side: Login Container */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-4 py-10 md:p-10 bg-surface">
        <div className="w-full max-w-[440px]">
          {/* Back to Portal */}
          <button
            type="button"
            onClick={() => navigate('/portal')}
            className="flex items-center gap-1.5 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Portal</span>
          </button>

          {/* Brand Header */}
          <div className="flex flex-col items-center mb-8">
            <img
              src={RESTAURANT_INFO.logo || '/Amanis Logo Final.svg'}
              alt={RESTAURANT_INFO.name}
              className="w-16 h-16 rounded-full object-contain p-0.5 bg-surface mb-3 shadow-md border border-outline-variant/40"
            />
            <span className="font-serif text-2xl font-bold text-primary tracking-tight mb-1.5">{RESTAURANT_INFO.name}</span>
            <div className="h-1 w-12 bg-secondary-fixed-dim rounded-full" />
          </div>

          {/* Login Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-surface-container-lowest p-8 rounded-2xl shadow-[0px_4px_20px_rgba(0,0,0,0.06)] border border-surface-container"
          >
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-semibold text-on-surface mb-1.5">Manager Login</h1>
              <p className="text-sm text-on-surface-variant">Access the management dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm font-semibold text-on-surface">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="manager@mangammaruchulu.in"
                    className="w-full h-14 pl-11 pr-4 bg-surface-container-low border border-transparent focus:border-primary focus:ring-0 rounded-2xl text-sm outline-none transition-all placeholder:text-on-surface-variant/50"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="password" className="text-sm font-semibold text-on-surface">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-14 pl-11 pr-11 bg-surface-container-low border border-transparent focus:border-primary focus:ring-0 rounded-2xl text-sm outline-none transition-all placeholder:text-on-surface-variant/50"
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

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary/20 cursor-pointer"
                  />
                  <span className="text-xs font-medium text-on-surface-variant group-hover:text-on-surface transition-colors">
                    Remember Me
                  </span>
                </label>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-xs font-semibold text-primary hover:opacity-80 transition-opacity"
                >
                  Forgot Password?
                </a>
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

              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={status !== 'idle'}
                className={`w-full h-14 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 disabled:cursor-not-allowed ${
                  status === 'success'
                    ? 'bg-secondary-fixed-dim text-on-secondary-fixed'
                    : 'bg-primary text-on-primary hover:opacity-90'
                }`}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {status === 'loading' && (
                    <motion.span
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Signing in...</span>
                    </motion.span>
                  )}
                  {status === 'success' && (
                    <motion.span
                      key="success"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Success</span>
                    </motion.span>
                  )}
                  {status === 'idle' && (
                    <motion.span
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <span>Login</span>
                      <ArrowRight className="w-4 h-4" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </form>

            {/* Help Link */}
            <div className="mt-8 pt-6 border-t border-surface-container flex justify-center">
              <button
                type="button"
                onClick={() => {
                  setEmail(DEMO_EMAIL);
                  setPassword(DEMO_PASSWORD);
                }}
                className="flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors text-xs font-medium"
              >
                <Headset className="w-4 h-4" />
                <span>Need assistance? Use demo credentials</span>
              </button>
            </div>
          </motion.div>

          {/* Footer Section */}
          <footer className="mt-8 flex flex-col items-center gap-3">
            <p className="text-xs text-on-surface-variant text-center opacity-70">
              &copy; {new Date().getFullYear()} {RESTAURANT_INFO.name} Restaurant Group. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" onClick={(e) => e.preventDefault()} className="text-xs text-on-surface-variant hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" onClick={(e) => e.preventDefault()} className="text-xs text-on-surface-variant hover:text-primary transition-colors">
                Terms of Service
              </a>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default ManagerLoginScreen;

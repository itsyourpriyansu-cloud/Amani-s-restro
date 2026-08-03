import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Utensils,
  ChefHat,
  ConciergeBell,
  CreditCard,
  Shield,
  KeyRound,
  ArrowRight,
  Sparkles,
  Lock,
  CheckCircle2,
  AlertCircle,
  X,
  Compass,
  Store,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MODULE_CARDS = [
  {
    id: 'customer',
    title: 'Customer Self-Ordering',
    path: '/',
    icon: Utensils,
    roleTitle: 'Guest / Customer',
    tag: 'Public Access',
    color: 'from-amber-600 to-orange-600',
    accentBorder: 'border-amber-300',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    requiresPin: false,
    demoPin: null,
    desc: 'Browse our regional Andhra menu (Biryanis, Tandoor Grills, Curries), customize dishes, place table orders, track preparation stages, and request bills.',
  },
  {
    id: 'kitchen',
    title: 'Kitchen Display System (KDS)',
    path: '/kitchen',
    icon: ChefHat,
    roleTitle: 'Head Chef & Kitchen Staff',
    tag: 'Staff Auth Required',
    color: 'from-amber-600 to-amber-800',
    accentBorder: 'border-amber-300',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    requiresPin: false,
    demoPin: null,
    desc: 'Real-time kitchen order tickets, station filtering (Starters & Tandoor, Biryani & Rice, Curries), rush alerts, and cook completion timers.',
  },
  {
    id: 'waiter',
    title: 'Waiter Service Mobile',
    path: '/waiter/login',
    icon: ConciergeBell,
    roleTitle: 'Floor Waiter / Server',
    tag: 'Staff Auth Required',
    color: 'from-indigo-600 to-blue-700',
    accentBorder: 'border-indigo-300',
    badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
    requiresPin: false,
    demoPin: null,
    desc: 'Interactive table floor plan, guest seating management, waiter assistance request clearing, and bill requests.',
  },
  {
    id: 'counter',
    title: 'Counter POS & Billing',
    path: '/counter/login',
    icon: CreditCard,
    roleTitle: 'Counter Staff',
    tag: 'Staff Auth Required',
    color: 'from-emerald-600 to-teal-700',
    accentBorder: 'border-emerald-300',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    requiresPin: false,
    demoPin: null,
    desc: 'Counter checkout terminal, cash register till management, card & UPI payments, print receipts, and shift reports.',
  },
  {
    id: 'manager',
    title: 'Manager Executive Portal',
    path: '/manager/login',
    icon: Shield,
    roleTitle: 'General Manager',
    tag: 'Executive Auth Required',
    color: 'from-stone-800 to-stone-900',
    accentBorder: 'border-amber-400',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
    requiresPin: false,
    demoPin: null,
    desc: 'Full operational suite: Real-time KPIs, regional menu CRUD, employee roster management, financial analytics, table layouts, and settings.',
  },
];

const PortalGatewayScreen = () => {
  const navigate = useNavigate();
  const [selectedModule, setSelectedModule] = useState(null);
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleSelectModule = (mod) => {
    if (!mod.requiresPin) {
      navigate(mod.path);
    } else {
      setSelectedModule(mod);
      setPin(mod.demoPin || '');
      setErrorMsg('');
    }
  };

  const handleLoginSubmit = (e) => {
    e?.preventDefault();
    setErrorMsg('');

    if (!pin) {
      setErrorMsg('Please enter 4-digit security PIN.');
      return;
    }

    setIsAuthenticating(true);

    setTimeout(() => {
      // Accept module demo pin, 1234 universal pin, or 8888 manager pin
      if (pin === selectedModule.demoPin || pin === '1234' || pin === '8888') {
        setIsAuthenticating(false);
        navigate(selectedModule.path);
      } else {
        setIsAuthenticating(false);
        setErrorMsg(`Invalid Security PIN. (Demo PIN for ${selectedModule.roleTitle}: ${selectedModule.demoPin || '1234'})`);
      }
    }, 350);
  };

  return (
    <div className="min-h-screen bg-stone-900 text-white flex flex-col justify-between relative overflow-hidden font-sans">
      
      {/* Background Graphic Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/30 via-stone-950 to-stone-950 pointer-events-none" />
      <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute left-0 bottom-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 border-b border-stone-800/80 px-6 py-4 bg-stone-900/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <img
              src="/Amanis Logo Final.svg"
              alt="Amani's Kitchen Logo"
              className="w-11 h-11 rounded-full object-contain p-0.5 bg-white/10 shadow-lg ring-2 ring-amber-400/30 shrink-0"
            />

            <div>
              <h1 className="text-lg font-serif font-bold tracking-wide text-white">
                Amani's Kitchen
              </h1>
              <p className="text-xs text-stone-400 font-mono flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span>Central System Launchpad & Gateway</span>
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-amber-300 bg-stone-800/80 px-3 py-1.5 rounded-xl border border-stone-700">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>5 Modules Operational</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-7xl w-full mx-auto px-6 py-10 flex-1 flex flex-col justify-center">
        
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/20 text-amber-300 font-mono text-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Select System Role & Authenticate</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-white">
            Restaurant Management System
          </h2>
          
          <p className="text-stone-400 text-sm">
            Launch any of the 5 dedicated operational portals with role-based security authentication.
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto w-full">
          {MODULE_CARDS.map((mod) => {
            const Icon = mod.icon;
            return (
              <motion.div
                key={mod.id}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                onClick={() => handleSelectModule(mod)}
                className={`bg-stone-800/90 border rounded-3xl p-6 cursor-pointer transition-all shadow-xl hover:shadow-2xl relative flex flex-col justify-between space-y-5 group ${
                  mod.id === 'manager' ? 'border-amber-500/40 bg-gradient-to-b from-stone-800 to-stone-900' : 'border-stone-700/80 hover:border-amber-400/60'
                }`}
              >
                <div>
                  {/* Top Badge & Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${mod.color} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>

                    <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${mod.badgeColor}`}>
                      {mod.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-serif font-bold text-white group-hover:text-amber-300 transition-colors">
                    {mod.title}
                  </h3>
                  
                  <p className="text-xs font-mono text-amber-400/90 font-semibold mt-0.5">
                    Role: {mod.roleTitle}
                  </p>

                  <p className="text-stone-300 text-xs mt-3 leading-relaxed">
                    {mod.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-700/60 flex items-center justify-between text-xs">
                  <span className="text-stone-400 font-mono flex items-center gap-1">
                    {mod.requiresPin ? (
                      <>
                        <Lock className="w-3.5 h-3.5 text-amber-400" />
                        <span>PIN: {mod.demoPin}</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Instant Access</span>
                      </>
                    )}
                  </span>

                  <button className="flex items-center gap-1 font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
                    <span>Launch Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-stone-800/80 px-6 py-4 text-center text-xs font-mono text-stone-500">
        Amani's Kitchen • South Indian Restaurant Management Suite v2.4 • All Systems Connected
      </footer>

      {/* Security Login Modal */}
      <AnimatePresence>
        {selectedModule && (
          <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-stone-900 border border-stone-700 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative text-white space-y-6"
            >
              <button
                onClick={() => setSelectedModule(null)}
                className="absolute right-4 top-4 text-stone-400 hover:text-white p-1 rounded-xl bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-2">
                <div className={`w-14 h-14 mx-auto rounded-3xl bg-gradient-to-br ${selectedModule.color} text-white flex items-center justify-center shadow-xl`}>
                  <KeyRound className="w-7 h-7" />
                </div>

                <h3 className="text-xl font-serif font-bold text-white">
                  Authenticate {selectedModule.title}
                </h3>
                <p className="text-xs text-amber-400 font-mono font-semibold">
                  Required Role: {selectedModule.roleTitle}
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5 text-xs font-mono">
                    <span className="text-stone-300">Enter Security PIN</span>
                    <button
                      type="button"
                      onClick={() => setPin(selectedModule.demoPin)}
                      className="text-amber-400 hover:underline flex items-center gap-1 font-bold"
                    >
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      Autofill PIN ({selectedModule.demoPin})
                    </button>
                  </div>

                  <input
                    type="password"
                    maxLength={4}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="••••"
                    className="w-full text-center tracking-[0.5em] text-2xl font-mono py-3 rounded-2xl bg-stone-950 border border-stone-700 text-white placeholder-stone-600 focus:outline-none focus:border-amber-400 font-bold"
                  />
                </div>

                {errorMsg && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-300 font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-2xl text-sm tracking-wide shadow-lg flex items-center justify-center gap-2 transition-all"
                >
                  {isAuthenticating ? (
                    <span>Authenticating...</span>
                  ) : (
                    <>
                      <span>Enter {selectedModule.title}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PortalGatewayScreen;

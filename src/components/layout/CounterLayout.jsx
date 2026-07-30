import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../../context/OrderContext';
import {
  Store,
  Clock,
  Unlock,
  Lock,
  ArrowLeft,
  IndianRupee,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

const CounterLayout = ({ children, activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const { registerSession, toggleRegisterDrawer, resetKitchenDemoData } = useOrder();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const totalCollectedToday = (
    registerSession.cashCollected +
    registerSession.cardCollected +
    registerSession.upiCollected
  ).toFixed(2);

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 font-sans flex flex-col">
      {/* Light Mode Top Header Bar */}
      <header className="bg-white border-b border-stone-200 px-4 py-3 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Left: Brand & Station Info */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/portal')}
              className="p-2 rounded-xl bg-stone-100 border border-stone-200 text-stone-700 hover:bg-stone-200 transition-colors shadow-xs flex items-center gap-1 text-xs font-semibold"
              title="Return to System Launchpad"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Portal</span>
            </button>

            <img
              src="/logo.png"
              alt="Mangamma Ruchulu"
              className="w-10 h-10 rounded-full object-cover shadow-md border border-stone-300 shrink-0"
            />

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-serif font-bold text-stone-900 tracking-wide">
                  Mangamma Ruchulu
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-[11px] font-bold uppercase font-mono">
                  Counter POS
                </span>
              </div>
              <p className="text-xs text-stone-500 font-mono">
                {registerSession.registerId} • Cashier: <span className="text-stone-800 font-semibold">{registerSession.cashierName}</span>
              </p>
            </div>
          </div>

          {/* Center: Live Time Clock & Stats */}
          <div className="hidden lg:flex items-center gap-6 bg-stone-50 border border-stone-200 px-4 py-1.5 rounded-2xl shadow-xs">
            <div className="flex items-center gap-2 text-stone-700 text-xs font-mono">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
            </div>

            <div className="h-4 w-px bg-stone-200" />

            <div className="flex items-center gap-2 text-xs">
              <span className="text-stone-500 font-mono">Shift Sales:</span>
              <span className="text-emerald-700 font-bold font-mono">₹{totalCollectedToday}</span>
            </div>

            <div className="h-4 w-px bg-stone-200" />

            <div className="flex items-center gap-1.5 text-xs">
              <span className={`w-2 h-2 rounded-full ${registerSession.isDrawerOpen ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'}`} />
              <span className="text-stone-700 font-medium">
                {registerSession.isDrawerOpen ? 'Till Unlocked' : 'Till Locked'}
              </span>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleRegisterDrawer(!registerSession.isDrawerOpen)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border shadow-xs ${
                registerSession.isDrawerOpen
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
              }`}
            >
              {registerSession.isDrawerOpen ? (
                <>
                  <Unlock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Drawer Open</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-stone-500" />
                  <span>Open Drawer</span>
                </>
              )}
            </button>

            <button
              onClick={resetKitchenDemoData}
              className="p-2 rounded-xl bg-white text-stone-600 hover:text-amber-700 hover:bg-stone-50 border border-stone-200 transition-colors shadow-xs"
              title="Reset Counter & Order Demo Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Page Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        {children}
      </main>
    </div>
  );
};

export default CounterLayout;

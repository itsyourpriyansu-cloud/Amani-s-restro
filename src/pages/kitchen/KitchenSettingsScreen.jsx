import React from 'react';
import {
  UserCircle2,
  Bell,
  Contrast,
  Monitor,
  Languages,
  LogOut
} from 'lucide-react';
import { useKitchenPrefs } from '../../context/KitchenPrefsContext';

const Toggle = ({ checked, onChange }) => (
  <label className="relative inline-flex items-center cursor-pointer shrink-0">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="sr-only peer"
    />
    <div className="w-12 h-7 bg-surface-container-highest rounded-full peer-checked:bg-primary transition-colors" />
    <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
  </label>
);

const SettingsCard = ({ icon: Icon, title, children }) => (
  <section className="p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-[0px_4px_20px_rgba(0,0,0,0.03)] flex flex-col gap-4">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-primary shrink-0">
        <Icon className="w-5 h-5" />
      </div>
      <h2 className="text-sm font-semibold text-on-surface">{title}</h2>
    </div>
    {children}
  </section>
);

const TEXT_SIZE_STEPS = ['small', 'normal', 'large'];

const KitchenSettingsScreen = ({ staffAuth, onLogoutStaff }) => {
  const { prefs, updatePref } = useKitchenPrefs();

  const textSizeIndex = Math.max(0, TEXT_SIZE_STEPS.indexOf(prefs.textSize));

  return (
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
              <h2 className="text-3xl font-bold text-on-surface">{staffAuth?.name || 'Kitchen Staff'}</h2>
              <span className="px-3 py-1 bg-primary text-on-primary rounded-full text-xs font-bold uppercase w-fit mx-auto md:mx-0">
                {staffAuth?.role || 'Kitchen Team'}
              </span>
            </div>
            <p className="text-on-surface-variant">
              Station: <span className="font-bold text-on-surface">{staffAuth?.station || 'Main Line'}</span>
            </p>
          </div>
        </div>
      </section>

      {/* Settings Groups */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-on-surface px-1">Notifications</h3>
          <div className="grid gap-3">
            <SettingsCard icon={Bell} title="Order Alert Sounds">
              <div className="flex items-center justify-between">
                <span className="text-xs text-on-surface-variant">Chime when a new ticket arrives</span>
                <Toggle
                  checked={!prefs.audioMuted}
                  onChange={(checked) => updatePref('audioMuted', !checked)}
                />
              </div>
            </SettingsCard>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-bold text-on-surface px-1">Display Settings</h3>
          <div className="grid gap-3">
            <SettingsCard icon={Monitor} title="Show Order Timers">
              <div className="flex items-center justify-between">
                <span className="text-xs text-on-surface-variant">Elapsed time badge on tickets</span>
                <Toggle
                  checked={prefs.showTimers}
                  onChange={(checked) => updatePref('showTimers', checked)}
                />
              </div>
            </SettingsCard>
            <SettingsCard icon={Monitor} title="Text Size">
              <div className="flex flex-col gap-2">
                <input
                  type="range"
                  min={0}
                  max={2}
                  step={1}
                  value={textSizeIndex}
                  onChange={(e) => updatePref('textSize', TEXT_SIZE_STEPS[Number(e.target.value)])}
                  className="w-full accent-primary cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-on-surface-variant">
                  <span>Small</span>
                  <span>Normal</span>
                  <span>Large</span>
                </div>
              </div>
            </SettingsCard>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-bold text-on-surface px-1">Theme</h3>
          <div className="grid gap-3">
            <SettingsCard icon={Contrast} title="Display Theme">
              <div className="flex p-1 bg-surface-container-low rounded-full">
                {['light', 'dark'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => updatePref('theme', mode)}
                    className={`flex-1 py-2 px-4 rounded-full text-sm font-bold capitalize transition-all ${
                      prefs.theme === mode
                        ? 'bg-primary text-on-primary'
                        : 'text-on-surface-variant hover:bg-surface-container'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </SettingsCard>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-bold text-on-surface px-1">Language</h3>
          <div className="grid gap-3">
            <SettingsCard icon={Languages} title="Display Language">
              <select
                value={prefs.language}
                onChange={(e) => updatePref('language', e.target.value)}
                className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm appearance-none focus:ring-2 focus:ring-primary/30 transition-all cursor-pointer"
              >
                <option>English</option>
                <option>Tamil</option>
                <option>Hindi</option>
                <option>Telugu</option>
              </select>
            </SettingsCard>
          </div>
        </div>
      </div>

      {/* Logout Action */}
      <section className="pt-4 pb-4">
        <button
          onClick={onLogoutStaff}
          className="w-full bg-primary text-on-primary py-4 px-8 rounded-2xl text-lg font-bold flex items-center justify-center gap-3 hover:brightness-110 active:scale-[0.98] transition-all shadow-[0px_10px_30px_rgba(0,0,0,0.08)]"
        >
          <LogOut className="w-5 h-5" />
          Logout Session
        </button>
        <p className="text-center mt-3 text-on-surface-variant text-[10px] uppercase tracking-widest">
          Mangamma Ruchulu KDS v2.4.0
        </p>
      </section>
    </div>
  );
};

export default KitchenSettingsScreen;

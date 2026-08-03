import React, { useState } from 'react';
import { Gauge, AlertTriangle, ShieldAlert, Flame, Clock, ChevronDown } from 'lucide-react';
import { useOrder } from '../../context/OrderContext';

const INDIVIDUAL_STATIONS = [
  { id: 'All', label: 'All Stations' },
  { id: 'MY_STATION', label: 'My Station' },
  { id: 'Starter & Tandoor Station', label: 'Starter & Tandoor' },
  { id: 'Curry & Gravy Station', label: 'Curry & Gravy' },
  { id: 'Biryani & Rice Station', label: 'Biryani & Rice' },
  { id: 'Fry Station', label: 'Fry Station' },
  { id: 'Beverage & Dessert Station', label: 'Beverage & Dessert' },
  { id: 'Packing Station', label: 'Packing Station' }
];

const KitchenHeader = ({
  selectedStation,
  setSelectedStation,
  activeFilter,
  setActiveFilter,
  densityMode,
  setDensityMode,
  orders = []
}) => {
  const { kitchenLoad, updateKitchenLoadStatus } = useOrder();
  const [showPausedConfirm, setShowPausedConfirm] = useState(false);
  const [isStationDropdownOpen, setIsStationDropdownOpen] = useState(false);

  const delayedCount = orders.filter((o) => o.status !== 'served' && (o.elapsedSeconds > 900 || o.isRush)).length;
  const allergyCount = orders.filter((o) => o.status !== 'served' && (o.specialNotes?.toLowerCase().includes('allergy') || o.items?.some((i) => i.allergyAlert))).length;
  const activeTotal = orders.filter((o) => o.status !== 'served').length;

  const handleSelectLoadStatus = (statusId) => {
    if (statusId === 'PAUSED') {
      setShowPausedConfirm(true);
    } else {
      updateKitchenLoadStatus(statusId);
    }
  };

  const confirmPause = () => {
    updateKitchenLoadStatus('PAUSED');
    setShowPausedConfirm(false);
  };

  return (
    <div className="space-y-2.5">
      {/* Paused Confirmation Modal */}
      {showPausedConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-[#C5221F]">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-bold text-lg text-gray-900">Pause Kitchen Ordering?</h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Pausing the kitchen will stop new customer order placements across all digital channels. Are you sure?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowPausedConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmPause}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#C5221F] text-white hover:bg-[#a81c19]"
              >
                Pause Ordering
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Row 1: Operational Kitchen-Load Control & Exception Bar (Google UI Card) */}
      <div className="bg-white px-4 py-2.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        {/* Load Status Banner */}
        <div className="flex items-center gap-2 text-xs">
          <Gauge className="w-4 h-4 text-[#A30F3B] shrink-0" />
          <span className="font-bold text-gray-900">
            Kitchen load: <span className="text-[#A30F3B] capitalize">{kitchenLoad?.status?.toLowerCase() || 'Busy'}</span>
          </span>
          <span className="text-gray-500 hidden sm:inline">
            · {kitchenLoad?.customerMessage || 'Longer preparation estimates active.'}
          </span>
        </div>

        {/* Load Buttons & Exception Summary */}
        <div className="flex items-center gap-3">
          {/* Exception Counts */}
          <div className="hidden lg:flex items-center gap-3 text-xs font-semibold px-3.5 py-1 bg-gray-100/80 rounded-xl text-gray-600">
            <span>Active: <strong className="text-gray-900 font-bold">{activeTotal}</strong></span>
            {delayedCount > 0 && (
              <span className="text-[#C5221F] flex items-center gap-1 font-bold">
                <Clock className="w-3.5 h-3.5" /> Delayed: {delayedCount}
              </span>
            )}
            {allergyCount > 0 && (
              <span className="text-[#C5221F] flex items-center gap-1 font-bold">
                <ShieldAlert className="w-3.5 h-3.5" /> Allergy: {allergyCount}
              </span>
            )}
          </div>

          {/* Segmented Control */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
            {[
              { id: 'NORMAL', label: 'Normal' },
              { id: 'BUSY', label: 'Busy' },
              { id: 'VERY_BUSY', label: 'Very Busy' },
              { id: 'PAUSED', label: 'Paused' }
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => handleSelectLoadStatus(st.id)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  kitchenLoad?.status === st.id
                    ? 'bg-[#A30F3B] text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Station Filter Toolbar & Density Toggle (Google UI Card) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white px-4 py-2 rounded-2xl shadow-2xs">
        {/* Quick Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          {[
            { id: 'ALL', label: 'All Stations' },
            { id: 'MY_STATION', label: 'My Station' },
            { id: 'DELAYED', label: `Delayed ${delayedCount > 0 ? `(${delayedCount})` : ''}`, icon: Clock, isDanger: delayedCount > 0 },
            { id: 'ALLERGY', label: `Allergy Alerts ${allergyCount > 0 ? `(${allergyCount})` : ''}`, icon: ShieldAlert, isDanger: allergyCount > 0 },
            { id: 'REFIRE', label: 'Re-fire', icon: Flame }
          ].map((btn) => {
            const isActive = activeFilter === btn.id;
            const Icon = btn.icon;
            return (
              <button
                key={btn.id}
                onClick={() => setActiveFilter(btn.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#A30F3B] text-white shadow-xs'
                    : btn.isDanger
                    ? 'bg-[#FCE8E6] text-[#C5221F] font-bold hover:bg-[#fbdcd9]'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
                <span>{btn.label}</span>
              </button>
            );
          })}
        </div>

        {/* Station Select Dropdown & Density Toggle */}
        <div className="flex items-center gap-2">
          {/* Station Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsStationDropdownOpen(!isStationDropdownOpen)}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 flex items-center gap-2 hover:bg-gray-200 transition-colors"
            >
              <span>Station: <strong>{INDIVIDUAL_STATIONS.find((s) => s.id === selectedStation)?.label || 'All Stations'}</strong></span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
            </button>

            {isStationDropdownOpen && (
              <div className="absolute right-0 mt-1 w-52 bg-white rounded-2xl shadow-xl py-1.5 z-30 space-y-0.5 border-none">
                {INDIVIDUAL_STATIONS.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => {
                      setSelectedStation(st.id);
                      setIsStationDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs font-semibold transition-colors ${
                      selectedStation === st.id
                        ? 'bg-[#F9E9EE] text-[#A30F3B]'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Density Toggle */}
          <div className="flex items-center bg-gray-100 p-0.5 rounded-full">
            <button
              onClick={() => setDensityMode('comfortable')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                densityMode === 'comfortable' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600'
              }`}
              title="Comfortable display mode"
            >
              Comfortable
            </button>
            <button
              onClick={() => setDensityMode('compact')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                densityMode === 'compact' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600'
              }`}
              title="Compact display mode"
            >
              Compact
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KitchenHeader;

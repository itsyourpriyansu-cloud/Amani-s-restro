import React, { useState, useRef, useEffect } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { LEDGER_STATUS_TABS } from '../../../constants/coupons';

const CouponFilters = ({
  statusFilter,
  onStatusFilterChange,
  statusCounts,
  search,
  onSearchChange,
  searchInputRef,
  secondaryFilters,
  onSecondaryFiltersChange,
}) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const popoverRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) setPopoverOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeFilterCount = Object.values(secondaryFilters).filter((v) => v && v !== 'ANY').length;

  return (
    <div className="space-y-3">
      {/* Search + secondary filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            ref={searchInputRef}
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search mobile number, coupon code, invoice or guest name"
            aria-label="Search coupons"
            className="w-full pl-9 pr-9 py-2.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 text-xs text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="relative" ref={popoverRef}>
          <button
            onClick={() => setPopoverOpen((v) => !v)}
            className="px-3.5 py-2.5 rounded-2xl border border-outline-variant/40 bg-surface-container-lowest text-xs font-bold text-on-surface flex items-center gap-1.5 whitespace-nowrap"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters {activeFilterCount > 0 && <span className="text-primary">{activeFilterCount}</span>}
          </button>
          {popoverOpen && (
            <div className="absolute right-0 mt-2 z-20 w-72 bg-surface border border-outline-variant/40 rounded-2xl shadow-lg p-4 space-y-3 text-xs">
              <div>
                <label className="font-bold text-on-surface block mb-1">Coupon Fulfilment Consent</label>
                <select
                  value={secondaryFilters.fulfilmentConsent}
                  onChange={(e) => onSecondaryFiltersChange({ ...secondaryFilters, fulfilmentConsent: e.target.value })}
                  className="w-full p-2 rounded-lg border border-outline-variant bg-surface"
                >
                  <option value="ANY">Any</option>
                  <option value="GRANTED">Granted</option>
                  <option value="NOT_GRANTED">Not Granted</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-on-surface block mb-1">Marketing Consent</label>
                <select
                  value={secondaryFilters.marketingConsent}
                  onChange={(e) => onSecondaryFiltersChange({ ...secondaryFilters, marketingConsent: e.target.value })}
                  className="w-full p-2 rounded-lg border border-outline-variant bg-surface"
                >
                  <option value="ANY">Any</option>
                  <option value="GRANTED">Granted</option>
                  <option value="NOT_GRANTED">Not Granted</option>
                </select>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => onSecondaryFiltersChange({ fulfilmentConsent: 'ANY', marketingConsent: 'ANY' })}
                  className="flex-1 py-2 bg-surface-container-high text-on-surface font-semibold rounded-lg"
                >
                  Clear Filters
                </button>
                <button
                  onClick={() => setPopoverOpen(false)}
                  className="flex-1 py-2 bg-primary text-on-primary font-bold rounded-lg"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar" role="tablist" aria-label="Coupon status filter">
        {LEDGER_STATUS_TABS.map((tab) => {
          const count = statusCounts[tab.id];
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={statusFilter === tab.id}
              onClick={() => onStatusFilterChange(tab.id)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-1.5 ${
                statusFilter === tab.id
                  ? 'bg-primary text-on-primary border-primary shadow-xs'
                  : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant/30 hover:bg-surface-container-high'
              }`}
            >
              {tab.label}
              {count > 0 && (
                <span className={`text-[10px] px-1.5 rounded-full ${statusFilter === tab.id ? 'bg-white/20' : 'bg-surface-container-high'}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CouponFilters;

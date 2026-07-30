import React from 'react';
import { RefreshCw } from 'lucide-react';
import { SegmentedControl } from './DashboardPrimitives';

const KITCHEN_LOAD_OPTIONS = [
  { value: 'NORMAL', label: 'Normal' },
  { value: 'BUSY', label: 'Busy' },
  { value: 'VERY_BUSY', label: 'Very Busy' },
  { value: 'PAUSED', label: 'Paused' },
];

const OperationsPageHeader = ({ kitchenLoadStatus, onKitchenLoadChange, lastUpdated, onRefresh }) => (
  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 mb-1 border-b border-outline-variant/25">
    <div>
      <h1 className="text-[28px] leading-tight font-extrabold tracking-tight text-on-surface">
        Restaurant Operations
      </h1>
      <p className="text-sm text-on-surface-variant mt-1">
        Live overview of orders, tables, payments and customer issues
      </p>
    </div>

    <div className="flex flex-wrap items-center gap-3 shrink-0">
      <div className="flex flex-col items-start gap-1">
        <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider pl-1">Kitchen Load</span>
        <SegmentedControl options={KITCHEN_LOAD_OPTIONS} value={kitchenLoadStatus} onChange={onKitchenLoadChange} />
      </div>

      <div className="flex items-center gap-2 self-end lg:self-auto">
        <span className="text-xs text-on-surface-variant font-medium hidden sm:inline">Updated {lastUpdated}</span>
        <button
          onClick={onRefresh}
          title="Refresh operational data"
          className="h-10 px-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container shadow-sm text-xs font-bold text-on-surface flex items-center gap-2 transition-all active:scale-95"
        >
          <RefreshCw className="w-4 h-4 text-primary" />
          <span>Refresh</span>
        </button>
      </div>
    </div>
  </div>
);

export default OperationsPageHeader;

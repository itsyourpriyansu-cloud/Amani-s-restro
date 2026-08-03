import React from 'react';
import { Ticket, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import CouponLedgerRow from './CouponLedgerRow';

const SORT_OPTIONS = [
  { value: 'issuedAt', label: 'Issued date' },
  { value: 'expiresAt', label: 'Expiry date' },
  { value: 'status', label: 'Status' },
  { value: 'guestName', label: 'Guest name' },
  { value: 'couponCode', label: 'Coupon code' },
  { value: 'redeemedAt', label: 'Redemption date' },
];

const PAGE_SIZE_OPTIONS = [10, 25, 50];

const SkeletonRow = () => (
  <tr className="border-b border-outline-variant/15">
    {Array.from({ length: 8 }).map((_, i) => (
      <td key={i} className="px-4 py-3">
        <div className="h-3 bg-surface-container-high rounded animate-pulse w-3/4" />
      </td>
    ))}
  </tr>
);

const CouponLedgerTable = ({
  rows,
  totalCount,
  isLoading,
  hasAnyCoupons,
  sortBy,
  sortDir,
  onSortChange,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onOpenDetails,
  onRedeem,
  onViewRequests,
}) => {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const rangeStart = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(totalCount, page * pageSize);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-end gap-2 text-xs">
        <label htmlFor="coupon-sort" className="font-semibold text-on-surface-variant flex items-center gap-1">
          <ArrowUpDown className="w-3.5 h-3.5" /> Sort by
        </label>
        <select
          id="coupon-sort"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value, sortDir)}
          className="p-1.5 rounded-lg border border-outline-variant bg-surface text-xs"
        >
          {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <button
          onClick={() => onSortChange(sortBy, sortDir === 'asc' ? 'desc' : 'asc')}
          aria-label={`Sort direction: ${sortDir === 'asc' ? 'ascending' : 'descending'}`}
          className="px-2 py-1.5 rounded-lg border border-outline-variant bg-surface font-bold"
        >
          {sortDir === 'asc' ? '↑' : '↓'}
        </button>
      </div>

      <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 shadow-xs overflow-x-auto">
        <table className="w-full text-xs min-w-[1000px]">
          <thead>
            <tr className="border-b border-outline-variant/30 text-on-surface-variant text-[11px] uppercase tracking-wide">
              <th scope="col" className="text-left font-bold px-4 py-3">Guest</th>
              <th scope="col" className="text-left font-bold px-4 py-3">Source</th>
              <th scope="col" className="text-left font-bold px-4 py-3">Coupon</th>
              <th scope="col" className="text-left font-bold px-4 py-3">Offer</th>
              <th scope="col" className="text-left font-bold px-4 py-3">Status</th>
              <th scope="col" className="text-left font-bold px-4 py-3">Issued / Expiry</th>
              <th scope="col" className="text-left font-bold px-4 py-3">Consent</th>
              <th scope="col" className="text-left font-bold px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            ) : rows.length > 0 ? (
              rows.map((row) => (
                <CouponLedgerRow key={row.request.requestId} row={row} onOpenDetails={onOpenDetails} onRedeem={onRedeem} />
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-on-surface-variant">
                  <Ticket className="w-8 h-8 mx-auto mb-2 opacity-40 text-primary" />
                  {hasAnyCoupons ? (
                    <>
                      <p className="font-bold">No matching coupons</p>
                      <p className="text-xs text-on-surface-variant/70 mt-1">Try another mobile number, code, invoice, or status.</p>
                    </>
                  ) : (
                    <>
                      <p className="font-bold">No coupons have been issued yet</p>
                      <p className="text-xs text-on-surface-variant/70 mt-1">Eligible customer requests will appear here after manager approval.</p>
                      {onViewRequests && (
                        <button onClick={onViewRequests} className="mt-3 px-3 py-1.5 bg-primary text-on-primary rounded-xl text-[11px] font-bold">
                          View Coupon Requests
                        </button>
                      )}
                    </>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalCount > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-on-surface-variant">
          <span>Showing {rangeStart}–{rangeEnd} of {totalCount} coupons</span>
          <div className="flex items-center gap-2">
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="p-1.5 rounded-lg border border-outline-variant bg-surface text-xs"
              aria-label="Rows per page"
            >
              {PAGE_SIZE_OPTIONS.map((n) => <option key={n} value={n}>{n} rows</option>)}
            </select>
            <button
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page <= 1}
              className="p-1.5 rounded-lg border border-outline-variant bg-surface disabled:opacity-40"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold">{page} / {totalPages}</span>
            <button
              onClick={() => onPageChange(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages}
              className="p-1.5 rounded-lg border border-outline-variant bg-surface disabled:opacity-40"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponLedgerTable;

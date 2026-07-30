import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useOrder } from '../../context/OrderContext';
import { getCouponLedger, paginate, computeCouponStats } from '../../services/couponService';
import { hasCouponPermission } from '../../constants/coupons';
import CouponPageHeader from '../../components/manager/coupons/CouponPageHeader';
import CouponStatsOverview from '../../components/manager/coupons/CouponStatsOverview';
import CouponFilters from '../../components/manager/coupons/CouponFilters';
import CouponLedgerTable from '../../components/manager/coupons/CouponLedgerTable';
import CouponRequestDrawer from '../../components/manager/CouponRequestDrawer';
import CouponDetailsDrawer from '../../components/manager/coupons/CouponDetailsDrawer';
import CouponRedemptionDrawer from '../../components/manager/coupons/CouponRedemptionDrawer';
import CouponWhatsAppPreview from '../../components/manager/coupons/CouponWhatsAppPreview';
import CouponRevokeDialog from '../../components/manager/coupons/CouponRevokeDialog';
import CouponCreateDrawer from '../../components/manager/coupons/CouponCreateDrawer';

const STAFF_NAME = 'Sundaram Pillai';
const STAFF_ROLE = 'GENERAL_MANAGER';

const CouponManagementScreen = () => {
  const {
    couponRequests,
    managerMarkCouponMessageReceived,
    managerVerifyCouponEligibility,
    managerDeclineCouponRequest,
    managerIssuePrototypeCoupon,
    managerMarkCouponSent,
    managerMarkCouponReplyOpened,
    managerRevokeCoupon,
    managerExtendCouponExpiry,
    managerRevealCouponPhone,
    managerWithdrawMarketingConsent,
    managerCreateDynamicCoupon,
  } = useOrder();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [secondaryFilters, setSecondaryFilters] = useState({ fulfilmentConsent: 'ANY', marketingConsent: 'ANY' });
  const [sortBy, setSortBy] = useState('issuedAt');
  const [sortDir, setSortDir] = useState('desc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const [reviewRequestId, setReviewRequestId] = useState(null);
  const [detailsRequestId, setDetailsRequestId] = useState(null);
  const [redemptionOpen, setRedemptionOpen] = useState(false);
  const [redemptionPrefill, setRedemptionPrefill] = useState('');
  const [resendRequest, setResendRequest] = useState(null);
  const [revokeRequest, setRevokeRequest] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);

  const searchInputRef = useRef(null);
  const [updatedAtLabel] = useState(() => `Updated ${new Date().toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })}`);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => { setPage(1); }, [search, statusFilter, secondaryFilters]);

  const permissions = {
    canRevoke: hasCouponPermission(STAFF_ROLE, 'COUPON_REVOKE'),
    canExtend: hasCouponPermission(STAFF_ROLE, 'COUPON_EXTEND_EXPIRY'),
    canResend: hasCouponPermission(STAFF_ROLE, 'COUPON_RESEND'),
    canRevealPhone: hasCouponPermission(STAFF_ROLE, 'COUPON_REVEAL_PHONE'),
    canCreate: hasCouponPermission(STAFF_ROLE, 'COUPON_ISSUE'),
  };

  const stats = useMemo(() => computeCouponStats(couponRequests), [couponRequests]);

  const baseRows = useMemo(
    () => getCouponLedger(couponRequests, { statusFilter: 'ALL', search, sortBy, sortDir }),
    [couponRequests, search, sortBy, sortDir]
  );

  const secondaryFiltered = useMemo(() => baseRows.filter((row) => {
    if (secondaryFilters.fulfilmentConsent === 'GRANTED' && !row.request.consent.fulfilmentGranted) return false;
    if (secondaryFilters.fulfilmentConsent === 'NOT_GRANTED' && row.request.consent.fulfilmentGranted) return false;
    if (secondaryFilters.marketingConsent === 'GRANTED' && !row.request.consent.marketingGranted) return false;
    if (secondaryFilters.marketingConsent === 'NOT_GRANTED' && row.request.consent.marketingGranted) return false;
    return true;
  }), [baseRows, secondaryFilters]);

  const statusCounts = useMemo(() => {
    const counts = { ALL: secondaryFiltered.length };
    secondaryFiltered.forEach((row) => {
      counts[row.ledgerStatus] = (counts[row.ledgerStatus] || 0) + 1;
    });
    return counts;
  }, [secondaryFiltered]);

  const filteredRows = statusFilter === 'ALL' ? secondaryFiltered : secondaryFiltered.filter((r) => r.ledgerStatus === statusFilter);
  const pagedRows = paginate(filteredRows, page, pageSize);
  const hasAnyCoupons = couponRequests.some((r) => r.coupon);

  const reviewRequest = couponRequests.find((r) => r.requestId === reviewRequestId) || null;
  const detailsRow = detailsRequestId
    ? baseRows.find((row) => row.request.requestId === detailsRequestId) || null
    : null;

  const openDetails = (row) => {
    if (row.ledgerStatus === 'AWAITING_REVIEW' || row.ledgerStatus === 'DECLINED') {
      setReviewRequestId(row.request.requestId);
    } else {
      setDetailsRequestId(row.request.requestId);
    }
  };

  const openRedemption = (prefillCode = '') => {
    setRedemptionPrefill(prefillCode);
    setRedemptionOpen(true);
  };

  return (
    <div className="space-y-6">
      <CouponPageHeader
        updatedAtLabel={updatedAtLabel}
        onRedeemClick={() => openRedemption('')}
        onCreateClick={() => setCreateOpen(true)}
        canCreate={permissions.canCreate}
      />

      <CouponStatsOverview stats={stats} onDrillDown={setStatusFilter} />

      <CouponFilters
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        statusCounts={statusCounts}
        search={search}
        onSearchChange={setSearch}
        searchInputRef={searchInputRef}
        secondaryFilters={secondaryFilters}
        onSecondaryFiltersChange={setSecondaryFilters}
      />

      <CouponLedgerTable
        rows={pagedRows}
        totalCount={filteredRows.length}
        isLoading={false}
        hasAnyCoupons={hasAnyCoupons}
        sortBy={sortBy}
        sortDir={sortDir}
        onSortChange={(by, dir) => { setSortBy(by); setSortDir(dir); }}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}
        onOpenDetails={openDetails}
        onRedeem={openRedemption}
        onViewRequests={() => setStatusFilter('AWAITING_REVIEW')}
      />

      {reviewRequest && (
        <CouponRequestDrawer
          request={reviewRequest}
          onClose={() => setReviewRequestId(null)}
          staffName={STAFF_NAME}
          onMarkMessageReceived={managerMarkCouponMessageReceived}
          onVerifyEligibility={managerVerifyCouponEligibility}
          onDecline={managerDeclineCouponRequest}
          onIssueCoupon={managerIssuePrototypeCoupon}
          onWithdrawMarketingConsent={managerWithdrawMarketingConsent}
        />
      )}

      {detailsRow && (
        <CouponDetailsDrawer
          request={detailsRow.request}
          ledgerStatus={detailsRow.ledgerStatus}
          onClose={() => setDetailsRequestId(null)}
          staffName={STAFF_NAME}
          permissions={permissions}
          onOpenRedemption={(code) => { setDetailsRequestId(null); openRedemption(code); }}
          onOpenResend={(req) => setResendRequest(req)}
          onOpenRevoke={(req) => setRevokeRequest(req)}
          onExtendExpiry={managerExtendCouponExpiry}
          onRevealPhone={managerRevealCouponPhone}
        />
      )}

      <CouponRedemptionDrawer
        isOpen={redemptionOpen}
        onClose={() => setRedemptionOpen(false)}
        staffName={STAFF_NAME}
        initialQuery={redemptionPrefill}
      />

      {resendRequest && (
        <CouponWhatsAppPreview
          request={resendRequest}
          onClose={() => setResendRequest(null)}
          onReplyOpened={managerMarkCouponReplyOpened}
          onMarkSent={managerMarkCouponSent}
          staffName={STAFF_NAME}
        />
      )}

      {revokeRequest && (
        <CouponRevokeDialog
          request={revokeRequest}
          onClose={() => setRevokeRequest(null)}
          onRevoke={managerRevokeCoupon}
          staffName={STAFF_NAME}
        />
      )}

      <CouponCreateDrawer
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        staffName={STAFF_NAME}
        onCreate={(payload, staffNameArg) => {
          const newRequest = managerCreateDynamicCoupon(payload, staffNameArg);
          setDetailsRequestId(newRequest.requestId);
          return newRequest;
        }}
      />
    </div>
  );
};

export default CouponManagementScreen;

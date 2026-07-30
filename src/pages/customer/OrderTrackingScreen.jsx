import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../../context/OrderContext';
import { useTable } from '../../context/TableContext';
import { useToast } from '../../context/ToastContext';
import TopAppBar from '../../components/layout/TopAppBar';
import BottomNavBar from '../../components/layout/BottomNavBar';
import OrderTimeline from '../../components/order/OrderTimeline';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';
import Icon from '../../components/common/Icon';
import RestaurantTrustProfileModal from '../../components/trust/RestaurantTrustProfileModal';
import { Clock, CheckCircle2, HelpCircle, AlertCircle, ChevronRight } from 'lucide-react';

const STAGE_PROGRESS_LABELS = ['Order received', 'Being prepared', 'Ready to serve', 'Served'];

const OrderTrackingScreen = () => {
  const navigate = useNavigate();
  const { activeOrder, assistanceRequests, addAssistanceRequest, issuesList } = useOrder();
  const { tableNumber } = useTable();
  const { showToast } = useToast();

  const [remainingSeconds, setRemainingSeconds] = useState(14 * 60);
  const [isAssistanceModalOpen, setIsAssistanceModalOpen] = useState(false);
  const [serveReadyFirst, setServeReadyFirst] = useState(false);
  const [isTrustOpen, setIsTrustOpen] = useState(false);

  const currentStageIndex = activeOrder?.stageIndex ?? 0;

  const activeAssistance = assistanceRequests?.find(
    (req) => req.tableNumber === tableNumber && req.status === 'pending'
  );

  const activeIssue = issuesList?.find(
    (iss) => (iss.orderId === activeOrder?.orderId || iss.tableNumber === tableNumber) && iss.status !== 'CLOSED' && iss.status !== 'RESOLVED'
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRequestAssistanceOption = (optionLabel) => {
    if (optionLabel === 'Report an Issue') {
      setIsAssistanceModalOpen(false);
      navigate('/report-issue');
      return;
    }
    if (activeAssistance) {
      showToast('Assistance already requested. Rahul will respond shortly.', 'warning');
      setIsAssistanceModalOpen(false);
      return;
    }
    addAssistanceRequest(tableNumber, optionLabel);
    showToast(`Requested "${optionLabel}" for Table ${tableNumber}`, 'success');
    setIsAssistanceModalOpen(false);
  };

  if (!activeOrder) {
    return (
      <>
        <TopAppBar variant="brand" />
        <main className="flex-1 pt-20 px-4">
          <EmptyState
            icon={() => <Icon name="schedule" className="text-4xl" />}
            title="No active order to track"
            description="You have not placed an order yet."
            actionLabel="Browse Menu"
            onAction={() => navigate('/menu')}
          />
        </main>
        <BottomNavBar />
      </>
    );
  }

  const items = activeOrder.items || [];
  const readyItems = items.filter((it) => it.readinessStatus === 'READY');
  const preparingItems = items.filter((it) => it.readinessStatus !== 'READY');
  const allReady = items.length > 0 && readyItems.length === items.length;

  const minutesRemaining = Math.ceil(remainingSeconds / 60);
  const countdownLabel = remainingSeconds <= 0 ? 'Any moment now' : `About ${minutesRemaining} min remaining`;
  const progressPercent = Math.max(6, Math.min(100, (currentStageIndex / (STAGE_PROGRESS_LABELS.length - 1)) * 100));

  return (
    <>
      <TopAppBar
        variant="brand"
        onOpenTrustProfile={() => setIsTrustOpen(true)}
      />

      <main className="flex-1 pt-20 pb-28 max-w-2xl mx-auto w-full px-4 space-y-4">
        {/* Scannable order meta row */}
        <div className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant px-1">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          <span>Live tracking</span>
          <span className="text-on-surface-variant/40">&bull;</span>
          <span>Table {tableNumber}</span>
          <span className="text-on-surface-variant/40">&bull;</span>
          <span>Order #{activeOrder.orderId || 'ORD-1048'}</span>
        </div>

        {/* Transparent ETA Change Notice */}
        {activeOrder.etaChangeReason && (
          <section className="bg-warning/10 border border-warning/30 rounded-2xl p-4 space-y-2.5 text-xs text-on-surface">
            <div className="flex items-center justify-between">
              <span className="font-bold flex items-center gap-1.5 text-warning">
                <Clock className="w-4 h-4 text-warning" />
                Your estimate was just updated
              </span>
              <span className="text-[10px] font-semibold text-warning">
                {activeOrder.etaUpdatedAt || '7:31 PM'}
              </span>
            </div>
            <div className="flex items-center justify-between bg-surface/70 px-3 py-2.5 rounded-xl border border-warning/40">
              <span className="line-through text-muted text-xs tabular-nums">Was {activeOrder.previousEstimate || '7:38 PM'}</span>
              <span className="font-bold text-warning text-sm tabular-nums">Now {activeOrder.estimatedReadyAt || '7:46 PM'}</span>
            </div>
            <p className="text-xs leading-relaxed">{activeOrder.etaChangeReason}</p>
          </section>
        )}

        {/* Active Status Hero Card — status, ETA and progress unified */}
        <section
          className="relative overflow-hidden rounded-2xl bg-surface-container-lowest p-6 shadow-soft border border-outline-variant/20 text-center"
          aria-live="polite"
        >
          <div className="inline-flex items-center justify-center p-4 bg-primary/10 text-primary rounded-full mb-3">
            <Icon name="cooking" className="text-3xl" filled />
          </div>
          <h1 className="text-lg font-bold text-on-surface mb-1">We're freshly preparing your order</h1>
          <p className="text-xs text-on-surface-variant mb-5 max-w-xs mx-auto leading-relaxed">
            Our kitchen is cooking with care. This page updates automatically, so there's nothing you need to refresh.
          </p>

          <div className="bg-surface-container-low rounded-2xl border border-outline-variant/10 px-5 py-4">
            <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider block mb-1">
              Expected ready by
            </span>
            <span className="text-3xl font-black text-primary tabular-nums block leading-tight">
              {activeOrder.estimatedReadyAt || '7:46 PM'}
            </span>
            <span className="text-xs font-semibold text-on-surface-variant mt-1 block">
              {countdownLabel}
            </span>

            <div className="mt-3.5 h-1.5 w-full rounded-full bg-surface-container-high overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-[10px] text-on-surface-variant/70 font-medium mt-1.5 block">
              {STAGE_PROGRESS_LABELS[currentStageIndex]}
            </span>
          </div>
        </section>

        {/* Item Readiness Section */}
        <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 overflow-hidden">
          <div className="flex items-center justify-between px-4 pt-4 pb-3">
            <div>
              <h2 className="font-bold text-sm text-on-surface flex items-center gap-2">
                <Icon name="checklist" className="text-primary text-base" />
                Item Readiness
              </h2>
              <p className="text-[11px] text-on-surface-variant mt-0.5">See what's ready to be served</p>
            </div>
            <span
              className={`text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0 ${
                allReady ? 'bg-success/15 text-success' : 'bg-secondary-container text-on-secondary-container'
              }`}
            >
              {readyItems.length} of {items.length} ready
            </span>
          </div>

          <div className="divide-y divide-outline-variant/10 border-t border-outline-variant/10">
            {items.map((item, idx) => {
              const isReady = item.readinessStatus === 'READY';
              return (
                <div key={idx} className="flex items-center gap-3 px-4 py-3.5">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isReady ? 'bg-success/15' : 'bg-warning/15'}`}>
                    {isReady ? (
                      <CheckCircle2 className="w-4 h-4 text-success" />
                    ) : (
                      <Clock className="w-4 h-4 text-warning" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-on-surface truncate">{item.name}</p>
                    <p className="text-[11px] text-on-surface-variant">
                      Qty {item.quantity}
                      {item.note && <span className="italic"> &middot; "{item.note}"</span>}
                    </p>
                  </div>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0 ${
                      isReady ? 'bg-success/15 text-success' : 'bg-warning/15 text-warning'
                    }`}
                  >
                    {isReady ? 'Ready to serve' : 'Preparing'}
                  </span>
                </div>
              );
            })}
          </div>

          {readyItems.length > 0 && preparingItems.length > 0 && (
            <div className="flex items-center justify-between gap-3 text-xs px-4 py-3 border-t border-outline-variant/10 bg-surface-container-low/60">
              <span className="text-on-surface-variant font-medium">Serve ready dishes now, rather than waiting?</span>
              <label className="flex items-center gap-2 font-bold text-primary cursor-pointer shrink-0 min-h-11">
                <input
                  type="checkbox"
                  checked={serveReadyFirst}
                  onChange={(e) => {
                    setServeReadyFirst(e.target.checked);
                    showToast(e.target.checked ? 'Notified waiter to serve ready items first' : 'Standard serving sequence restored', 'info');
                  }}
                  className="w-4 h-4 rounded text-primary focus:ring-primary"
                />
                Yes, please
              </label>
            </div>
          )}
        </section>

        {/* Order Progress Stepper */}
        <section className="bg-surface-container-lowest rounded-2xl p-5 shadow-soft border border-outline-variant/20">
          <h2 className="font-bold text-sm text-on-surface mb-4">Order Progress</h2>
          <OrderTimeline currentStageIndex={currentStageIndex} />
        </section>

        {/* Help & Support — secondary, low-noise */}
        <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-4 space-y-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant shrink-0">
              <HelpCircle className="w-[18px] h-[18px]" />
            </div>
            <div>
              <h2 className="font-bold text-on-surface text-sm">Need help?</h2>
              <p className="text-[11px] text-on-surface-variant">We're one tap away if something isn't right.</p>
            </div>
          </div>

          {activeIssue && (
            <div className="rounded-xl border border-warning/30 bg-warning/5 p-3.5 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wide text-warning/80">
                  Support ticket #{activeIssue.issueId}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-warning/20 text-warning shrink-0">
                  {activeIssue.statusLabel || activeIssue.status}
                </span>
              </div>
              <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
                <div>
                  <dt className="text-on-surface-variant text-[10px] uppercase tracking-wide">Assigned to</dt>
                  <dd className="font-semibold text-on-surface">{activeIssue.assignedOwner || 'Our team'}</dd>
                </div>
                <div>
                  <dt className="text-on-surface-variant text-[10px] uppercase tracking-wide">Contact</dt>
                  <dd className="font-semibold text-on-surface">Rahul (waiter)</dd>
                </div>
              </dl>
              {activeIssue.recoveryAction && (
                <p className="text-[11px] text-on-surface bg-surface/80 p-2.5 rounded-lg border border-warning/30 leading-relaxed">
                  <strong>Latest update:</strong> {activeIssue.recoveryAction}
                </p>
              )}
              <button
                onClick={() => navigate('/report-status')}
                className="w-full min-h-11 py-2 bg-primary text-on-primary rounded-lg font-bold text-xs shadow-sm hover:bg-primary/90 flex items-center justify-center gap-1.5 transition-colors"
              >
                View Full Status
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setIsAssistanceModalOpen(true)}
              className="min-h-11 rounded-xl border border-outline text-on-surface font-bold text-xs hover:bg-surface-container flex items-center justify-center gap-2 transition-colors"
            >
              <Icon name="support_agent" className="text-primary text-base" />
              <span>Get Support</span>
            </button>
            <button
              onClick={() => handleRequestAssistanceOption('Call Waiter')}
              disabled={!!activeAssistance}
              className="min-h-11 rounded-xl bg-primary/10 text-primary font-bold text-xs flex items-center justify-center gap-2 hover:bg-primary/15 transition-colors disabled:opacity-60"
            >
              <Icon name="front_hand" className="text-base" />
              <span>{activeAssistance ? 'Rahul is on the way' : 'Call Waiter'}</span>
            </button>
          </div>

          {!activeIssue && (
            <button
              onClick={() => navigate('/report-issue')}
              className="w-full min-h-11 flex items-center justify-center gap-1.5 text-xs font-semibold text-error hover:brightness-90 transition-colors"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              Something wrong with your order? Report it
            </button>
          )}
        </section>
      </main>

      <BottomNavBar />

      {/* Trust Profile Modal */}
      <RestaurantTrustProfileModal
        isOpen={isTrustOpen}
        onClose={() => setIsTrustOpen(false)}
        onRequestAssistance={(type) => addAssistanceRequest(tableNumber, type)}
      />

      {/* Support Modal */}
      <Modal isOpen={isAssistanceModalOpen} onClose={() => setIsAssistanceModalOpen(false)} title="How can we help?" position="bottom">
        <div className="space-y-2">
          {activeAssistance && (
            <div className="p-3 bg-warning/10 border border-warning/30 rounded-xl text-xs text-warning font-medium mb-3">
              Rahul Sharma has accepted your request. Expected response in a few minutes.
            </div>
          )}
          {[
            'Order update',
            'Need water pitcher',
            'Need extra cutlery',
            'Check delayed item',
            'Billing assistance',
            'Allergy assistance',
            'Speak to manager',
            'Report an Issue',
          ].map((req) => (
            <button
              key={req}
              onClick={() => handleRequestAssistanceOption(req)}
              className={`w-full text-left min-h-11 p-3.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-between border ${
                req === 'Report an Issue'
                  ? 'bg-error/5 hover:bg-error/10 border-error/40 text-error'
                  : 'bg-surface-container-low hover:bg-primary/5 border-outline-variant/10 text-on-surface'
              }`}
            >
              <span>{req}</span>
              <Icon name="chevron_right" className="text-on-surface-variant" />
            </button>
          ))}
        </div>
      </Modal>
    </>
  );
};

export default OrderTrackingScreen;

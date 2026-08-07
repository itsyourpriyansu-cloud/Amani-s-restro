import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardCheck,
  UserCheck,
  Sparkles,
  BellRing,
  PartyPopper,
  Check,
  Clock,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  Circle,
  HeartHandshake,
} from 'lucide-react';
import { useOrder } from '../../context/OrderContext';
import { useTable } from '../../context/TableContext';
import { useToast } from '../../context/ToastContext';
import { REPORT_STAGES, ISSUE_CATEGORIES } from '../../utils/issueCategories';
import BottomNavBar from '../../components/layout/BottomNavBar';
import TopAppBar from '../../components/layout/TopAppBar';
import Icon from '../../components/common/Icon';

const STAGE_ICONS = { ClipboardCheck, UserCheck, Sparkles, BellRing, PartyPopper };

const STAGE_INDEX_BY_STATUS = {
  REPORTED: 0,
  ACKNOWLEDGED: 0,
  OWNER_ASSIGNED: 1,
  ACTION_IN_PROGRESS: 2,
  REOPENED: 2,
  WAITING_FOR_CUSTOMER: 3,
  RESOLVED: 4,
  CLOSED: 4,
};

const STATUS_META = {
  REPORTED: { label: 'Report received', tone: 'info' },
  ACKNOWLEDGED: { label: 'Being reviewed', tone: 'info' },
  OWNER_ASSIGNED: { label: 'Staff assigned', tone: 'warning' },
  ACTION_IN_PROGRESS: { label: 'Being resolved', tone: 'warning' },
  WAITING_FOR_CUSTOMER: { label: 'Awaiting your confirmation', tone: 'warning' },
  RESOLVED: { label: 'Resolved', tone: 'success' },
  CLOSED: { label: 'Resolved', tone: 'success' },
  REOPENED: { label: 'Reopened', tone: 'danger' },
};

const TONE_CLASSES = {
  info: 'bg-information/10 text-information border border-information/20',
  warning: 'bg-warning/10 text-warning border border-warning/20',
  success: 'bg-success/10 text-success border border-success/20',
  danger: 'bg-danger/10 text-danger border border-danger/20',
};

const FRIENDLY_TITLES = {
  EXCESSIVE_DELAY: (item) => `Your ${item || 'order'} is taking longer than it should`,
  MISSING_ITEM: (item) => `Sorting out your missing ${item || 'item'}`,
  WRONG_ITEM: (item) => `Fixing the mix-up with your ${item || 'order'}`,
  FOOD_COLD: (item) => `Getting your ${item || 'dish'} served the way it should be`,
  QUALITY_ISSUE: (item) => `Making things right with your ${item || 'dish'}`,
  ALLERGY_CONCERN: (item) => `Checking on the allergy concern for your ${item || 'order'}`,
  BILLING_ISSUE: () => 'Reviewing your bill',
  MANAGER_ASSISTANCE: () => 'Getting a manager to your table',
};

const getFriendlyTitle = (issue) => {
  const build = FRIENDLY_TITLES[issue.category];
  const title = build ? build(issue.affectedItemName) : null;
  return title || issue.description || issue.categoryLabel || 'Looking into your request';
};

const getOwnerName = (issue) =>
  (issue.assignedOwner || '').replace(/\s*\([^)]*\)\s*$/, '').trim() || 'Our team';

const getAuditIcon = (text = '') => {
  const t = text.toLowerCase();
  if (t.includes('reopen') || t.includes('not resolved')) return RotateCcw;
  if (t.includes('confirm')) return CheckCircle2;
  if (t.includes('approved')) return ShieldCheck;
  if (t.includes('assigned') || t.includes('accepted')) return UserCheck;
  if (t.includes('started') || t.includes('preparing') || t.includes('progress')) return Sparkles;
  if (t.includes('reported')) return ClipboardCheck;
  return Circle;
};

const ReportStatusScreen = () => {
  const navigate = useNavigate();
  const { activeOrder, issuesList, confirmIssueResolution } = useOrder();
  const { tableNumber } = useTable();
  const { showToast } = useToast();

  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  // Pick active or most recent issue
  const currentIssue = issuesList?.find(
    (iss) => (iss.orderId === activeOrder?.orderId || iss.tableNumber === tableNumber)
  ) || issuesList?.[0];

  if (!currentIssue) {
    return (
      <>
        <TopAppBar variant="brand" />
        <main className="flex-1 flex flex-col items-center justify-center px-4 pt-20 text-center gap-3">
          <Icon name="fact_check" className="text-4xl text-on-surface-variant" />
          <p className="text-on-surface font-semibold text-base">Nothing to report right now</p>
          <p className="text-xs text-on-surface-variant max-w-xs">If something isn't quite right with your food, bill, or service, let us know anytime — we're happy to help.</p>
          <button
            onClick={() => navigate('/report-issue')}
            className="mt-2 min-h-11 px-5 py-2.5 bg-primary text-on-primary rounded-xl font-bold text-xs shadow-floating focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Report an Issue
          </button>
        </main>
        <BottomNavBar />
      </>
    );
  }

  const handleResolutionChoice = (isResolved) => {
    if (isResolved) {
      setShowFeedbackModal(true);
    } else {
      confirmIssueResolution(currentIssue.issueId, false);
      showToast(`We've let our team know it's not quite sorted yet — they're on it, Table ${tableNumber}.`, 'warning');
    }
  };

  const handleSubmitFeedback = () => {
    confirmIssueResolution(currentIssue.issueId, true, {
      rating: feedbackRating,
      comment: feedbackComment,
    });
    showToast('Thank you for letting us know — we appreciate your patience!', 'success');
    setShowFeedbackModal(false);
  };

  const isResolved = currentIssue.status === 'RESOLVED' || currentIssue.status === 'CLOSED';
  const isReopened = currentIssue.status === 'REOPENED';
  const currentStageIdx = STAGE_INDEX_BY_STATUS[currentIssue.status] ?? 0;
  const statusMeta = STATUS_META[currentIssue.status] || { label: currentIssue.status, tone: 'info' };
  const categoryMeta = ISSUE_CATEGORIES.find((c) => c.id === currentIssue.category);
  const ownerName = getOwnerName(currentIssue);

  return (
    <>
      <TopAppBar variant="brand" />

      <main className="flex-1 px-4 pt-20 pb-28 max-w-xl mx-auto w-full space-y-5">
        {/* Identity / hero */}
        <section aria-labelledby="issue-heading" className="space-y-3">
          {categoryMeta && (
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <Icon name={categoryMeta.icon} className="text-base" />
              <span>{currentIssue.categoryLabel}</span>
            </div>
          )}
          <h2 id="issue-heading" className="text-xl sm:text-2xl font-bold text-on-surface leading-snug">
            {getFriendlyTitle(currentIssue)}
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container text-on-surface-variant text-xs font-semibold">
              <Icon name="confirmation_number" className="text-sm" />
              <span className="font-mono">{currentIssue.issueId}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container text-on-surface-variant text-xs font-semibold">
              <Icon name="table_restaurant" className="text-sm" />
              Table {currentIssue.tableNumber}
            </span>
            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${TONE_CLASSES[statusMeta.tone]}`}>
              {statusMeta.label}
            </span>
          </div>
        </section>

        {/* Care team card */}
        <section aria-labelledby="care-team-heading" className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 shadow-card overflow-hidden">
          <h3 id="care-team-heading" className="sr-only">Who's taking care of this</h3>
          <div className="p-4 flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shrink-0">
              <Icon name="support_agent" className="text-xl" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Taking care of you</p>
              <p className="text-sm font-bold text-on-surface truncate">{ownerName}</p>
              <p className="text-xs text-on-surface-variant">{currentIssue.assignedRole || 'Floor Staff'}</p>
            </div>
          </div>
          <div className="border-t border-outline-variant/15 p-4 flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Accepted at</p>
              <p className="text-sm font-bold text-on-surface">{currentIssue.acceptedAt || 'Just now'}</p>
            </div>
          </div>
        </section>

        {/* Active resolution action */}
        <section aria-labelledby="action-heading" className="relative rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/8 to-secondary/10 p-5 shadow-card">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-floating">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="space-y-1.5 min-w-0">
              <p id="action-heading" className="text-xs font-bold uppercase tracking-wider text-primary">What we're doing right now</p>
              <p className="text-sm font-semibold text-on-surface leading-relaxed">
                {currentIssue.recoveryAction || 'Our team has your report and is working out the best way to make this right for you.'}
              </p>
              {currentIssue.estimatedActionMinutes ? (
                <p className="inline-flex items-center gap-1.5 text-xs font-bold text-on-surface-variant pt-1">
                  <Clock className="w-3.5 h-3.5" />
                  About {currentIssue.estimatedActionMinutes} more minute{currentIssue.estimatedActionMinutes === 1 ? '' : 's'}
                </p>
              ) : null}
            </div>
          </div>
        </section>

        {/* Resolution timeline / stepper */}
        <section aria-labelledby="timeline-heading" className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-5 shadow-card">
          <h3 id="timeline-heading" className="font-bold text-sm text-on-surface mb-4">Where things stand</h3>

          {isReopened && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-danger/10 border border-danger/20 px-3 py-2.5 text-xs font-semibold text-danger">
              <RotateCcw className="w-4 h-4 shrink-0" />
              You reopened this issue — our team's been notified and is back on it.
            </div>
          )}

          <ol>
            {REPORT_STAGES.map((stage, idx) => {
              const isDone = idx < currentStageIdx || (isResolved && idx === currentStageIdx);
              const isActive = !isDone && idx === currentStageIdx;
              const isLast = idx === REPORT_STAGES.length - 1;
              const StageIcon = STAGE_ICONS[stage.icon] || Circle;

              return (
                <li key={stage.id} className="flex gap-4" aria-current={isActive ? 'step' : undefined}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                        isDone
                          ? 'bg-success text-on-success'
                          : isActive
                          ? 'bg-primary text-on-primary ring-4 ring-primary/20'
                          : 'bg-surface-container-high text-on-surface-variant/50 border border-outline-variant/30'
                      }`}
                    >
                      {isDone ? <Check className="w-5 h-5" strokeWidth={3} /> : <StageIcon className="w-[18px] h-[18px]" strokeWidth={isActive ? 2.5 : 2} />}
                    </div>
                    {!isLast && (
                      <div className={`w-0.5 flex-1 min-h-[28px] my-1 rounded-full ${isDone ? 'bg-success' : 'bg-surface-container-high'}`} />
                    )}
                  </div>

                  <div className={isLast ? 'pt-1.5' : 'pb-6 pt-1.5'}>
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-bold ${isActive ? 'text-primary' : isDone ? 'text-on-surface' : 'text-on-surface-variant/60'}`}>
                        {stage.title}
                      </p>
                      {isActive && (
                        <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container">
                          In progress
                        </span>
                      )}
                    </div>
                    <p className={`text-xs mt-0.5 ${idx > currentStageIdx ? 'text-on-surface-variant/50' : 'text-on-surface-variant'}`}>
                      {stage.subtitle}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        {/* Customer confirmation */}
        {!isResolved && (
          <section
            aria-labelledby="confirm-heading"
            className="rounded-2xl border-2 border-secondary/30 bg-secondary-container/40 p-5 space-y-3"
          >
            <div className="flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-on-secondary-container" />
              <h3 id="confirm-heading" className="font-bold text-base text-on-secondary-container">Have we made things right?</h3>
            </div>
            <p className="text-sm leading-relaxed text-on-secondary-container/90">
              We'd love to close the loop with you first. Let us know if everything's sorted now, or if you'd like our team to take another look.
            </p>
            <div className="flex flex-col gap-2.5 pt-1">
              <button
                onClick={() => handleResolutionChoice(true)}
                className="min-h-12 py-3 bg-success hover:brightness-95 text-on-success font-bold rounded-xl shadow-floating transition-all active:scale-[0.99] text-sm flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-success focus-visible:ring-offset-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                Yes, issue resolved
              </button>
              <button
                onClick={() => handleResolutionChoice(false)}
                className="min-h-12 py-3 bg-surface border-2 border-outline-variant/60 hover:bg-surface-container text-on-surface-variant font-bold rounded-xl transition-colors active:scale-[0.99] text-sm flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <RotateCcw className="w-4 h-4" />
                Not yet, reopen issue
              </button>
            </div>
          </section>
        )}

        {/* Audit history */}
        {currentIssue.timeline?.length > 0 && (
          <section aria-labelledby="history-heading" className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-5 shadow-card">
            <h3 id="history-heading" className="font-bold text-sm text-on-surface">What's happened so far</h3>
            <p className="text-xs text-on-surface-variant mb-4 mt-0.5">A full record of every update on this ticket.</p>
            <ol className="space-y-0">
              {currentIssue.timeline.map((item, idx) => {
                const EventIcon = getAuditIcon(item.text);
                const isLast = idx === currentIssue.timeline.length - 1;
                return (
                  <li key={idx} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant border border-outline-variant/30 shrink-0">
                        <EventIcon className="w-4 h-4" />
                      </div>
                      {!isLast && <div className="w-px flex-1 min-h-[14px] bg-outline-variant/30 my-1" />}
                    </div>
                    <div className={isLast ? 'pt-1' : 'pb-4 pt-1'}>
                      <p className="text-sm text-on-surface font-medium leading-snug">{item.text}</p>
                      <p className="text-[11px] font-mono text-on-surface-variant/70 mt-0.5">{item.time}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        )}
      </main>

      {/* Resolution Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div role="dialog" aria-modal="true" aria-labelledby="feedback-heading" className="bg-surface border border-outline-variant/30 rounded-2xl p-6 max-w-md w-full space-y-4 text-on-surface shadow-2xl">
            <div className="text-center space-y-1">
              <h3 id="feedback-heading" className="font-bold text-lg">How did we do?</h3>
              <p className="text-xs text-on-surface-variant">A quick rating helps us keep taking good care of our guests.</p>
            </div>

            <div className="flex justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setFeedbackRating(star)}
                  aria-label={`Rate ${star} star${star === 1 ? '' : 's'}`}
                  aria-pressed={star <= feedbackRating}
                  className={`w-11 h-11 rounded-full flex items-center justify-center text-xl transition-transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                    star <= feedbackRating ? 'bg-highlight/20 text-highlight font-bold' : 'bg-surface-container text-on-surface-variant/40'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>

            <textarea
              rows={2}
              value={feedbackComment}
              onChange={(e) => setFeedbackComment(e.target.value)}
              aria-label="Optional feedback"
              placeholder="Anything else you'd like us to know? (optional)"
              className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl p-3 text-xs outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />

            <button
              onClick={handleSubmitFeedback}
              className="w-full min-h-12 py-3 bg-primary text-on-primary font-bold text-sm rounded-xl shadow-floating focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Submit &amp; Close This Out
            </button>
          </div>
        </div>
      )}

      <BottomNavBar />
    </>
  );
};

export default ReportStatusScreen;

import React, { useState, useMemo } from 'react';
import { Wrench, X, ChevronDown, ChevronUp } from 'lucide-react';
import { StatusBadge, SectionHeading, ContextualButton } from './DashboardPrimitives';

const STAFF_OPTIONS = [
  'Rahul Sharma (Waiter)',
  'Ananya Reddy (Shift Manager)',
  'Imran Khan (Counter Staff)',
  'Chef Arjun Rao (Head Chef)',
];

const isResolved = (issue) => issue.status === 'RESOLVED' || issue.status === 'CLOSED';

const IssueRow = ({ issue, onTakeAction, onView }) => {
  const unowned = !issue.assignedOwner || issue.assignedOwner === 'Unassigned';
  return (
    <div className={`rounded-xl shadow-sm p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
      issue.priority === 'HIGH' ? 'bg-rose-500/6' : 'bg-surface-container-low'
    }`}>
      <button onClick={() => onView(issue)} className="min-w-0 flex-1 text-left space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs font-extrabold text-on-surface">#{issue.issueId}</span>
          <span className="text-[11px] text-on-surface-variant">Table {issue.tableNumber} · Order #{issue.orderId?.replace('ORD-', '')}</span>
          <StatusBadge tone={issue.priority === 'HIGH' ? 'red' : 'amber'}>{issue.categoryLabel}</StatusBadge>
        </div>
        <p className="text-xs font-semibold text-on-surface">{issue.statusLabel || issue.status}</p>
        <div className="text-[11px] text-on-surface-variant flex flex-wrap gap-x-3">
          <span>Owner: <strong className={unowned ? 'text-amber-700' : 'text-on-surface'}>{issue.assignedOwner || 'Unassigned'}</strong></span>
          <span>Reported {issue.reportedAt}</span>
        </div>
      </button>

      <div className="shrink-0">
        {unowned ? (
          <ContextualButton variant="primary" size="sm" icon={Wrench} onClick={() => onTakeAction(issue)}>Assign Owner</ContextualButton>
        ) : (
          <ContextualButton variant="secondary" size="sm" onClick={() => onTakeAction(issue)}>Continue Resolution</ContextualButton>
        )}
      </div>
    </div>
  );
};

const ResolvedRow = ({ issue, onView }) => (
  <button
    onClick={() => onView(issue)}
    className="w-full text-left rounded-xl shadow-sm bg-surface-container-low/50 px-3.5 py-2.5 flex items-center justify-between gap-3"
  >
    <div className="min-w-0 flex items-center gap-2 text-xs">
      <span className="font-mono font-bold text-on-surface-variant">#{issue.issueId}</span>
      <span className="text-on-surface-variant">Table {issue.tableNumber}</span>
    </div>
    <StatusBadge tone="green">{issue.customerConfirmed ? 'Confirmed by customer' : 'Resolved'}</StatusBadge>
  </button>
);

const CustomerIssuesSection = ({ issues, onApplyAction, onViewIssue }) => {
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [assigneeName, setAssigneeName] = useState(STAFF_OPTIONS[0]);
  const [recoveryActionText, setRecoveryActionText] = useState('');
  const [showResolved, setShowResolved] = useState(false);

  const { unresolved, resolved, awaitingConfirmation } = useMemo(() => {
    const un = issues.filter((i) => !isResolved(i)).sort((a, b) => {
      const rank = { HIGH: 1, MEDIUM: 2, LOW: 3 };
      return (rank[a.priority] || 2) - (rank[b.priority] || 2);
    });
    const res = issues.filter(isResolved);
    const awaiting = un.filter((i) => i.recoveryAction && !i.customerConfirmed).length;
    return { unresolved: un, resolved: res, awaitingConfirmation: awaiting };
  }, [issues]);

  const openActionModal = (issue) => {
    setSelectedIssue(issue);
    setAssigneeName(issue.assignedOwner && issue.assignedOwner !== 'Unassigned' ? issue.assignedOwner : STAFF_OPTIONS[0]);
    setRecoveryActionText(issue.recoveryAction || '');
  };

  const handleSave = () => {
    if (!selectedIssue) return;
    onApplyAction(selectedIssue.issueId, {
      assignedOwner: assigneeName,
      status: 'ACTION_IN_PROGRESS',
      statusLabel: 'Action in progress',
      recoveryAction: recoveryActionText || 'Replacement being prepared by kitchen',
    });
    setSelectedIssue(null);
  };

  return (
    <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-2xl shadow-card">
      <SectionHeading
        title="Customer Issues"
        subtitle={`${unresolved.length} unresolved${awaitingConfirmation > 0 ? ` · ${awaitingConfirmation} awaiting customer confirmation` : ''}`}
      />

      {unresolved.length === 0 ? (
        <p className="text-xs text-on-surface-variant py-2">No open customer issues right now.</p>
      ) : (
        <div className="space-y-2.5">
          {unresolved.map((iss) => (
            <IssueRow key={iss.issueId} issue={iss} onTakeAction={openActionModal} onView={onViewIssue} />
          ))}
        </div>
      )}

      {resolved.length > 0 && (
        <div className="mt-4 pt-4 border-t border-outline-variant/15">
          <button
            onClick={() => setShowResolved((v) => !v)}
            className="text-xs font-bold text-primary flex items-center gap-1"
          >
            {showResolved ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            {showResolved ? 'Hide resolved issues' : `View resolved issues (${resolved.length})`}
          </button>
          {showResolved && (
            <div className="space-y-2 mt-3">
              {resolved.map((iss) => (
                <ResolvedRow key={iss.issueId} issue={iss} onView={onViewIssue} />
              ))}
            </div>
          )}
        </div>
      )}

      {selectedIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-surface rounded-2xl p-6 max-w-md w-full space-y-4 text-on-surface shadow-2xl">
            <div className="flex justify-between items-center border-b border-outline-variant/20 pb-3">
              <h3 className="font-bold text-base flex items-center gap-2 text-rose-700">
                <Wrench className="w-5 h-5" />
                Assign Owner &amp; Action
              </h3>
              <button onClick={() => setSelectedIssue(null)} className="p-1 text-on-surface-variant hover:text-on-surface">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs space-y-3">
              <p>Assign staff owner and recovery action for <strong>#{selectedIssue.issueId}</strong> (Table {selectedIssue.tableNumber}).</p>

              <div>
                <label className="block font-bold text-on-surface mb-1">Staff Owner</label>
                <select
                  value={assigneeName}
                  onChange={(e) => setAssigneeName(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/30 rounded-xl font-semibold outline-none"
                >
                  {STAFF_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block font-bold text-on-surface mb-1">Recovery Action</label>
                <textarea
                  rows={3}
                  value={recoveryActionText}
                  onChange={(e) => setRecoveryActionText(e.target.value)}
                  placeholder="e.g. Replacement Chicken Dum Biryani being prepared by kitchen. ETA 12 minutes."
                  className="w-full p-3 bg-surface-container-low border border-outline-variant/30 rounded-xl outline-none font-medium"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <ContextualButton variant="secondary" size="md" onClick={() => setSelectedIssue(null)}>Cancel</ContextualButton>
              <ContextualButton variant="primary" size="md" onClick={handleSave}>Save</ContextualButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerIssuesSection;

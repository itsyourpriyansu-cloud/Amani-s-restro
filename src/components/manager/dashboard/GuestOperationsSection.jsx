import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { StatusBadge, ContextualButton } from './DashboardPrimitives';

const TABS = [
  { value: 'FEEDBACK', label: 'Feedback' },
  { value: 'RELATIONSHIPS', label: 'Guest Relationships' },
  { value: 'COMMUNITY_CONTENT', label: 'Community Content' },
];

const RATING_LABELS = { food: 'Food Quality', service: 'Service', speed: 'Preparation Speed', cleanliness: 'Cleanliness', value: 'Value for Money' };
const ratingTone = (v) => (v <= 2 ? 'red' : v === 3 ? 'amber' : 'green');

const lowestRatingKey = (ratings = {}) => {
  const entries = Object.entries(ratings).filter(([k]) => RATING_LABELS[k]);
  if (entries.length === 0) return null;
  return entries.reduce((min, cur) => (cur[1] < min[1] ? cur : min), entries[0])[0];
};

const RatingChip = ({ label, value }) => (
  <div className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg bg-surface-container-low">
    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wide">{label}</span>
    <StatusBadge tone={ratingTone(value)}>{value}/5</StatusBadge>
  </div>
);

const FeedbackCard = ({ fdb, quiet, onView }) => {
  if (quiet) {
    return (
      <button
        onClick={() => onView(fdb)}
        className="w-full text-left flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl shadow-sm bg-surface-container-low/50"
      >
        <div className="flex items-center gap-2 text-xs min-w-0">
          <span className="font-bold text-primary">#{fdb.feedbackId}</span>
          <span className="text-on-surface-variant truncate">Table {fdb.tableNumber} · Order #{fdb.orderId}</span>
        </div>
        <StatusBadge tone="green">Positive · {fdb.status}</StatusBadge>
      </button>
    );
  }

  const concernKey = lowestRatingKey(fdb.ratings);

  return (
    <div className={`rounded-2xl shadow-card p-4 space-y-3 ${fdb.feedbackRoute === 'PRIVATE_MANAGER_REVIEW' ? 'bg-amber-500/6' : 'bg-surface'}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-primary">#{fdb.feedbackId}</span>
          <span className="text-on-surface-variant">Order #{fdb.orderId} · Table {fdb.tableNumber}</span>
        </div>
        {fdb.feedbackRoute === 'PRIVATE_MANAGER_REVIEW' && <StatusBadge tone="amber">Private Manager Review</StatusBadge>}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
        {Object.entries(RATING_LABELS).map(([key, label]) => (
          fdb.ratings?.[key] !== undefined && <RatingChip key={key} label={label} value={fdb.ratings[key]} />
        ))}
      </div>

      {concernKey && fdb.ratings[concernKey] <= 3 && (
        <div className="text-xs">
          <span className="text-on-surface-variant font-semibold">Primary concern: </span>
          <span className="font-bold text-rose-700">{RATING_LABELS[concernKey]}</span>
        </div>
      )}

      {fdb.comment && (
        <p className="text-xs italic text-on-surface bg-surface-container-lowest px-3 py-2 rounded-xl">
          &quot;{fdb.comment}&quot;
        </p>
      )}

      <div className="flex items-center justify-between pt-1 border-t border-outline-variant/15 text-[11px]">
        <span className="text-on-surface-variant">Status: <strong className="text-on-surface">{fdb.status}</strong></span>
        <ContextualButton variant="tertiary" size="sm" onClick={() => onView(fdb)}>View Feedback</ContextualButton>
      </div>
    </div>
  );
};

const FeedbackTab = ({ feedbacksList, onView }) => {
  const sorted = useMemo(() => {
    const quiet = (f) => f.status === 'Closed' || (f.feedbackRoute !== 'PRIVATE_MANAGER_REVIEW' && Object.values(f.ratings || {}).every((v) => v >= 4));
    return [...feedbacksList].sort((a, b) => Number(quiet(a)) - Number(quiet(b)));
  }, [feedbacksList]);

  return (
    <div className="space-y-2.5">
      {sorted.map((fdb) => {
        const quiet = fdb.status === 'Closed' || (fdb.feedbackRoute !== 'PRIVATE_MANAGER_REVIEW' && Object.values(fdb.ratings || {}).every((v) => v >= 4));
        return <FeedbackCard key={fdb.feedbackId} fdb={fdb} quiet={quiet} onView={onView} />;
      })}
    </div>
  );
};

const RelationshipsTab = ({ customerMembership }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <div className="p-4 rounded-2xl bg-amber-500/8 shadow-card space-y-1 text-xs">
        <span className="font-bold text-amber-900 uppercase tracking-wider block text-[10px]">Community Status</span>
        <p className="text-base font-bold text-primary">{customerMembership?.statusLevel || 'Regular Guest'}</p>
        <p className="text-on-surface-variant">{customerMembership?.statusEarnedReason || 'Recognized after 5 completed visits.'}</p>
      </div>
      <div className="p-4 rounded-2xl bg-surface-container-low shadow-card space-y-1 text-xs">
        <span className="font-bold text-primary uppercase tracking-wider block text-[10px]">Upcoming Celebration</span>
        <p className="font-bold text-on-surface">
          {customerMembership?.celebrationPreferences?.occasionType || 'Birthday'} · Day {customerMembership?.celebrationPreferences?.day || 14}/08
        </p>
        <p className="text-on-surface-variant italic">&quot;{customerMembership?.celebrationPreferences?.guestNote || 'Window bay table preferred'}&quot;</p>
      </div>
      <div className="p-4 rounded-2xl bg-surface-container-low shadow-card space-y-1 text-xs">
        <span className="font-bold text-primary uppercase tracking-wider block text-[10px]">Favourite Dish Alerts</span>
        {(customerMembership?.favouriteDishAlerts || [
          { dishName: 'Chicken Dum Biryani', preferenceChannel: 'In-app' },
          { dishName: 'Sweet Lassi', preferenceChannel: 'In-app' },
        ]).map((al, idx) => (
          <div key={idx} className="flex justify-between text-[11px]">
            <span className="font-medium text-on-surface">{al.dishName}</span>
            <span className="font-bold text-secondary">{al.preferenceChannel}</span>
          </div>
        ))}
      </div>
    </div>

    <div className="p-4 bg-surface rounded-2xl shadow-card space-y-2 text-xs">
      <h4 className="font-bold text-primary uppercase tracking-wider text-[10px]">Active Hospitality Benefits</h4>
      {(customerMembership?.activeHospitalityBenefits || []).map((ben) => (
        <div key={ben.benefitId} className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low">
          <div>
            <span className="font-bold text-on-surface">{ben.title}</span>
            <p className="text-[11px] text-on-surface-variant">{ben.description}</p>
          </div>
          <StatusBadge tone={ben.status === 'Redeemed' ? 'green' : 'amber'}>{ben.status}</StatusBadge>
        </div>
      ))}
    </div>
  </div>
);

const CommunityTab = ({ ugcSubmissions, removalRequests, onMockRepost, onUpdateRemovalRequestStatus }) => (
  <div className="space-y-5">
    <div className="space-y-2.5">
      <h4 className="text-[11px] font-bold text-primary uppercase tracking-wider">Content Permissions ({ugcSubmissions.length})</h4>
      {ugcSubmissions.map((ugc) => {
        const repostAllowed = ugc.permissions?.restaurantRepostAllowed === true;
        return (
          <div key={ugc.participationId} className="p-3.5 rounded-2xl bg-surface shadow-card text-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-primary">#{ugc.participationId} · {ugc.dishName}</span>
              <span className="text-[11px] text-on-surface-variant">{ugc.permissionGrantedAt}</span>
            </div>
            <div className="flex gap-3 items-center">
              <img src={ugc.mediaPreview} alt="Customer upload preview" className="w-14 h-14 rounded-xl object-cover border border-outline-variant shrink-0" />
              <p className="font-semibold text-on-surface line-clamp-2">&quot;{ugc.captionText}&quot;</p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-outline-variant/15">
              <StatusBadge tone={repostAllowed ? 'green' : 'red'}>{repostAllowed ? 'Repost permitted' : 'Repost not permitted'}</StatusBadge>
              {repostAllowed && (
                <ContextualButton variant="secondary" size="sm" onClick={() => onMockRepost(ugc.participationId)}>Mock Repost</ContextualButton>
              )}
            </div>
          </div>
        );
      })}
    </div>

    <div className="space-y-2.5">
      <h4 className="text-[11px] font-bold text-primary uppercase tracking-wider">Removal Requests ({removalRequests.length})</h4>
      {removalRequests.map((req) => (
        <div key={req.requestId} className="p-3.5 rounded-2xl bg-surface shadow-card text-xs space-y-2">
          <div className="flex justify-between items-center font-bold text-on-surface">
            <span>#{req.requestId} · {req.requestReasonLabel}</span>
            <select
              value={req.status}
              onChange={(e) => onUpdateRemovalRequestStatus(req.requestId, e.target.value)}
              className="px-2 py-1 bg-surface-container-low border border-outline-variant/30 rounded-lg text-[11px] font-bold"
            >
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="Removed">Removed</option>
              <option value="Clarification Needed">Clarification Needed</option>
            </select>
          </div>
          <p className="text-on-surface-variant">{req.details || 'Customer requested permission withdrawal.'}</p>
        </div>
      ))}
    </div>
  </div>
);

const GuestOperationsSection = ({ feedbacksList, ugcSubmissions, removalRequests, customerMembership, onViewFeedback, onMockRepost, onUpdateRemovalRequestStatus }) => {
  const [expanded, setExpanded] = useState(false);
  const [tab, setTab] = useState('FEEDBACK');

  const feedbackNeedingReview = feedbacksList.filter((f) => f.feedbackRoute === 'PRIVATE_MANAGER_REVIEW' && f.status !== 'Closed').length;

  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-card">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between gap-3 px-5 sm:px-6 py-4 text-left"
      >
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-primary" />
          <div>
            <h3 className="text-sm font-bold text-on-surface">Guest &amp; Feedback Operations</h3>
            <p className="text-[11px] text-on-surface-variant">
              {feedbackNeedingReview > 0 ? `${feedbackNeedingReview} feedback item${feedbackNeedingReview === 1 ? '' : 's'} ${feedbackNeedingReview === 1 ? 'requires' : 'require'} review` : 'No feedback requires review'}
            </p>
          </div>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-on-surface-variant shrink-0" /> : <ChevronDown className="w-4 h-4 text-on-surface-variant shrink-0" />}
      </button>

      {expanded && (
        <div className="px-5 sm:px-6 pb-6">
          <div className="flex flex-wrap gap-1.5 mb-4 border-t border-outline-variant/15 pt-4">
            {TABS.map((t) => (
              <button
                key={t.value}
                onClick={() => setTab(t.value)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors ${
                  tab === t.value ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === 'FEEDBACK' && <FeedbackTab feedbacksList={feedbacksList} onView={onViewFeedback} />}
          {tab === 'RELATIONSHIPS' && <RelationshipsTab customerMembership={customerMembership} />}
          {tab === 'COMMUNITY_CONTENT' && (
            <CommunityTab
              ugcSubmissions={ugcSubmissions}
              removalRequests={removalRequests}
              onMockRepost={onMockRepost}
              onUpdateRemovalRequestStatus={onUpdateRemovalRequestStatus}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default GuestOperationsSection;

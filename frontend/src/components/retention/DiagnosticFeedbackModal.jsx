import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '../common/Modal';
import Icon from '../common/Icon';
import { useOrder } from '../../context/OrderContext';
import { useToast } from '../../context/ToastContext';
import { ShieldCheck, MessageSquare, CheckCircle, ArrowRight, CornerDownRight } from 'lucide-react';

const RATING_CATEGORIES = [
  { key: 'food', label: 'Food Quality & Flavor', icon: 'utensils' },
  { key: 'service', label: 'Waiter & Floor Service', icon: 'user_check' },
  { key: 'speed', label: 'Preparation & Delivery Speed', icon: 'timer' },
  { key: 'cleanliness', label: 'Cleanliness & Hygiene', icon: 'sparkles' },
  { key: 'value', label: 'Overall Value for Money', icon: 'receipt' },
];

const SCALE_LABELS = {
  1: 'Very Poor',
  2: 'Poor',
  3: 'Okay',
  4: 'Good',
  5: 'Excellent',
};

const IMPROVEMENT_OPTIONS = [
  { key: 'FOOD_TASTE', label: 'Food Taste' },
  { key: 'FOOD_TEMP', label: 'Food Temperature' },
  { key: 'PORTION_SIZE', label: 'Portion Size' },
  { key: 'PREPARATION_SPEED', label: 'Preparation Speed' },
  { key: 'WAITER_SERVICE', label: 'Waiter Service' },
  { key: 'CLEANLINESS', label: 'Cleanliness' },
  { key: 'BILLING', label: 'Billing' },
  { key: 'VALUE', label: 'Value' },
  { key: 'OTHER', label: 'Other' },
];

const DiagnosticFeedbackModal = ({ isOpen, onClose, order }) => {
  const { addDiagnosticFeedback } = useOrder();
  const { showToast } = useToast();

  const [step, setStep] = useState('DIAGNOSTIC_FORM'); // DIAGNOSTIC_FORM -> SUBMITTED_NOTICE -> PUBLIC_REVIEW_CHOICE
  const [ratings, setRatings] = useState({
    food: 4,
    service: 4,
    speed: 3,
    cleanliness: 5,
    value: 4,
  });
  const [memorableDishId, setMemorableDishId] = useState(order?.items?.[0]?.dishId || 'biryani-chicken-dum');
  const [selectedImprovementCategories, setSelectedImprovementCategories] = useState([]);
  const [comment, setComment] = useState('');
  const [submittedRecord, setSubmittedRecord] = useState(null);
  const [publicReviewSubmitted, setPublicReviewSubmitted] = useState(false);

  // Available dishes from completed order ONLY
  const orderDishes = order?.items || [
    { dishId: 'biryani-chicken-dum', name: 'Chicken Dum Biryani', unitPrice: 250 },
    { dishId: 'drink-sweet-lassi', name: 'Sweet Lassi', unitPrice: 100 },
  ];

  const handleRatingChange = (category, value) => {
    setRatings((prev) => ({ ...prev, [category]: value }));
  };

  const toggleImprovementCategory = (key) => {
    setSelectedImprovementCategories((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const isNegative =
    Object.values(ratings).some((r) => r <= 2) ||
    selectedImprovementCategories.includes('BILLING') ||
    comment.toLowerCase().includes('allergy') ||
    comment.toLowerCase().includes('hair') ||
    comment.toLowerCase().includes('cold');

  const handleSubmitDiagnostic = (e) => {
    e.preventDefault();
    const selectedDishObj = orderDishes.find((d) => d.dishId === memorableDishId);
    const feedbackRoute = isNegative ? 'PRIVATE_MANAGER_REVIEW' : 'STANDARD_LOG';

    const feedbackPayload = {
      orderId: order?.orderId || 'ORD-1048',
      billId: order?.billId || 'BILL-1048',
      tableNumber: order?.tableNumber || '08',
      ratings,
      memorableDishId,
      memorableDishName: selectedDishObj?.name || 'Chicken Dum Biryani',
      improvementCategories: selectedImprovementCategories,
      improvementCategoriesLabels: selectedImprovementCategories.map(
        (k) => IMPROVEMENT_OPTIONS.find((o) => o.key === k)?.label || k
      ),
      comment,
      feedbackRoute,
      routeReason: isNegative
        ? 'Category rating <= 2 or service issue requiring private operational manager review.'
        : 'Positive diagnostic rating recorded.',
      assignedManager: 'Ananya Reddy (Shift Manager)',
    };

    const record = addDiagnosticFeedback(feedbackPayload);
    setSubmittedRecord(record);
    setStep('SUBMITTED_NOTICE');
    showToast('Feedback submitted to restaurant operations.', 'success');
  };

  const handlePublicReviewAction = (choice) => {
    if (choice === 'PUBLISH') {
      setPublicReviewSubmitted(true);
      showToast('Thank you! Your verified public review choice has been recorded.', 'success');
    } else {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Help Us Improve Your Experience">
      <div className="space-y-4 text-left">
        {step === 'DIAGNOSTIC_FORM' && (
          <form onSubmit={handleSubmitDiagnostic} className="space-y-5">
            {/* Header info */}
            <div className="flex items-center justify-between bg-surface-container-low p-3 rounded-xl border border-outline-variant/30">
              <div>
                <p className="text-xs font-semibold text-on-surface">A short operational review based on your completed visit</p>
                <p className="text-[11px] text-on-surface-variant">Order #{order?.orderId || 'ORD-1048'} · Table {order?.tableNumber || '08'}</p>
              </div>
              <span className="text-[11px] font-bold text-secondary bg-secondary-container/30 px-2.5 py-1 rounded-full shrink-0">
                About 30 seconds
              </span>
            </div>

            {/* Ratings Section */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Diagnostic Category Ratings</h4>
              {RATING_CATEGORIES.map(({ key, label }) => (
                <div key={key} className="bg-surface p-3 rounded-xl border border-outline-variant/30 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-on-surface">{label}</span>
                    <span className="font-bold text-primary text-[11px]">
                      {SCALE_LABELS[ratings[key]]} ({ratings[key]}/5)
                    </span>
                  </div>
                  <div className="flex justify-between gap-1">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => handleRatingChange(key, val)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          ratings[key] === val
                            ? 'bg-primary text-on-primary shadow-sm scale-105'
                            : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
                        }`}
                        aria-label={`${label} - ${SCALE_LABELS[val]}`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Memorable Dish Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-primary uppercase tracking-wider block">
                Which dish was most memorable?
              </label>
              <p className="text-[11px] text-on-surface-variant">Select from dishes in your completed order:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {orderDishes.map((dish) => (
                  <button
                    key={dish.dishId}
                    type="button"
                    onClick={() => setMemorableDishId(dish.dishId)}
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between text-xs transition-all ${
                      memorableDishId === dish.dishId
                        ? 'border-primary bg-primary-container/20 font-bold text-primary'
                        : 'border-outline-variant/40 bg-surface hover:bg-surface-container-low text-on-surface'
                    }`}
                  >
                    <span>{dish.name}</span>
                    {memorableDishId === dish.dishId && <Icon name="check_circle" className="text-primary text-sm" filled />}
                  </button>
                ))}
              </div>
            </div>

            {/* Improvement Categories */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-primary uppercase tracking-wider block">
                What should improve? (Optional)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {IMPROVEMENT_OPTIONS.map((opt) => {
                  const isSelected = selectedImprovementCategories.includes(opt.key);
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => toggleImprovementCategory(opt.key)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-warning text-on-warning font-bold shadow-sm'
                          : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Detailed Comment */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-primary uppercase tracking-wider block">
                Operational Notes & Comments
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us what worked well or what we can fix next time..."
                rows={3}
                className="w-full text-xs p-3 rounded-xl border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Submit & Equal Weight Cancel Action */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-semibold text-xs rounded-xl transition-colors"
              >
                Not Now
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs rounded-xl shadow transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Submit Feedback</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Submission Routing Notice */}
        {step === 'SUBMITTED_NOTICE' && (
          <div className="space-y-5 py-2">
            <div className="p-4 rounded-2xl bg-success/10 border border-success/30 space-y-2">
              <div className="flex items-center gap-2 text-success font-bold text-sm">
                <CheckCircle className="w-5 h-5 text-success" />
                Thank you for telling us!
              </div>
              <p className="text-xs text-on-background/90 leading-relaxed">
                {isNegative
                  ? 'A restaurant manager will review your notes privately so the team can respond appropriately and improve operational quality.'
                  : 'Your operational ratings have been recorded to help our kitchen and floor teams maintain high standards.'}
              </p>
            </div>

            {/* Negative Feedback Manager Routing Card */}
            {isNegative && (
              <div className="p-3.5 bg-warning/10 rounded-xl border border-warning/30 space-y-1.5 text-xs text-on-background">
                <div className="flex items-center gap-2 font-bold text-warning">
                  <ShieldCheck className="w-4 h-4 text-warning" />
                  Private Manager Review Assigned
                </div>
                <p className="text-[11px] text-warning">
                  Feedback ID: <span className="font-mono font-bold">{submittedRecord?.feedbackId}</span> assigned to Shift Manager Ananya Reddy for private follow-up.
                </p>
              </div>
            )}

            {/* Step 3: Public Review Choice */}
            <div className="p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 space-y-3">
              <div className="space-y-1">
                <h4 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-secondary" />
                  Share an Honest Public Review
                </h4>
                <p className="text-xs text-on-surface-variant">
                  You may share your experience publicly whether it was positive, mixed, or negative.
                </p>
              </div>

              {!publicReviewSubmitted ? (
                <div className="space-y-2 pt-1">
                  <button
                    onClick={() => handlePublicReviewAction('PUBLISH')}
                    className="w-full py-2.5 bg-secondary text-on-secondary font-bold text-xs rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Icon name="rate_review" className="text-sm" />
                    Write Public Review
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePublicReviewAction('KEEP_PRIVATE')}
                      className="flex-1 py-2 bg-surface-container-high text-on-surface font-semibold text-xs rounded-xl hover:bg-surface-container-highest"
                    >
                      Keep Feedback Private
                    </button>
                    <button
                      onClick={onClose}
                      className="flex-1 py-2 border border-outline text-on-surface font-medium text-xs rounded-xl hover:bg-surface-container-low"
                    >
                      Not Now
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-success/10 rounded-xl border border-success/30 text-xs text-success space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-success">
                    <CheckCircle className="w-4 h-4 text-success" />
                    Public Review Published with Verification Badge
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="bg-success text-on-success px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                      Verified completed order
                    </span>
                    <span className="text-[11px] text-success">Linked to Order #{order?.orderId || 'ORD-1048'}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                onClick={onClose}
                className="w-full py-3 bg-primary text-on-primary font-bold text-xs rounded-xl shadow hover:bg-primary/90 transition-colors"
              >
                Close Feedback Flow
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default DiagnosticFeedbackModal;

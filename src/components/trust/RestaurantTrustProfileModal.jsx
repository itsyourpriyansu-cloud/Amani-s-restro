import React, { useState } from 'react';
import { RESTAURANT_TRUST_PROFILE, VERIFIED_CUSTOMER_PHOTOS, VERIFIED_CUSTOMER_REVIEWS } from '../../data/restaurantPrototypeData';
import Icon from '../common/Icon';

const RestaurantTrustProfileModal = ({ isOpen, onClose, onRequestAssistance }) => {
  const [showFullStory, setShowFullStory] = useState(false);
  const [showCalculationModal, setShowCalculationModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'hygiene_safety', 'reviews_photos'

  if (!isOpen) return null;

  const profile = RESTAURANT_TRUST_PROFILE;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-surface border border-outline-variant/30 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden text-on-surface">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-surface-container-high border-b border-outline-variant/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              <Icon name="verified_user" className="text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-on-surface">{profile.restaurantName}</h3>
              <p className="text-xs text-on-surface-variant">Restaurant Trust Profile & Standards</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-highest transition-colors"
            aria-label="Close Trust Profile"
          >
            <Icon name="close" className="text-lg" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 bg-surface-container-low border-b border-outline-variant/10 flex gap-2 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-primary text-primary font-bold'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Icon name="restaurant" className="text-sm" />
            <span>Kitchen & Sourcing</span>
          </button>
          <button
            onClick={() => setActiveTab('hygiene_safety')}
            className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'hygiene_safety'
                ? 'border-primary text-primary font-bold'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Icon name="sanitizer" className="text-sm" />
            <span>Hygiene, Allergy & Licences</span>
          </button>
          <button
            onClick={() => setActiveTab('reviews_photos')}
            className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'reviews_photos'
                ? 'border-primary text-primary font-bold'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Icon name="photo_camera" className="text-sm" />
            <span>Verified Photos & Reviews</span>
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {activeTab === 'overview' && (
            <>
              {/* Section 1: Our Kitchen */}
              <section className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/20">
                <h4 className="font-bold text-on-surface mb-1 flex items-center gap-2 text-base">
                  <Icon name="soup_kitchen" className="text-primary" />
                  1. Our Kitchen
                </h4>
                <p className="text-on-surface-variant leading-relaxed">{profile.shortKitchenIntroduction}</p>
              </section>

              {/* Section 2: Chef & Team */}
              <section className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/20">
                <div className="flex items-start gap-4">
                  <img
                    src={profile.chefProfile.image}
                    alt={profile.chefProfile.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
                  />
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between">
                      <h4 className="font-bold text-on-surface text-base">{profile.chefProfile.name}</h4>
                      <span className="text-xs bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full">
                        {profile.chefProfile.role}
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant font-medium mt-0.5">{profile.chefProfile.experienceLabel}</p>
                    <p className="text-xs italic text-on-surface/80 mt-1">"{profile.chefProfile.philosophy}"</p>

                    {!showFullStory ? (
                      <button
                        onClick={() => setShowFullStory(true)}
                        className="text-xs font-bold text-primary hover:underline mt-2 flex items-center gap-1"
                      >
                        Read the kitchen story
                        <Icon name="expand_more" className="text-sm" />
                      </button>
                    ) : (
                      <div className="mt-3 pt-3 border-t border-outline-variant/20 space-y-2 text-xs">
                        <p className="text-on-surface-variant leading-relaxed">{profile.chefProfile.story}</p>
                        <p className="text-on-surface font-semibold">Speciality: {profile.chefProfile.speciality}</p>
                        <button
                          onClick={() => setShowFullStory(false)}
                          className="text-xs font-bold text-primary hover:underline mt-1 flex items-center gap-1"
                        >
                          Show less
                          <Icon name="expand_less" className="text-sm" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Section 3: Ingredient Sourcing */}
              <section className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/20">
                <h4 className="font-bold text-on-surface mb-3 flex items-center gap-2 text-base">
                  <Icon name="eco" className="text-emerald-600" />
                  3. Ingredient Sourcing
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {profile.ingredientSourcing.map((src, idx) => (
                    <div key={idx} className="bg-surface-container-low p-3 rounded-lg border border-outline-variant/10">
                      <p className="font-bold text-xs text-on-surface">{src.label}</p>
                      <p className="text-xs text-on-surface-variant mt-1 leading-snug">{src.description}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Section 7 & 8: Service Promise & Preparation Reliability */}
              <section className="bg-primary/5 p-4 rounded-xl border border-primary/20 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-on-surface flex items-center gap-2 text-base">
                    <Icon name="timer" className="text-primary" />
                    Preparation Reliability & Service Promise
                  </h4>
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                    {profile.preparationAccuracy.value}% Prep Accuracy
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant">{profile.servicePromise.description}</p>
                <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="font-semibold text-on-surface">{profile.preparationAccuracy.label}</span>
                    <p className="text-on-surface-variant/80 text-[11px]">
                      Based on {profile.preparationAccuracy.sampleSize} completed orders ({profile.preparationAccuracy.period}).
                    </p>
                  </div>
                  <button
                    onClick={() => setShowCalculationModal(true)}
                    className="text-xs text-primary font-bold hover:underline whitespace-nowrap flex items-center gap-1"
                  >
                    How this is calculated
                    <Icon name="help_outline" className="text-sm" />
                  </button>
                </div>
              </section>
            </>
          )}

          {activeTab === 'hygiene_safety' && (
            <>
              {/* Section 4: Hygiene and Safety */}
              <section className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/20 space-y-3">
                <h4 className="font-bold text-on-surface flex items-center gap-2 text-base">
                  <Icon name="sanitizer" className="text-blue-600" />
                  4. Hygiene and Safety
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                  <div className="bg-surface-container-low p-2.5 rounded-lg">
                    <span className="text-on-surface-variant font-medium block">Last review date</span>
                    <span className="font-bold text-on-surface text-sm">{profile.hygieneAudit.lastAuditDate}</span>
                  </div>
                  <div className="bg-surface-container-low p-2.5 rounded-lg">
                    <span className="text-on-surface-variant font-medium block">Review type</span>
                    <span className="font-bold text-on-surface text-sm">{profile.hygieneAudit.auditType}</span>
                  </div>
                  <div className="bg-surface-container-low p-2.5 rounded-lg col-span-2 md:col-span-1">
                    <span className="text-on-surface-variant font-medium block">Next scheduled review</span>
                    <span className="font-bold text-on-surface text-sm">{profile.hygieneAudit.nextReviewDate}</span>
                  </div>
                </div>
                <p className="text-[11px] text-on-surface-variant/70 italic">
                  Note: Distinguishes internal restaurant review protocols from third-party audits.
                </p>
              </section>

              {/* Section 5: Dietary Practices & Kitchen Separation */}
              <section className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/20 space-y-2">
                <h4 className="font-bold text-on-surface flex items-center gap-2 text-base">
                  <Icon name="kitchen" className="text-amber-600" />
                  5. Kitchen Preparation & Dietary Separation
                </h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">{profile.kitchenSeparation.description}</p>
                <div className="flex gap-2 pt-1">
                  <span className="bg-emerald-500/10 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-md flex items-center gap-1">
                    <Icon name="check_circle" className="text-sm" /> Veg Preparation Area
                  </span>
                  <span className="bg-amber-500/10 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-md flex items-center gap-1">
                    <Icon name="check_circle" className="text-sm" /> Labelled Equipment
                  </span>
                </div>
              </section>

              {/* Section 6: Allergy-Handling Policy */}
              <section className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-xl border border-amber-200 dark:border-amber-800/40 space-y-3">
                <h4 className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-2 text-base">
                  <Icon name="warning" className="text-amber-600" />
                  6. Allergy-Handling Policy
                </h4>
                <p className="text-xs text-amber-900/90 dark:text-amber-300 leading-relaxed font-medium">
                  {profile.allergyPolicy.summary}
                </p>
                <div className="p-2.5 bg-amber-100/60 dark:bg-amber-900/40 rounded-lg text-xs text-amber-950 dark:text-amber-200 border border-amber-300/50">
                  <strong>Notice:</strong> {profile.allergyPolicy.crossContactWarning}
                </div>
                {onRequestAssistance && (
                  <button
                    onClick={() => {
                      onClose();
                      onRequestAssistance('Allergy assistance');
                    }}
                    className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs shadow transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Icon name="support_agent" className="text-base" />
                    Speak to staff about an allergy
                  </button>
                )}
              </section>

              {/* Section 11: Restaurant Licences */}
              <section className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/20 space-y-2">
                <h4 className="font-bold text-on-surface flex items-center gap-2 text-base">
                  <Icon name="badge" className="text-primary" />
                  11. Restaurant Licences & Registration
                </h4>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-surface-container-low rounded-lg border border-outline-variant/10 gap-2">
                  <div>
                    <span className="text-xs font-bold text-on-surface block">FSSAI Licence / Registration</span>
                    <span className="font-mono font-bold text-sm text-primary tracking-wide">{profile.fssai.number}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-on-surface-variant bg-surface-container px-2.5 py-1 rounded-full w-fit">
                    {profile.fssai.statusLabel}
                  </span>
                </div>
              </section>
            </>
          )}

          {activeTab === 'reviews_photos' && (
            <>
              {/* Section 9: Verified Customer Photos */}
              <section className="space-y-3">
                <h4 className="font-bold text-on-surface flex items-center gap-2 text-base">
                  <Icon name="photo_library" className="text-primary" />
                  9. Verified Customer Photos
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {VERIFIED_CUSTOMER_PHOTOS.map((photo) => (
                    <div key={photo.photoId} className="bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/20 shadow-sm">
                      <img src={photo.image} alt={photo.caption} className="w-full h-36 object-cover" />
                      <div className="p-3">
                        <div className="flex items-center justify-between">
                          <span className="bg-emerald-500/10 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Icon name="check_circle" className="text-[12px]" /> Verified order photo
                          </span>
                          <span className="text-[10px] text-on-surface-variant">{photo.submittedAt}</span>
                        </div>
                        <p className="text-xs font-semibold text-on-surface mt-1">{photo.caption}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Section 10: Verified Reviews */}
              <section className="space-y-3 pt-2">
                <h4 className="font-bold text-on-surface flex items-center gap-2 text-base">
                  <Icon name="rate_review" className="text-primary" />
                  10. Verified Customer Reviews
                </h4>
                <div className="space-y-3">
                  {VERIFIED_CUSTOMER_REVIEWS.map((rev) => (
                    <div key={rev.reviewId} className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/20 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-amber-500">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Icon name="star" key={i} className="text-sm fill-current" />
                          ))}
                        </div>
                        <span className="bg-emerald-500/10 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Icon name="verified" className="text-[12px]" /> Verified completed order
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant italic">"{rev.reviewText}"</p>
                      <div className="flex items-center justify-between text-[10px] text-on-surface-variant/70 pt-1 border-t border-outline-variant/10">
                        <span>{rev.displayName}</span>
                        <span>{rev.submittedAt}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-surface-container-high border-t border-outline-variant/20 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-primary text-on-primary font-bold text-xs rounded-xl shadow hover:bg-primary/90 transition-colors"
          >
            Close Trust Profile
          </button>
        </div>
      </div>

      {/* Preparation Accuracy Calculation Explanation Sub-Modal */}
      {showCalculationModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-surface p-6 rounded-2xl max-w-md w-full border border-outline-variant/30 space-y-4 text-on-surface shadow-2xl">
            <div className="flex justify-between items-center border-b border-outline-variant/20 pb-3">
              <h4 className="font-bold text-base flex items-center gap-2 text-primary">
                <Icon name="analytics" />
                How Preparation Accuracy Is Calculated
              </h4>
              <button
                onClick={() => setShowCalculationModal(false)}
                className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-highest"
              >
                <Icon name="close" className="text-sm" />
              </button>
            </div>
            <div className="text-xs space-y-2 text-on-surface-variant leading-relaxed">
              <p>{profile.preparationAccuracy.calculationExplanation}</p>
              <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant/10 space-y-1">
                <p className="font-semibold text-on-surface">Metric Audit Parameters:</p>
                <p>• Measurement Period: <strong>{profile.preparationAccuracy.period}</strong></p>
                <p>• Total Sample Size: <strong>{profile.preparationAccuracy.sampleSize} verified orders</strong></p>
                <p>• Last Updated: <strong>{profile.preparationAccuracy.lastUpdated}</strong></p>
              </div>
            </div>
            <button
              onClick={() => setShowCalculationModal(false)}
              className="w-full py-2 bg-primary text-on-primary rounded-xl font-bold text-xs"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantTrustProfileModal;

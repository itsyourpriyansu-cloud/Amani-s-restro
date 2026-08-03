import React, { useState, useRef } from 'react';
import Modal from '../common/Modal';
import Icon from '../common/Icon';
import { useOrder } from '../../context/OrderContext';
import { useToast } from '../../context/ToastContext';
import { SIGNATURE_DISH_STORIES } from '../../data/restaurantPrototypeData';
import { Play, Pause, VolumeX, ShieldCheck, Upload, Share2, Info, Check, Eye } from 'lucide-react';

const SignatureDishStoryModal = ({ isOpen, onClose, dish }) => {
  const { addUgcSubmission } = useOrder();
  const { showToast } = useToast();

  const dishStoryData = SIGNATURE_DISH_STORIES[dish?.id] || SIGNATURE_DISH_STORIES['biryani-chicken-dum'];
  const socialStory = dishStoryData?.socialStory;

  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [activeTab, setActiveTab] = useState('WATCH_STORY'); // 'WATCH_STORY', 'CREATE_MOMENT'

  // Prepared Social Template State
  const [templateText, setTemplateText] = useState(
    socialStory?.suggestedStoryTemplate || `Trying the signature ${dish?.name || 'Chicken Dum Biryani'} at Amani's Kitchen.`
  );
  const [includeTag, setIncludeTag] = useState(true);
  const [includeLocation, setIncludeLocation] = useState(true);
  const [optionalHandle, setOptionalHandle] = useState('');

  // Customer Media Upload State (Mock preview)
  const [uploadedMediaPreview, setUploadedMediaPreview] = useState(null);

  // Separate Permission Checkboxes
  const [permissions, setPermissions] = useState({
    submittedForParticipation: true,
    restaurantRepostAllowed: false, // Explicitly UNCHECKED BY DEFAULT!
    inAppGalleryAllowed: true,
    displayNameAllowed: false,
  });

  const [showRewardConditions, setShowRewardConditions] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleMediaUploadMock = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedMediaPreview(url);
      showToast('Photo/video preview loaded!', 'info');
    } else {
      // Mock fallback preview image
      setUploadedMediaPreview('https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80');
      showToast('Mock media preview loaded!', 'info');
    }
  };

  const handleSubmitParticipation = (e) => {
    e.preventDefault();

    const submissionPayload = {
      orderId: 'ORD-1048',
      dishId: dish?.id || 'biryani-chicken-dum',
      dishName: dish?.name || 'Chicken Dum Biryani',
      mediaType: uploadedMediaPreview ? 'CUSTOMER_MEDIA' : 'STORY_TEMPLATE',
      mediaPreview: uploadedMediaPreview || dish?.image || 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80',
      captionText: templateText,
      restaurantTag: includeTag ? (socialStory?.restaurantTag || '@AmanisKitchen') : null,
      locationLabel: includeLocation ? (socialStory?.locationLabel || 'Hyderabad, Telangana') : null,
      socialHandle: optionalHandle ? `@${optionalHandle.replace('@', '')}` : null,
      permissions,
      rewardConditionsAccepted: true,
      displayName: permissions.displayNameAllowed ? 'Priya R.' : 'Verified Guest',
    };

    addUgcSubmission(submissionPayload);
    showToast('Participation content submitted with your privacy preferences!', 'success');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={dish?.name ? `${dish.name} - Dish Story` : 'Signature Dish Story'}>
      <div className="space-y-4 text-left max-h-[75vh] overflow-y-auto pr-1">
        {/* Navigation Switcher */}
        <div className="flex bg-surface-container-high p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('WATCH_STORY')}
            className={`flex-1 py-2 rounded-lg transition-all ${
              activeTab === 'WATCH_STORY'
                ? 'bg-surface text-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Watch How It Is Made
          </button>
          <button
            onClick={() => setActiveTab('CREATE_MOMENT')}
            className={`flex-1 py-2 rounded-lg transition-all ${
              activeTab === 'CREATE_MOMENT'
                ? 'bg-surface text-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Share Dish Moment
          </button>
        </div>

        {/* Tab 1: Watch How It Is Made (Video + Origin) */}
        {activeTab === 'WATCH_STORY' && (
          <div className="space-y-4">
            {/* 8-12 second vertical video container */}
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-[9/16] max-w-[260px] mx-auto shadow-xl group">
              <video
                ref={videoRef}
                src={socialStory?.verticalVideo || 'https://assets.mixkit.co/videos/preview/mixkit-chef-cooking-food-in-a-pan-43407-large.mp4'}
                muted={isMuted}
                loop
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 flex flex-col justify-between p-3">
                <div className="flex justify-between items-center text-white">
                  <span className="text-[10px] font-bold bg-primary/80 backdrop-blur px-2 py-0.5 rounded-full">
                    {socialStory?.videoDurationSeconds || 10}s Preparation Story
                  </span>
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="w-7 h-7 rounded-full bg-black/50 backdrop-blur flex items-center justify-center text-white text-xs"
                    aria-label="Mute toggle"
                  >
                    <VolumeX className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex justify-center my-auto">
                  <button
                    onClick={togglePlay}
                    className="w-12 h-12 rounded-full bg-white/30 backdrop-blur hover:bg-white/50 text-white flex items-center justify-center transition-transform hover:scale-110 shadow-lg"
                  >
                    {isPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white ml-0.5" />}
                  </button>
                </div>

                <div className="text-white text-left space-y-0.5">
                  <p className="text-xs font-bold">{dish?.name || 'Chicken Dum Biryani'}</p>
                  <p className="text-[10px] text-white/80 line-clamp-2">
                    {socialStory?.chefNote || 'Cooked to order with fresh hand-ground spices.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Structured Origin & Ingredient Sections */}
            <div className="space-y-3 pt-1">
              <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-1">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Dish Origin</h4>
                <p className="text-xs text-on-surface leading-relaxed">
                  {socialStory?.origin ||
                    'A regional Andhra classic, Chicken Dum Biryani is layered rice and spiced chicken sealed and slow-cooked over a low flame for deep, even flavour.'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-1">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Chef Note & Ingredient Story</h4>
                <p className="text-xs text-on-surface leading-relaxed">
                  <strong className="text-primary">Chef Note:</strong> {socialStory?.chefNote || 'Best enjoyed immediately while crisp.'}
                </p>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  <strong className="text-primary">Ingredients:</strong> {socialStory?.ingredientStory || 'Long-grain rice and hand-ground biryani masala prepared in controlled batches.'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('CREATE_MOMENT')}
              className="w-full py-3 bg-primary text-on-primary font-bold text-xs rounded-xl shadow hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              <span>Share a Dish Moment</span>
            </button>
          </div>
        )}

        {/* Tab 2: Create & Share Dish Moment */}
        {activeTab === 'CREATE_MOMENT' && (
          <form onSubmit={handleSubmitParticipation} className="space-y-4">
            {/* Prepared Social Template Editor */}
            <div className="p-3.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 space-y-3">
              <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Suggested Social Template</h4>

              <textarea
                value={templateText}
                onChange={(e) => setTemplateText(e.target.value)}
                rows={2}
                className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
              />

              <div className="flex flex-wrap gap-2 text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeTag}
                    onChange={(e) => setIncludeTag(e.target.checked)}
                    className="accent-primary"
                  />
                  <span>Tag {socialStory?.restaurantTag || '@AmanisKitchen'}</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeLocation}
                    onChange={(e) => setIncludeLocation(e.target.checked)}
                    className="accent-primary"
                  />
                  <span>Location ({socialStory?.locationLabel || 'Hyderabad'})</span>
                </label>
              </div>
            </div>

            {/* Customer Photo / Video Upload Preview */}
            <div className="p-3.5 rounded-2xl border border-outline-variant/30 bg-surface space-y-2">
              <label className="text-xs font-bold text-primary uppercase tracking-wider block">
                Add your own photo or video
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleMediaUploadMock}
                  className="hidden"
                  id="ugc-media-file-input"
                />
                <label
                  htmlFor="ugc-media-file-input"
                  className="px-3.5 py-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-semibold text-xs rounded-xl cursor-pointer flex items-center gap-1.5 border border-outline-variant/40"
                >
                  <Upload className="w-3.5 h-3.5 text-primary" />
                  <span>Browse Media</span>
                </label>
                <button
                  type="button"
                  onClick={() => handleMediaUploadMock({})}
                  className="text-[11px] text-primary font-semibold hover:underline"
                >
                  Use Mock Sample
                </button>
              </div>

              {uploadedMediaPreview && (
                <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-outline-variant mt-2">
                  <img src={uploadedMediaPreview} alt="Customer upload preview" className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-1 rounded font-bold">Preview</span>
                </div>
              )}
            </div>

            {/* Optional Social Handle (No Login Credentials Requested!) */}
            <div className="space-y-1 text-xs">
              <label className="font-bold text-on-surface block">Optional Social Handle</label>
              <input
                type="text"
                value={optionalHandle}
                onChange={(e) => setOptionalHandle(e.target.value)}
                placeholder="e.g. @priya_r (No password or login required)"
                className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface text-xs"
              />
              <p className="text-[10px] text-on-surface-variant/80">
                The restaurant will not receive your social-media login credentials.
              </p>
            </div>

            {/* Transparent Participation Reward Conditions Box */}
            <div className="p-3.5 rounded-2xl bg-warning/10 border border-warning/30 space-y-2 text-xs text-on-background">
              <div className="flex items-center justify-between">
                <span className="font-bold text-warning flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-warning" />
                  Participation Conditions
                </span>
                <button
                  type="button"
                  onClick={() => setShowRewardConditions(!showRewardConditions)}
                  className="text-[11px] font-bold text-warning hover:underline"
                >
                  {showRewardConditions ? 'Hide' : 'View Details'}
                </button>
              </div>
              <p className="text-[11px] text-on-background/90 leading-relaxed">
                Participation rewards authentic content based on genuine visits, not positive sentiment or 5-star praise.
              </p>

              {showRewardConditions && (
                <ul className="list-disc pl-4 text-[10px] space-y-1 text-on-background/80 pt-1">
                  <li>Must relate to an authentic completed visit.</li>
                  <li>Positive, mixed, or neutral food documentation is eligible.</li>
                  <li>Restaurant reviews submissions for relevance and safety.</li>
                  <li>Repost permission is separate and optional.</li>
                  <li>You may still post publicly without participating in rewards.</li>
                </ul>
              )}
            </div>

            {/* Explicit Customer Privacy Controls (Separate Checkboxes) */}
            <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-2.5 text-xs">
              <h4 className="font-bold text-primary uppercase tracking-wider text-[11px]">Customer Privacy Controls</h4>
              <p className="text-[11px] text-on-surface-variant">Your content remains yours. Select separate permissions:</p>

              <div className="space-y-2 pt-1">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.submittedForParticipation}
                    onChange={(e) => setPermissions({ ...permissions, submittedForParticipation: e.target.checked })}
                    className="accent-primary mt-0.5"
                  />
                  <span>Upload this content for participation credit</span>
                </label>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.restaurantRepostAllowed}
                    onChange={(e) => setPermissions({ ...permissions, restaurantRepostAllowed: e.target.checked })}
                    className="accent-primary mt-0.5"
                  />
                  <span className="font-semibold text-primary">
                    Allow the restaurant to repost this content (Unselected by default)
                  </span>
                </label>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.inAppGalleryAllowed}
                    onChange={(e) => setPermissions({ ...permissions, inAppGalleryAllowed: e.target.checked })}
                    className="accent-primary mt-0.5"
                  />
                  <span>Allow the restaurant to display this content inside the RMS gallery</span>
                </label>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.displayNameAllowed}
                    onChange={(e) => setPermissions({ ...permissions, displayNameAllowed: e.target.checked })}
                    className="accent-primary mt-0.5"
                  />
                  <span>Show my display name (Default: Verified Guest)</span>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 bg-surface-container-high text-on-surface font-semibold text-xs rounded-xl hover:bg-surface-container-highest"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-primary text-on-primary font-bold text-xs rounded-xl shadow hover:bg-primary/90 transition-colors"
              >
                Submit Participation
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};

export default SignatureDishStoryModal;

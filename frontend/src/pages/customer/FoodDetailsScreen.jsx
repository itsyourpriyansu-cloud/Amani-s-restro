import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { menuService } from '../../services/menuService';
import { useCart } from '../../context/CartContext';
import { useOrder } from '../../context/OrderContext';
import { useTable } from '../../context/TableContext';
import { useToast } from '../../context/ToastContext';
import { formatMenuPrice } from '../../utils/formatters';
import ResponsiveImage from '../../components/common/ResponsiveImage';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import ErrorState from '../../components/common/ErrorState';
import CustomizationModal from '../../components/menu/CustomizationModal';
import RestaurantTrustProfileModal from '../../components/trust/RestaurantTrustProfileModal';
import SignatureDishStoryModal from '../../components/retention/SignatureDishStoryModal';
import biryaniVideo from '../../assets/no_have_no_images.mp4';
import {
  Sparkles,
  ChevronRight,
  ChevronDown,
  Plus,
  BookOpen,
  ShieldAlert,
  ArrowLeft,
  Heart,
  Clock,
  Flame,
  CheckCircle2,
  Utensils,
  Leaf,
  PackageCheck,
  CookingPot,
  Drumstick,
  Soup,
  Salad,
  GlassWater,
  Wheat,
  Dessert,
  Milk,
  Citrus,
  Sprout
} from 'lucide-react';

/**
 * Returns exact items/components included in the serving for customer UX clarity.
 */
const getDishInclusions = (dish) => {
  if (!dish) return [];
  const providedInclusions = dish.includedItems || dish.inclusions || dish.mealComponents;
  if (Array.isArray(providedInclusions)) return providedInclusions;

  const cat = dish.subCategory || dish.category || '';
  const name = (dish.name || '').toLowerCase();

  if (cat === 'biryanis' || name.includes('biryani')) {
    return [
      { name: 'Basmati Dum Rice', detail: 'Fragrant dum-cooked rice', icon: 'rice' },
      { name: name.includes('veg') ? 'Paneer & Vegetables' : name.includes('egg') ? 'Spiced Boiled Eggs' : 'Spiced Chicken Pieces', detail: 'Signature marinade & rich gravy', icon: name.includes('veg') ? 'vegetable' : 'protein' },
      { name: 'Mirchi Ka Salan', detail: 'Authentic house peanut-sesame gravy', icon: 'sauce' },
      { name: 'Onion Raita', detail: 'Cooling spiced yoghurt & fresh onion', icon: 'dairy' },
      { name: 'Herbal Garnish', detail: 'Fresh mint, coriander & lemon wedge', icon: 'garnish' },
    ];
  }

  if (cat === 'meals' || name.includes('bojanam') || name.includes('meal')) {
    return [
      { name: 'Steamed Rice', detail: 'Unlimited traditional aromatic rice', icon: 'rice' },
      { name: 'Dal, Sambar & Rasam', detail: 'Home-style lentil & tangy soups', icon: 'soup' },
      { name: 'Special Curries & Vepudu', detail: name.includes('non-veg') ? 'Mutton curry & Chicken fry' : 'Seasonal regional vegetable curries', icon: name.includes('non-veg') ? 'protein' : 'vegetable' },
      { name: 'Condiments', detail: 'Homemade pickle, podi & pure ghee', icon: 'spice' },
      { name: 'Dessert & Curd', detail: 'Traditional sweet & fresh thick curd', icon: 'dessert' },
    ];
  }

  if (cat.includes('starters')) {
    return [
      { name: 'Full Starter Portion', detail: 'Prepared fresh to order with house spices', icon: 'spice' },
      { name: 'Mint Chutney', detail: 'Signature spiced coriander-mint dip', icon: 'sauce' },
      { name: 'Fresh Salad Garnish', detail: 'Sliced ring onions & lemon wedge', icon: 'salad' },
    ];
  }

  if (cat.includes('soups')) {
    return [
      { name: 'Hot Soup Bowl', detail: 'Freshly brewed aromatic soup', icon: 'soup' },
      { name: 'Crispy Noodles', detail: 'Crunchy fried noodle topping', icon: 'garnish' },
    ];
  }

  if (cat.includes('curries') || cat.includes('main_course')) {
    return [
      { name: 'Curry / Gravy Portion', detail: 'Slow-cooked rich gravy portion', icon: 'curry' },
      { name: 'Herb Garnish', detail: 'Fresh cilantro, ginger juliennes & ghee', icon: 'garnish' },
    ];
  }

  if (cat.includes('rotis') || cat.includes('breads')) {
    return [
      { name: 'Clay-Oven Indian Bread', detail: 'Baked fresh in tandoor oven', icon: 'bread' },
      { name: 'Desi Ghee Glaze', detail: 'Brushed with pure ghee/butter', icon: 'dairy' },
    ];
  }

  if (cat === 'desserts') {
    return [
      { name: 'Dessert Portion', detail: dish.portionLabel || 'Freshly prepared dessert', icon: 'dessert' },
      { name: 'Nut Garnish', detail: 'Pistachio & cardamom dusting', icon: 'garnish' },
    ];
  }

  if (cat === 'drinks') {
    return [
      { name: 'Chilled Drink Portion', detail: 'Served ice-cold with fresh mint/lime', icon: 'drink' },
    ];
  }

  return [
    { name: 'Full Dish Portion', detail: 'Prepared fresh with signature spices', icon: 'dish' },
    { name: 'House Dips & Salad', detail: 'Complimentary condiments', icon: 'salad' },
  ];
};

const inclusionIcons = {
  rice: CookingPot,
  protein: Drumstick,
  soup: Soup,
  sauce: Soup,
  curry: CookingPot,
  salad: Salad,
  vegetable: Leaf,
  spice: Flame,
  bread: Wheat,
  dessert: Dessert,
  dairy: Milk,
  drink: GlassWater,
  garnish: Sprout,
  citrus: Citrus,
  dish: Utensils,
};

const MealMetadataChip = ({ icon: Icon, label, tone = 'neutral' }) => {
  const toneClasses = {
    vegetarian: 'border-meal-vegetarian-border bg-meal-vegetarian-bg text-meal-vegetarian-fg',
    nonVegetarian: 'border-meal-primary-border bg-meal-primary-bg text-meal-primary-fg',
    spice: 'border-meal-spice-border bg-meal-spice-bg text-meal-spice-fg',
    preparation: 'border-meal-preparation-border bg-meal-preparation-bg text-meal-preparation-fg',
    neutral: 'border-meal-neutral-border bg-meal-neutral-bg text-meal-neutral-fg',
  };

  return (
    <span
      className={`inline-flex min-h-8 items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-xs font-medium leading-4 ${toneClasses[tone]}`}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
};

const MealMetadataGroup = ({ dish, prepTimeMin }) => {
  const isVegetarian = dish.foodType === 'VEGETARIAN';
  const spiceLabel = dish.spiceLevel === 'MEDIUM'
    ? 'Medium Spice'
    : dish.spiceLevel === 'SPICY'
      ? 'Spicy'
      : 'Mild';

  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Meal details">
      <MealMetadataChip
        icon={isVegetarian ? Leaf : Drumstick}
        label={isVegetarian ? 'Vegetarian' : 'Non-Vegetarian'}
        tone={isVegetarian ? 'vegetarian' : 'nonVegetarian'}
      />
      {dish.spiceLevel && (
        <MealMetadataChip icon={Flame} label={spiceLabel} tone="spice" />
      )}
      <MealMetadataChip icon={Clock} label={`${prepTimeMin}–${prepTimeMin + 5} min prep`} tone="preparation" />
      <MealMetadataChip icon={Utensils} label={`Serves ${dish.serves || '1 person'}`} />
    </div>
  );
};

const FoodIconContainer = ({ item }) => {
  const imageSource = item.image || item.iconImage || (
    typeof item.icon === 'string' && /^(https?:|\/|data:)/.test(item.icon) ? item.icon : null
  );
  const Icon = inclusionIcons[item.icon] || Utensils;

  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-meal-icon-bg text-meal-icon-fg" aria-hidden="true">
      {imageSource ? (
        <img src={imageSource} alt="" className="h-full w-full object-cover" />
      ) : (
        <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
      )}
    </span>
  );
};

const IncludedDishRow = ({ item }) => {
  const isUnavailable = item.available === false || item.availabilityStatus === 'UNAVAILABLE';
  const isSubstituted = item.isSubstituted || item.substituted;
  const statusLabel = isUnavailable ? 'Unavailable' : isSubstituted ? 'Substituted' : null;
  const detail = item.detail || item.description;

  return (
    <li className="flex min-h-[68px] items-start gap-3 py-3">
      <FoodIconContainer item={item} />
      <div className="min-w-0 flex-1 pt-0.5">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <h3 className="text-[15px] font-semibold leading-5 text-on-surface">{item.name}</h3>
          {statusLabel && (
            <span className={`text-xs font-medium ${isUnavailable ? 'text-error' : 'text-tertiary'}`}>
              {statusLabel}
            </span>
          )}
        </div>
        {detail && (
          <p className="mt-0.5 text-[13px] font-normal leading-[1.4] text-on-surface-variant">
            {detail}
          </p>
        )}
      </div>
    </li>
  );
};

const MealStatusBadge = ({ label }) => (
  <span
    className="inline-flex min-h-8 shrink-0 items-center gap-1.5 rounded-full bg-meal-verified-bg px-2.5 py-1.5 text-xs font-medium leading-4 text-meal-verified-fg"
    aria-label="This order includes a complete meal."
  >
    <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
    {label}
  </span>
);

const MealContentsSection = ({ dish }) => {
  const inclusions = getDishInclusions(dish);
  if (!inclusions?.length) return null;

  const completeMealLabel = dish.mealCompletenessLabel || dish.mealCompleteness?.label || 'Complete meal';
  const completeMealState = dish.isCompleteMeal ?? dish.mealComplete ?? dish.mealCompleteness?.isComplete;
  const isCompleteMeal = completeMealState !== false;

  return (
    <section className="rounded-2xl border border-meal-section-border bg-meal-section-bg px-4 py-5 sm:p-5" aria-labelledby="meal-contents-title">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-[12rem] flex-1 items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-meal-primary-bg text-meal-primary-fg" aria-hidden="true">
            <PackageCheck className="h-5 w-5" strokeWidth={1.8} />
          </span>
          <div className="min-w-0 pt-0.5">
            <h2 id="meal-contents-title" className="text-lg font-semibold leading-6 tracking-[-0.01em] text-on-surface">
              What’s included
            </h2>
            <p className="mt-1 text-[13px] leading-[1.45] text-on-surface-variant">
              Everything served as part of this meal
            </p>
          </div>
        </div>
        {isCompleteMeal && <MealStatusBadge label={completeMealLabel} />}
      </div>

      <ul className="mt-4 divide-y divide-meal-row-divider border-t border-meal-row-divider">
        {inclusions.map((item, idx) => (
          <IncludedDishRow key={item.id || `${item.name}-${idx}`} item={item} />
        ))}
      </ul>
    </section>
  );
};

const PreparationNotice = ({ prepTimeMin, message }) => (
  <aside className="rounded-[14px] border border-meal-notice-border bg-meal-notice-bg p-4 text-meal-notice-fg" aria-labelledby="preparation-notice-title">
    <div className="flex items-start gap-3">
      <Clock className="mt-0.5 h-[18px] w-[18px] shrink-0" aria-hidden="true" />
      <div>
        <h2 id="preparation-notice-title" className="text-sm font-semibold leading-5">
          Longer preparation time
        </h2>
        <p className="mt-1 text-[13px] leading-[1.5] text-on-surface-variant">
          {message || (
            <>
              This item currently takes approximately <strong className="font-semibold text-meal-notice-fg">{prepTimeMin}–{prepTimeMin + 5} minutes</strong> due to kitchen volume. Other items in your order may be ready earlier.
            </>
          )}
        </p>
      </div>
    </div>
  </aside>
);

const FoodDetailsScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { tableNumber } = useTable();
  const { kitchenLoad, addAssistanceRequest } = useOrder();
  const { showToast } = useToast();

  const [dish, setDish] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);
  const [isTrustOpen, setIsTrustOpen] = useState(false);
  const [isFavourite, setIsFavourite] = useState(false);
  const [isAllergyExpanded, setIsAllergyExpanded] = useState(false);

  useEffect(() => {
    const loadDish = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await menuService.getDishById(id);
        setDish(res.data);
      } catch (err) {
        setError('Dish details could not be found.');
      } finally {
        setIsLoading(false);
      }
    };
    loadDish();
  }, [id]);

  if (isLoading) return <LoadingSkeleton />;
  if (error || !dish) return <ErrorState message={error} onRetry={() => navigate('/menu')} />;

  const isAvailable = dish.availabilityStatus === 'AVAILABLE' || dish.availabilityStatus === 'LIMITED_AVAILABILITY';
  const isOrderable = dish.orderableInApp !== false;
  const prepTimeMin = dish.preparationTimeMinutes || 15;
  const preparationNoticeMessage = typeof dish.preparationNotice === 'string'
    ? dish.preparationNotice
    : dish.preparationNotice?.message;
  const isDelayedDish = Boolean(dish.preparationNotice) || prepTimeMin >= 30 || kitchenLoad?.status === 'BUSY' || kitchenLoad?.status === 'VERY_BUSY';

  const handleAddToCartFromModal = (payload) => {
    const { dish: d, quantity, formattedModifiers, allergyAlert, specialInstruction, selectedOptions, makeVegan, jainPreparation } = payload;
    addToCart(d, formattedModifiers, specialInstruction, quantity, { selectedOptions, makeVegan, jainPreparation, allergyAlert });
    showToast(`Added ${d.name} (x${quantity}) to cart`, 'success');
    navigate('/menu');
  };

  const handleDirectAddToCart = () => {
    addToCart(dish);
    showToast(`Added "${dish.name}" to cart`, 'success');
    navigate('/menu');
  };

  const handleAddPairing = (pairing) => {
    const pairingDish = {
      id: pairing.itemId || `pairing-${Date.now()}`,
      name: pairing.name,
      price: pairing.price,
      image: pairing.image || dish.image,
      customizationAvailable: false,
    };
    addToCart(pairingDish);
    showToast(`Added pairing "${pairing.name}" to cart`, 'success');
  };

  const isChickenDumBiryani = dish && (
    dish.id === 'biryani-chicken-dum' ||
    (dish.name && dish.name.toLowerCase().includes('chicken dum biryani'))
  );

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-error-container selection:text-primary">
      <main className="flex-1 pb-36 max-w-2xl mx-auto w-full relative">
        {/* 1. Hero Food Photography / Video Section */}
        <section className="relative w-full h-[40vh] sm:h-[46vh] min-h-[260px] max-h-[420px] bg-stone-900 overflow-hidden">
          {isChickenDumBiryani ? (
            <div className="relative w-full h-full">
              <video
                src={biryaniVideo}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent pointer-events-none" />
            </div>
          ) : (
            <ResponsiveImage
              src={dish.image}
              alt={dish.name}
              aspectRatio={undefined}
              rounded="rounded-none"
              fetchPriority="high"
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
              overlay={
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
              }
            />
          )}

          {/* Glassmorphic Action Header */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
            <button
              onClick={() => navigate(-1)}
              aria-label="Go back"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-surface/85 backdrop-blur-md hover:bg-surface active:scale-95 transition-all shadow-md border border-outline-variant/40 text-on-surface"
            >
              <ArrowLeft className="w-5 h-5 text-on-surface" />
            </button>
            <button
              onClick={() => setIsFavourite((v) => !v)}
              aria-label={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
              aria-pressed={isFavourite}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-surface/85 backdrop-blur-md hover:bg-surface active:scale-95 transition-all shadow-md border border-outline-variant/40 text-on-surface"
            >
              <Heart className={`w-5 h-5 transition-colors ${isFavourite ? 'fill-primary text-primary' : 'text-on-surface'}`} />
            </button>
          </div>
        </section>

        {/* 2. Main Content Card with Smooth Overlap */}
        <article className="-mt-6 rounded-t-3xl relative z-10 bg-surface px-5 pt-6 pb-6 shadow-sm border-t border-outline-variant space-y-6">
          {/* Header Title, Portion Badge & Price Block */}
          <div>
            <div className="flex items-center justify-between gap-3 mb-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-surface-container-low border border-primary-container text-primary text-[11px] font-bold tracking-wide uppercase">
                {dish.portionLabel || 'Regular'}
              </span>

              {/* Availability Tag */}
              <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${isAvailable ? 'text-success' : 'text-primary'}`}>
                <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-success animate-pulse' : 'bg-primary'}`} />
                {dish.availabilityStatus === 'AVAILABLE'
                  ? 'Available Now'
                  : dish.availabilityStatus === 'LIMITED_AVAILABILITY'
                  ? 'Limited Portions Left'
                  : 'Sold Out Today'}
              </span>
            </div>

            <div className="flex items-start justify-between gap-4">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-on-surface tracking-tight leading-tight flex-1">
                {dish.name}
              </h1>
              <div className="text-2xl sm:text-3xl font-black text-primary whitespace-nowrap pt-0.5">
                {dish.priceDisplay || formatMenuPrice(dish.price)}
              </div>
            </div>
          </div>

          {/* Compact, responsive decision metadata */}
          <MealMetadataGroup dish={dish} prepTimeMin={prepTimeMin} />

          {/* Mangamma Favourite Highlight Card */}
          {dish.bestseller && (
            <div className="p-3.5 rounded-2xl bg-surface-container-low border border-primary-container flex items-start gap-3 shadow-xs">
              <div className="p-2 rounded-xl bg-primary-container text-primary flex-shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-primary uppercase tracking-wider block">
                  Mangamma Favourite
                </span>
                <p className="text-xs text-on-surface-variant font-medium leading-relaxed mt-0.5">
                  {dish.bestsellerReason || 'Our most-loved biryani upgrade'}
                </p>
              </div>
            </div>
          )}

          {/* Primary meal composition */}
          <MealContentsSection dish={dish} />

          {/* Kitchen Volume / Long Preparation Alert */}
          {isDelayedDish && (
            <PreparationNotice prepTimeMin={prepTimeMin} message={preparationNoticeMessage} />
          )}

          {/* Appetizing Dish Description */}
          <div className="py-1">
            <p className="text-on-surface text-sm leading-relaxed font-normal">
              {dish.shortDescription || dish.description}
            </p>
          </div>

          {/* Special Dietary Options Pills */}
          {(dish.jainAvailable || dish.veganAvailable) && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {dish.jainAvailable && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-success/10 border border-success/25 text-success text-xs font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Jain option available on request
                </span>
              )}
              {dish.veganAvailable && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-success/10 border border-success/25 text-success text-xs font-medium">
                  <Leaf className="w-3.5 h-3.5" />
                  Vegan customizable
                </span>
              )}
            </div>
          )}

          <div className="border-t border-outline-variant pt-4 space-y-3">
            {/* Progressive Disclosure 1: Allergens & Safety Policy Accordion */}
            <div className="rounded-2xl border border-outline-variant bg-surface overflow-hidden transition-all shadow-xs">
              <button
                type="button"
                onClick={() => setIsAllergyExpanded((v) => !v)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-surface-container-low transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary-container text-primary">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-on-surface text-xs uppercase tracking-wider">
                      Allergens & Kitchen Safety Policy
                    </h3>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      {dish.glutenStatus || 'Gluten-Free Recipe'} • {dish.allergens?.length > 0 ? dish.allergens.join(', ') : 'No Allergens Listed'}
                    </p>
                  </div>
                </div>
                {isAllergyExpanded ? (
                  <ChevronDown className="w-4 h-4 text-primary transform rotate-180 transition-transform" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-on-surface-variant" />
                )}
              </button>

              {isAllergyExpanded && (
                <div className="px-4 pb-4 pt-1 border-t border-outline-variant bg-surface-container-low/50 space-y-3 text-xs">
                  <div className="flex flex-col gap-1 text-on-surface-variant pt-2">
                    <p><strong>Gluten Status:</strong> {dish.glutenStatus || 'Gluten-Free Recipe'}</p>
                    <p><strong>Allergens Present:</strong> {dish.allergens?.length > 0 ? dish.allergens.join(', ') : 'None listed'}</p>
                  </div>
                  <div className="p-3 bg-surface rounded-xl text-on-surface-variant border border-outline-variant leading-relaxed">
                    Allergy requests are reviewed by the kitchen before the order is accepted. Cross-contact may still be possible in a shared commercial kitchen.
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => setIsTrustOpen(true)}
                      className="text-xs font-bold text-primary hover:underline"
                    >
                      Read Kitchen Policy
                    </button>
                    <button
                      type="button"
                      onClick={() => addAssistanceRequest(tableNumber, 'Allergy assistance')}
                      className="text-xs font-bold text-primary hover:underline"
                    >
                      Speak to staff about an allergy
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Progressive Disclosure 2: Story of this Dish Button Row */}
            <button
              type="button"
              onClick={() => setShowStoryModal(true)}
              className="w-full p-4 rounded-2xl border border-outline-variant bg-surface-container-low hover:bg-primary-container/60 text-on-surface font-bold text-xs flex items-center justify-between transition-colors shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary-container text-primary">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="block font-bold text-on-surface">Story of this dish</span>
                  <span className="text-[11px] font-normal text-on-surface-variant">Discover the traditional heritage & secret spices</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-primary" />
            </button>
          </div>

          {/* Recommended Pairings Section */}
          {dish.recommendedPairings && dish.recommendedPairings.length > 0 && (
            <div className="pt-2 border-t border-outline-variant">
              <h3 className="font-bold text-on-surface-variant text-xs uppercase tracking-wider mb-3">
                Pairs well with
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {dish.recommendedPairings.map((pairing) => (
                  <div
                    key={pairing.itemId || pairing.name}
                    className="flex items-center justify-between p-3 rounded-2xl border border-outline-variant bg-surface shadow-xs hover:border-error/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {pairing.image && (
                        <img src={pairing.image} alt={pairing.name} className="w-12 h-12 object-cover rounded-xl border border-outline-variant" />
                      )}
                      <div>
                        <h4 className="font-bold text-xs text-on-surface">{pairing.name}</h4>
                        <span className="text-xs text-primary font-bold">{formatMenuPrice(pairing.price)}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddPairing(pairing)}
                      className="px-3 py-1.5 rounded-xl bg-error-container hover:bg-error text-error hover:text-on-error font-bold text-xs flex items-center gap-1 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!isOrderable && (
            <div className="p-3 rounded-xl bg-highlight/10 border border-highlight/30 text-xs text-highlight">
              This item is priced at MRP and isn't orderable through the app — please ask your server.
            </div>
          )}
        </article>
      </main>

      {/* Modals */}
      {showStoryModal && <SignatureDishStoryModal isOpen={showStoryModal} onClose={() => setShowStoryModal(false)} dish={dish} />}

      <RestaurantTrustProfileModal
        isOpen={isTrustOpen}
        onClose={() => setIsTrustOpen(false)}
        onRequestAssistance={(type) => addAssistanceRequest(tableNumber, type)}
      />

      {/* Sticky Call-To-Action Footer */}
      {!isCustomizationOpen && (
        <footer
          className="fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-outline-variant px-4 pt-3 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
          style={{ paddingBottom: 'calc(12px + env(safe-area-inset-bottom))' }}
        >
          <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider block">
                Total Price
              </span>
              <div className="text-xl sm:text-2xl font-black text-on-surface">
                {dish.priceDisplay || formatMenuPrice(dish.price)}
              </div>
            </div>

            {!isOrderable ? (
              <button disabled className="flex-1 py-3.5 px-6 bg-surface-container text-on-surface-variant font-bold rounded-xl text-sm cursor-not-allowed">
                Ask Your Server
              </button>
            ) : dish.customizationAvailable ? (
              <button
                onClick={() => setIsCustomizationOpen(true)}
                disabled={!isAvailable}
                className="flex-1 py-3.5 px-6 bg-error hover:brightness-90 active:scale-[0.98] disabled:bg-surface-container disabled:text-on-surface-variant text-on-error font-bold rounded-xl transition-all shadow-md shadow-error/20 flex items-center justify-center gap-2 text-sm"
              >
                <span>Customize & Add</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleDirectAddToCart}
                disabled={!isAvailable}
                className="flex-1 py-3.5 px-6 bg-error hover:brightness-90 active:scale-[0.98] disabled:bg-surface-container disabled:text-on-surface-variant text-on-error font-bold rounded-xl transition-all shadow-md shadow-error/20 flex items-center justify-center gap-2 text-sm"
              >
                <span>Add to Order</span>
              </button>
            )}
          </div>
        </footer>
      )}

      {isCustomizationOpen && (
        <CustomizationModal isOpen={isCustomizationOpen} onClose={() => setIsCustomizationOpen(false)} dish={dish} onAddToCart={handleAddToCartFromModal} />
      )}
    </div>
  );
};

export default FoodDetailsScreen;

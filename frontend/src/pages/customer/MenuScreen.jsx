import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Utensils, X } from 'lucide-react';
import { menuService } from '../../services/menuService';
import TopAppBar from '../../components/layout/TopAppBar';
import BottomNavBar from '../../components/layout/BottomNavBar';
import SearchBar from '../../components/menu/SearchBar';
import OfferBanner from '../../components/menu/OfferBanner';
import FoodCard from '../../components/menu/FoodCard';
import CompactDishRow from '../../components/menu/CompactDishRow';
import StickyCartBar from '../../components/menu/StickyCartBar';
import CustomizationModal from '../../components/menu/CustomizationModal';
import CategoryBottomSheet from '../../components/menu/CategoryBottomSheet';
import RestaurantTrustProfileModal from '../../components/trust/RestaurantTrustProfileModal';
import CustomerPreferencesModal from '../../components/preferences/CustomerPreferencesModal';
import DietaryFilterRail, { QUICK_FILTERS } from '../../components/menu/DietaryFilterRail';
import RecommendedDishRail from '../../components/menu/RecommendedDishRail';
import MenuSectionHeader from '../../components/menu/MenuSectionHeader';
import { MenuSkeletonList } from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import Icon from '../../components/common/Icon';
import { DISHES, FAVOURITE_DISH_IDS } from '../../utils/mockData';
import { useCart } from '../../context/CartContext';
import { useOrder } from '../../context/OrderContext';
import { useTable } from '../../context/TableContext';
import { useToast } from '../../context/ToastContext';

const MenuScreen = () => {
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(location.state?.category || 'all');
  const [searchQuery, setSearchQuery] = useState(location.state?.initialSearchQuery || '');
  const [activeFilters, setActiveFilters] = useState(location.state?.activeFilters || []);
  const [dishes, setDishes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [customizingDish, setCustomizingDish] = useState(null);
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);

  const [isTrustOpen, setIsTrustOpen] = useState(false);
  const [isPrefsOpen, setIsPrefsOpen] = useState(false);
  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false);

  const favouritesRef = useRef(null);

  const { addToCart, totals } = useCart();
  const { tableNumber } = useTable();
  const { kitchenLoad, addAssistanceRequest } = useOrder();
  const { showToast } = useToast();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await menuService.getCategories();
        setCategories(res.data || []);
      } catch (err) {
        console.error('Error loading categories', err);
      }
    };
    loadCategories();
  }, []);

  const fetchMenuData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await menuService.getMenu(selectedCategory, searchQuery);
      setDishes(res.data || []);
    } catch (err) {
      setError('Failed to load menu dishes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMenuData();
    }, 250);
    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    if (location.state?.focus === 'favourites' && favouritesRef.current) {
      setTimeout(() => favouritesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
    }
  }, [location.state]);

  const toggleFilter = (id) => {
    setActiveFilters((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  };

  const resetFilters = () => setActiveFilters([]);

  const handleSelectCategory = (categoryId) => {
    setSelectedCategory(categoryId);
    setActiveFilters([]);

    // Smoothly scroll to the requested category section anchor
    setTimeout(() => {
      const el = document.getElementById(`category-${categoryId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        const fullMenuEl = document.getElementById('full-menu-section');
        if (fullMenuEl) fullMenuEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);
  };

  const visibleDishes = dishes.filter((d) =>
    activeFilters.every((fid) => QUICK_FILTERS.find((f) => f.id === fid)?.test(d))
  );

  const favouriteDishes = FAVOURITE_DISH_IDS.map((id) => DISHES.find((d) => d.id === id)).filter(Boolean);

  const handleOpenCustomize = (dish) => {
    if (dish.availabilityStatus === 'SOLD_OUT') {
      showToast(`${dish.name} is currently sold out`, 'warning');
      return;
    }
    if (dish.orderableInApp === false) {
      showToast(`${dish.name} is priced at MRP — please ask your server`, 'info');
      return;
    }
    setCustomizingDish(dish);
    setIsCustomizationOpen(true);
  };

  const handleAddToCartFromModal = (payload) => {
    const { dish, quantity, formattedModifiers, allergyAlert, specialInstruction, selectedOptions, makeVegan, jainPreparation } = payload;
    addToCart(dish, formattedModifiers, specialInstruction, quantity, { selectedOptions, makeVegan, jainPreparation, allergyAlert });
    showToast(`Added customized ${dish.name} (x${quantity}) to cart`, 'success');
  };

  const showCuratedRecommendations = selectedCategory === 'all' && !searchQuery && activeFilters.length === 0;

  const selectedCategoryObj = categories.find((c) => c.id === selectedCategory) || { id: 'all', name: 'Full Menu' };

  // Bottom padding dynamic clearance so floating nav & cart never obscure content
  const contentPaddingBottom = totals.itemCount > 0
    ? 'calc(200px + env(safe-area-inset-bottom))'
    : 'calc(120px + env(safe-area-inset-bottom))';

  return (
    <>
      <TopAppBar
        variant="brand"
        kitchenLoad={kitchenLoad}
        onOpenTrustProfile={() => setIsTrustOpen(true)}
        onOpenPreferences={() => setIsPrefsOpen(true)}
      />

      <main
        className="customer-page flex-1 max-w-[640px] mx-auto w-full"
        style={{
          paddingTop: 'calc(84px + env(safe-area-inset-top) + 6px)',
          paddingBottom: contentPaddingBottom,
        }}
      >
        {/* 2. Offer Banner + Prominent search */}
        <section className="px-4 mt-4 mb-6 flex flex-col gap-3.5">
          <OfferBanner />
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery('')}
            autoFocus={Boolean(location.state?.focusSearch)}
          />
        </section>

        {/* 4. High-value quick filters + "More filters" bottom sheet */}
        <DietaryFilterRail
          activeFilters={activeFilters}
          onToggleFilter={toggleFilter}
          onResetFilters={resetFilters}
        />

        {/* 5. Recommended — compact single row, skipped once the user is searching/filtering */}
        {showCuratedRecommendations && favouriteDishes.length > 0 && (
          <RecommendedDishRail
            recommendedDishes={favouriteDishes}
            onCustomize={handleOpenCustomize}
            onViewAll={() => {
              const el = document.getElementById('full-menu-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            favouritesRef={favouritesRef}
          />
        )}

        {/* 6. Selected Category Heading */}
        <div id="full-menu-section">
          <MenuSectionHeader
            selectedCategoryObj={selectedCategoryObj}
            dishCount={visibleDishes.length}
            onOpenTrustProfile={() => setIsTrustOpen(true)}
          />
        </div>

        {/* 6b. Dish cards grouped by category or filtered */}
        {isLoading ? (
          <div className="px-4">
            <MenuSkeletonList count={5} />
          </div>
        ) : error ? (
          <div className="px-4">
            <ErrorState message={error} onRetry={fetchMenuData} />
          </div>
        ) : visibleDishes.length === 0 ? (
          <div className="px-4">
            <EmptyState
              icon={() => <Icon name="tune" className="text-4xl" />}
              title="No dishes found"
              description={`No dishes match "${searchQuery || selectedCategoryObj.name}". Try clearing search or filters.`}
              actionLabel="Clear Filters"
              onAction={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setActiveFilters([]);
              }}
            />
          </div>
        ) : selectedCategory === 'all' && !searchQuery ? (
          <section className="px-4 space-y-6">
            {[
              { id: 'starters', name: 'Starters' },
              { id: 'meals', name: 'Meals' },
              { id: 'biryanis', name: 'Biryanis' },
              { id: 'rotis_breads', name: 'Breads' },
              { id: 'desserts', name: 'Desserts' },
              { id: 'drinks', name: 'Cooldrinks' },
            ].map((section) => {
              const sectionDishes = visibleDishes.filter((d) => d.category === section.id);
              if (sectionDishes.length === 0) return null;

              return (
                <div key={section.id} id={`category-${section.id}`} className="scroll-mt-24 pt-1">
                  <div className="flex items-center justify-between mb-3.5 px-1 border-b border-outline-variant/30 pb-2">
                    <h3 className="font-extrabold text-base text-on-surface flex items-center gap-2">
                      <span>{section.name}</span>
                      <span className="text-[11px] font-bold text-on-surface-variant bg-surface-container px-2.5 py-0.5 rounded-full">
                        {sectionDishes.length}
                      </span>
                    </h3>
                  </div>
                  <div className="flex flex-col gap-3.5">
                    {sectionDishes.map((dish) => {
                      const isSimpleItem = dish.category === 'rotis_breads' || dish.category === 'drinks';
                      if (isSimpleItem) {
                        return <CompactDishRow key={dish.id} dish={dish} onCustomize={handleOpenCustomize} />;
                      }
                      return <FoodCard key={dish.id} dish={dish} onCustomize={handleOpenCustomize} />;
                    })}
                  </div>
                </div>
              );
            })}
          </section>
        ) : (
          <section id={`category-${selectedCategory}`} className="scroll-mt-24 px-4 flex flex-col gap-3.5">
            {visibleDishes.map((dish) => {
              const isSimpleItem = dish.category === 'rotis_breads' || dish.category === 'drinks';
              if (isSimpleItem && !searchQuery) {
                return <CompactDishRow key={dish.id} dish={dish} onCustomize={handleOpenCustomize} />;
              }
              return <FoodCard key={dish.id} dish={dish} onCustomize={handleOpenCustomize} />;
            })}
          </section>
        )}
      </main>

      {/* Modals & Floating Bars */}
      {customizingDish && (
        <CustomizationModal
          isOpen={isCustomizationOpen}
          onClose={() => {
            setIsCustomizationOpen(false);
            setCustomizingDish(null);
          }}
          dish={customizingDish}
          onAddToCart={handleAddToCartFromModal}
        />
      )}

      <RestaurantTrustProfileModal
        isOpen={isTrustOpen}
        onClose={() => setIsTrustOpen(false)}
        onRequestAssistance={(type) => addAssistanceRequest(tableNumber, type)}
      />
      <CustomerPreferencesModal isOpen={isPrefsOpen} onClose={() => setIsPrefsOpen(false)} />

      {/* Category Bottom Sheet Panel */}
      <CategoryBottomSheet
        isOpen={isCategorySheetOpen}
        onClose={() => setIsCategorySheetOpen(false)}
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        dishes={dishes}
      />

      {/* Floating Zomato-Style Menu / Close FAB (matching reference image 1 & 2) */}
      {!isCustomizationOpen && (
        <div
          className={`fixed right-4 pointer-events-auto transition-all duration-200 ${
            isCategorySheetOpen ? 'z-50' : 'z-40'
          }`}
          style={{
            bottom: totals.itemCount > 0
              ? 'calc(170px + env(safe-area-inset-bottom))'
              : 'calc(94px + env(safe-area-inset-bottom))',
          }}
        >
          {isCategorySheetOpen ? (
            <button
              type="button"
              onClick={() => setIsCategorySheetOpen(false)}
              aria-label="Close menu categories"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-[16px] bg-[#2B2B36] text-white shadow-[0_8px_24px_rgba(0,0,0,0.35)] border border-white/10 hover:bg-[#343542] active:scale-95 transition-all duration-150 cursor-pointer"
            >
              <X className="w-4 h-4 text-white" />
              <span className="text-sm font-bold text-white tracking-wide">Close</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsCategorySheetOpen(true)}
              aria-label="Open menu categories"
              className="flex items-center gap-2 px-4 py-2.5 rounded-[16px] bg-[#2B2B36] text-white shadow-[0_8px_24px_rgba(0,0,0,0.35)] border border-white/10 hover:bg-[#343542] active:scale-95 transition-all duration-150 cursor-pointer"
            >
              <Utensils className="w-4 h-4 text-white" />
              <span className="text-sm font-bold text-white tracking-wide">Menu</span>
            </button>
          )}
        </div>
      )}

      {!isCustomizationOpen && <StickyCartBar />}
      {!isCustomizationOpen && <BottomNavBar />}
    </>
  );
};

export default MenuScreen;

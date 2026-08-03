import React, { useState } from 'react';
import { DISHES, CATEGORIES } from '../../utils/mockData';
import { addAuditLog } from '../../services/managerService';
import { formatMenuPrice } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import ActionConfirmationModal from '../common/ActionConfirmationModal';
import * as LucideIcons from 'lucide-react';
import {
  UtensilsCrossed,
  Search,
  Plus,
  Edit2,
  Archive,
  CheckCircle2,
  XCircle,
  Sparkles,
  X,
  Clock,
  LayoutGrid,
  BookOpen,
  History,
  Tag
} from 'lucide-react';

const CategoryIcon = ({ icon, className = 'w-3.5 h-3.5 inline' }) => {
  const LucideIcon = icon && LucideIcons[icon];
  if (LucideIcon) return <LucideIcon className={className} />;
  return icon ? <span>{icon}</span> : null;
};

const DISHES_STORAGE_KEY = 'amani_menu_dishes';
const CATEGORIES_STORAGE_KEY = 'amani_menu_categories';

const DEFAULT_DISH_FORM = {
  name: '',
  category: 'meals',
  price: '',
  prepTime: '15-20 min',
  description: '',
  ingredients: '',
  isVeg: true,
  isChefSpecial: false,
  image: '',
  availabilityStatus: 'AVAILABLE', // AVAILABLE | LIMITED | TEMPORARILY_UNAVAILABLE | SOLD_OUT
  isArchived: false,
};

const DEFAULT_CATEGORY_FORM = { name: '', icon: '🍽️' };

const ManagerMenuView = () => {
  const { showToast } = useToast();
  const [activeSection, setActiveSection] = useState('items'); // 'items' | 'categories' | 'archived'

  const [dishes, setDishes] = useState(() => {
    const saved = localStorage.getItem(DISHES_STORAGE_KEY);
    return saved ? JSON.parse(saved) : DISHES;
  });

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    return saved ? JSON.parse(saved) : CATEGORIES.filter((c) => c.id !== 'all');
  });

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState('all');

  const [isDishModalOpen, setIsDishModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState(null);
  const [dishForm, setDishForm] = useState(DEFAULT_DISH_FORM);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState(DEFAULT_CATEGORY_FORM);

  // Safe Action Confirmation Modal state
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    target: null, // { type: 'dish' | 'category', item: object }
  });

  const saveDishesToStorage = (updated) => {
    setDishes(updated);
    localStorage.setItem(DISHES_STORAGE_KEY, JSON.stringify(updated));
  };

  const saveCategoriesToStorage = (updated) => {
    setCategories(updated);
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(updated));
  };

  const handleOpenAddDishModal = () => {
    setEditingDish(null);
    setDishForm({
      ...DEFAULT_DISH_FORM,
      category: categories[0]?.id || 'meals',
      image: 'https://images.pexels.com/photos/8820783/pexels-photo-8820783.jpeg?auto=compress&cs=tinysrgb&w=1200',
    });
    setIsDishModalOpen(true);
  };

  const handleOpenEditDishModal = (dish) => {
    setEditingDish(dish);
    setDishForm({
      name: dish.name || '',
      category: dish.category || categories[0]?.id || 'meals',
      price: dish.price ? dish.price.toString() : '',
      prepTime: dish.prepTime || '15-20 min',
      description: dish.description || '',
      ingredients: dish.ingredients ? dish.ingredients.join(', ') : '',
      isVeg: dish.isVeg !== undefined ? dish.isVeg : true,
      isChefSpecial: dish.isChefSpecial || false,
      image: dish.image || '',
      availabilityStatus: dish.availabilityStatus || 'AVAILABLE',
      isArchived: dish.isArchived || false,
    });
    setIsDishModalOpen(true);
  };

  const handleUpdateAvailabilityState = (dishId, newStatus) => {
    const updated = dishes.map((d) => {
      if (d.id === dishId) {
        addAuditLog('Item Stock State Updated', `Updated ${d.name} state to ${newStatus}`, 'menu');
        showToast(`${d.name} is now ${newStatus.replace('_', ' ')}`, 'info');
        return { ...d, availabilityStatus: newStatus };
      }
      return d;
    });
    saveDishesToStorage(updated);
  };

  const initiateArchiveDish = (dish) => {
    setConfirmationModal({
      isOpen: true,
      target: { type: 'dish', item: dish }
    });
  };

  const initiateArchiveCategory = (cat) => {
    setConfirmationModal({
      isOpen: true,
      target: { type: 'category', item: cat }
    });
  };

  const handleConfirmArchive = (modalData) => {
    const { target } = confirmationModal;
    if (!target) return;

    if (target.type === 'dish') {
      const dish = target.item;
      const updated = dishes.map((d) =>
        d.id === dish.id ? { ...d, isArchived: true } : d
      );
      saveDishesToStorage(updated);
      addAuditLog(
        'MENU_ITEM_ARCHIVED',
        `Archived dish ${dish.name} - Reason: ${modalData.reason}`,
        'menu'
      );
      showToast(`Archived dish "${dish.name}" from active menu`, 'success');
    } else if (target.type === 'category') {
      const cat = target.item;
      const updated = categories.filter((c) => c.id !== cat.id);
      saveCategoriesToStorage(updated);
      addAuditLog(
        'CATEGORY_ARCHIVED',
        `Archived menu category ${cat.name} - Reason: ${modalData.reason}`,
        'menu'
      );
      showToast(`Archived category "${cat.name}"`, 'success');
    }
  };

  const handleDishFormSubmit = (e) => {
    e.preventDefault();
    if (!dishForm.name || !dishForm.price) {
      showToast('Please fill in dish name and price', 'error');
      return;
    }

    const priceNum = parseFloat(dishForm.price);
    const ingArray = dishForm.ingredients ? dishForm.ingredients.split(',').map((i) => i.trim()).filter(Boolean) : [];

    if (editingDish) {
      const updated = dishes.map((d) =>
        d.id === editingDish.id
          ? {
              ...d,
              name: dishForm.name,
              category: dishForm.category,
              price: priceNum,
              prepTime: dishForm.prepTime,
              description: dishForm.description,
              ingredients: ingArray,
              isVeg: dishForm.isVeg,
              isChefSpecial: dishForm.isChefSpecial,
              image: dishForm.image,
              availabilityStatus: dishForm.availabilityStatus,
              isArchived: dishForm.isArchived,
            }
          : d
      );
      saveDishesToStorage(updated);
      addAuditLog('Dish Updated', `Updated menu item ${dishForm.name}`, 'menu');
      showToast(`Updated "${dishForm.name}"`, 'success');
    } else {
      const newDish = {
        id: `dish-${Date.now()}`,
        name: dishForm.name,
        category: dishForm.category,
        price: priceNum,
        prepTime: dishForm.prepTime,
        description: dishForm.description,
        ingredients: ingArray,
        isVeg: dishForm.isVeg,
        isChefSpecial: dishForm.isChefSpecial,
        image: dishForm.image || 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80',
        availabilityStatus: dishForm.availabilityStatus || 'AVAILABLE',
        isArchived: false,
      };
      const updated = [newDish, ...dishes];
      saveDishesToStorage(updated);
      addAuditLog('Dish Created', `Created new dish ${dishForm.name}`, 'menu');
      showToast(`Created new dish "${dishForm.name}"`, 'success');
    }
    setIsDishModalOpen(false);
  };

  const handleCategoryFormSubmit = (e) => {
    e.preventDefault();
    if (!categoryForm.name) {
      showToast('Please provide category name', 'error');
      return;
    }

    if (editingCategory) {
      const updated = categories.map((c) =>
        c.id === editingCategory.id
          ? { ...c, name: categoryForm.name, icon: categoryForm.icon }
          : c
      );
      saveCategoriesToStorage(updated);
      addAuditLog('Category Updated', `Updated category ${categoryForm.name}`, 'menu');
      showToast(`Updated category "${categoryForm.name}"`, 'success');
    } else {
      const newCat = {
        id: `cat-${Date.now()}`,
        name: categoryForm.name,
        icon: categoryForm.icon || '🍽️',
      };
      const updated = [...categories, newCat];
      saveCategoriesToStorage(updated);
      addAuditLog('Category Created', `Created category ${categoryForm.name}`, 'menu');
      showToast(`Created category "${categoryForm.name}"`, 'success');
    }
    setIsCategoryModalOpen(false);
  };

  // Filter active dishes vs archived dishes
  const activeDishes = dishes.filter(d => !d.isArchived);
  const archivedDishes = dishes.filter(d => d.isArchived);

  const displayedDishes = (activeSection === 'archived' ? archivedDishes : activeDishes).filter((dish) => {
    const matchesCategory = selectedCategory === 'all' || dish.category === selectedCategory;
    const matchesSearch =
      dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (dish.description && dish.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStock =
      stockFilter === 'all' ||
      (stockFilter === 'in_stock' && dish.availabilityStatus === 'AVAILABLE') ||
      (stockFilter === 'out_of_stock' && dish.availabilityStatus !== 'AVAILABLE');

    return matchesCategory && matchesSearch && matchesStock;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Tabs */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/30 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-on-surface">Menu Catalog Management</h2>
          <p className="text-xs text-on-surface-variant mt-1">
            Configure dishes, prices, availability states, and category groupings
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex bg-surface-container p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveSection('items')}
              className={`px-3 py-1.5 rounded-lg transition-all ${activeSection === 'items' ? 'bg-surface-container-lowest text-on-surface shadow-xs font-bold' : 'text-on-surface-variant'}`}
            >
              Active Menu ({activeDishes.length})
            </button>
            <button
              onClick={() => setActiveSection('categories')}
              className={`px-3 py-1.5 rounded-lg transition-all ${activeSection === 'categories' ? 'bg-surface-container-lowest text-on-surface shadow-xs font-bold' : 'text-on-surface-variant'}`}
            >
              Categories ({categories.length})
            </button>
            <button
              onClick={() => setActiveSection('archived')}
              className={`px-3 py-1.5 rounded-lg transition-all ${activeSection === 'archived' ? 'bg-surface-container-lowest text-on-surface shadow-xs font-bold' : 'text-on-surface-variant'}`}
            >
              Archived History ({archivedDishes.length})
            </button>
          </div>

          {activeSection === 'items' && (
            <button
              onClick={handleOpenAddDishModal}
              className="px-4 py-2 rounded-xl bg-primary text-on-primary font-bold text-xs flex items-center gap-1.5 hover:bg-primary-container transition-all shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Dish</span>
            </button>
          )}

          {activeSection === 'categories' && (
            <button
              onClick={() => {
                setEditingCategory(null);
                setCategoryForm(DEFAULT_CATEGORY_FORM);
                setIsCategoryModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-primary text-on-primary font-bold text-xs flex items-center gap-1.5 hover:bg-primary-container transition-all shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Category</span>
            </button>
          )}
        </div>
      </div>

      {/* Dish Catalog View */}
      {(activeSection === 'items' || activeSection === 'archived') && (
        <div className="space-y-4">
          {/* Search & Category Filter Toolbar */}
          <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/30 flex flex-col md:flex-row gap-3 justify-between items-center">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-3 text-on-surface-variant" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dish name or ingredient..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/40 text-xs font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-surface-container-lowest border border-outline-variant/40 text-xs font-bold text-on-surface rounded-xl px-3 py-2 focus:outline-none"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>

              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                className="bg-surface-container-lowest border border-outline-variant/40 text-xs font-bold text-on-surface rounded-xl px-3 py-2 focus:outline-none"
              >
                <option value="all">All Availability States</option>
                <option value="in_stock">Available Only</option>
                <option value="out_of_stock">Unavailable / Limited Only</option>
              </select>
            </div>
          </div>

          {/* Dishes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayedDishes.map((dish) => {
              const catObj = categories.find((c) => c.id === dish.category);
              const currentStatus = dish.availabilityStatus || 'AVAILABLE';

              return (
                <div
                  key={dish.id}
                  className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div>
                    {/* Dish Image */}
                    <div className="relative h-40 w-full bg-surface-container-high overflow-hidden">
                      <img
                        src={dish.image}
                        alt={dish.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/60 backdrop-blur-xs text-white px-2.5 py-1 rounded-full text-[10px] font-bold">
                        <CategoryIcon icon={catObj?.icon} />
                        <span>{catObj?.name || dish.category}</span>
                      </div>

                      <div className="absolute top-3 right-3 flex items-center gap-1">
                        <select
                          value={currentStatus}
                          onChange={(e) => handleUpdateAvailabilityState(dish.id, e.target.value)}
                          className="bg-inverse-surface text-inverse-on-surface text-[10px] font-bold px-2 py-1 rounded-full border border-outline-variant/30 focus:outline-none cursor-pointer"
                        >
                          <option value="AVAILABLE">Available</option>
                          <option value="LIMITED">Limited</option>
                          <option value="TEMPORARILY_UNAVAILABLE">Temp Unavailable</option>
                          <option value="SOLD_OUT">Sold Out</option>
                        </select>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <h3 className="font-extrabold text-sm text-on-surface leading-tight">{dish.name}</h3>
                        <span className="font-mono font-extrabold text-sm text-primary shrink-0">
                          {formatMenuPrice(dish.price)}
                        </span>
                      </div>

                      <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                        {dish.description || dish.shortDescription}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-4 pt-2 border-t border-outline-variant/20 flex items-center justify-between text-xs">
                    <button
                      onClick={() => handleOpenEditDishModal(dish)}
                      className="px-3 py-1.5 rounded-xl border border-outline-variant/40 hover:bg-surface-container font-bold text-on-surface flex items-center gap-1.5 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-primary" />
                      <span>Edit</span>
                    </button>

                    {!dish.isArchived ? (
                      <button
                        onClick={() => initiateArchiveDish(dish)}
                        className="px-3 py-1.5 rounded-xl border border-error/20 hover:bg-error-container/30 text-error font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <Archive className="w-3.5 h-3.5" />
                        <span>Archive Dish</span>
                      </button>
                    ) : (
                      <span className="text-[11px] font-bold text-on-surface-variant/60 italic">Archived Record</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Category Management View */}
      {activeSection === 'categories' && (
        <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/30 shadow-sm space-y-4">
          <h3 className="font-extrabold text-base text-on-surface">Menu Categories</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="p-4 rounded-xl border border-outline-variant/40 bg-surface-container-low flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-lg font-bold">
                    <CategoryIcon icon={cat.icon} />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-on-surface">{cat.name}</h4>
                    <span className="text-[11px] text-on-surface-variant">
                      {dishes.filter((d) => d.category === cat.id && !d.isArchived).length} Active Dishes
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => initiateArchiveCategory(cat)}
                  className="p-2 rounded-xl text-error hover:bg-error-container/30 transition-colors"
                  title="Archive Category"
                >
                  <Archive className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dish Form Modal */}
      {isDishModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-outline-variant/20 pb-3">
              <h3 className="font-extrabold text-base text-on-surface">
                {editingDish ? `Edit Dish (${editingDish.name})` : 'Add New Menu Item'}
              </h3>
              <button onClick={() => setIsDishModalOpen(false)}><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleDishFormSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Dish Name *</label>
                <input
                  type="text"
                  required
                  value={dishForm.name}
                  onChange={(e) => setDishForm({ ...dishForm, name: e.target.value })}
                  placeholder="e.g. Chicken Dum Biryani"
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl p-2.5 font-semibold text-on-surface"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Category *</label>
                  <select
                    value={dishForm.category}
                    onChange={(e) => setDishForm({ ...dishForm, category: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl p-2.5 font-semibold text-on-surface"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="1"
                    value={dishForm.price}
                    onChange={(e) => setDishForm({ ...dishForm, price: e.target.value })}
                    placeholder="140"
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl p-2.5 font-semibold text-on-surface"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={dishForm.description}
                  onChange={(e) => setDishForm({ ...dishForm, description: e.target.value })}
                  placeholder="Rich, slow dum-cooked rice layered with hand-ground biryani spices..."
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl p-2.5 text-on-surface resize-none"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Availability State</label>
                <select
                  value={dishForm.availabilityStatus}
                  onChange={(e) => setDishForm({ ...dishForm, availabilityStatus: e.target.value })}
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl p-2.5 font-semibold text-on-surface"
                >
                  <option value="AVAILABLE">Available</option>
                  <option value="LIMITED">Limited</option>
                  <option value="TEMPORARILY_UNAVAILABLE">Temporarily Unavailable</option>
                  <option value="SOLD_OUT">Sold Out</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setIsDishModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-outline-variant/40 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary text-on-primary font-bold"
                >
                  Save Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Safe Action Confirmation Modal */}
      <ActionConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() => setConfirmationModal({ isOpen: false, target: null })}
        onConfirm={handleConfirmArchive}
        title={
          confirmationModal.target?.type === 'dish'
            ? `Archive Dish ${confirmationModal.target?.item?.name}?`
            : `Archive Category ${confirmationModal.target?.item?.name}?`
        }
        affectedRecord={
          confirmationModal.target?.type === 'dish'
            ? `${confirmationModal.target?.item?.name} (${formatMenuPrice(confirmationModal.target?.item?.price)})`
            : confirmationModal.target?.item?.name
        }
        consequenceExplanation={
          confirmationModal.target?.type === 'dish'
            ? 'This item will be removed from customer and waiter ordering menus, but retained in historical order logs and manager menu records.'
            : 'This category will be archived from active menu navigation.'
        }
        requiredPermission="MENU_ARCHIVE"
        currentRole="MANAGER"
        reasons={[
          'Temporarily discontinued',
          'Seasonal item',
          'Recipe unavailable',
          'Duplicate item',
          'Quality control pause',
          'Other'
        ]}
        confirmButtonText="Archive Item"
        confirmButtonVariant="danger"
      />
    </div>
  );
};

export default ManagerMenuView;

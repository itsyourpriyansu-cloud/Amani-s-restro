import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { getStoredCart, setStoredCart, clearStoredCart } from '../utils/storage';
import { calculateCartTotals } from '../utils/formatters';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => getStoredCart());
  const [tipPercentage, setTipPercentage] = useState(0); // Default 0% tip (No Tip)
  const [customTipAmount, setCustomTipAmount] = useState('');
  const [selectedTipOption, setSelectedTipOption] = useState('0'); // '0' | '5' | '10' | 'custom'
  const [packagingCharge, setPackagingCharge] = useState(0);
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [specialOrderNotes, setSpecialOrderNotes] = useState('');

  // Persist to localStorage whenever cart changes
  useEffect(() => {
    setStoredCart(cartItems);
  }, [cartItems]);

  // Compute subtotal, taxes, grandTotal dynamically
  const totals = useMemo(() => {
    let discountAmount = 0;
    const initialSubtotal = cartItems.reduce((acc, item) => {
      const basePrice = item.unitPrice !== undefined ? item.unitPrice : (
        item.price + (item.selectedCustomizations?.reduce((cAcc, opt) => cAcc + (opt.priceDelta || opt.price || 0), 0) || 0)
      );
      return acc + (basePrice * item.quantity);
    }, 0);

    if (appliedPromo && appliedPromo.discountPercent) {
      discountAmount = (initialSubtotal * appliedPromo.discountPercent) / 100;
    }

    return calculateCartTotals(cartItems, tipPercentage, discountAmount, packagingCharge, selectedTipOption === 'custom' ? customTipAmount : null);
  }, [cartItems, tipPercentage, customTipAmount, selectedTipOption, packagingCharge, appliedPromo]);

  // Add item to cart or increment if identical item (same dish id + same customizations + same note) exists
  const addToCart = (dish, selectedCustomizations = [], note = '', initialQuantity = 1, metadata = {}) => {
    setCartItems((prevItems) => {
      const formattedCustomizations = Array.isArray(selectedCustomizations) ? selectedCustomizations : [];
      const customKey = JSON.stringify({
        dishId: dish.id,
        customizations: formattedCustomizations.map(c => c.label || c.name).sort(),
        note: (note || '').trim(),
        allergyAlert: (metadata.allergyAlert || '').trim(),
        makeVegan: !!metadata.makeVegan,
        jainPreparation: !!metadata.jainPreparation,
      });

      const existingIndex = prevItems.findIndex(
        (item) => item.customKey === customKey
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + initialQuantity,
        };
        return updated;
      } else {
        const cartItemId = `${dish.id}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        
        // Calculate unit price if not pre-calculated in metadata
        const customizationsExtra = formattedCustomizations.reduce((acc, c) => acc + (c.priceDelta || c.price || 0), 0);
        const unitPrice = metadata.unitPrice !== undefined ? metadata.unitPrice : (dish.price + customizationsExtra);

        return [
          ...prevItems,
          {
            cartItemId,
            customKey,
            id: dish.id,
            name: dish.name,
            italianName: dish.italianName,
            price: dish.price,
            unitPrice,
            image: dish.image,
            isVeg: dish.foodType ? (dish.foodType === 'VEGETARIAN' || dish.foodType === 'VEGAN') : dish.isVeg,
            quantity: initialQuantity,
            selectedCustomizations: formattedCustomizations,
            selectedOptions: metadata.selectedOptions || {},
            makeVegan: metadata.makeVegan || false,
            jainPreparation: metadata.jainPreparation || false,
            allergyAlert: metadata.allergyAlert || null,
            itemNote: note || '',
            originalDish: dish,
          },
        ];
      }
    });
  };

  // Update customization of an existing item in cart
  const updateCartItemCustomization = (cartItemId, newPayload) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.cartItemId !== cartItemId) return item;

        const { dish, quantity, formattedModifiers, allergyAlert, specialInstruction, selectedOptions, makeVegan, jainPreparation } = newPayload;
        const customizationsExtra = formattedModifiers.reduce((acc, c) => acc + (c.priceDelta || c.price || 0), 0);
        const unitPrice = dish.price + customizationsExtra;

        const customKey = JSON.stringify({
          dishId: dish.id,
          customizations: formattedModifiers.map(c => c.label || c.name).sort(),
          note: (specialInstruction || '').trim(),
          allergyAlert: (allergyAlert || '').trim(),
          makeVegan: !!makeVegan,
          jainPreparation: !!jainPreparation,
        });

        return {
          ...item,
          customKey,
          quantity: quantity || item.quantity,
          unitPrice,
          selectedCustomizations: formattedModifiers,
          selectedOptions: selectedOptions || {},
          makeVegan: !!makeVegan,
          jainPreparation: !!jainPreparation,
          allergyAlert: allergyAlert || null,
          itemNote: specialInstruction || '',
        };
      })
    );
  };

  // Update item quantity
  const updateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.cartItemId === cartItemId || item.id === cartItemId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Remove item by ID or cartItemId
  const removeFromCart = (targetId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.cartItemId !== targetId && item.id !== targetId));
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
    setAppliedPromo(null);
    setSpecialOrderNotes('');
    clearStoredCart();
  };

  // Quick helper: check quantity of dish in cart by dish id
  const getDishQuantityInCart = (dishId) => {
    return cartItems
      .filter((item) => item.id === dishId)
      .reduce((acc, item) => acc + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateCartItemCustomization,
        updateQuantity,
        removeFromCart,
        clearCart,
        getDishQuantityInCart,
        tipPercentage,
        setTipPercentage,
        customTipAmount,
        setCustomTipAmount,
        selectedTipOption,
        setSelectedTipOption,
        packagingCharge,
        setPackagingCharge,
        appliedPromo,
        setAppliedPromo,
        specialOrderNotes,
        setSpecialOrderNotes,
        totals,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_COUPONS } from '../services/mockData';

const CartContext = createContext();

const CART_STORAGE_KEY = 'mak_power_cart_items';
const COUPON_STORAGE_KEY = 'mak_power_active_coupon';

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeCoupon, setActiveCoupon] = useState(() => {
    try {
      const saved = localStorage.getItem(COUPON_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (activeCoupon) {
      localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(activeCoupon));
    } else {
      localStorage.removeItem(COUPON_STORAGE_KEY);
    }
  }, [activeCoupon]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => item.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: Math.min(newQty, product.stock || 99)
        };
        showToast(`Updated "${product.name}" quantity to ${updated[existingIndex].quantity}`);
        return updated;
      } else {
        showToast(`Added "${product.name}" to Cart 🛒`);
        return [
          ...prev,
          {
            id: product.id,
            slug: product.slug,
            name: product.name,
            price: Number(product.sellingPrice),
            originalPrice: Number(product.originalPrice),
            image: product.images?.[0] || '/image/featured-electronics.jpg',
            categoryName: product.categoryName,
            stock: product.stock,
            quantity: Math.max(1, quantity)
          }
        ];
      }
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId
          ? { ...item, quantity: Math.min(newQuantity, item.stock || 99) }
          : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => {
      const itemToRemove = prev.find(i => i.id === productId);
      if (itemToRemove) {
        showToast(`Removed "${itemToRemove.name}" from cart`);
      }
      return prev.filter(item => item.id !== productId);
    });
  };

  const clearCart = () => {
    setCartItems([]);
    setActiveCoupon(null);
  };

  // Calculations
  const totalItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Free shipping over ₹499
  const shippingCharge = subtotal > 0 && subtotal < 499 ? 49 : 0;

  // Coupon discount calculation
  let discountAmount = 0;
  if (activeCoupon && subtotal >= (activeCoupon.minOrderValue || 0)) {
    if (activeCoupon.discountType === 'percentage') {
      const rawDiscount = (subtotal * activeCoupon.discountValue) / 100;
      discountAmount = activeCoupon.maxDiscount ? Math.min(rawDiscount, activeCoupon.maxDiscount) : rawDiscount;
    } else {
      discountAmount = activeCoupon.discountValue;
    }
  }

  const finalTotal = Math.max(0, subtotal - discountAmount + shippingCharge);

  const applyCoupon = (code) => {
    const cleanCode = code.trim().toUpperCase();
    const found = INITIAL_COUPONS.find(c => c.code.toUpperCase() === cleanCode);
    if (!found) {
      return { success: false, message: 'Invalid coupon code.' };
    }
    if (subtotal < (found.minOrderValue || 0)) {
      return { success: false, message: `Minimum order of ₹${found.minOrderValue} required for this coupon.` };
    }
    setActiveCoupon(found);
    showToast(`Coupon "${found.code}" applied! You saved ₹${discountAmount}`);
    return { success: true, message: `Coupon applied successfully!` };
  };

  const removeCoupon = () => {
    setActiveCoupon(null);
    showToast('Coupon removed');
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItemsCount,
        subtotal,
        shippingCharge,
        discountAmount,
        activeCoupon,
        applyCoupon,
        removeCoupon,
        finalTotal,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        toastMessage,
        showToast
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { CartItem, Product } from '@/types';
import { useAuth } from './AuthContext';

interface CartContextType {
  items: Record<string, CartItem>;
  itemCount: number;
  addToCart: (product: Product, qty?: number) => void;
  updateQuantity: (productId: string, qty: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getTotalQty: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'bco_cart';

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<Record<string, CartItem>>(() => {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // When user logs in, we could sync with server here
  useEffect(() => {
    if (user) {
      // TODO: Sync cart with Firestore when Firebase is integrated
      console.log('User logged in, sync cart with server');
    }
  }, [user]);

  const itemCount = Object.values(items).reduce((sum, item) => sum + item.qty, 0);

  const addToCart = useCallback((product: Product, qty: number = 1) => {
    setItems(prev => {
      const existing = prev[product.id];
      const newQty = existing ? existing.qty + qty : qty;
      
      return {
        ...prev,
        [product.id]: {
          productId: product.id,
          nameSnapshot: product.name,
          priceSnapshot: product.priceRetail,
          imageUrlSnapshot: product.imageUrl,
          qty: Math.min(newQty, product.stock),
        },
      };
    });
  }, []);

  const updateQuantity = useCallback((productId: string, qty: number) => {
    if (qty <= 0) {
      setItems(prev => {
        const { [productId]: removed, ...rest } = prev;
        return rest;
      });
    } else {
      setItems(prev => ({
        ...prev,
        [productId]: {
          ...prev[productId],
          qty,
        },
      }));
    }
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setItems(prev => {
      const { [productId]: removed, ...rest } = prev;
      return rest;
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems({});
  }, []);

  const getSubtotal = useCallback(() => {
    return Object.values(items).reduce((sum, item) => sum + item.priceSnapshot * item.qty, 0);
  }, [items]);

  const getTotalQty = useCallback(() => {
    return Object.values(items).reduce((sum, item) => sum + item.qty, 0);
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getSubtotal,
        getTotalQty,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

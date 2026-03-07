import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number, customText?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('doll_shop_cart');
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      // If any item has a numeric ID, it's from the old system. Clear it.
      if (Array.isArray(parsed) && parsed.some(item => typeof item.id === 'number')) {
        localStorage.removeItem('doll_shop_cart');
        return [];
      }
      return parsed;
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('doll_shop_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, quantity: number, customText?: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.custom_text === customText);
      if (existing) {
        return prev.map(item => 
          (item.id === product.id && item.custom_text === customText) 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      }
      return [...prev, { ...product, quantity, custom_text: customText }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

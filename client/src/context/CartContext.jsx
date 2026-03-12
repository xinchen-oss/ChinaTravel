import { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';

const CartContext = createContext();

const CART_KEY = 'chinatravel_cart';

export function CartProvider({ children }) {
  const { user } = useContext(AuthContext);

  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  // Clear cart when user logs out
  useEffect(() => {
    if (!user) {
      setItems([]);
      localStorage.removeItem(CART_KEY);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (item) => {
    // item: { guideId, titulo, ciudad, precio, duracionDias, imagen, customizations }
    setItems((prev) => {
      const exists = prev.find((i) => i.guideId === item.guideId);
      if (exists) return prev;
      return [...prev, { ...item, addedAt: Date.now() }];
    });
  };

  const removeItem = (guideId) => {
    setItems((prev) => prev.filter((i) => i.guideId !== guideId));
  };

  const clearCart = () => setItems([]);

  const isInCart = (guideId) => items.some((i) => i.guideId === guideId);

  const count = items.length;

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, isInCart, count }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);

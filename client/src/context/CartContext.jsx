import { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';

const CartContext = createContext();

const CART_KEY = 'chinatravel_cart';

// A cart item is identified by its type + id, so a Ruta and an Actividad
// with the same underlying id never collide.
const keyOf = (tipo, id) => `${tipo}:${id}`;

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

  // item: { tipo: 'RUTA'|'ACTIVIDAD', id, titulo, ciudad, precio, imagen, ... }
  //   RUTA also carries: duracionDias, customizations
  //   ACTIVIDAD also carries: fechaVisita, horaVisita
  const addItem = (item) => {
    setItems((prev) => {
      const k = keyOf(item.tipo, item.id);
      if (prev.some((i) => keyOf(i.tipo, i.id) === k)) return prev;
      return [...prev, { ...item, addedAt: Date.now() }];
    });
  };

  const updateItem = (tipo, id, updates) => {
    setItems((prev) => prev.map((i) => (keyOf(i.tipo, i.id) === keyOf(tipo, id) ? { ...i, ...updates } : i)));
  };

  const removeItem = (tipo, id) => {
    setItems((prev) => prev.filter((i) => keyOf(i.tipo, i.id) !== keyOf(tipo, id)));
  };

  const clearCart = () => setItems([]);

  const isInCart = (tipo, id) => items.some((i) => keyOf(i.tipo, i.id) === keyOf(tipo, id));

  const count = items.length;

  return (
    <CartContext.Provider value={{ items, addItem, updateItem, removeItem, clearCart, isInCart, count }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);

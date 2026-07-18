import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartCtx = createContext(null);
const STORAGE_KEY = 'tanyy_cart_v1';

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch (e) {
      console.warn('CartContext: could not read cart from localStorage:', e?.message);
    }
  }, []);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }
    catch (e) { console.warn('CartContext: could not persist cart to localStorage:', e?.message); }
  }, [items]);

  const add = (item, qty = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.id === item.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + qty };
        return next;
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, image: item.image, qty }];
    });
  };
  const setQty = (id, qty) => setItems((prev) => prev.map((p) => (p.id === id ? { ...p, qty: Math.max(1, qty) } : p)));
  const remove = (id) => setItems((prev) => prev.filter((p) => p.id !== id));
  const clear = () => setItems([]);

  const subtotal = useMemo(() => items.reduce((s, i) => s + i.price * i.qty, 0), [items]);
  const count = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items]);

  // Cart data is non-sensitive (menu items + quantities). Persisted to localStorage so the cart
  // survives reloads — httpOnly cookies aren't possible in a pure client-side app.
  const value = useMemo(
    () => ({ items, add, setQty, remove, clear, subtotal, count, open, setOpen }),
    [items, subtotal, count, open]
  );
  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export const useCart = () => {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

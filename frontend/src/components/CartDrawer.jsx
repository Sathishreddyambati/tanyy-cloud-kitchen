import { AnimatePresence, motion } from 'framer-motion';
import { X, Minus, Plus, Trash2, Clock, BadgeCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';

export default function CartDrawer() {
  const { items, open, setOpen, setQty, remove, subtotal } = useCart();
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} data-testid="cart-overlay" />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
            className="fixed right-0 top-0 h-full w-full max-w-md z-[70] flex flex-col"
            style={{ background: 'var(--tk-bg)' }}
            data-testid="cart-drawer"
          >
            <header className="flex items-center justify-between px-6 py-5 border-b border-[color:var(--tk-border)]">
              <div>
                <div className="text-[10px] tracking-[0.3em] uppercase text-[color:var(--tk-accent)]">Your Order</div>
                <div className="font-serif text-2xl">Cart</div>
              </div>
              <button data-testid="close-cart-btn" onClick={() => setOpen(false)} className="w-10 h-10 rounded-full grid place-items-center hover:bg-[color:var(--tk-accent)]/10"><X size={18} /></button>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-16">
                  <div className="mx-auto w-16 h-16 rounded-full grid place-items-center border border-[color:var(--tk-border)]"><Clock size={22} /></div>
                  <div className="mt-4 font-serif text-xl">Your cart is empty</div>
                  <div className="text-sm text-[color:var(--tk-text-soft)] mt-1">Add a homestyle meal to get started.</div>
                </div>
              ) : items.map((it) => (
                <div key={it.id} data-testid={`cart-item-${it.id}`} className="flex gap-4 p-3 rounded-2xl border border-[color:var(--tk-border)]">
                  <img src={it.image} alt={it.name} className="w-20 h-20 object-cover rounded-xl" />
                  <div className="flex-1 min-w-0">
                    <div className="font-serif text-base leading-tight">{it.name}</div>
                    <div className="text-xs text-[color:var(--tk-text-soft)] mt-1">₹{it.price} each</div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center rounded-full border border-[color:var(--tk-border)]">
                        <button data-testid={`cart-minus-${it.id}`} onClick={() => setQty(it.id, it.qty - 1)} className="w-8 h-8 grid place-items-center"><Minus size={12} /></button>
                        <span className="w-6 text-center text-xs">{it.qty}</span>
                        <button data-testid={`cart-plus-${it.id}`} onClick={() => setQty(it.id, it.qty + 1)} className="w-8 h-8 grid place-items-center"><Plus size={12} /></button>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-sm font-medium">₹{it.price * it.qty}</div>
                        <button data-testid={`cart-remove-${it.id}`} onClick={() => remove(it.id)} className="text-[color:var(--tk-text-soft)] hover:text-red-500"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {items.length > 0 && (
              <footer className="border-t border-[color:var(--tk-border)] px-6 py-5 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[color:var(--tk-text-soft)]">Subtotal</span>
                  <span data-testid="cart-subtotal">₹{subtotal}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[color:var(--tk-text-soft)] inline-flex items-center gap-1.5"><BadgeCheck size={14} className="text-[color:var(--tk-accent)]" /> Delivery</span>
                  <span className="text-[color:var(--tk-accent)] font-medium">FREE</span>
                </div>
                <div className="flex items-center justify-between border-t border-dashed border-[color:var(--tk-border)] pt-3">
                  <span className="font-serif text-lg">Total</span>
                  <span data-testid="cart-total" className="font-serif text-2xl">₹{subtotal}</span>
                </div>
                <div className="text-[11px] text-[color:var(--tk-text-soft)] flex items-center gap-1.5"><Clock size={12} /> Estimated delivery • 35–45 min</div>
                <button
                  data-testid="checkout-btn"
                  onClick={() => { setOpen(false); navigate('/checkout'); }}
                  className="tk-btn-primary w-full rounded-full py-3.5 text-sm uppercase tracking-widest"
                >
                  Proceed to Checkout
                </button>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

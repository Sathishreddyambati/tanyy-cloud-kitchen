import { motion } from 'framer-motion';
import { useState } from 'react';
import { Minus, Plus, ShoppingBag, Star } from 'lucide-react';
import { MENU } from '@/data/menu';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

function MenuCard({ item, index }) {
  const [qty, setQty] = useState(1);
  const { add, setOpen } = useCart();
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ delay: index * 0.08, duration: 0.6 }}
      className="tk-card overflow-hidden hover-lift group"
      data-testid={`menu-card-${item.id}`}
    >
      <div className="relative">
        <img src={item.image} alt={item.name} loading="lazy" className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute top-4 left-4 glass px-3 py-1.5 rounded-full text-[10px] uppercase tracking-[0.25em] flex items-center gap-1.5">
          <Star size={12} className="text-[color:var(--tk-accent)] fill-[color:var(--tk-accent)]" /> {item.badge}
        </div>
        <div className="absolute bottom-4 right-4 glass rounded-full px-3.5 py-1.5">
          <span className="font-serif text-lg">₹{item.price}</span>
        </div>
      </div>
      <div className="p-6 sm:p-7">
        <div className="text-[11px] uppercase tracking-[0.28em] text-[color:var(--tk-accent)]">{item.tagline}</div>
        <h3 className="mt-3 font-serif text-2xl sm:text-[26px] leading-tight">{item.name}</h3>
        <p className="mt-3 text-sm text-[color:var(--tk-text-soft)] leading-relaxed">{item.description}</p>

        <div className="mt-6 flex items-center justify-between gap-3">
          <div className="flex items-center rounded-full border border-[color:var(--tk-border)]">
            <button data-testid={`qty-minus-${item.id}`} onClick={() => setQty((v) => Math.max(1, v - 1))} className="w-9 h-9 grid place-items-center hover:text-[color:var(--tk-accent)]"><Minus size={14} /></button>
            <span data-testid={`qty-value-${item.id}`} className="w-8 text-center text-sm font-medium">{qty}</span>
            <button data-testid={`qty-plus-${item.id}`} onClick={() => setQty((v) => v + 1)} className="w-9 h-9 grid place-items-center hover:text-[color:var(--tk-accent)]"><Plus size={14} /></button>
          </div>
          <button
            data-testid={`add-to-cart-${item.id}`}
            onClick={() => { add(item, qty); setOpen(true); toast.success(`${item.name} added to cart`); }}
            className="tk-btn-primary rounded-full px-5 py-2.5 text-xs uppercase tracking-widest inline-flex items-center gap-2"
          >
            <ShoppingBag size={14} /> Add to Cart
          </button>
        </div>
      </div>
    </motion.article>
  );
}

export default function MenuSection({ title = 'Our Menu', showEyebrow = true, id = 'menu' }) {
  return (
    <section id={id} data-testid="menu-section" className="mx-auto max-w-7xl px-5 sm:px-8 py-16 sm:py-24">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          {showEyebrow && <div className="text-xs uppercase tracking-[0.3em] text-[color:var(--tk-accent)]">Freshly Cooked Today</div>}
          <h2 className="mt-3 font-serif text-4xl sm:text-5xl tracking-tight leading-tight">{title}</h2>
        </div>
        <div className="glass px-4 py-2 rounded-full text-[11px] uppercase tracking-[0.25em]">Free delivery • Every order</div>
      </div>
      <div className="mt-12 grid gap-8 md:grid-cols-2 max-w-5xl">
        {MENU.map((m, i) => <MenuCard key={m.id} item={m} index={i} />)}
      </div>
    </section>
  );
}

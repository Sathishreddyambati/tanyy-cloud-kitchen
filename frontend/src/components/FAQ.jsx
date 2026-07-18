import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const FAQS = [
  {
    q: 'Do you cook fresh for every order?',
    a: 'Absolutely. Nothing is pre-cooked or reheated. Our chef fires up the pan only after you place an order — that\'s why your food takes 35–45 minutes to reach you.',
  },
  {
    q: 'What areas do you deliver to?',
    a: 'We currently deliver across most zones in the city. If your pincode is not covered, our WhatsApp team will reach out and confirm before your order is prepared.',
  },
  {
    q: 'Is delivery really free?',
    a: 'Yes. Every order comes with FREE delivery — no hidden charges, no minimum-order tricks. What you see is what you pay.',
  },
  {
    q: 'How do I pay for my order?',
    a: 'We currently accept Cash on Delivery. Simply hand over the exact amount to our delivery partner when your order arrives.',
  },
  {
    q: 'How can I track my order?',
    a: 'The moment you place an order, you receive a WhatsApp confirmation with a unique tracking link and Order ID (TK######). Click the link anytime to see live status — Pending → Preparing → Out for Delivery → Delivered.',
  },
  {
    q: 'Is your kitchen FSSAI certified?',
    a: 'Yes. TANYY Cloud Kitchen is fully FSSAI licensed (Lic. No. 22426573000559). We follow strict hygiene protocols, use fresh ingredients daily, and maintain a spotless kitchen you\'d be proud to eat in.',
  },
  {
    q: 'Can I cancel or modify my order?',
    a: 'You can cancel within 2 minutes of placing an order by messaging us on WhatsApp. Once cooking has started, cancellation is not possible — because we start cooking immediately for you.',
  },
  {
    q: 'How spicy is the chicken curry?',
    a: 'It has an authentic Andhra kick — medium-hot for most palates. If you\'d prefer it milder, just add a note in the "Delivery Instructions" box at checkout and we\'ll adjust for you.',
  },
];

function Item({ item, open, onToggle, idx }) {
  return (
    <div className="border-b border-[color:var(--tk-border)]">
      <button
        data-testid={`faq-toggle-${idx}`}
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-6 py-6 text-left group"
      >
        <span className="font-serif text-lg sm:text-xl group-hover:text-[color:var(--tk-accent)] transition-colors">{item.q}</span>
        <span className="w-9 h-9 rounded-full grid place-items-center border border-[color:var(--tk-border)] group-hover:border-[color:var(--tk-accent)] group-hover:text-[color:var(--tk-accent)] transition shrink-0">
          {open ? <Minus size={14} /> : <Plus size={14} />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="pb-6 pr-14 text-[color:var(--tk-text-soft)] leading-relaxed text-[15px]">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" data-testid="faq-section" className="mx-auto max-w-7xl px-5 sm:px-8 py-20 sm:py-28">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="text-xs uppercase tracking-[0.3em] text-[color:var(--tk-accent)]">FAQ</div>
          <h2 className="mt-3 font-serif text-4xl sm:text-5xl tracking-tight leading-tight">
            Questions,<br /><span className="font-editorial italic text-[color:var(--tk-text-soft)]">answered.</span>
          </h2>
          <p className="mt-5 text-[color:var(--tk-text-soft)] max-w-sm">
            Everything you'd ask before that first bite — the honest way. Can't find your question? Ping us on WhatsApp anytime.
          </p>
        </div>
        <div className="lg:col-span-8">
          <div className="tk-card px-6 sm:px-8">
            {FAQS.map((f, i) => (
              <Item key={f.q} item={f} idx={i} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

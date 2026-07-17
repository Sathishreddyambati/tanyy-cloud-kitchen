import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Home, ShoppingBag, Clock, MessageCircle } from 'lucide-react';

export default function SuccessPage() {
  const [params] = useSearchParams();
  const order = params.get('order') || 'TK100000';
  const [waUrl, setWaUrl] = useState('');
  useEffect(() => {
    try { setWaUrl(sessionStorage.getItem('tanyy_last_wa') || ''); } catch (_) {}
  }, []);

  return (
    <div className="min-h-[70vh] grid place-items-center px-5 py-16">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="tk-card max-w-lg w-full p-8 sm:p-10 text-center" data-testid="success-card">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 180, damping: 14, delay: 0.1 }} className="mx-auto w-20 h-20 rounded-full grid place-items-center bg-[color:var(--tk-accent)]/15 text-[color:var(--tk-accent)]">
          <CheckCircle2 size={40} />
        </motion.div>
        <div className="mt-6 text-xs uppercase tracking-[0.3em] text-[color:var(--tk-accent)]">Order Confirmed</div>
        <h1 className="mt-2 font-serif text-4xl">Thank you ❤️</h1>
        <p className="mt-3 text-[color:var(--tk-text-soft)] text-sm">Your order has been received. We're firing up the pans now.</p>
        <div className="mt-6 rounded-2xl border border-dashed border-[color:var(--tk-border)] p-5">
          <div className="text-[11px] tracking-[0.25em] uppercase text-[color:var(--tk-text-soft)]">Order Number</div>
          <div data-testid="order-number" className="mt-1 font-serif text-3xl">{order}</div>
          <div className="mt-3 text-xs text-[color:var(--tk-text-soft)] inline-flex items-center gap-1.5"><Clock size={12} /> Estimated delivery • 35–45 min</div>
        </div>

        {waUrl && (
          <a
            href={waUrl}
            target="_blank"
            rel="noreferrer"
            data-testid="resend-whatsapp-btn"
            className="mt-6 tk-btn-primary rounded-full px-6 py-3 text-xs uppercase tracking-widest inline-flex items-center justify-center gap-2 w-full"
          >
            <MessageCircle size={14} /> Send Order on WhatsApp
          </a>
        )}

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Link to="/menu" data-testid="continue-shopping-btn" className="tk-btn-outline rounded-full py-3 text-xs uppercase tracking-widest inline-flex items-center justify-center gap-2"><ShoppingBag size={14} /> Continue</Link>
          <Link to="/" data-testid="back-home-btn" className="tk-btn-primary rounded-full py-3 text-xs uppercase tracking-widest inline-flex items-center justify-center gap-2"><Home size={14} /> Home</Link>
        </div>
      </motion.div>
    </div>
  );
}

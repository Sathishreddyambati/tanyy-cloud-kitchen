import { motion } from 'framer-motion';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section data-testid="hero-section" className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 pt-8 md:pt-14 pb-10">
        <div className="grid gap-10 lg:gap-14 lg:grid-cols-12 items-center">
          {/* Copy */}
          <div className="lg:col-span-6 relative z-10">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-[11px] tracking-[0.28em] uppercase">
              <Sparkles size={12} className="text-[color:var(--tk-accent)]" /> Freshly Cooked Every Order
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.8 }} className="mt-6 font-serif text-5xl sm:text-6xl md:text-7xl leading-[0.98] tracking-tighter">
              Homestyle
              <br />
              Food, <span className="italic font-editorial text-[color:var(--tk-accent)]">Made with Love.</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.7 }} className="mt-6 max-w-xl text-base sm:text-lg text-[color:var(--tk-text-soft)] leading-relaxed">
              Freshly prepared Andhra homestyle meals — long-grain bagara rice, slow-simmered chicken curry, hand-rolled chapatis — delivered straight to your doorstep.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }} className="mt-8 flex flex-wrap items-center gap-4">
              <Link to="/menu" data-testid="hero-order-now" className="tk-btn-primary inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm uppercase tracking-widest font-medium">
                Order Now <ArrowUpRight size={16} />
              </Link>
              <Link to="/menu" data-testid="hero-explore-menu" className="tk-btn-outline inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm uppercase tracking-widest font-medium">
                Explore Menu
              </Link>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="mt-10 grid grid-cols-3 max-w-md gap-6">
              {[
                { k: '4.9★', v: 'Loved by locals' },
                { k: '<45m', v: 'Doorstep delivery' },
                { k: '₹99', v: 'Homestyle meals' },
              ].map((s) => (
                <div key={s.k}>
                  <div className="font-serif text-2xl text-[color:var(--tk-accent)]">{s.k}</div>
                  <div className="text-[11px] uppercase tracking-[0.2em] text-[color:var(--tk-text-soft)] mt-1">{s.v}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Image */}
          <div className="lg:col-span-6 relative">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9 }} className="relative">
              <div className="absolute -inset-6 rounded-[2rem] bg-[color:var(--tk-accent)]/10 blur-3xl" aria-hidden />
              <div className="relative rounded-[1.75rem] overflow-hidden border border-[color:var(--tk-border)] shadow-[0_30px_80px_rgba(9,40,30,0.35)]">
                <img src="/images/flavoured-rice.png" alt="Flavoured Rice with Chicken Curry" className="w-full h-[420px] sm:h-[520px] object-cover" />
              </div>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="hidden sm:flex absolute -left-8 bottom-10 glass rounded-2xl px-4 py-3 items-center gap-3">
                <img src="/images/chapati-set.png" alt="Chapati Set" className="w-12 h-12 rounded-xl object-cover" />
                <div>
                  <div className="text-sm font-medium">Chapati Set</div>
                  <div className="text-xs text-[color:var(--tk-text-soft)]">₹99 • Homestyle</div>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="hidden md:block absolute -right-4 top-8 glass rounded-2xl px-4 py-3">
                <div className="text-[10px] uppercase tracking-[0.25em] text-[color:var(--tk-text-soft)]">Andhra Style</div>
                <div className="font-serif text-xl">Bagara Rice</div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Marquee ticker */}
      <div className="border-y border-[color:var(--tk-border)] py-4 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, r) => (
            <div key={`marquee-row-${r}`} className="flex items-center gap-10 pr-10 text-sm uppercase tracking-[0.3em] text-[color:var(--tk-text-soft)]">
              {['Fresh Ingredients', 'Hygienic Kitchen', 'Homestyle Cooking', 'Free Delivery', 'Freshly Cooked', 'Premium Quality', 'Made with Love'].map((t) => (
                <span key={`${r}-${t}`} className="flex items-center gap-10">
                  <span>{t}</span>
                  <span className="text-[color:var(--tk-accent)]">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

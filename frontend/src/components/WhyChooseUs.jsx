import { motion } from 'framer-motion';
import { Sprout, ShieldCheck, ChefHat, Bike, BadgeIndianRupee, Flame, Sparkles, Award } from 'lucide-react';
import { FEATURES } from '@/data/menu';

const iconMap = { Sprout, ShieldCheck, ChefHat, Bike, BadgeIndianRupee, Flame, Sparkles, Award };

export default function WhyChooseUs() {
  return (
    <section data-testid="why-choose-us" className="mx-auto max-w-7xl px-5 sm:px-8 py-20 sm:py-28">
      <div className="flex items-end justify-between gap-6 flex-wrap">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-[color:var(--tk-accent)]">Why Mother's Touch</div>
          <h2 className="mt-3 font-serif text-4xl sm:text-5xl tracking-tight leading-tight max-w-2xl">
            Not just a meal —<br /><span className="font-editorial italic text-[color:var(--tk-text-soft)]">a homestyle ritual.</span>
          </h2>
        </div>
        <p className="max-w-sm text-[color:var(--tk-text-soft)] text-sm sm:text-base">
          Every plate we serve is a small love letter to Andhra cooking — hand-cooked, never mass-produced.
        </p>
      </div>

      <div className="mt-14 grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => {
          const Icon = iconMap[f.icon] || Sparkles;
          const span = i === 0 ? 'lg:col-span-2' : '';
          return (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: i * 0.05, duration: 0.55 }}
              className={`group tk-card p-7 hover-lift relative overflow-hidden ${span}`}
              data-testid={`feature-${f.title.replace(/\s+/g, '-').toLowerCase()}`}
            >
              <div className="w-12 h-12 rounded-full grid place-items-center border border-[color:var(--tk-border)] group-hover:border-[color:var(--tk-accent)] transition">
                <Icon size={20} className="text-[color:var(--tk-accent)]" />
              </div>
              <div className="mt-6 font-serif text-2xl">{f.title}</div>
              <div className="mt-2 text-sm text-[color:var(--tk-text-soft)] max-w-sm">{f.copy}</div>
              <div className="absolute -right-16 -bottom-16 w-40 h-40 rounded-full bg-[color:var(--tk-accent)]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

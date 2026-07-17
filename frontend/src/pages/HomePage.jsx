import Hero from '@/components/Hero';
import WhyChooseUs from '@/components/WhyChooseUs';
import MenuSection from '@/components/MenuSection';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <div>
      <Hero />
      <WhyChooseUs />
      <MenuSection title="Signature Homestyle Plates" />

      <section className="mx-auto max-w-7xl px-5 sm:px-8 py-20 sm:py-28">
        <div className="tk-card grain relative overflow-hidden p-10 sm:p-16 grid gap-10 lg:grid-cols-2 items-center">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-[color:var(--tk-accent)]">From our kitchen</div>
            <h2 className="mt-3 font-serif text-4xl sm:text-5xl leading-tight">Cooked fresh. <span className="italic font-editorial">Delivered fast.</span></h2>
            <p className="mt-5 text-[color:var(--tk-text-soft)] max-w-lg">We start cooking only after you place your order — no reheated meals, no shortcuts. That's our promise, one plate at a time.</p>
            <motion.a href="/menu" whileHover={{ x: 4 }} className="mt-8 inline-flex items-center gap-2 text-[color:var(--tk-accent)] uppercase tracking-widest text-sm">
              Order a plate today →
            </motion.a>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src="/images/flavoured-rice.png" alt="" className="rounded-2xl aspect-square object-cover w-full" />
            <img src="/images/chapati-set.png" alt="" className="rounded-2xl aspect-square object-cover w-full mt-6" />
          </div>
        </div>
      </section>
    </div>
  );
}

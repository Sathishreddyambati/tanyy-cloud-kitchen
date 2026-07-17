import MenuSection from '@/components/MenuSection';

export default function MenuPage() {
  return (
    <div>
      <div className="mx-auto max-w-7xl px-5 sm:px-8 pt-14 pb-2">
        <div className="text-xs uppercase tracking-[0.3em] text-[color:var(--tk-accent)]">Our Menu</div>
        <h1 className="mt-3 font-serif text-5xl sm:text-6xl leading-tight tracking-tighter">Two plates.<br /><span className="italic font-editorial text-[color:var(--tk-text-soft)]">One love story.</span></h1>
        <p className="mt-5 max-w-2xl text-[color:var(--tk-text-soft)]">We keep our menu small so every plate is perfect. Freshly cooked to order — no shortcuts, ever.</p>
      </div>
      <MenuSection title="Freshly Cooked to Order" showEyebrow={false} />
    </div>
  );
}

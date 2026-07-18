import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

const REVIEWS = [
  {
    name: 'Sathish Reddy',
    city: 'Madurai',
    text: 'Tastes exactly like my Amma\'s cooking from Guntur. The bagara rice was so fragrant and the chicken curry — perfectly spicy. Ordered thrice this week already.',
    rating: 5,
  },
  {
    name: 'Priya Iyer',
    city: 'Banjara Hills',
    text: 'Beautifully packed, arrived hot, and the chapatis were still soft. Honestly better than most restaurants at 3× the price. My new weekday lunch.',
    rating: 5,
  },
  {
    name: 'Rahul Menon',
    city: 'Kondapur',
    text: 'That fried onion garnish on the rice? Chef\'s kiss. You can tell they cook only after you order — nothing tasted reheated. Rare in a cloud kitchen.',
    rating: 5,
  },
  {
    name: 'Ananya Sharma',
    city: 'Jubilee Hills',
    text: 'The chicken curry has that proper deep Andhra kick — not the watered-down version. Delivery was 32 mins, still steaming. Instant reorder.',
    rating: 5,
  },
  {
    name: 'Vikram Rao',
    city: 'Gachibowli',
    text: 'Ordered on a bad Monday and it fixed my whole week. Free delivery is a small touch that means a lot when you\'re on a tight budget.',
    rating: 5,
  },
  {
    name: 'Meera Krishnan',
    city: 'Hitech City',
    text: 'The presentation in the black bowls, the aroma when I opened the box — TANYY treats homestyle food like a luxury dining experience. Loved it.',
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" data-testid="testimonials-section" className="mx-auto max-w-7xl px-5 sm:px-8 py-20 sm:py-28">
      <div className="flex items-end justify-between gap-6 flex-wrap">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-[color:var(--tk-accent)]">Loved by locals</div>
          <h2 className="mt-3 font-serif text-4xl sm:text-5xl tracking-tight leading-tight max-w-2xl">
            What our people are saying —<br />
            <span className="font-editorial italic text-[color:var(--tk-text-soft)]">plate by plate.</span>
          </h2>
        </div>
        <div className="flex items-center gap-3 glass rounded-full px-5 py-3">
          <div className="flex">
            {[1,2,3,4,5].map((i) => <Star key={i} size={16} className="fill-[color:var(--tk-accent)] text-[color:var(--tk-accent)]" />)}
          </div>
          <div className="text-sm">
            <span className="font-serif text-lg">4.9</span>
            <span className="text-[color:var(--tk-text-soft)] ml-1">/ 5 • 320+ reviews</span>
          </div>
        </div>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {REVIEWS.map((r, i) => (
          <motion.article
            key={r.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ delay: i * 0.06, duration: 0.55 }}
            className="tk-card p-7 hover-lift relative"
            data-testid={`testimonial-${i}`}
          >
            <Quote size={22} className="text-[color:var(--tk-accent)] opacity-40" />
            <p className="mt-4 text-[15px] leading-relaxed text-[color:var(--tk-text)]">
              "{r.text}"
            </p>
            <div className="mt-6 flex items-center justify-between">
              <div>
                <div className="font-serif text-lg">{r.name}</div>
                <div className="text-[11px] uppercase tracking-[0.25em] text-[color:var(--tk-text-soft)] mt-0.5">{r.city}</div>
              </div>
              <div className="flex">
                {Array.from({ length: r.rating }).map((_, j) => (
                  <Star key={`${r.name}-star-${j}`} size={13} className="fill-[color:var(--tk-accent)] text-[color:var(--tk-accent)]" />
                ))}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

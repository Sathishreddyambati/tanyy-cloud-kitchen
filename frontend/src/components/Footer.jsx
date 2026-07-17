import { Link } from 'react-router-dom';
import { Instagram, Phone, MessageCircle, Heart } from 'lucide-react';
import { WHATSAPP_NUMBER, PHONE_NUMBER } from '@/data/menu';

export default function Footer() {
  return (
    <footer data-testid="site-footer" className="mt-24 border-t border-[color:var(--tk-border)]">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="font-serif text-3xl">TANYY</div>
          <div className="tracking-[0.35em] text-xs text-[color:var(--tk-text-soft)] mt-1">CLOUD KITCHEN</div>
          <p className="mt-5 font-editorial text-2xl max-w-md leading-snug">"Homestyle Food, Made with Love."</p>
          <div className="mt-6 flex items-center gap-3">
            <a href={`tel:${PHONE_NUMBER}`} data-testid="footer-call" className="w-10 h-10 rounded-full grid place-items-center border border-[color:var(--tk-border)] hover:border-[color:var(--tk-accent)]"><Phone size={16} /></a>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" data-testid="footer-whatsapp" className="w-10 h-10 rounded-full grid place-items-center border border-[color:var(--tk-border)] hover:border-[color:var(--tk-accent)]"><MessageCircle size={16} /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" data-testid="footer-instagram" className="w-10 h-10 rounded-full grid place-items-center border border-[color:var(--tk-border)] hover:border-[color:var(--tk-accent)]"><Instagram size={16} /></a>
          </div>
        </div>
        <div>
          <div className="text-xs tracking-[0.25em] uppercase text-[color:var(--tk-text-soft)]">Explore</div>
          <ul className="mt-4 space-y-3 text-sm">
            <li><Link to="/" className="hover:text-[color:var(--tk-accent)]">Home</Link></li>
            <li><Link to="/menu" className="hover:text-[color:var(--tk-accent)]">Menu</Link></li>
            <li><Link to="/contact" className="hover:text-[color:var(--tk-accent)]">Contact</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-xs tracking-[0.25em] uppercase text-[color:var(--tk-text-soft)]">Legal</div>
          <ul className="mt-4 space-y-3 text-sm">
            <li><span className="text-[color:var(--tk-text-soft)]">Privacy Policy</span></li>
            <li><span className="text-[color:var(--tk-text-soft)]">Terms & Conditions</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[color:var(--tk-border)]">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-5 text-xs text-[color:var(--tk-text-soft)] flex flex-col sm:flex-row justify-between gap-2">
          <div>© {new Date().getFullYear()} TANYY CLOUD KITCHEN. All rights reserved.</div>
          <div className="flex items-center gap-1">Crafted with <Heart size={12} className="text-[color:var(--tk-accent)]" /> in India</div>
        </div>
      </div>
    </footer>
  );
}

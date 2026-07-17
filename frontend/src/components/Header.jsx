import { Link, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Sun, Moon, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';

const linkBase = 'px-4 py-2 text-sm tracking-wide uppercase transition-colors';

export default function Header() {
  const { count, setOpen } = useCart();
  const { theme, toggle } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header data-testid="site-header" className="sticky top-0 z-50 glass">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-4 flex items-center justify-between">
        <Link to="/" data-testid="brand-link" className="flex items-center gap-3 group">
          <span className="w-10 h-10 rounded-full grid place-items-center border border-[color:var(--tk-accent)]/40 group-hover:rotate-12 transition-transform">
            <span className="font-serif text-lg text-[color:var(--tk-accent)]">T</span>
          </span>
          <div className="leading-none">
            <div className="font-serif text-xl sm:text-2xl tracking-tight">TANYY</div>
            <div className="text-[10px] tracking-[0.35em] text-[color:var(--tk-text-soft)]">CLOUD KITCHEN</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {[
            { to: '/', label: 'Home' },
            { to: '/menu', label: 'Menu' },
            { to: '/contact', label: 'Contact' },
          ].map((l) => (
            <NavLink key={l.to} to={l.to} end data-testid={`nav-${l.label.toLowerCase()}`} className={({ isActive }) => `${linkBase} ${isActive ? 'text-[color:var(--tk-accent)]' : 'text-[color:var(--tk-text)] hover:text-[color:var(--tk-accent)]'}`}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button data-testid="theme-toggle" onClick={toggle} aria-label="Toggle theme" className="w-10 h-10 rounded-full grid place-items-center hover:bg-[color:var(--tk-accent)]/10 transition">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button data-testid="open-cart-btn" onClick={() => setOpen(true)} className="relative w-10 h-10 rounded-full grid place-items-center hover:bg-[color:var(--tk-accent)]/10 transition" aria-label="Open cart">
            <ShoppingBag size={18} />
            {count > 0 && (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} data-testid="cart-badge" className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full text-[11px] font-semibold grid place-items-center bg-[color:var(--tk-accent)] text-[#09281E]">
                {count}
              </motion.span>
            )}
          </button>
          <button data-testid="menu-toggle" onClick={() => setMenuOpen((v) => !v)} className="md:hidden w-10 h-10 rounded-full grid place-items-center hover:bg-[color:var(--tk-accent)]/10">
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden border-t border-[color:var(--tk-border)]">
          <div className="px-5 py-3 flex flex-col">
            {[
              { to: '/', label: 'Home' },
              { to: '/menu', label: 'Menu' },
              { to: '/contact', label: 'Contact' },
            ].map((l) => (
              <NavLink key={l.to} to={l.to} end onClick={() => setMenuOpen(false)} className={({ isActive }) => `py-3 text-sm uppercase tracking-widest ${isActive ? 'text-[color:var(--tk-accent)]' : ''}`}>
                {l.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

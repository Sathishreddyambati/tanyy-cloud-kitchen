import { useEffect, useState } from 'react';
import { MessageCircle, Phone, ArrowUp } from 'lucide-react';
import { WHATSAPP_NUMBER, PHONE_NUMBER } from '@/data/menu';

export default function FloatingButtons() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-3">
      {show && (
        <button data-testid="scroll-top-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Scroll to top" className="w-12 h-12 rounded-full grid place-items-center glass hover:bg-[color:var(--tk-accent)]/20 transition">
          <ArrowUp size={18} />
        </button>
      )}
      <a href={`tel:${PHONE_NUMBER}`} data-testid="float-call" aria-label="Call us" className="w-12 h-12 rounded-full grid place-items-center bg-[color:var(--tk-primary)] text-[color:var(--tk-bg)] shadow-lg hover:scale-105 transition">
        <Phone size={18} />
      </a>
      <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" data-testid="float-whatsapp" aria-label="WhatsApp us" className="w-12 h-12 rounded-full grid place-items-center bg-[#25D366] text-white shadow-lg hover:scale-105 transition">
        <MessageCircle size={20} />
      </a>
    </div>
  );
}

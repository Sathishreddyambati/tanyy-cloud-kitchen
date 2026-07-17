import { Phone, MessageCircle, Clock, Mail, MapPin } from 'lucide-react';
import { WHATSAPP_NUMBER, PHONE_NUMBER } from '@/data/menu';

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 sm:px-8 py-14">
      <div className="text-xs uppercase tracking-[0.3em] text-[color:var(--tk-accent)]">Get in touch</div>
      <h1 className="mt-3 font-serif text-5xl sm:text-6xl leading-tight">We'd love to<br /><span className="italic font-editorial text-[color:var(--tk-text-soft)]">hear from you.</span></h1>

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { Icon: Phone, label: 'Phone', value: PHONE_NUMBER, href: `tel:${PHONE_NUMBER}`, testid: 'contact-phone' },
          { Icon: MessageCircle, label: 'WhatsApp', value: PHONE_NUMBER, href: `https://wa.me/${WHATSAPP_NUMBER}`, testid: 'contact-whatsapp' },
          { Icon: Clock, label: 'Business Hours', value: 'Open Daily • 10am – 10pm', testid: 'contact-hours' },
          { Icon: Mail, label: 'Email', value: 'hello@tanyy.kitchen', testid: 'contact-email' },
        ].map(({ Icon, label, value, href, testid }) => (
          <a key={label} href={href || '#'} target={href?.startsWith('http') ? '_blank' : undefined} rel="noreferrer" data-testid={testid} className="tk-card p-6 hover-lift block">
            <div className="w-11 h-11 rounded-full grid place-items-center border border-[color:var(--tk-border)]"><Icon size={18} className="text-[color:var(--tk-accent)]" /></div>
            <div className="mt-5 text-[11px] uppercase tracking-widest text-[color:var(--tk-text-soft)]">{label}</div>
            <div className="mt-1 font-serif text-lg">{value}</div>
          </a>
        ))}
      </div>

      <div className="mt-12 tk-card p-6 sm:p-10">
        <div className="text-[11px] uppercase tracking-widest text-[color:var(--tk-text-soft)] inline-flex items-center gap-2"><MapPin size={14} className="text-[color:var(--tk-accent)]" /> Location</div>
        <div className="mt-3 font-serif text-3xl">TANYY Cloud Kitchen</div>
        <div className="mt-1 text-[color:var(--tk-text-soft)] text-sm">Serving fresh homestyle Andhra meals across the city.</div>
        <div className="mt-6 aspect-[16/8] rounded-2xl overflow-hidden border border-[color:var(--tk-border)] bg-[color:var(--tk-surface)] grid place-items-center text-[color:var(--tk-text-soft)] text-sm">
          Google Maps location coming soon
        </div>
      </div>
    </div>
  );
}

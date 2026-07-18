import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, ChefHat, Bike, PackageCheck, XCircle, RefreshCw, Phone, MessageCircle, MapPin } from 'lucide-react';
import { fetchOrderByNumber } from '@/lib/firebase';
import { WHATSAPP_NUMBER, PHONE_NUMBER } from '@/data/menu';

const TIMELINE = [
  { key: 'Pending',            label: 'Order Received',    Icon: Clock },
  { key: 'Accepted',           label: 'Order Confirmed',   Icon: CheckCircle2 },
  { key: 'Preparing',          label: 'In the Kitchen',    Icon: ChefHat },
  { key: 'Out for Delivery',   label: 'On the Way',        Icon: Bike },
  { key: 'Delivered',          label: 'Delivered',         Icon: PackageCheck },
];

function statusIndex(s) {
  const i = TIMELINE.findIndex((t) => t.key === s);
  return i < 0 ? 0 : i;
}

export default function TrackOrderPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const load = async () => {
    setLoading(true);
    setNotFound(false);
    const o = await fetchOrderByNumber(orderId);
    if (!o) setNotFound(true);
    setOrder(o);
    setLoading(false);
  };

  useEffect(() => { if (orderId) load(); /* eslint-disable-next-line */ }, [orderId]);
  useEffect(() => {
    const t = setInterval(() => { if (orderId) load(); }, 20000);
    return () => clearInterval(t);
    // eslint-disable-next-line
  }, [orderId]);

  const cancelled = order?.status === 'Cancelled';
  const activeIdx = order ? statusIndex(order.status) : 0;

  return (
    <div className="mx-auto max-w-5xl px-5 sm:px-8 py-10">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-[color:var(--tk-accent)]">Track your order</div>
          <h1 className="mt-2 font-serif text-4xl sm:text-5xl">Order <span className="text-[color:var(--tk-accent)]">{orderId}</span></h1>
        </div>
        <button data-testid="track-refresh" onClick={load} className="tk-btn-outline rounded-full px-4 py-2 text-xs uppercase tracking-widest inline-flex items-center gap-2">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {loading && (
        <div className="mt-10 tk-card p-10 text-center text-[color:var(--tk-text-soft)]" data-testid="track-loading">Loading your order…</div>
      )}

      {!loading && notFound && (
        <div className="mt-10 tk-card p-10 text-center" data-testid="track-notfound">
          <div className="mx-auto w-14 h-14 rounded-full grid place-items-center border border-[color:var(--tk-border)]"><XCircle size={22} className="text-[color:var(--tk-accent)]" /></div>
          <div className="mt-5 font-serif text-2xl">Order not found</div>
          <p className="mt-2 text-[color:var(--tk-text-soft)] text-sm max-w-md mx-auto">
            We couldn't locate an order with the ID <span className="font-mono">{orderId}</span>. It may still be syncing — please try again in a minute. If the issue persists, contact us on WhatsApp with your Order ID.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="tk-btn-primary rounded-full px-5 py-2.5 text-xs uppercase tracking-widest inline-flex items-center gap-2"><MessageCircle size={14} /> WhatsApp us</a>
            <Link to="/" className="tk-btn-outline rounded-full px-5 py-2.5 text-xs uppercase tracking-widest">Home</Link>
          </div>
        </div>
      )}

      {!loading && order && (
        <div className="mt-10 grid gap-8 lg:grid-cols-5">
          {/* Timeline */}
          <div className="lg:col-span-3 tk-card p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-widest text-[color:var(--tk-text-soft)]">Current Status</div>
                <div data-testid="track-status" className={`mt-1 font-serif text-2xl ${cancelled ? 'text-red-500' : ''}`}>{order.status}</div>
              </div>
              <div className="text-right">
                <div className="text-[11px] uppercase tracking-widest text-[color:var(--tk-text-soft)]">Estimated Delivery</div>
                <div className="mt-1 font-serif text-lg">{order.estimatedDelivery || '35–45 min'}</div>
              </div>
            </div>

            {cancelled ? (
              <div className="mt-8 rounded-2xl border border-red-400/40 bg-red-500/5 px-5 py-6 text-sm">
                <div className="font-serif text-lg text-red-500">This order was cancelled.</div>
                <div className="mt-2 text-[color:var(--tk-text-soft)]">If this was unexpected, please contact us on WhatsApp with your Order ID.</div>
              </div>
            ) : (
              <ol className="mt-8 space-y-6">
                {TIMELINE.map((step, i) => {
                  const done = i < activeIdx;
                  const current = i === activeIdx;
                  const StepIcon = step.Icon;
                  return (
                    <li key={step.key} className="flex gap-5 items-start" data-testid={`step-${step.key.toLowerCase().replace(/ /g, '-')}`}>
                      <div className="relative">
                        <motion.div
                          initial={false}
                          animate={{ scale: current ? 1.05 : 1 }}
                          className={`w-11 h-11 rounded-full grid place-items-center border transition
                            ${done ? 'bg-[color:var(--tk-accent)] border-[color:var(--tk-accent)] text-[#09281E]' : ''}
                            ${current ? 'border-[color:var(--tk-accent)] text-[color:var(--tk-accent)] ring-4 ring-[color:var(--tk-accent)]/20' : ''}
                            ${!done && !current ? 'border-[color:var(--tk-border)] text-[color:var(--tk-text-soft)]' : ''}
                          `}
                        >
                          <StepIcon size={18} />
                        </motion.div>
                        {i < TIMELINE.length - 1 && (
                          <div className={`absolute left-1/2 -translate-x-1/2 top-11 w-[2px] h-10 ${done ? 'bg-[color:var(--tk-accent)]' : 'bg-[color:var(--tk-border)]'}`} />
                        )}
                      </div>
                      <div className="pt-1.5">
                        <div className={`font-serif text-lg ${current ? 'text-[color:var(--tk-accent)]' : ''}`}>{step.label}</div>
                        <div className="text-xs text-[color:var(--tk-text-soft)] mt-1">
                          {done && 'Completed'}
                          {current && 'Happening now — hang tight!'}
                          {!done && !current && 'Coming up next'}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>

          {/* Details */}
          <div className="lg:col-span-2 space-y-5">
            <div className="tk-card p-6">
              <div className="text-[11px] uppercase tracking-widest text-[color:var(--tk-text-soft)]">Delivering to</div>
              <div className="mt-2 font-serif text-lg">{order.customer?.name}</div>
              <div className="text-sm text-[color:var(--tk-text-soft)] mt-1">{order.customer?.phone}</div>
              <div className="mt-3 flex gap-2 items-start text-sm">
                <MapPin size={14} className="text-[color:var(--tk-accent)] mt-1 shrink-0" />
                <div className="text-[color:var(--tk-text-soft)]">
                  {[order.address?.house, order.address?.street, order.address?.area, order.address?.landmark && `Near ${order.address.landmark}`, order.address?.city, order.address?.state, order.address?.pincode].filter(Boolean).join(', ')}
                </div>
              </div>
            </div>

            <div className="tk-card p-6">
              <div className="text-[11px] uppercase tracking-widest text-[color:var(--tk-text-soft)]">Items</div>
              <div className="mt-3 space-y-3">
                {(order.items || []).map((i) => (
                  <div key={i.id || i.name} className="flex items-center justify-between text-sm">
                    <div><span className="text-[color:var(--tk-text-soft)]">{i.qty} ×</span> {i.name}</div>
                    <div>₹{i.lineTotal || (i.price * i.qty)}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 border-t border-dashed border-[color:var(--tk-border)] pt-3 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-[color:var(--tk-text-soft)]">Subtotal</span><span>₹{order.subtotal}</span></div>
                <div className="flex justify-between"><span className="text-[color:var(--tk-text-soft)]">Delivery</span><span className="text-[color:var(--tk-accent)]">FREE</span></div>
                <div className="flex justify-between border-t border-[color:var(--tk-border)] pt-2"><span className="font-serif text-base">Total</span><span className="font-serif text-lg">₹{order.grandTotal || order.subtotal}</span></div>
                <div className="text-[11px] text-[color:var(--tk-text-soft)] pt-1">Payment • {order.payment || 'Cash on Delivery'}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <a href={`tel:${PHONE_NUMBER}`} data-testid="track-call" className="tk-btn-outline rounded-full py-2.5 text-xs uppercase tracking-widest inline-flex items-center justify-center gap-2"><Phone size={14} /> Call</a>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" data-testid="track-whatsapp" className="tk-btn-primary rounded-full py-2.5 text-xs uppercase tracking-widest inline-flex items-center justify-center gap-2"><MessageCircle size={14} /> Chat</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

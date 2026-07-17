import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { ArrowLeft, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { saveOrder, reserveOrderNumber } from '@/lib/firebase';
import { WHATSAPP_NUMBER } from '@/data/menu';

const PAYMENTS = [
  { id: 'cod', label: 'Cash on Delivery' },
  { id: 'gpay', label: 'Google Pay' },
  { id: 'phonepe', label: 'PhonePe' },
  { id: 'paytm', label: 'Paytm' },
  { id: 'upi', label: 'UPI' },
];

const FIELDS = [
  { name: 'name', label: 'Full Name', required: true },
  { name: 'phone', label: 'Phone Number', required: true, type: 'tel', pattern: /^[6-9]\d{9}$/, hint: '10-digit Indian mobile' },
  { name: 'altPhone', label: 'Alternative Phone (Optional)', type: 'tel' },
  { name: 'house', label: 'House / Flat Number', required: true },
  { name: 'street', label: 'Street', required: true },
  { name: 'area', label: 'Area / Colony', required: true },
  { name: 'landmark', label: 'Landmark' },
  { name: 'city', label: 'City', required: true },
  { name: 'state', label: 'State', required: true },
  { name: 'pincode', label: 'Pincode', required: true, pattern: /^\d{6}$/, hint: '6-digit pincode' },
];

function buildWhatsAppMessage({ orderNumber, form, items, subtotal }) {
  const lines = [];
  lines.push('🍽️ *TANYY CLOUD KITCHEN*');
  lines.push('');
  lines.push(`*Order Number:* ${orderNumber}`);
  lines.push(`*Customer:* ${form.name}`);
  lines.push(`*Phone:* ${form.phone}`);
  if (form.altPhone) lines.push(`*Alt Phone:* ${form.altPhone}`);
  lines.push('');
  lines.push(`*Address:*`);
  lines.push(`${form.house}, ${form.street}, ${form.area}${form.landmark ? ` (Near ${form.landmark})` : ''}`);
  lines.push(`${form.city}, ${form.state} - ${form.pincode}`);
  lines.push('');
  lines.push('*Items:*');
  items.forEach((i) => lines.push(`• ${i.qty} × ${i.name} — ₹${i.qty * i.price}`));
  lines.push('');
  lines.push(`*Subtotal:* ₹${subtotal}`);
  lines.push(`*Delivery:* FREE`);
  lines.push(`*Grand Total:* ₹${subtotal}`);
  lines.push('');
  lines.push(`*Payment:* ${PAYMENTS.find((p) => p.id === form.payment)?.label || form.payment}`);
  if (form.notes) lines.push(`*Notes:* ${form.notes}`);
  lines.push('');
  lines.push('Thank You ❤️');
  return encodeURIComponent(lines.join('\n'));
}

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ payment: 'cod', notes: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const setField = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: undefined })); };

  const validate = () => {
    const next = {};
    for (const f of FIELDS) {
      const v = (form[f.name] || '').trim();
      if (f.required && !v) next[f.name] = `${f.label} is required`;
      else if (v && f.pattern && !f.pattern.test(v)) next[f.name] = f.hint || 'Invalid format';
    }
    if (!form.payment) next.payment = 'Select a payment method';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) { toast.error('Your cart is empty'); return; }
    if (!validate()) { toast.error('Please fill all required fields correctly'); return; }
    setSubmitting(true);
    try {
      const orderNumber = await reserveOrderNumber();
      const orderData = {
        orderNumber,
        status: 'Pending',
        customer: {
          name: form.name, phone: form.phone, altPhone: form.altPhone || '',
        },
        address: {
          house: form.house, street: form.street, area: form.area, landmark: form.landmark || '',
          city: form.city, state: form.state, pincode: form.pincode,
        },
        items: items.map((i) => ({ id: i.id, name: i.name, price: i.price, qty: i.qty, lineTotal: i.price * i.qty })),
        subtotal,
        deliveryCharge: 0,
        grandTotal: subtotal,
        payment: PAYMENTS.find((p) => p.id === form.payment)?.label || 'Cash on Delivery',
        notes: form.notes || '',
        estimatedDelivery: '35–45 min',
      };
      try { await saveOrder(orderData); } catch (err) { console.warn('Order save failed:', err?.message); }

      const msg = buildWhatsAppMessage({ orderNumber, form, items, subtotal });
      const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
      window.open(waUrl, '_blank');
      clear();
      navigate(`/success?order=${orderNumber}`);
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8 py-10">
      <button data-testid="back-btn" onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-[color:var(--tk-text-soft)] hover:text-[color:var(--tk-accent)]"><ArrowLeft size={14} /> Back</button>
      <div className="mt-6 grid gap-10 lg:grid-cols-5">
        <form onSubmit={onSubmit} className="lg:col-span-3 space-y-6" data-testid="checkout-form">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-[color:var(--tk-accent)]">Checkout</div>
            <h1 className="mt-2 font-serif text-4xl sm:text-5xl">Delivery Details</h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FIELDS.map((f) => (
              <label key={f.name} className={`block ${f.name === 'name' || f.name === 'landmark' ? 'sm:col-span-2' : ''}`}>
                <span className="text-[11px] uppercase tracking-widest text-[color:var(--tk-text-soft)]">{f.label}{f.required && ' *'}</span>
                <input
                  type={f.type || 'text'}
                  data-testid={`field-${f.name}`}
                  value={form[f.name] || ''}
                  onChange={(e) => setField(f.name, e.target.value)}
                  className={`mt-1 w-full rounded-xl bg-transparent border px-4 py-3 text-sm outline-none transition focus:border-[color:var(--tk-accent)] ${errors[f.name] ? 'border-red-400' : 'border-[color:var(--tk-border)]'}`}
                />
                {errors[f.name] && <div className="mt-1 text-xs text-red-500">{errors[f.name]}</div>}
              </label>
            ))}

            <label className="sm:col-span-2 block">
              <span className="text-[11px] uppercase tracking-widest text-[color:var(--tk-text-soft)]">Delivery Instructions</span>
              <textarea data-testid="field-notes" value={form.notes} onChange={(e) => setField('notes', e.target.value)} rows={3} className="mt-1 w-full rounded-xl bg-transparent border border-[color:var(--tk-border)] px-4 py-3 text-sm outline-none focus:border-[color:var(--tk-accent)]" placeholder="e.g. Please call before delivery" />
            </label>
          </div>

          <div>
            <div className="text-[11px] uppercase tracking-widest text-[color:var(--tk-text-soft)] mb-2">Payment Method</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PAYMENTS.map((p) => (
                <button type="button" key={p.id} data-testid={`payment-${p.id}`} onClick={() => setField('payment', p.id)} className={`rounded-xl border px-4 py-3 text-sm transition ${form.payment === p.id ? 'border-[color:var(--tk-accent)] bg-[color:var(--tk-accent)]/10 text-[color:var(--tk-accent)]' : 'border-[color:var(--tk-border)] hover:border-[color:var(--tk-accent)]/60'}`}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <motion.button whileTap={{ scale: 0.98 }} disabled={submitting} type="submit" data-testid="place-order-btn" className="tk-btn-primary w-full rounded-full py-4 text-sm uppercase tracking-widest font-medium disabled:opacity-60">
            {submitting ? 'Placing Order…' : 'Place Order via WhatsApp'}
          </motion.button>
          <div className="text-[11px] text-[color:var(--tk-text-soft)] flex items-center gap-2"><ShieldCheck size={12} className="text-[color:var(--tk-accent)]" /> Your details are used only to fulfil your order.</div>
        </form>

        <aside className="lg:col-span-2 lg:sticky lg:top-24 h-fit">
          <div className="tk-card p-6">
            <div className="font-serif text-2xl">Order Summary</div>
            <div className="mt-4 space-y-4">
              {items.length === 0 && <div className="text-sm text-[color:var(--tk-text-soft)]">Your cart is empty.</div>}
              {items.map((i) => (
                <div key={i.id} className="flex items-center gap-3">
                  <img src={i.image} alt="" className="w-14 h-14 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm truncate">{i.name}</div>
                    <div className="text-xs text-[color:var(--tk-text-soft)]">₹{i.price} × {i.qty}</div>
                  </div>
                  <div className="text-sm">₹{i.price * i.qty}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 border-t border-dashed border-[color:var(--tk-border)] pt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-[color:var(--tk-text-soft)]">Subtotal</span><span data-testid="summary-subtotal">₹{subtotal}</span></div>
              <div className="flex justify-between"><span className="text-[color:var(--tk-text-soft)] inline-flex items-center gap-1.5"><Truck size={14} className="text-[color:var(--tk-accent)]" /> Delivery</span><span className="text-[color:var(--tk-accent)]">FREE</span></div>
              <div className="flex justify-between border-t border-[color:var(--tk-border)] pt-3"><span className="font-serif text-lg">Total</span><span data-testid="summary-total" className="font-serif text-xl">₹{subtotal}</span></div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

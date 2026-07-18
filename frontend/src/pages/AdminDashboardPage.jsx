import { useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { fetchOrders, updateOrderStatus, removeOrder } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Download, Trash2, RefreshCw, LogOut, Search, IndianRupee, Package, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const STATUSES = ['Pending', 'Accepted', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];

function toCSV(rows) {
  const header = ['Order Number', 'Status', 'Customer', 'Phone', 'Address', 'Items', 'Subtotal', 'Total', 'Payment', 'Created'];
  const csv = [header.join(',')];
  for (const r of rows) {
    const address = `"${[r.address?.house, r.address?.street, r.address?.area, r.address?.city, r.address?.state, r.address?.pincode].filter(Boolean).join(', ').replace(/"/g, '""')}"`;
    const items = `"${(r.items || []).map((i) => `${i.qty}x ${i.name}`).join(' | ').replace(/"/g, '""')}"`;
    const created = r.createdAt?.toDate ? r.createdAt.toDate().toISOString() : '';
    csv.push([r.orderNumber, r.status, r.customer?.name, r.customer?.phone, address, items, r.subtotal, r.grandTotal, r.payment, created].join(','));
  }
  return csv.join('\n');
}

export default function AdminDashboardPage() {
  const { isAdmin, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('all');

  const load = useCallback(async () => {
    setLoading(true);
    try { setOrders(await fetchOrders()); }
    catch (e) { console.warn('AdminDashboard: fetchOrders failed:', e?.message); toast.error('Could not load orders'); }
    setLoading(false);
  }, []);
  useEffect(() => { if (isAdmin) load(); }, [isAdmin, load]);

  const filtered = useMemo(() => orders.filter((o) => {
    const matchQ = !q || [o.orderNumber, o.customer?.name, o.customer?.phone].join(' ').toLowerCase().includes(q.toLowerCase());
    const matchS = filter === 'all' || o.status === filter;
    return matchQ && matchS;
  }), [orders, q, filter]);

  const today = new Date().toDateString();
  const isToday = (o) => o.createdAt?.toDate && o.createdAt.toDate().toDateString() === today;
  const stats = {
    today: orders.filter(isToday).length,
    revenue: orders.filter((o) => o.status === 'Delivered').reduce((s, o) => s + (o.grandTotal || 0), 0),
    pending: orders.filter((o) => o.status === 'Pending').length,
    delivered: orders.filter((o) => o.status === 'Delivered').length,
    cancelled: orders.filter((o) => o.status === 'Cancelled').length,
  };

  const revenueByDay = useMemo(() => {
    const map = new Map();
    for (const o of orders) {
      const d = o.createdAt?.toDate ? o.createdAt.toDate() : new Date();
      const key = `${d.getMonth() + 1}/${d.getDate()}`;
      map.set(key, (map.get(key) || 0) + (o.grandTotal || 0));
    }
    return Array.from(map.entries()).slice(-7).map(([day, revenue]) => ({ day, revenue }));
  }, [orders]);

  const popularItems = useMemo(() => {
    const m = new Map();
    for (const o of orders) for (const i of (o.items || [])) m.set(i.name, (m.get(i.name) || 0) + i.qty);
    return Array.from(m.entries()).map(([name, value]) => ({ name, value }));
  }, [orders]);

  if (!isAdmin) return <Navigate to="/admin" replace />;

  const onStatusChange = async (id, status) => {
    try { await updateOrderStatus(id, status); toast.success('Status updated'); load(); }
    catch (e) { toast.error('Failed to update'); }
  };
  const onDelete = async (id) => {
    if (!window.confirm('Delete this order?')) return;
    try { await removeOrder(id); toast.success('Order deleted'); load(); }
    catch (e) { toast.error('Failed to delete'); }
  };
  const onExport = () => {
    const csv = toCSV(filtered);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `mothers-touch-orders-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const COLORS = ['#D4AF37', '#0C3C2D', '#F3CE5A', '#4A6B5D'];

  return (
    <div className="mx-auto max-w-7xl px-5 sm:px-8 py-10" data-testid="admin-dashboard">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-[color:var(--tk-accent)]">Admin</div>
          <h1 className="mt-2 font-serif text-4xl">Dashboard</h1>
        </div>
        <div className="flex items-center gap-2">
          <button data-testid="admin-refresh" onClick={load} className="tk-btn-outline rounded-full px-4 py-2 text-xs uppercase tracking-widest inline-flex items-center gap-2"><RefreshCw size={14} /> Refresh</button>
          <button data-testid="admin-export" onClick={onExport} className="tk-btn-outline rounded-full px-4 py-2 text-xs uppercase tracking-widest inline-flex items-center gap-2"><Download size={14} /> Export CSV</button>
          <button data-testid="admin-logout" onClick={logout} className="tk-btn-primary rounded-full px-4 py-2 text-xs uppercase tracking-widest inline-flex items-center gap-2"><LogOut size={14} /> Sign out</button>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { label: "Today's Orders", value: stats.today, Icon: Package },
          { label: 'Total Revenue', value: `₹${stats.revenue}`, Icon: IndianRupee },
          { label: 'Pending', value: stats.pending, Icon: Clock },
          { label: 'Delivered', value: stats.delivered, Icon: CheckCircle2 },
          { label: 'Cancelled', value: stats.cancelled, Icon: XCircle },
        ].map((s) => (
          <div key={s.label} className="tk-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-widest text-[color:var(--tk-text-soft)]">{s.label}</span>
              <s.Icon size={16} className="text-[color:var(--tk-accent)]" />
            </div>
            <div className="mt-3 font-serif text-3xl">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="tk-card p-5 lg:col-span-2">
          <div className="text-[11px] uppercase tracking-widest text-[color:var(--tk-text-soft)]">Daily Revenue</div>
          <div className="mt-3 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByDay}>
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip cursor={{ fill: 'rgba(212,175,55,0.08)' }} />
                <Bar dataKey="revenue" fill="#D4AF37" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="tk-card p-5">
          <div className="text-[11px] uppercase tracking-widest text-[color:var(--tk-text-soft)]">Popular Items</div>
          <div className="mt-3 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={popularItems} innerRadius={40} outerRadius={70} dataKey="value" nameKey="name">
                  {popularItems.map((entry) => <Cell key={entry.name} fill={COLORS[popularItems.indexOf(entry) % COLORS.length]} />)}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-8 tk-card p-5">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[240px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--tk-text-soft)]" />
            <input data-testid="admin-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search order number, customer, phone" className="w-full rounded-full bg-transparent border border-[color:var(--tk-border)] pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[color:var(--tk-accent)]" />
          </div>
          <select data-testid="admin-filter" value={filter} onChange={(e) => setFilter(e.target.value)} className="rounded-full bg-transparent border border-[color:var(--tk-border)] px-4 py-2.5 text-sm">
            <option value="all">All statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-widest text-[color:var(--tk-text-soft)]">
                <th className="py-3 pr-4">Order</th>
                <th className="py-3 pr-4">Customer</th>
                <th className="py-3 pr-4">Items</th>
                <th className="py-3 pr-4">Total</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3 pr-4"></th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={6} className="py-6 text-center text-[color:var(--tk-text-soft)]">Loading orders…</td></tr>}
              {!loading && filtered.length === 0 && <tr><td colSpan={6} className="py-6 text-center text-[color:var(--tk-text-soft)]">No orders yet.</td></tr>}
              {filtered.map((o) => (
                <tr key={o.id} className="border-t border-[color:var(--tk-border)]">
                  <td className="py-3 pr-4 font-mono">{o.orderNumber}</td>
                  <td className="py-3 pr-4">
                    <div>{o.customer?.name}</div>
                    <div className="text-xs text-[color:var(--tk-text-soft)]">{o.customer?.phone}</div>
                  </td>
                  <td className="py-3 pr-4 max-w-xs">
                    <div className="text-xs">{(o.items || []).map((i) => `${i.qty}× ${i.name}`).join(', ')}</div>
                  </td>
                  <td className="py-3 pr-4">₹{o.grandTotal}</td>
                  <td className="py-3 pr-4">
                    <select data-testid={`status-${o.orderNumber}`} value={o.status} onChange={(e) => onStatusChange(o.id, e.target.value)} className="rounded-full bg-transparent border border-[color:var(--tk-border)] px-3 py-1.5 text-xs">
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="py-3 pr-4">
                    <button data-testid={`delete-${o.orderNumber}`} onClick={() => onDelete(o.id)} className="text-[color:var(--tk-text-soft)] hover:text-red-500"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Lock } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminLoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    if (login(email, password)) {
      toast.success('Welcome back, Chef');
      nav('/admin/dashboard');
    } else {
      toast.error('Invalid credentials');
    }
  };

  return (
    <div className="min-h-[70vh] grid place-items-center px-5 py-16">
      <form onSubmit={onSubmit} className="tk-card w-full max-w-md p-8" data-testid="admin-login-form">
        <div className="mx-auto w-12 h-12 rounded-full grid place-items-center border border-[color:var(--tk-border)]"><Lock size={18} className="text-[color:var(--tk-accent)]" /></div>
        <div className="mt-5 text-center text-xs uppercase tracking-[0.3em] text-[color:var(--tk-accent)]">Restricted</div>
        <h1 className="mt-2 text-center font-serif text-3xl">Admin Access</h1>
        <div className="mt-8 space-y-4">
          <label className="block">
            <span className="text-[11px] uppercase tracking-widest text-[color:var(--tk-text-soft)]">Email</span>
            <input data-testid="admin-email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-xl bg-transparent border border-[color:var(--tk-border)] px-4 py-3 text-sm outline-none focus:border-[color:var(--tk-accent)]" />
          </label>
          <label className="block">
            <span className="text-[11px] uppercase tracking-widest text-[color:var(--tk-text-soft)]">Password</span>
            <input data-testid="admin-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full rounded-xl bg-transparent border border-[color:var(--tk-border)] px-4 py-3 text-sm outline-none focus:border-[color:var(--tk-accent)]" />
          </label>
        </div>
        <button data-testid="admin-login-btn" type="submit" className="tk-btn-primary mt-6 w-full rounded-full py-3 text-sm uppercase tracking-widest">Sign In</button>
      </form>
    </div>
  );
}

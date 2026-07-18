import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const AuthCtx = createContext(null);
const KEY = 'tanyy_admin_v1';

export const ADMIN_EMAIL = 'Admin@123';
export const ADMIN_PASSWORD = 'Admin@143';

// Admin session is client-side only (no backend). We accept the security trade-off: the admin
// route is obscured but not cryptographically protected. For production, migrate to Firebase Auth.
export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    try { setIsAdmin(localStorage.getItem(KEY) === '1'); }
    catch (e) { console.warn('AuthContext: could not read admin flag:', e?.message); }
  }, []);

  const login = useCallback((email, password) => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      try { localStorage.setItem(KEY, '1'); }
      catch (e) { console.warn('AuthContext: could not persist admin flag:', e?.message); }
      setIsAdmin(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    try { localStorage.removeItem(KEY); }
    catch (e) { console.warn('AuthContext: could not clear admin flag:', e?.message); }
    setIsAdmin(false);
  }, []);

  const value = useMemo(() => ({ isAdmin, login, logout }), [isAdmin, login, logout]);
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);

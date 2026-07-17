import { createContext, useContext, useEffect, useState } from 'react';

const AuthCtx = createContext(null);
const KEY = 'tanyy_admin_v1';

export const ADMIN_EMAIL = 'Admin@123';
export const ADMIN_PASSWORD = 'Admin@143';

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    try { setIsAdmin(localStorage.getItem(KEY) === '1'); } catch (_) {}
  }, []);
  const login = (email, password) => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem(KEY, '1');
      setIsAdmin(true);
      return true;
    }
    return false;
  };
  const logout = () => {
    localStorage.removeItem(KEY);
    setIsAdmin(false);
  };
  return <AuthCtx.Provider value={{ isAdmin, login, logout }}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);

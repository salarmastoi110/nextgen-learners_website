import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/authService';
import { ensureSeedData } from '../services/mockDb';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    ensureSeedData();
    setUser(authService.getCurrentUser());
    setReady(true);
  }, []);

  const value = useMemo(
    () => ({
      user,
      ready,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
      login: async (credentials) => setUser(await authService.login(credentials)),
      register: async (payload) => setUser(await authService.register(payload)),
      logout: async () => {
        await authService.logout();
        setUser(null);
      },
      updateProfile: async (updates) => setUser(await authService.updateProfile(updates)),
    }),
    [user, ready]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

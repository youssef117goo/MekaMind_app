import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAdminAuthenticated: boolean;
  adminUser: { username: string; role: string } | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Admin credentials (in real app, this would be on backend)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'mekamind2024'
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [adminUser, setAdminUser] = useState<{ username: string; role: string } | null>(null);

  // Check localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('mekamind_admin_session');
    if (stored) {
      try {
        const session = JSON.parse(stored);
        // Check if session is still valid (24 hours)
        if (session.expiresAt > Date.now()) {
          setAdminUser(session.user);
        } else {
          localStorage.removeItem('mekamind_admin_session');
        }
      } catch (e) {
        localStorage.removeItem('mekamind_admin_session');
      }
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      const user = { username, role: 'admin' };
      const session = {
        user,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
      };
      localStorage.setItem('mekamind_admin_session', JSON.stringify(session));
      setAdminUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('mekamind_admin_session');
    setAdminUser(null);
  };

  return (
    <AuthContext.Provider value={{
      isAdminAuthenticated: !!adminUser,
      adminUser,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

interface UserAuthContextType {
  currentUser: User | null;
  users: User[];
  register: (username: string, email: string, password: string) => { success: boolean; message: string };
  login: (email: string, password: string) => { success: boolean; message: string };
  logout: () => void;
}

const UserAuthContext = createContext<UserAuthContextType | undefined>(undefined);

// Simulated user database (in real app, this would be on backend)
const DEFAULT_USERS: Array<User & { password: string }> = [
  {
    id: 'USER_001',
    username: 'أحمد محمد',
    email: 'ahmed@example.com',
    password: 'user123',
    createdAt: '2024-01-15'
  },
  {
    id: 'USER_002',
    username: 'سارة علي',
    email: 'sara@example.com',
    password: 'user123',
    createdAt: '2024-02-20'
  }
];

export function UserAuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [userDb, setUserDb] = useState<Array<User & { password: string }>>([]);

  // Load users from localStorage on mount
  useEffect(() => {
    const storedUsers = localStorage.getItem('mekamind_users_db');
    const db: Array<User & { password: string }> = storedUsers ? JSON.parse(storedUsers) : DEFAULT_USERS;
    setUserDb(db);
    setUsers(db.map(({ password: _pw, ...user }) => user));

    const storedSession = localStorage.getItem('mekamind_user_session');
    if (storedSession) {
      try {
        const session = JSON.parse(storedSession);
        if (session.expiresAt > Date.now()) {
          setCurrentUser(session.user);
        } else {
          localStorage.removeItem('mekamind_user_session');
        }
      } catch (e) {
        localStorage.removeItem('mekamind_user_session');
      }
    }
  }, []);

  const register = (username: string, email: string, password: string) => {
    // Check if email already exists
    if (userDb.some(u => u.email === email)) {
      return { success: false, message: 'البريد الإلكتروني مسجل مسبقاً' };
    }

    const newUser = {
      id: `USER_${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      username,
      email,
      password,
      createdAt: new Date().toISOString().split('T')[0]
    };

    const newDb = [...userDb, newUser];
    setUserDb(newDb);
    setUsers(newDb.map(({ password: _pw, ...user }) => user));
    localStorage.setItem('mekamind_users_db', JSON.stringify(newDb));

    return { success: true, message: 'تم إنشاء الحساب بنجاح' };
  };

  const login = (email: string, password: string) => {
    const user = userDb.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return { success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
    }

    const { password: _, ...userData } = user;
    const session = {
      user: userData,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000
    };
    
    localStorage.setItem('mekamind_user_session', JSON.stringify(session));
    setCurrentUser(userData);

    return { success: true, message: 'تم تسجيل الدخول بنجاح' };
  };

  const logout = () => {
    localStorage.removeItem('mekamind_user_session');
    setCurrentUser(null);
  };

  return (
    <UserAuthContext.Provider value={{
      currentUser,
      users,
      register,
      login,
      logout
    }}>
      {children}
    </UserAuthContext.Provider>
  );
}

export function useUserAuth() {
  const context = useContext(UserAuthContext);
  if (!context) throw new Error('useUserAuth must be used within UserAuthProvider');
  return context;
}

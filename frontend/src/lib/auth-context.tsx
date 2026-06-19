'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from './api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role?: string;
  shopId?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; firstName: string; lastName: string; shopName: string; city?: string }) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('lenspulse_token');
    const savedUser = localStorage.getItem('lenspulse_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const result = await api.login(email, password);
    localStorage.setItem('lenspulse_token', result.accessToken);
    localStorage.setItem('lenspulse_user', JSON.stringify(result.user));
    setToken(result.accessToken);
    setUser(result.user);
  };

  const register = async (data: { email: string; password: string; firstName: string; lastName: string; shopName: string; city?: string }) => {
    const result = await api.register(data);
    localStorage.setItem('lenspulse_token', result.accessToken);
    localStorage.setItem('lenspulse_user', JSON.stringify(result.user));
    setToken(result.accessToken);
    setUser(result.user);
  };

  const logout = () => {
    localStorage.removeItem('lenspulse_token');
    localStorage.removeItem('lenspulse_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}

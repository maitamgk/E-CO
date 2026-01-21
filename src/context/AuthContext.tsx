import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: Record<string, { password: string; role: UserRole }> = {
  'admin@bco.vn': { password: 'admin123', role: 'admin' },
  'user@bco.vn': { password: 'user123', role: 'user' },
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('bco_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const isAdmin = user?.role === 'admin';

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockUser = mockUsers[email];
      if (!mockUser || mockUser.password !== password) {
        throw new Error('Email hoặc mật khẩu không đúng');
      }

      const newUser: User = {
        uid: crypto.randomUUID(),
        email,
        role: mockUser.role,
        createdAt: new Date(),
      };

      setUser(newUser);
      localStorage.setItem('bco_user', JSON.stringify(newUser));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (mockUsers[email]) {
        throw new Error('Email đã được sử dụng');
      }

      const newUser: User = {
        uid: crypto.randomUUID(),
        email,
        role: 'user',
        createdAt: new Date(),
      };

      // In real app, this would be saved to Firebase
      mockUsers[email] = { password, role: 'user' };

      setUser(newUser);
      localStorage.setItem('bco_user', JSON.stringify(newUser));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    localStorage.removeItem('bco_user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, isAdmin, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

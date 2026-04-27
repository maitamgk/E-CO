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

const MOCK_USERS_KEY = 'bco_mock_users';

const getMockUsers = (): Record<string, { uid: string; password: string; role: UserRole }> => {
  try {
    const saved = localStorage.getItem(MOCK_USERS_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    // Ignore error and fall back to default
  }
  return {
    'admin@bco.vn': { uid: 'admin-uid-123', password: 'admin123', role: 'admin' },
    'user@bco.vn': { uid: 'user-uid-123', password: 'user123', role: 'user' },
  };
};

const saveMockUsers = (users: Record<string, { uid: string; password: string; role: UserRole }>) => {
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
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
      
      const mockUsers = getMockUsers();
      const mockUser = mockUsers[email];
      if (!mockUser || mockUser.password !== password) {
        throw new Error('Email hoặc mật khẩu không đúng');
      }

      const newUser: User = {
        uid: mockUser.uid,
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
      
      const mockUsers = getMockUsers();
      if (mockUsers[email]) {
        throw new Error('Email đã được sử dụng');
      }

      const newUid = crypto.randomUUID();
      const newUser: User = {
        uid: newUid,
        email,
        role: 'user', // Default to user, admin logic can be added if needed
        createdAt: new Date(),
      };

      mockUsers[email] = { uid: newUid, password, role: 'user' };
      saveMockUsers(mockUsers);

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

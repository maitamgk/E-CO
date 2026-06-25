import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { supabase } from '@/lib/supabase';
import { profileService } from '@/services/profileService';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<{ needsEmailConfirmation: boolean }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mapAuthError = (message: string): string => {
  const normalized = message.toLowerCase();
  if (normalized.includes('invalid login credentials')) {
    return 'Email hoặc mật khẩu không đúng';
  }
  if (normalized.includes('user already registered')) {
    return 'Email đã được sử dụng';
  }
  if (normalized.includes('email not confirmed')) {
    return 'Vui lòng xác nhận email trước khi đăng nhập';
  }
  if (normalized.includes('password should be at least')) {
    return 'Mật khẩu phải có ít nhất 6 ký tự';
  }
  return message;
};

const buildUser = async (authUser: { id: string; email?: string; created_at?: string }): Promise<User> => {
  const profile = await profileService.getProfile(authUser.id);

  return {
    uid: authUser.id,
    email: profile?.email || authUser.email || '',
    role: profile?.role || 'user',
    createdAt: new Date(profile?.created_at || authUser.created_at || Date.now()),
  };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    let mounted = true;

    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!mounted) return;

      if (session?.user) {
        const appUser = await buildUser(session.user);
        if (mounted) setUser(appUser);
      }

      if (mounted) setIsLoading(false);
    };

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;

      if (session?.user) {
        const appUser = await buildUser(session.user);
        setUser(appUser);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw new Error(mapAuthError(error.message));
      if (!data.user) throw new Error('Đăng nhập thất bại');

      const appUser = await buildUser(data.user);
      setUser(appUser);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw new Error(mapAuthError(error.message));

      if (data.session?.user) {
        const appUser = await buildUser(data.session.user);
        setUser(appUser);
        return { needsEmailConfirmation: false };
      }

      return { needsEmailConfirmation: true };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
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

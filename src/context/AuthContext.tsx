import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { supabase } from '@/lib/supabase';
import { profileService } from '@/services/profileService';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const ADMIN_EMAIL = 'admin@beco.com';

const mapAuthError = (message: string): string => {
  const normalized = message.toLowerCase();
  if (normalized.includes('invalid login credentials')) {
    return 'Email hoặc mật khẩu không đúng';
  }
  if (normalized.includes('email not confirmed')) {
    return 'Vui lòng xác nhận email trước khi đăng nhập';
  }
  return message;
};

const ADMIN_ONLY_ERROR = 'Tài khoản này không có quyền quản trị';

const buildUser = async (authUser: { id: string; email?: string; created_at?: string }): Promise<User> => {
  const profile = await profileService.getProfile(authUser.id);

  return {
    uid: authUser.id,
    email: authUser.email || profile?.email || '',
    role: profile?.role || 'user',
    createdAt: new Date(profile?.created_at || authUser.created_at || Date.now()),
  };
};

const isAuthorizedAdmin = (candidate: User): boolean => (
  candidate.role === 'admin' && candidate.email.trim().toLowerCase() === ADMIN_EMAIL
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAdmin = user ? isAuthorizedAdmin(user) : false;

  useEffect(() => {
    let mounted = true;

    const initSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!mounted) return;

        if (session?.user) {
          const appUser = await buildUser(session.user);
          if (isAuthorizedAdmin(appUser)) {
            if (mounted) setUser(appUser);
          } else {
            await supabase.auth.signOut();
            if (mounted) setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Không thể khởi tạo phiên quản trị:', error);
        if (mounted) setUser(null);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    void initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;

      if (!session?.user) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      window.setTimeout(() => {
        if (!mounted) return;

        void buildUser(session.user)
          .then(appUser => {
            if (mounted) setUser(isAuthorizedAdmin(appUser) ? appUser : null);
          })
          .catch(error => {
            console.error('Không thể đồng bộ phiên quản trị:', error);
            if (mounted) setUser(null);
          })
          .finally(() => {
            if (mounted) setIsLoading(false);
          });
      }, 0);
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
      if (!isAuthorizedAdmin(appUser)) {
        await supabase.auth.signOut();
        setUser(null);
        throw new Error(ADMIN_ONLY_ERROR);
      }
      setUser(appUser);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, isAdmin, login, logout }}>
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

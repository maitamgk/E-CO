import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { validateEmail, validateMinLength } from '@/utils/validators';
import { Loader2, Leaf } from 'lucide-react';

const Auth = () => {
  const navigate = useNavigate();
  const { login, register, user } = useAuth();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirect if already logged in
  if (user) {
    navigate('/');
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    if (!validateEmail(loginForm.email)) {
      setErrors({ email: 'Email không hợp lệ' });
      return;
    }
    
    setIsLoading(true);
    try {
      await login(loginForm.email, loginForm.password);
      toast({ title: 'Đăng nhập thành công!' });
      navigate('/');
    } catch (error: any) {
      toast({
        title: 'Đăng nhập thất bại',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    const newErrors: Record<string, string> = {};
    
    if (!validateEmail(registerForm.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    if (!validateMinLength(registerForm.password, 6)) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    if (registerForm.password !== registerForm.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    try {
      await register(registerForm.email, registerForm.password);
      toast({ title: 'Đăng ký thành công!' });
      navigate('/');
    } catch (error: any) {
      toast({
        title: 'Đăng ký thất bại',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-green-950 via-emerald-900 to-teal-950 text-white overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 opacity-35"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1542601098-3adb3e4c6df9?w=1920&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-950/60 via-emerald-900/65 to-teal-950/70" />
        
        {/* Glowing Orbs */}
        <div className="absolute top-20 -left-20 w-72 h-72 bg-emerald-500/8 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-teal-500/8 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 py-12 relative">
          <h1 className="text-4xl md:text-5xl font-black italic mb-4 bg-gradient-to-r from-emerald-400 via-green-300 to-teal-400 bg-clip-text text-transparent text-center">
            Tài khoản
          </h1>
          <p className="text-emerald-100 text-lg text-center">
            Đăng nhập hoặc tạo tài khoản mới
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 font-bold text-2xl text-primary">
              <Leaf className="h-8 w-8" />
              <span>B-ECO</span>
            </Link>
            <p className="text-muted-foreground mt-2">Đăng nhập để quản lý đơn hàng</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Đăng nhập</TabsTrigger>
                <TabsTrigger value="register">Đăng ký</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      value={loginForm.email}
                      onChange={e => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="email@example.com"
                      className={errors.email ? 'border-destructive' : ''}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="login-password">Mật khẩu</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={loginForm.password}
                      onChange={e => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="••••••••"
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Đăng nhập
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    Demo: admin@bco.vn / admin123 hoặc user@bco.vn / user123
                  </p>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      value={registerForm.email}
                      onChange={e => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="email@example.com"
                      className={errors.email ? 'border-destructive' : ''}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="register-password">Mật khẩu</Label>
                    <Input
                      id="register-password"
                      type="password"
                      value={registerForm.password}
                      onChange={e => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="••••••••"
                      className={errors.password ? 'border-destructive' : ''}
                    />
                    {errors.password && (
                      <p className="text-sm text-destructive mt-1">{errors.password}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="register-confirm">Xác nhận mật khẩu</Label>
                    <Input
                      id="register-confirm"
                      type="password"
                      value={registerForm.confirmPassword}
                      onChange={e => setRegisterForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="••••••••"
                      className={errors.confirmPassword ? 'border-destructive' : ''}
                    />
                    {errors.confirmPassword && (
                      <p className="text-sm text-destructive mt-1">{errors.confirmPassword}</p>
                    )}
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Đăng ký
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Bạn vẫn có thể đặt hàng mà không cần đăng nhập
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Auth;

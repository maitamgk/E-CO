import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, LockKeyhole, ShieldCheck } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { validateEmail } from '@/utils/validators';
import adminVisual from '@/assets/generated/beco-about-origin.png';

type LoginErrors = {
  email?: string;
  password?: string;
  form?: string;
};

const getErrorMessage = (error: unknown) => error instanceof Error ? error.message : 'Vui lòng thử lại sau.';

const Auth = () => {
  const navigate = useNavigate();
  const { login, user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<LoginErrors>({});

  useEffect(() => {
    if (user && isAdmin) {
      navigate('/admin', { replace: true });
    }
  }, [isAdmin, navigate, user]);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    const nextErrors: LoginErrors = {};
    if (!validateEmail(loginForm.email)) {
      nextErrors.email = 'Email quản trị không hợp lệ';
    }
    if (!loginForm.password) {
      nextErrors.password = 'Vui lòng nhập mật khẩu';
    }
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    try {
      await login(loginForm.email.trim(), loginForm.password);
      toast({ title: 'Đăng nhập quản trị thành công' });
      navigate('/admin', { replace: true });
    } catch (error: unknown) {
      setErrors({ form: getErrorMessage(error) });
    } finally {
      setIsSubmitting(false);
    }
  };

  const loading = isSubmitting;

  return (
    <Layout>
      <main className="border-b border-border bg-background">
        <div className="mx-auto grid min-h-[calc(100dvh-104px)] max-w-[1500px] grid-cols-1 lg:grid-cols-[0.86fr_1.14fr]">
          <section className="flex items-center px-5 py-12 sm:px-10 sm:py-16 lg:px-16 xl:px-24" aria-labelledby="admin-login-title">
            <div className="w-full max-w-md">
              <Link to="/" className="mb-12 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Về trang chủ
              </Link>

              <div className="mb-9">
                <div className="mb-5 flex h-11 w-11 items-center justify-center border border-primary/30 bg-primary/10 text-primary">
                  <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                </div>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-primary">Khu vực nội bộ</p>
                <h1 id="admin-login-title" className="max-w-sm font-heading text-4xl font-medium leading-[1.08] text-foreground sm:text-5xl">
                  Cổng quản trị B-ECO
                </h1>
                <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground sm:text-base">
                  Đăng nhập để quản lý đơn hàng, sản phẩm và trạng thái vận hành.
                </p>
              </div>

              <form onSubmit={handleLogin} className="border-t border-border pt-8" noValidate>
                <div className="grid gap-5">
                  <div className="grid gap-2">
                    <Label htmlFor="admin-email" className="text-sm font-semibold">Email quản trị</Label>
                    <Input
                      id="admin-email"
                      name="email"
                      type="email"
                      autoComplete="username"
                      value={loginForm.email}
                      onChange={event => setLoginForm(previous => ({ ...previous, email: event.target.value }))}
                      placeholder="Nhập email quản trị"
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? 'admin-email-error' : undefined}
                      className="h-12 rounded-none border-border bg-card px-4 placeholder:text-muted-foreground focus-visible:ring-primary"
                    />
                    {errors.email && <p id="admin-email-error" className="text-sm font-medium text-destructive">{errors.email}</p>}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="admin-password" className="text-sm font-semibold">Mật khẩu</Label>
                    <Input
                      id="admin-password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      value={loginForm.password}
                      onChange={event => setLoginForm(previous => ({ ...previous, password: event.target.value }))}
                      placeholder="Nhập mật khẩu"
                      aria-invalid={Boolean(errors.password)}
                      aria-describedby={errors.password ? 'admin-password-error' : undefined}
                      className="h-12 rounded-none border-border bg-card px-4 placeholder:text-muted-foreground focus-visible:ring-primary"
                    />
                    {errors.password && <p id="admin-password-error" className="text-sm font-medium text-destructive">{errors.password}</p>}
                  </div>

                  {errors.form && (
                    <div role="alert" className="border-l-2 border-destructive bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
                      {errors.form}
                    </div>
                  )}

                  <Button type="submit" size="lg" className="mt-1 h-12 w-full rounded-none" disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <LockKeyhole className="h-4 w-4" aria-hidden="true" />}
                    {loading ? 'Đang xác thực' : 'Đăng nhập quản trị'}
                  </Button>
                </div>
              </form>

              <p className="mt-6 text-xs leading-5 text-muted-foreground">
                Chỉ tài khoản được cấp quyền quản trị mới có thể truy cập.
              </p>
            </div>
          </section>

          <aside className="relative min-h-[320px] overflow-hidden border-t border-border lg:min-h-full lg:border-l lg:border-t-0" aria-label="Sản phẩm B-ECO tại Phú Yên">
            <img
              src={adminVisual}
              alt="Sản phẩm lá bàng biển B-ECO bên bờ biển Phú Yên"
              className="absolute inset-0 h-full w-full object-cover"
              loading="eager"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[hsl(151_49%_13%/0.36)] via-transparent to-transparent" aria-hidden="true" />
          </aside>
        </div>
      </main>
    </Layout>
  );
};

export default Auth;

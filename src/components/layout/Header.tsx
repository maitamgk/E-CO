import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Moon, Search, ShoppingBag, Sun, User, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';
import logo from '@/assets/products/logo.png';

const navLinks = [
  { to: '/shop', label: 'Sản phẩm' },
  { to: '/about', label: 'Về B-ECO' },
  { to: '/blog', label: 'Bài viết' },
  { to: '/order-lookup', label: 'Tra cứu đơn hàng' },
];

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const { itemCount } = useCart();
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    navigate(`/shop?search=${encodeURIComponent(query)}`);
    setSearchQuery('');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/75 bg-background/90 shadow-[0_6px_24px_rgba(16,63,40,0.04)] backdrop-blur-xl">
      <div className="mx-auto grid h-[72px] max-w-[1400px] grid-cols-[auto_1fr_auto] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center" aria-label="B-ECO trang chủ">
          <img src={logo} alt="B-ECO" className="h-12 w-36 object-contain object-left sm:w-40" />
        </Link>

        <nav className="hidden items-center justify-center gap-1 lg:flex" aria-label="Điều hướng chính">
          {navLinks.map(link => {
            const active = location.pathname === link.to || (link.to === '/shop' && location.pathname.startsWith('/product/'));
            return (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  'rounded-lg px-3 py-2 text-sm font-semibold transition-colors',
                  active ? 'bg-secondary text-primary' : 'text-muted-foreground hover:bg-secondary/70 hover:text-foreground',
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center justify-end gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => setSearchOpen(current => !current)}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-foreground transition-colors hover:bg-secondary"
            aria-label="Tìm kiếm"
            aria-expanded={searchOpen}
          >
            <Search className="h-5 w-5 stroke-[1.7]" />
          </button>
          <button
            type="button"
            onClick={() => setIsDark(current => !current)}
            className="hidden h-10 w-10 items-center justify-center rounded-xl text-foreground transition-colors hover:bg-secondary sm:flex"
            aria-label={isDark ? 'Dùng giao diện sáng' : 'Dùng giao diện tối'}
          >
            {isDark ? <Sun className="h-5 w-5 stroke-[1.7]" /> : <Moon className="h-5 w-5 stroke-[1.7]" />}
          </button>
          <Link
            to={user ? '/orders' : '/auth'}
            className="hidden h-10 w-10 items-center justify-center rounded-xl text-foreground transition-colors hover:bg-secondary sm:flex"
            aria-label={user ? 'Đơn hàng của tôi' : 'Đăng nhập'}
          >
            <User className="h-5 w-5 stroke-[1.7]" />
          </Link>
          <Link
            to="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-foreground transition-colors hover:bg-secondary"
            aria-label={`Giỏ hàng có ${itemCount} sản phẩm`}
          >
            <ShoppingBag className="h-5 w-5 stroke-[1.7]" />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(current => !current)}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-foreground transition-colors hover:bg-secondary lg:hidden"
            aria-label="Mở menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-border/60 bg-card shadow-[0_18px_48px_hsl(var(--primary)/0.1)]">
          <form onSubmit={handleSearchSubmit} className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4 sm:px-6">
            <Search className="h-5 w-5 flex-none text-muted-foreground" />
            <label htmlFor="site-search" className="sr-only">Tìm sản phẩm</label>
            <input
              id="site-search"
              value={searchQuery}
              onChange={event => setSearchQuery(event.target.value)}
              placeholder="Tìm đĩa, chén, quà tặng hoặc sản phẩm nghệ thuật"
              className="h-11 min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              autoFocus
            />
            <button type="submit" className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
              Tìm kiếm
            </button>
          </form>
        </div>
      )}

      {mobileMenuOpen && (
        <div className="border-t border-border/60 bg-card px-4 py-4 shadow-[0_18px_48px_hsl(var(--primary)/0.1)] lg:hidden">
          <nav className="mx-auto flex max-w-[1400px] flex-col" aria-label="Điều hướng di động">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} className="rounded-xl px-4 py-3.5 text-sm font-semibold text-foreground hover:bg-secondary">
                {link.label}
              </Link>
            ))}
            <Link to={user ? '/orders' : '/auth'} className="rounded-xl px-4 py-3.5 text-sm font-semibold text-foreground hover:bg-secondary">
              {user ? 'Đơn hàng của tôi' : 'Đăng nhập / Đăng ký'}
            </Link>
            {isAdmin && <Link to="/admin" className="rounded-xl px-4 py-3.5 text-sm font-semibold text-primary hover:bg-secondary">Trang quản trị</Link>}
            {user && <button type="button" onClick={logout} className="rounded-xl px-4 py-3.5 text-left text-sm font-semibold text-muted-foreground hover:bg-secondary">Đăng xuất</button>}
            <button type="button" onClick={() => setIsDark(current => !current)} className="mt-2 flex items-center gap-3 rounded-xl border border-border px-4 py-3 text-sm font-semibold text-foreground">
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {isDark ? 'Giao diện sáng' : 'Giao diện tối'}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

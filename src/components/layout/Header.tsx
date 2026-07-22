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
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/95 backdrop-blur-xl">
      <div className="flex h-8 items-center justify-center bg-primary px-4 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-primary-foreground sm:text-[11px]">
        Sản phẩm sinh thái từ lá bàng biển, phát triển tại Phú Yên
      </div>

      <div className="mx-auto grid h-[72px] max-w-[1500px] grid-cols-[1fr_auto] items-center px-4 sm:px-6 lg:grid-cols-[1fr_auto_1fr] lg:px-8">
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Điều hướng chính">
          {navLinks.map(link => {
            const active = location.pathname === link.to || (link.to === '/shop' && location.pathname.startsWith('/product/'));
            return (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  'relative py-2 text-xs font-bold uppercase tracking-[0.08em] transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:bg-primary after:transition-transform',
                  active ? 'text-primary after:scale-x-100' : 'text-foreground/75 after:scale-x-0 hover:text-primary hover:after:scale-x-100',
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <Link to="/" className="flex h-[68px] w-52 items-center justify-center overflow-hidden sm:w-60 lg:justify-self-center" aria-label="B-ECO trang chủ">
          <img src={logo} alt="B-ECO" className="h-full w-full scale-[2.8] object-contain" />
        </Link>

        <div className="flex items-center justify-end gap-0.5 lg:gap-1">
          <button type="button" onClick={() => setSearchOpen(current => !current)} className="flex h-10 w-10 items-center justify-center text-foreground transition-colors hover:text-primary" aria-label="Tìm kiếm" aria-expanded={searchOpen}>
            <Search className="h-[19px] w-[19px] stroke-[1.6]" />
          </button>
          <button type="button" onClick={() => setIsDark(current => !current)} className="hidden h-10 w-10 items-center justify-center text-foreground transition-colors hover:text-primary sm:flex" aria-label={isDark ? 'Dùng giao diện sáng' : 'Dùng giao diện tối'}>
            {isDark ? <Sun className="h-[19px] w-[19px] stroke-[1.6]" /> : <Moon className="h-[19px] w-[19px] stroke-[1.6]" />}
          </button>
          <Link to={user ? '/orders' : '/auth'} className="hidden h-10 w-10 items-center justify-center text-foreground transition-colors hover:text-primary sm:flex" aria-label={user ? 'Đơn hàng của tôi' : 'Đăng nhập'}>
            <User className="h-[19px] w-[19px] stroke-[1.6]" />
          </Link>
          <Link to="/cart" className="relative flex h-10 w-10 items-center justify-center text-foreground transition-colors hover:text-primary" aria-label={`Giỏ hàng có ${itemCount} sản phẩm`}>
            <ShoppingBag className="h-[19px] w-[19px] stroke-[1.6]" />
            {itemCount > 0 && <span className="absolute right-0 top-0 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent px-1 text-[9px] font-bold text-accent-foreground">{itemCount > 99 ? '99+' : itemCount}</span>}
          </Link>
          <button type="button" onClick={() => setMobileMenuOpen(current => !current)} className="flex h-10 w-10 items-center justify-center text-foreground lg:hidden" aria-label="Mở menu" aria-expanded={mobileMenuOpen}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-border bg-card">
          <form onSubmit={handleSearchSubmit} className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4 sm:px-6">
            <Search className="h-5 w-5 flex-none text-muted-foreground" />
            <label htmlFor="site-search" className="sr-only">Tìm sản phẩm</label>
            <input id="site-search" value={searchQuery} onChange={event => setSearchQuery(event.target.value)} placeholder="Tìm đĩa, chén, quà tặng hoặc sản phẩm nghệ thuật" className="h-11 min-w-0 flex-1 border-b border-border bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary" autoFocus />
            <button type="submit" className="h-11 border border-primary bg-primary px-6 text-xs font-bold uppercase tracking-[0.08em] text-primary-foreground transition-colors hover:bg-primary/90">Tìm kiếm</button>
          </form>
        </div>
      )}

      {mobileMenuOpen && (
        <div className="border-t border-border bg-card px-4 py-5 lg:hidden">
          <nav className="mx-auto flex max-w-[1400px] flex-col" aria-label="Điều hướng di động">
            {navLinks.map(link => <Link key={link.to} to={link.to} className="border-b border-border/70 px-1 py-3.5 text-sm font-bold text-foreground hover:text-primary">{link.label}</Link>)}
            <Link to={user ? '/orders' : '/auth'} className="border-b border-border/70 px-1 py-3.5 text-sm font-bold text-foreground">{user ? 'Đơn hàng của tôi' : 'Đăng nhập / Đăng ký'}</Link>
            {isAdmin && <Link to="/admin" className="border-b border-border/70 px-1 py-3.5 text-sm font-bold text-primary">Trang quản trị</Link>}
            {user && <button type="button" onClick={logout} className="border-b border-border/70 px-1 py-3.5 text-left text-sm font-bold text-muted-foreground">Đăng xuất</button>}
            <button type="button" onClick={() => setIsDark(current => !current)} className="mt-4 flex items-center gap-3 text-sm font-bold text-foreground">
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {isDark ? 'Giao diện sáng' : 'Giao diện tối'}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

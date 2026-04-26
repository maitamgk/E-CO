import { Link } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Moon, Sun, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import logo from '@/assets/products/logo.jpg';

const navLinks = [
  { to: '/', label: 'Trang chủ' },
  { to: '/shop', label: 'Cửa hàng' },
  { to: '/pricing', label: 'Bảng giá' },
  { to: '/about', label: 'Về B-ECO' },
  { to: '/contact', label: 'Liên hệ' },
  { to: '/policies', label: 'Chính sách' },
];

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { itemCount } = useCart();
  const { user, isAdmin, logout } = useAuth();
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  const toggleDarkMode = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    if (newDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 eco-dark-bg text-white transition-all duration-300 ${scrolled ? 'shadow-lg' : ''}`}>
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-16 lg:h-[72px]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="overflow-hidden border border-white/20 rounded-full">
              <img src={logo} alt="B-ECO Logo" className="h-10 w-10 object-cover" />
            </div>
            <span className="font-heading font-extrabold text-xl tracking-tight text-white">
              B-ECO
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors uppercase tracking-wider"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link to="/shop">
              <Button className="hidden sm:flex h-9 px-5 rounded-none text-xs font-bold uppercase tracking-widest bg-transparent border border-white text-white hover:bg-white hover:text-[#2d4a3e] transition-all">
                Đặt hàng
              </Button>
            </Link>

            <Link to="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-none h-9 w-9 text-white hover:bg-white/10"
              >
                <ShoppingCart className="h-4 w-4" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 min-w-4 flex items-center justify-center p-0 text-[9px] bg-orange-500 text-white rounded-full border-0">
                    {itemCount > 99 ? '99+' : itemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="rounded-none h-9 w-9 text-white hover:bg-white/10"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {user ? (
              <div className="hidden md:flex items-center gap-1">
                <Link to="/orders">
                  <Button variant="ghost" size="sm" className="rounded-none text-white/80 hover:text-white hover:bg-white/10 text-xs uppercase tracking-wider">
                    Đơn hàng
                  </Button>
                </Link>
                {isAdmin && (
                  <Link to="/admin">
                    <Button size="sm" className="rounded-none bg-white/20 text-white text-xs uppercase tracking-wider hover:bg-white/30">
                      Admin
                    </Button>
                  </Link>
                )}
                <Button variant="ghost" size="sm" onClick={logout} className="rounded-none text-white/60 hover:text-white hover:bg-white/10 text-xs">
                  Đăng xuất
                </Button>
              </div>
            ) : (
              <Link to="/auth" className="hidden md:block">
                <Button variant="ghost" size="icon" className="rounded-none h-9 w-9 text-white hover:bg-white/10">
                  <User className="h-4 w-4" />
                </Button>
              </Link>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-none h-9 w-9 text-white hover:bg-white/10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <nav className="flex flex-col">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="px-4 py-3 text-sm uppercase tracking-wider text-white/80 hover:text-white hover:bg-white/5 border-b border-white/5 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <>
                  <Link to="/orders" className="px-4 py-3 text-sm text-white/80 hover:text-white hover:bg-white/5" onClick={() => setMobileMenuOpen(false)}>
                    Đơn hàng
                  </Link>
                  <button className="px-4 py-3 text-left text-sm text-white/60 hover:text-white hover:bg-white/5" onClick={() => { logout(); setMobileMenuOpen(false); }}>
                    Đăng xuất
                  </button>
                </>
              ) : (
                <Link to="/auth" className="px-4 py-3 text-sm text-white/80 hover:text-white hover:bg-white/5 flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                  <User className="h-4 w-4" /> Đăng nhập
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

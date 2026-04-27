import { Link } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Moon, Sun } from 'lucide-react';
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
    <header className={`sticky top-0 z-50 bg-background border-b-2 border-border transition-all duration-300 ${scrolled ? 'shadow-[0_4px_0px_0px_rgba(30,51,42,0.1)]' : ''}`}>
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-16 lg:h-[72px]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="overflow-hidden border-2 border-border rounded-none bg-white">
              <img src={logo} alt="B-ECO Logo" className="h-10 w-10 object-cover" />
            </div>
            <span className="font-heading font-extrabold text-xl tracking-tight text-foreground">
              B-ECO
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="px-4 py-2 text-sm font-bold text-foreground/80 hover:text-foreground transition-colors uppercase tracking-wider relative after:content-[''] after:absolute after:bottom-1 after:left-4 after:right-4 after:h-[2px] after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link to="/shop">
              <Button className="hidden sm:flex h-9 px-5 rounded-none text-xs font-bold uppercase tracking-widest bg-primary border-2 border-border text-white hover:bg-background hover:text-foreground transition-all shadow-[3px_3px_0px_0px_rgba(30,51,42,1)] hover:shadow-none hover:translate-y-[3px] hover:translate-x-[3px]">
                Đặt hàng
              </Button>
            </Link>

            <Link to="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-none h-9 w-9 text-foreground hover:bg-primary/10"
              >
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center p-0 text-[10px] font-bold bg-emerald-500 text-white rounded-none border border-border">
                    {itemCount > 99 ? '99+' : itemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="rounded-none h-9 w-9 text-foreground hover:bg-primary/10"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {user ? (
              <div className="hidden md:flex items-center gap-1">
                <Link to="/orders">
                  <Button variant="ghost" size="sm" className="rounded-none text-foreground/80 hover:text-foreground hover:bg-primary/10 text-xs font-bold uppercase tracking-wider">
                    Đơn hàng
                  </Button>
                </Link>
                {isAdmin && (
                  <Link to="/admin">
                    <Button size="sm" className="rounded-none bg-primary/10 text-foreground border border-border/20 text-xs font-bold uppercase tracking-wider hover:bg-primary/20">
                      Admin
                    </Button>
                  </Link>
                )}
                <Button variant="ghost" size="sm" onClick={logout} className="rounded-none text-foreground/60 hover:text-foreground hover:bg-primary/10 text-xs font-bold uppercase tracking-wider">
                  Đăng xuất
                </Button>
              </div>
            ) : (
              <Link to="/auth" className="hidden md:block">
                <Button variant="ghost" size="icon" className="rounded-none h-9 w-9 text-foreground hover:bg-primary/10">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-none h-9 w-9 text-foreground hover:bg-primary/10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t-2 border-border">
            <nav className="flex flex-col">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="px-4 py-3 text-sm font-bold uppercase tracking-wider text-foreground/80 hover:text-foreground hover:bg-primary/5 border-b border-border/10 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <>
                  <Link to="/orders" className="px-4 py-3 text-sm font-bold uppercase tracking-wider text-foreground/80 hover:text-foreground hover:bg-primary/5 border-b border-border/10" onClick={() => setMobileMenuOpen(false)}>
                    Đơn hàng
                  </Link>
                  <button className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wider text-foreground/80 hover:text-foreground hover:bg-primary/5" onClick={() => { logout(); setMobileMenuOpen(false); }}>
                    Đăng xuất
                  </button>
                </>
              ) : (
                <Link to="/auth" className="px-4 py-3 text-sm font-bold uppercase tracking-wider text-foreground/80 hover:text-foreground hover:bg-primary/5 flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
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

import { Link } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Leaf, Sparkles, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

const navLinks = [
  { to: '/', label: 'Trang chủ' },
  { to: '/shop', label: 'Cửa hàng' },
  { to: '/pricing', label: 'Bảng giá' },
  { to: '/about', label: 'Về B-ECO' },
  { to: '/contact', label: 'Liên hệ' },
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
    <header className={`sticky top-0 z-50 transition-all duration-500 ${scrolled
      ? 'bg-white/90 dark:bg-gray-950/90 backdrop-blur-2xl shadow-xl shadow-emerald-500/5 border-b border-emerald-500/20'
      : 'bg-white/70 dark:bg-gray-950/70 backdrop-blur-md border-b border-emerald-500/10'
      }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo - Enhanced */}
          <Link to="/" className="flex items-center gap-3 font-bold text-xl group">
            <div className={`relative p-2.5 rounded-2xl transition-all duration-300 ${scrolled
              ? 'bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/30'
              : 'bg-gradient-to-br from-emerald-400 to-teal-400 shadow-md shadow-emerald-400/20'
              }`}>
              <Leaf className="h-6 w-6 text-white group-hover:rotate-12 transition-transform duration-300" />
              <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="hidden sm:inline bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent font-black text-2xl tracking-tight">
              B-ECO
            </span>
          </Link>

          {/* Desktop Nav - Enhanced */}
          <nav className="hidden md:flex items-center gap-1 bg-gray-50/50 dark:bg-gray-900/50 rounded-full px-2 py-2 backdrop-blur-sm border border-emerald-500/10">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="relative px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-300 rounded-full hover:bg-white dark:hover:bg-gray-800 group"
              >
                {link.label}
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full group-hover:w-8 transition-all duration-300" />
              </Link>
            ))}
          </nav>

          {/* Actions - Enhanced */}
          <div className="flex items-center gap-2">
            <Link to="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="relative group hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-full h-11 w-11 transition-all duration-300"
              >
                <ShoppingCart className="h-5 w-5 text-gray-700 dark:text-gray-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:scale-110 transition-all duration-300" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center p-0 text-xs bg-gradient-to-r from-emerald-500 to-teal-500 border-2 border-white dark:border-gray-950 shadow-lg shadow-emerald-500/30 animate-scale-in">
                    {itemCount > 99 ? '99+' : itemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="group hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-full h-11 w-11 transition-all duration-300"
            >
              {isDark ? (
                <Sun className="h-5 w-5 text-yellow-500 group-hover:rotate-45 transition-all duration-300" />
              ) : (
                <Moon className="h-5 w-5 text-gray-700 group-hover:text-emerald-600 transition-all duration-300" />
              )}
            </Button>

            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/orders">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="group rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-950/30 font-medium"
                  >
                    <Sparkles className="h-4 w-4 mr-2 text-emerald-500 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:rotate-12" />
                    Đơn hàng
                  </Button>
                </Link>
                {isAdmin && (
                  <Link to="/admin">
                    <Button
                      size="sm"
                      className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-md shadow-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/40 transition-all duration-300"
                    >
                      Admin
                    </Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Đăng xuất
                </Button>
              </div>
            ) : (
              <Link to="/auth" className="hidden md:block">
                <Button
                  variant="ghost"
                  size="icon"
                  className="group hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-full h-11 w-11 transition-all duration-300"
                >
                  <User className="h-5 w-5 text-gray-700 dark:text-gray-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:scale-110 transition-all duration-300" />
                </Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-full h-11 w-11"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5 text-gray-700 dark:text-gray-300 animate-scale-in" />
              ) : (
                <Menu className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu - Enhanced */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-emerald-500/20 animate-fade-in bg-white/50 dark:bg-gray-950/50 backdrop-blur-xl rounded-b-2xl">
            <nav className="flex flex-col gap-1.5">
              {navLinks.map((link, i) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="px-4 py-3.5 text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 rounded-xl transition-all font-medium animate-fade-in-up"
                  style={{ animationDelay: `${i * 50}ms` }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-emerald-500/20 my-2 mx-2" />
              {user ? (
                <>
                  <Link
                    to="/orders"
                    className="px-4 py-3.5 text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 rounded-xl font-medium flex items-center gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Sparkles className="h-4 w-4 text-emerald-500" />
                    Đơn hàng của tôi
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="px-4 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold shadow-md shadow-emerald-500/30"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Quản trị
                    </Link>
                  )}
                  <button
                    className="px-4 py-3.5 text-left text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-950/30 rounded-xl font-medium"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  className="px-4 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold shadow-md shadow-emerald-500/30 flex items-center gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="h-4 w-4" />
                  Đăng nhập
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Leaf, Search, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import logo from '@/assets/products/logo.jpg';

const leftNavLinks = [
  { to: '/shop', label: 'Sản phẩm' },
  { to: '/about', label: 'Về B-ECO' },
  { to: '/blog', label: 'Bài viết' },
  { to: '/order-lookup', label: 'Tra cứu đơn hàng' },
];

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  
  const { itemCount } = useCart();
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <div className="w-full z-50 sticky top-0 flex flex-col">
      {/* 2. Main Navigation Header */}
      <header className={`transition-all duration-300 w-full border-b border-border/10 ${
        scrolled
          ? 'bg-background/95 dark:bg-[#242b26]/95 backdrop-blur-md shadow-sm'
          : 'bg-background dark:bg-[#242b26]'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20 relative">
            
            {/* Desktop Left: Search Toggle & Nav Links */}
            <div className="hidden lg:flex items-center gap-8 flex-1">
              <button 
                onClick={() => setSearchOpen(!searchOpen)} 
                className="flex items-center gap-2 text-primary/80 hover:text-primary transition-colors py-2"
                aria-label="Search"
              >
                <Search className="h-5 w-5 text-primary stroke-[1.5]" />
              </button>
              
              <nav className="flex items-center gap-6">
                {leftNavLinks.map(link => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="text-[13px] font-barlow uppercase tracking-widest text-primary/80 hover:text-primary transition-colors duration-300 relative group py-2"
                  >
                    {link.label}
                    <span className="absolute bottom-0 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
                  </Link>
                ))}
              </nav>
            </div>

            {/* Mobile Left: Menu Toggle */}
            <div className="lg:hidden flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-none hover:bg-transparent p-0 mr-4"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6 text-primary stroke-[1.5]" />
                ) : (
                  <Menu className="h-6 w-6 text-primary stroke-[1.5]" />
                )}
              </Button>
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="text-primary/80 hover:text-primary transition-colors"
                aria-label="Search"
              >
                <Search className="h-5 w-5 text-primary stroke-[1.5]" />
              </button>
            </div>

            {/* Center: Brand Logo */}
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center">
              <Link to="/" className="flex items-center group">
                <img 
                  src={logo} 
                  alt="B-ECO Logo" 
                  className="w-24 h-24 md:w-36 md:h-36 object-cover group-hover:scale-105 transition-transform duration-500 rounded-none border border-border/10" 
                />
              </Link>
            </div>

            {/* Right: Account, Cart, Theme Toggle */}
            <div className="flex items-center gap-2 sm:gap-4 flex-1 justify-end">
              {/* Dark Mode Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDarkMode}
                className="rounded-none hover:bg-transparent hover:text-primary/70 transition-colors h-10 w-10 p-0"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <Sun className="h-5 w-5 text-primary stroke-[1.5]" />
                ) : (
                  <Moon className="h-5 w-5 text-primary stroke-[1.5]" />
                )}
              </Button>

              {/* Account / Auth */}
              {user ? (
                <div className="flex items-center gap-2 sm:gap-4">
                  <Link to="/orders">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hidden sm:inline-block rounded-none text-[12px] font-barlow uppercase tracking-widest hover:bg-transparent hover:text-primary/70 p-0 font-medium"
                    >
                      Đơn hàng
                    </Button>
                  </Link>
                  {isAdmin && (
                    <Link to="/admin">
                      <Button
                        size="sm"
                        className="hidden sm:inline-block rounded-none bg-primary text-primary-foreground hover:bg-primary/90 text-[11px] font-barlow uppercase tracking-widest font-medium h-9 px-4"
                      >
                        Admin
                      </Button>
                    </Link>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    className="hidden sm:inline-block rounded-none text-[12px] font-barlow uppercase tracking-widest hover:bg-transparent hover:text-primary/70 p-0 font-medium"
                  >
                    Thoát
                  </Button>
                  <Link to="/orders" className="sm:hidden" aria-label="Account">
                    <User className="h-5 w-5 text-primary stroke-[1.5]" />
                  </Link>
                </div>
              ) : (
                <Link to="/auth" aria-label="Login">
                  <User className="h-5 w-5 text-primary stroke-[1.5] hover:text-primary/70 transition-colors" />
                </Link>
              )}

              {/* Cart */}
              <Link to="/cart">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative rounded-none hover:bg-transparent hover:text-primary/70 transition-colors h-10 w-10 p-0"
                  aria-label="Cart"
                >
                  <ShoppingCart className="h-5 w-5 text-primary stroke-[1.5]" />
                  {itemCount > 0 && (
                    <Badge className="absolute -top-1.5 -right-1.5 h-4 min-w-4 flex items-center justify-center p-0 text-[9px] font-semibold bg-primary text-primary-foreground border-none rounded-full">
                      {itemCount > 99 ? '99+' : itemCount}
                    </Badge>
                  )}
                </Button>
              </Link>
            </div>

          </div>
        </div>

        {/* Collapsible Search Panel */}
        {searchOpen && (
          <div className="absolute left-0 w-full bg-background dark:bg-[#242b26] border-b border-border/10 py-6 animate-fade-in shadow-md z-40">
            <div className="container mx-auto px-4 max-w-xl">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center border-b border-primary/20 pb-2">
                <input
                  type="text"
                  placeholder="Nhập sản phẩm hoặc từ khóa bạn muốn tìm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none outline-none focus:ring-0 text-sm placeholder-muted-foreground pr-10 font-nunito"
                  autoFocus
                />
                <button type="submit" className="absolute right-0" aria-label="Search submit">
                  <Search className="h-5 w-5 text-primary/60 hover:text-primary stroke-[1.5]" />
                </button>
              </form>
              <div className="mt-4 flex flex-wrap gap-2 items-center">
                <span className="text-[11px] font-barlow uppercase tracking-widest text-muted-foreground">Gợi ý:</span>
                {['Đĩa tròn', 'Chén lá bàng', 'Combo tiệc cưới', 'In logo'].map((keyword) => (
                  <button
                    key={keyword}
                    onClick={() => {
                      setSearchQuery(keyword);
                      navigate(`/shop?search=${encodeURIComponent(keyword)}`);
                      setSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="text-xs bg-primary/5 hover:bg-primary/10 text-primary px-3 py-1 transition-colors font-nunito"
                  >
                    {keyword}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mobile Menu Panel */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border/10 py-4 bg-background dark:bg-[#242b26] animate-fade-in absolute left-0 right-0 top-full shadow-lg z-50">
            <nav className="flex flex-col container mx-auto px-4">
              {leftNavLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="py-4 text-[13px] font-barlow uppercase tracking-widest text-primary border-b border-border/5 hover:text-primary/70 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <>
                  <Link
                    to="/orders"
                    className="py-4 text-[13px] font-barlow uppercase tracking-widest text-primary border-b border-border/5 hover:text-primary/70 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Đơn hàng của tôi
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="py-4 text-[13px] font-barlow uppercase tracking-widest text-primary font-medium border-b border-border/5"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Trang quản trị (Admin)
                    </Link>
                  )}
                  <button
                    className="py-4 text-[13px] font-barlow uppercase tracking-widest text-left text-primary hover:text-primary/70 transition-colors"
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
                  className="py-4 text-[13px] font-barlow uppercase tracking-widest text-primary hover:text-primary/70 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Đăng nhập / Đăng ký
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>
    </div>
  );
};

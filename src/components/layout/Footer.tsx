import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import logo from '@/assets/products/logo.jpg';

export const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      alert(`Cảm ơn bạn đã đăng ký nhận tin với email: ${email}`);
      setEmail('');
    }
  };

  return (
    <footer className="bg-background dark:bg-[#242b26] border-t border-border/10 relative overflow-hidden text-primary font-nunito">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16">
          
          {/* Left Side: Brand & Newsletter */}
          <div className="lg:col-span-5 space-y-8">
            <Link to="/" className="flex items-center group font-bold text-xl">
              <img 
                src={logo} 
                alt="B-ECO Logo" 
                className="w-32 h-32 md:w-48 md:h-48 object-cover group-hover:scale-105 transition-transform duration-500 rounded-none border border-border/10" 
              />
            </Link>
            
            <h3 className="font-heading text-3xl sm:text-4xl md:text-5xl italic font-light text-primary/90 leading-tight">
              B-ECO - Gieo mầm xanh từ chiếc lá nhỏ
            </h3>
            
            <div className="space-y-4 max-w-md">
              <p className="text-sm text-muted-foreground uppercase tracking-widest font-barlow">
                Đăng ký nhận tin tức mới nhất từ B-ECO
              </p>
              
              <form onSubmit={handleSubmit} className="relative flex items-center border-b border-primary/40 pb-2 group">
                <input
                  type="email"
                  placeholder="Email của bạn..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-none outline-none focus:ring-0 text-sm placeholder-muted-foreground/60 pr-10"
                  required
                />
                <button 
                  type="submit" 
                  className="absolute right-0 translate-x-0 group-hover:translate-x-1 transition-transform duration-300"
                  aria-label="Send email"
                >
                  <ArrowRight className="h-5 w-5 text-primary stroke-[1.5]" />
                </button>
              </form>
            </div>

            <div className="flex gap-6 font-barlow text-xs tracking-widest uppercase">
              {['facebook', 'instagram', 'youtube'].map(social => (
                <a
                  key={social}
                  href="#"
                  className="text-primary/60 hover:text-primary transition-colors duration-300 relative group py-1"
                >
                  {social}
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </div>
          </div>

          {/* Right Side: Navigation & Info Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            
            {/* Quick Links */}
            <div>
              <h4 className="font-barlow text-[13px] font-semibold tracking-widest text-primary uppercase mb-6">Liên kết nhanh</h4>
              <ul className="space-y-4 text-sm font-light">
                {[
                  { to: '/shop', label: 'Cửa hàng' },
                  { to: '/pricing', label: 'Bảng giá' },
                  { to: '/about', label: 'Về B-ECO' },
                  { to: '/blog', label: 'Bài viết' },
                  { to: '/order-lookup', label: 'Tra cứu đơn hàng' },
                ].map(link => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Policies */}
            <div>
              <h4 className="font-barlow text-[13px] font-semibold tracking-widest text-primary uppercase mb-6">Chính sách</h4>
              <ul className="space-y-4 text-sm font-light">
                {[
                  { to: '/policies', label: 'Chính sách mua hàng' },
                  { to: '/policies', label: 'Chính sách bảo mật' },
                  { to: '/policies', label: 'Điều khoản sử dụng' },
                ].map((link, idx) => (
                  <li key={idx}>
                    <Link
                      to={link.to}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-barlow text-[13px] font-semibold tracking-widest text-primary uppercase mb-6">Liên hệ</h4>
              <ul className="space-y-4 text-sm font-light">
                <li>
                  <a href="tel:0385959294" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                    <Phone className="h-4 w-4 text-primary/60 stroke-[1.5]" />
                    <span>0385 959 294</span>
                  </a>
                </li>
                <li>
                  <a href="mailto:tranbieu25@gmail.com" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                    <Mail className="h-4 w-4 text-primary/60 stroke-[1.5]" />
                    <span className="break-all">tranbieu25@gmail.com</span>
                  </a>
                </li>
                <li className="flex items-start gap-3 text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary/60 stroke-[1.5] mt-0.5 flex-shrink-0" />
                  <span>Phú Yên, Việt Nam</span>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* Footer Bottom Row */}
        <div className="border-t border-border/10 mt-16 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] font-barlow tracking-widest uppercase text-muted-foreground">
            <p>© {new Date().getFullYear()} B-ECO. Bảo vệ môi trường.</p>
            <p>Phú Yên, Việt Nam</p>
          </div>
        </div>

      </div>
    </footer>
  );
};

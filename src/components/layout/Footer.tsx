import { Link } from 'react-router-dom';
import { Leaf, Phone, Mail, MapPin, Send, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t border-border relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 font-bold text-2xl text-primary group">
              <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                <Leaf className="h-6 w-6" />
              </div>
              <span>B-CO</span>
            </Link>
            <p className="text-muted-foreground leading-relaxed">
              Gieo mầm xanh - Từ chiếc lá nhỏ
            </p>
            <div className="flex gap-3">
              {['facebook', 'instagram', 'youtube'].map(social => (
                <a
                  key={social}
                  href="#"
                  className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110"
                >
                  <span className="text-sm capitalize">{social[0].toUpperCase()}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-6">Liên kết nhanh</h4>
            <ul className="space-y-3">
              {[
                { to: '/shop', label: 'Cửa hàng' },
                { to: '/pricing', label: 'Bảng giá' },
                { to: '/about', label: 'Về B-CO' },
                { to: '/policies', label: 'Chính sách' },
              ].map(link => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="w-0 h-0.5 bg-primary group-hover:w-4 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-6">Liên hệ</h4>
            <ul className="space-y-4">
              <li>
                <a href="tel:0123456789" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group">
                  <div className="p-2 bg-muted rounded-lg group-hover:bg-primary/10 transition-colors">
                    <Phone className="h-4 w-4" />
                  </div>
                  <span>0123 456 789</span>
                </a>
              </li>
              <li>
                <a href="mailto:info@bco.vn" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group">
                  <div className="p-2 bg-muted rounded-lg group-hover:bg-primary/10 transition-colors">
                    <Mail className="h-4 w-4" />
                  </div>
                  <span>info@bco.vn</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <div className="p-2 bg-muted rounded-lg mt-0.5">
                  <MapPin className="h-4 w-4" />
                </div>
                <span>Phú Yên, Việt Nam</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold text-lg mb-6">Đăng ký nhận tin</h4>
            <p className="text-muted-foreground mb-4">
              Nhận thông tin khuyến mãi và sản phẩm mới.
            </p>
            <form className="flex gap-2">
              <Input
                type="email"
                placeholder="Email của bạn"
                className="rounded-xl"
              />
              <Button type="submit" size="icon" className="rounded-xl shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} B-CO. Bảo vệ môi trường, bảo vệ cuộc sống.</p>
            <p className="flex items-center gap-1">
              Made with <Heart className="h-4 w-4 text-red-500 fill-red-500" /> in Phú Yên
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import logo from '@/assets/products/logo.jpg';

export const Footer = () => {
  return (
    <footer className="eco-dark-bg-deeper text-white">
      <div className="container mx-auto px-6 lg:px-12 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="overflow-hidden border border-white/20 rounded-full">
                <img src={logo} alt="B-ECO Logo" className="h-10 w-10 object-cover" />
              </div>
              <span className="font-heading font-extrabold text-xl tracking-tight text-white">B-ECO</span>
            </Link>
            <p className="text-white/50 leading-relaxed text-sm">
              Gieo mầm xanh — Từ chiếc lá nhỏ
            </p>
          </div>

          {/* Links col 1 */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-[0.15em] mb-5 text-white/80">Sản phẩm</h4>
            <ul className="space-y-2.5">
              {[
                { to: '/shop', label: 'Cửa hàng' },
                { to: '/pricing', label: 'Bảng giá' },
                { to: '/about', label: 'Giới thiệu' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-white/50 hover:text-emerald-300 transition-colors text-sm">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links col 2 */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-[0.15em] mb-5 text-white/80">Hỗ trợ</h4>
            <ul className="space-y-2.5">
              {[
                { to: '/policies', label: 'Chính sách' },
                { to: '/contact', label: 'Liên hệ' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-white/50 hover:text-emerald-300 transition-colors text-sm">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-[0.15em] mb-5 text-white/80">Liên hệ</h4>
            <ul className="space-y-2.5 text-sm text-white/50">
              <li>
                <a href="mailto:tranbieu25@gmail.com" className="hover:text-emerald-300 transition-colors">tranbieu25@gmail.com</a>
              </li>
              <li>
                <a href="tel:0385959294" className="hover:text-emerald-300 transition-colors">0385 959 294</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/30 uppercase tracking-wider">
            <p>© {new Date().getFullYear()} B-ECO. Bảo vệ môi trường, bảo vệ cuộc sống.</p>
            <p className="flex items-center gap-1">
              Made with <Heart className="h-3 w-3 text-red-400 fill-red-400" /> in Phú Yên
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

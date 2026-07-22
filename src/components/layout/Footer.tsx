import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import logo from '@/assets/products/logo.png';

const productLinks = [
  { to: '/shop?category=dia', label: 'Đĩa sinh học' },
  { to: '/shop?category=chen', label: 'Chén lá mini' },
  { to: '/shop?category=art', label: 'B-ECO Art' },
  { to: '/shop?category=in-logo', label: 'Khắc logo' },
];

const companyLinks = [
  { to: '/about', label: 'Về B-ECO' },
  { to: '/blog', label: 'Bài viết' },
  { to: '/contact', label: 'Liên hệ' },
  { to: '/pricing', label: 'Bảng giá' },
];

const supportLinks = [
  { to: '/order-lookup', label: 'Tra cứu đơn hàng' },
  { to: '/policies', label: 'Chính sách mua hàng' },
  { to: '/cart', label: 'Giỏ hàng' },
  { to: '/auth', label: 'Tài khoản' },
];

const FooterLinks = ({ title, links }: { title: string; links: { to: string; label: string }[] }) => (
  <div>
    <h3 className="text-sm font-extrabold text-foreground">{title}</h3>
    <nav className="mt-4 grid gap-2.5" aria-label={title}>
      {links.map(link => <Link key={link.to} to={link.to} className="w-fit text-xs text-muted-foreground transition-colors hover:text-primary">{link.label}</Link>)}
    </nav>
  </div>
);

export const Footer = () => (
  <footer className="border-t border-border bg-card">
    <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-9 sm:grid-cols-2 lg:grid-cols-[1.35fr_0.72fr_0.72fr_0.8fr_1.15fr]">
        <div className="max-w-sm">
          <Link to="/" aria-label="B-ECO trang chủ">
            <img src={logo} alt="B-ECO" className="h-12 w-36 object-contain object-left" />
          </Link>
          <p className="mt-4 text-xs leading-6 text-muted-foreground">Sản phẩm sinh thái và mỹ nghệ từ lá bàng biển, được phát triển tại Phú Yên cho gia đình, doanh nghiệp và cộng đồng.</p>
          <p className="mt-4 text-sm font-extrabold leading-6 text-primary">Từ chiếc lá nhỏ đến một lựa chọn sống xanh.</p>
        </div>

        <FooterLinks title="Sản phẩm" links={productLinks} />
        <FooterLinks title="B-ECO" links={companyLinks} />
        <FooterLinks title="Hỗ trợ" links={supportLinks} />

        <div>
          <h3 className="text-sm font-extrabold text-foreground">Liên hệ</h3>
          <div className="mt-4 grid gap-3 text-xs text-muted-foreground">
            <a href="tel:0382548419" className="flex items-center gap-2.5 transition-colors hover:text-primary"><Phone className="h-4 w-4 text-primary" />0382 548 419</a>
            <a href="mailto:beco.phuyen@gmai.com" className="flex items-center gap-2.5 transition-colors hover:text-primary"><Mail className="h-4 w-4 text-primary" />beco.phuyen@gmai.com</a>
            <span className="flex items-center gap-2.5"><MapPin className="h-4 w-4 text-primary" />Phú Yên, Việt Nam</span>
          </div>
          <Link to="/contact" className="mt-5 inline-flex h-10 items-center rounded-xl bg-primary px-4 text-xs font-bold text-primary-foreground transition-transform hover:-translate-y-0.5">Gửi yêu cầu</Link>
        </div>
      </div>

      <div className="mt-9 flex flex-col gap-2 border-t border-border pt-5 text-[11px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 B-ECO. Sản phẩm sinh thái từ lá bàng biển.</p>
        <p>An toàn cho thực phẩm, chịu nhiệt đến 65°C.</p>
      </div>
    </div>
  </footer>
);

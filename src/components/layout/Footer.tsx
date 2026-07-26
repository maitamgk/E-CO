import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import logo from '@/assets/products/logo.webp';

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
  { to: '/auth', label: 'Quản trị' },
];

const FooterLinks = ({ title, links }: { title: string; links: { to: string; label: string }[] }) => (
  <div>
    <h3 className="text-xs font-bold uppercase tracking-[0.1em] text-foreground">{title}</h3>
    <nav className="mt-5 grid gap-3" aria-label={title}>
      {links.map(link => <Link key={link.to} to={link.to} className="w-fit text-sm text-muted-foreground transition-colors hover:text-primary">{link.label}</Link>)}
    </nav>
  </div>
);

export const Footer = () => (
  <footer className="bg-card">
    <div className="mx-auto max-w-[1500px] px-5 py-14 sm:px-8 sm:py-16 lg:px-14">
      <div className="grid gap-12 border-b border-border pb-14 sm:grid-cols-2 lg:grid-cols-[1.45fr_0.7fr_0.7fr_0.8fr_1.1fr]">
        <div className="max-w-md">
          <Link to="/" className="flex h-20 w-56 items-center justify-center overflow-hidden" aria-label="B-ECO trang chủ">
            <img src={logo} alt="B-ECO" className="h-full w-full scale-[2.8] object-contain" />
          </Link>
          <p className="mt-5 text-sm leading-7 text-muted-foreground">Sản phẩm sinh thái và mỹ nghệ từ lá bàng biển, được phát triển tại Phú Yên cho gia đình, doanh nghiệp và cộng đồng.</p>
          <p className="mt-4 font-heading text-xl font-medium leading-7 text-primary">Gieo Mầm Xanh - Từ chiếc lá nhỏ</p>
        </div>

        <FooterLinks title="Sản phẩm" links={productLinks} />
        <FooterLinks title="B-ECO" links={companyLinks} />
        <FooterLinks title="Hỗ trợ" links={supportLinks} />

        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.1em] text-foreground">Liên hệ</h3>
          <div className="mt-5 grid gap-4 text-sm text-muted-foreground">
            <a href="tel:0382548419" className="flex items-center gap-2.5 transition-colors hover:text-primary"><Phone className="h-4 w-4 text-primary" />0382 548 419</a>
            <a href="mailto:beco.phuyen@gmai.com" className="flex items-center gap-2.5 transition-colors hover:text-primary"><Mail className="h-4 w-4 text-primary" />beco.phuyen@gmai.com</a>
            <span className="flex items-center gap-2.5"><MapPin className="h-4 w-4 text-primary" />Phú Yên, Việt Nam</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-6 text-[11px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 B-ECO. Sản phẩm sinh thái từ lá bàng biển.</p>
        <p>An toàn cho thực phẩm, chịu nhiệt đến 65°C.</p>
      </div>
    </div>
  </footer>
);

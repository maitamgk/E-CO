import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Recycle, ShieldCheck } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { MotionReveal } from '@/components/home/MotionReveal';
import { ProductGrid } from '@/components/product/ProductGrid';
import { useProducts } from '@/context/ProductsContext';
import heroImage from '@/assets/generated/beco-editorial-hero.png';
import leafVariety from '@/assets/products/leaf-plates-variety.jpg';
import leafCloseup from '@/assets/products/leaf-plates-closeup.jpg';
import collectionDisplay from '@/assets/products/collection-display-1.jpg';
import exhibitionDisplay from '@/assets/products/exhibition-display.jpg';
import customLogo from '@/assets/products/custom-logo-beco.jpg';
import artClock from '@/assets/products/art-clock.png';

const categoryCards = [
  { name: 'Đĩa sinh học', image: leafCloseup, to: '/shop?category=dia' },
  { name: 'Chén lá mini', image: leafVariety, to: '/shop?category=chen' },
  { name: 'B-ECO Art', image: artClock, to: '/shop?category=art', contain: true },
  { name: 'Khắc logo', image: customLogo, to: '/shop?category=in-logo' },
  { name: 'Bộ sản phẩm', image: collectionDisplay, to: '/shop?category=combo' },
];

const values = [
  { icon: Leaf, title: 'Vật liệu tự nhiên', text: 'Sử dụng lá bàng biển được thu gom và xử lý tại Phú Yên.' },
  { icon: ShieldCheck, title: 'An toàn thực phẩm', text: 'Phù hợp cho món ăn nhẹ, bánh, trái cây và nhiều nhu cầu hằng ngày.' },
  { icon: Recycle, title: 'Phân hủy sinh học', text: 'Trở về với tự nhiên sau khi sử dụng và góp phần giảm rác thải nhựa.' },
];

const articles = [
  {
    title: 'Từ chiếc lá bàng biển rụng đến những chiếc đĩa trên bàn tiệc',
    date: '21 tháng 5, 2026',
    image: collectionDisplay,
  },
  {
    title: 'B-ECO đồng hành cùng xu hướng cưới sinh thái',
    date: '15 tháng 5, 2026',
    image: exhibitionDisplay,
  },
  {
    title: 'Vì sao đĩa lá bàng biển là lựa chọn thân thiện với đại dương?',
    date: '08 tháng 5, 2026',
    image: leafVariety,
  },
];

const Home = () => {
  const { products, isLoading } = useProducts();
  const featuredProducts = [products[0], products[3], products[7], products[8]].filter(Boolean);

  return (
    <Layout>
      <section className="relative isolate flex min-h-[calc(100dvh-104px)] max-h-[760px] items-center overflow-hidden bg-primary">
        <img src={heroImage} alt="Bộ đĩa và chén B-ECO từ lá bàng biển trong không gian thiên nhiên" className="absolute inset-0 h-full w-full object-cover" fetchPriority="high" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,31,22,0.9)_0%,rgba(15,31,22,0.67)_38%,rgba(15,31,22,0.14)_68%,rgba(15,31,22,0.05)_100%)]" />
        <div className="relative mx-auto w-full max-w-[1500px] px-5 py-16 sm:px-8 lg:px-14">
          <MotionReveal className="max-w-[760px] text-[#f8f4ea]">
            <h1 className="font-heading text-[72px] font-medium leading-[0.86] tracking-[0.02em] sm:text-[104px] lg:text-[132px]">B ECO</h1>
            <p className="mt-7 font-heading text-2xl font-medium text-[#d9bd80] sm:text-3xl">Gieo Mầm Xanh - Từ chiếc lá nhỏ</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/shop" className="inline-flex h-12 items-center gap-2 border border-[#d9bd80] bg-[#d9bd80] px-7 text-xs font-bold uppercase tracking-[0.1em] text-[#1f241d] transition-[transform,background-color] hover:-translate-y-0.5 hover:bg-[#e3ca92] active:translate-y-px">
                Mua ngay <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/about" className="inline-flex h-12 items-center border border-[#f8f4ea]/65 px-7 text-xs font-bold uppercase tracking-[0.1em] text-[#f8f4ea] transition-colors hover:bg-[#f8f4ea] hover:text-[#1f241d] active:translate-y-px">
                Câu chuyện B-ECO
              </Link>
            </div>
          </MotionReveal>
        </div>
      </section>

      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 lg:grid-cols-4">
          {[
            ['100%', 'lá bàng biển tự nhiên'],
            ['11', 'mã sản phẩm'],
            ['65°C', 'khả năng chịu nhiệt'],
            ['45 ngày', 'phân hủy sinh học'],
          ].map(([value, label], index) => (
            <div key={label} className={`px-5 py-7 text-center sm:px-8 ${index % 2 ? 'border-l border-border' : ''} ${index > 1 ? 'border-t border-border lg:border-t-0' : ''} ${index === 2 ? 'lg:border-l' : ''}`}>
              <strong className="font-heading text-3xl font-medium text-primary sm:text-4xl">{value}</strong>
              <span className="mt-1.5 block text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-24 lg:px-14">
        <div className="mx-auto max-w-[1260px]">
          <MotionReveal className="mx-auto max-w-3xl text-center">
            <h2 className="font-heading text-4xl font-medium leading-tight tracking-[-0.025em] text-foreground sm:text-5xl">Triết lý của B-ECO</h2>
            <p className="mx-auto mt-5 max-w-[62ch] text-sm leading-7 text-muted-foreground sm:text-base">
              Chúng tôi trân trọng vật liệu bản địa và biến những chiếc lá rụng thành sản phẩm hữu ích cho đời sống.
            </p>
            <Link to="/about" className="mt-6 inline-flex items-center gap-2 border-b border-primary pb-1 text-xs font-bold uppercase tracking-[0.1em] text-primary">Tìm hiểu thêm <ArrowRight className="h-3.5 w-3.5" /></Link>
          </MotionReveal>

          <div className="mt-14 grid gap-10 border-t border-border pt-12 md:grid-cols-3 md:gap-0">
            {values.map(({ icon: Icon, title, text }, index) => (
              <MotionReveal key={title} className={`px-2 text-center md:px-9 ${index ? 'md:border-l md:border-border' : ''}`} delay={index * 0.06}>
                <Icon className="mx-auto h-7 w-7 stroke-[1.4] text-primary" />
                <h3 className="mt-5 font-heading text-2xl font-medium text-foreground">{title}</h3>
                <p className="mx-auto mt-3 max-w-[34ch] text-sm leading-6 text-muted-foreground">{text}</p>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card px-5 py-20 sm:px-8 sm:py-24 lg:px-14">
        <div className="mx-auto max-w-[1400px]">
          <MotionReveal className="text-center">
            <h2 className="font-heading text-4xl font-medium tracking-[-0.025em] text-foreground sm:text-5xl">Sản phẩm bán chạy</h2>
            <p className="mx-auto mt-4 max-w-[58ch] text-sm leading-7 text-muted-foreground">Các sản phẩm được lựa chọn nhiều cho gia đình, nhà hàng, sự kiện và quà tặng.</p>
          </MotionReveal>
          <div className="mt-12">
            <ProductGrid products={featuredProducts} isLoading={isLoading} />
          </div>
          <div className="mt-10 text-center">
            <Link to="/shop" className="inline-flex h-12 items-center gap-2 border border-primary bg-primary px-8 text-xs font-bold uppercase tracking-[0.1em] text-primary-foreground transition-colors hover:bg-primary/90">
              Xem tất cả sản phẩm <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="mx-auto grid max-w-[1500px] md:grid-cols-[0.9fr_1.1fr]">
          <MotionReveal className="flex items-center bg-secondary px-6 py-14 sm:px-12 md:py-20 lg:px-20">
            <div className="max-w-xl">
              <h2 className="font-heading text-4xl font-medium leading-tight tracking-[-0.025em] text-foreground sm:text-5xl">Câu chuyện của vật liệu</h2>
              <p className="mt-5 max-w-[52ch] text-sm leading-7 text-muted-foreground sm:text-base">Lá bàng biển được thu gom, làm sạch và ép nhiệt tại Phú Yên. Mỗi sản phẩm giữ lại đường gân tự nhiên riêng.</p>
              <Link to="/about" className="mt-7 inline-flex items-center gap-2 border-b border-primary pb-1 text-xs font-bold uppercase tracking-[0.1em] text-primary">Khám phá hành trình <ArrowRight className="h-3.5 w-3.5" /></Link>
            </div>
          </MotionReveal>
          <MotionReveal delay={0.08}>
            <img src={collectionDisplay} alt="Không gian trưng bày sản phẩm B-ECO tại Phú Yên" className="h-full min-h-[420px] w-full object-cover" loading="lazy" />
          </MotionReveal>
        </div>

        <div className="mx-auto mt-12 max-w-[1400px] px-5 sm:px-8 lg:px-0">
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5 lg:gap-5">
            {categoryCards.map((category, index) => (
              <MotionReveal key={category.name} delay={index * 0.04}>
                <Link to={category.to} className="group block">
                  <div className="aspect-[4/5] overflow-hidden bg-secondary">
                    <img src={category.image} alt={category.name} className={`h-full w-full transition-transform duration-700 group-hover:scale-[1.045] ${category.contain ? 'object-contain p-4' : 'object-cover'}`} loading="lazy" />
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3 border-b border-border pb-3">
                    <h3 className="font-heading text-lg font-medium text-foreground transition-colors group-hover:text-primary">{category.name}</h3>
                    <ArrowRight className="h-4 w-4 flex-none text-primary transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative isolate min-h-[520px] overflow-hidden bg-primary">
        <img src={customLogo} alt="Sản phẩm B-ECO khắc logo theo yêu cầu doanh nghiệp" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(22,43,31,0.9),rgba(22,43,31,0.58),rgba(22,43,31,0.15))]" />
        <div className="relative mx-auto flex min-h-[520px] max-w-[1400px] items-center px-5 py-16 sm:px-8 lg:px-14">
          <MotionReveal className="max-w-[590px] text-[#f8f4ea]">
            <h2 className="font-heading text-4xl font-medium leading-tight tracking-[-0.025em] sm:text-5xl">Giải pháp xanh cho doanh nghiệp</h2>
            <p className="mt-5 max-w-[48ch] text-sm leading-7 text-[#f8f4ea]/80 sm:text-base">Khắc logo, quà tặng sự kiện và đơn hàng định kỳ theo số lượng.</p>
            <Link to="/contact" className="mt-8 inline-flex h-12 items-center gap-2 border border-[#d9bd80] bg-[#d9bd80] px-7 text-xs font-bold uppercase tracking-[0.1em] text-[#1f241d] transition-colors hover:bg-[#e3ca92]">
              Nhận báo giá <ArrowRight className="h-4 w-4" />
            </Link>
          </MotionReveal>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-24 lg:px-14">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex items-end justify-between gap-6">
            <h2 className="font-heading text-4xl font-medium tracking-[-0.025em] text-foreground sm:text-5xl">Bài viết mới nhất</h2>
            <Link to="/blog" className="hidden items-center gap-2 border-b border-primary pb-1 text-xs font-bold uppercase tracking-[0.1em] text-primary sm:inline-flex">Xem tất cả <ArrowRight className="h-3.5 w-3.5" /></Link>
          </div>

          <div className="mt-10 grid gap-7 lg:grid-cols-[1.35fr_0.65fr]">
            <MotionReveal>
              <Link to="/blog" className="group block">
                <div className="aspect-[16/9] overflow-hidden bg-secondary">
                  <img src={articles[0].image} alt={articles[0].title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]" loading="lazy" />
                </div>
                <p className="mt-5 text-xs font-semibold text-muted-foreground">{articles[0].date}</p>
                <h3 className="mt-2 max-w-[30ch] font-heading text-2xl font-medium leading-snug text-foreground transition-colors group-hover:text-primary sm:text-3xl">{articles[0].title}</h3>
              </Link>
            </MotionReveal>

            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-1">
              {articles.slice(1).map((article, index) => (
                <MotionReveal key={article.title} delay={(index + 1) * 0.06}>
                  <Link to="/blog" className="group grid gap-4 border-b border-border pb-7 sm:block lg:grid-cols-[160px_1fr] lg:items-center">
                    <div className="aspect-[4/3] overflow-hidden bg-secondary">
                      <img src={article.image} alt={article.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" loading="lazy" />
                    </div>
                    <div className="sm:mt-4 lg:mt-0">
                      <p className="text-xs font-semibold text-muted-foreground">{article.date}</p>
                      <h3 className="mt-2 font-heading text-xl font-medium leading-snug text-foreground transition-colors group-hover:text-primary">{article.title}</h3>
                    </div>
                  </Link>
                </MotionReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-secondary px-5 py-14 sm:px-8 lg:px-14">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-7 text-center lg:flex-row lg:text-left">
          <div>
            <h2 className="font-heading text-3xl font-medium text-foreground sm:text-4xl">Bạn cần sản phẩm riêng cho doanh nghiệp?</h2>
            <p className="mt-2 text-sm text-muted-foreground">Liên hệ B-ECO để nhận bảng giá và tư vấn theo số lượng.</p>
          </div>
          <Link to="/pricing" className="inline-flex h-12 flex-none items-center gap-2 border border-primary bg-primary px-8 text-xs font-bold uppercase tracking-[0.1em] text-primary-foreground transition-colors hover:bg-primary/90">
            Xem bảng giá <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Home;

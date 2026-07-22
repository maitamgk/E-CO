import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Leaf, Recycle, ShieldCheck, ShoppingBag, Thermometer } from 'lucide-react';
import { toast } from 'sonner';
import { Layout } from '@/components/layout/Layout';
import { MotionReveal } from '@/components/home/MotionReveal';
import { useCart } from '@/context/CartContext';
import { useProducts } from '@/context/ProductsContext';
import { Product } from '@/types';
import { formatMoney } from '@/utils/money';
import leafVariety from '@/assets/products/leaf-plates-variety.jpg';
import leafCloseup from '@/assets/products/leaf-plates-closeup.jpg';
import collectionDisplay from '@/assets/products/collection-display-1.jpg';
import customLogo from '@/assets/products/custom-logo-beco.jpg';
import artClock from '@/assets/products/art-clock.png';

const categoryCards = [
  { name: 'Đĩa sinh học', category: 'dia', image: leafCloseup, to: '/shop?category=dia' },
  { name: 'Chén lá mini', category: 'chen', image: leafVariety, to: '/shop?category=chen' },
  { name: 'B-ECO Art', category: 'art', image: artClock, to: '/shop?category=art', contain: true },
  { name: 'Khắc logo', category: 'in-logo', image: customLogo, to: '/shop?category=in-logo' },
  { name: 'Bộ sản phẩm', category: 'combo', image: collectionDisplay, to: '/shop?category=combo' },
];

const trustItems = [
  { icon: Leaf, title: 'Vật liệu tự nhiên', detail: 'Từ lá bàng biển' },
  { icon: ShieldCheck, title: 'An toàn thực phẩm', detail: 'Dùng cho món ăn' },
  { icon: Recycle, title: 'Phân hủy sinh học', detail: 'Giảm rác thải nhựa' },
];

const stats = [
  ['100%', 'lá bàng biển tự nhiên'],
  ['11', 'mã sản phẩm'],
  ['65°C', 'khả năng chịu nhiệt'],
  ['45 ngày', 'phân hủy sinh học'],
];

const CompactProductCard = ({ product }: { product: Product }) => {
  const navigate = useNavigate();
  const { addToCart, items } = useCart();
  const cartItem = items[product.id];

  const handleAddToCart = () => {
    addToCart(product, 1);
    toast.success('Đã thêm sản phẩm vào giỏ', {
      action: { label: 'Xem giỏ hàng', onClick: () => navigate('/cart') },
      duration: 3000,
    });
  };

  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[0_10px_28px_rgba(16,63,40,0.055)] transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_18px_38px_rgba(16,63,40,0.1)]">
      <Link to={`/product/${product.id}`} className="relative aspect-[1.18/1] overflow-hidden bg-secondary/55">
        <img
          src={product.imageUrl}
          alt={product.name}
          className={`h-full w-full transition-transform duration-500 group-hover:scale-[1.04] ${product.category === 'art' ? 'object-contain p-2' : 'object-cover'}`}
          loading="lazy"
        />
      </Link>
      <div className="flex flex-1 flex-col p-3.5">
        <Link to={`/product/${product.id}`} className="line-clamp-2 min-h-10 text-sm font-bold leading-5 text-foreground transition-colors hover:text-primary">
          {product.name}
        </Link>
        <div className="mt-3 flex items-end justify-between gap-2">
          <div className="min-w-0">
            <strong className="block text-base font-extrabold tracking-[-0.03em] text-primary">{formatMoney(product.priceRetail)}</strong>
            <span className="block truncate text-[11px] text-muted-foreground">/ {product.salesUnit ?? 'cái'}</span>
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-primary text-primary-foreground transition-[transform,background-color] hover:-translate-y-0.5 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={`Thêm ${product.name} vào giỏ`}
          >
            {cartItem ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </article>
  );
};

const Home = () => {
  const { products, isLoading } = useProducts();
  const featuredProducts = [products[0], products[3], products[7], products[8]].filter(Boolean);

  return (
    <Layout>
      <section className="border-b border-border/70 bg-card">
        <div className="mx-auto grid max-w-[1400px] overflow-hidden lg:min-h-[430px] lg:grid-cols-[0.86fr_1.14fr]">
          <div className="relative z-10 flex items-center px-5 py-12 sm:px-8 lg:px-12 lg:py-10">
            <div className="max-w-[590px]">
              <p className="mb-4 text-[11px] font-extrabold uppercase tracking-[0.17em] text-primary">Sản phẩm sinh học từ Phú Yên</p>
              <h1 className="max-w-[11ch] text-[42px] font-extrabold leading-[0.98] tracking-[-0.055em] text-foreground sm:text-[52px] lg:text-[58px]">
                Từ chiếc lá nhỏ, tạo nên lựa chọn lớn.
              </h1>
              <p className="mt-5 max-w-[48ch] text-sm leading-6 text-muted-foreground sm:text-base">
                Đĩa, chén và quà tặng từ lá bàng biển, an toàn cho đời sống hiện đại.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/shop" className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5">
                  Khám phá sản phẩm <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/contact" className="inline-flex h-11 items-center rounded-xl border border-primary/30 bg-card px-5 text-sm font-bold text-primary transition-colors hover:bg-secondary">
                  Nhận báo giá
                </Link>
              </div>

              <div className="mt-7 grid max-w-[560px] grid-cols-1 gap-3 border-t border-border pt-5 sm:grid-cols-3">
                {trustItems.map(({ icon: Icon, title, detail }) => (
                  <div key={title} className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-secondary text-primary"><Icon className="h-4 w-4" /></span>
                    <span className="min-w-0">
                      <strong className="block text-xs font-bold text-foreground">{title}</strong>
                      <span className="block text-[11px] text-muted-foreground">{detail}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative min-h-[340px] overflow-hidden bg-secondary lg:min-h-0">
            <img src={leafVariety} alt="Bộ sản phẩm B-ECO từ lá bàng biển" className="absolute inset-0 h-full w-full object-cover" fetchPriority="high" />
            <div className="absolute inset-y-0 left-0 hidden w-24 bg-gradient-to-r from-card to-transparent lg:block" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-primary/25 to-transparent" />
          </div>
        </div>
      </section>

      <div className="relative z-10 mx-auto -mt-5 max-w-[1240px] px-4 sm:-mt-7 sm:px-6">
        <MotionReveal className="grid grid-cols-2 overflow-hidden rounded-2xl border border-border bg-card shadow-[0_18px_48px_rgba(16,63,40,0.11)] lg:grid-cols-4">
          {stats.map(([value, label], index) => (
            <div key={label} className={`px-5 py-4 sm:px-7 sm:py-5 ${index % 2 ? 'border-l border-border' : ''} ${index > 1 ? 'border-t border-border lg:border-t-0' : ''} ${index === 2 ? 'lg:border-l' : ''}`}>
              <strong className="block text-2xl font-extrabold tracking-[-0.045em] text-primary sm:text-[28px]">{value}</strong>
              <span className="mt-1 block text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </MotionReveal>
      </div>

      <section className="px-4 pb-8 pt-9 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1400px] gap-8 xl:grid-cols-[0.82fr_1.18fr] xl:gap-10">
          <div>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-primary">Khám phá</p>
                <h2 className="mt-1 text-2xl font-extrabold tracking-[-0.04em] text-foreground">Danh mục sản phẩm</h2>
              </div>
              <Link to="/shop" className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline">Xem tất cả <ArrowRight className="h-3.5 w-3.5" /></Link>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5 xl:grid-cols-3 2xl:grid-cols-5">
              {categoryCards.map(category => {
                const count = products.filter(product => product.category === category.category).length;
                return (
                  <Link key={category.name} to={category.to} className="group min-w-0 overflow-hidden rounded-2xl border border-border bg-card transition-[transform,border-color,box-shadow] hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_14px_30px_rgba(16,63,40,0.08)]">
                    <div className="aspect-[1.08/1] overflow-hidden bg-secondary/60">
                      <img src={category.image} alt={category.name} className={`h-full w-full transition-transform duration-500 group-hover:scale-[1.05] ${category.contain ? 'object-contain p-2' : 'object-cover'}`} loading="lazy" />
                    </div>
                    <div className="p-3">
                      <h3 className="truncate text-xs font-bold text-foreground">{category.name}</h3>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">{count} sản phẩm</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-primary">Được yêu thích</p>
                <h2 className="mt-1 text-2xl font-extrabold tracking-[-0.04em] text-foreground">Sản phẩm nổi bật</h2>
              </div>
              <Link to="/shop" className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline">Xem tất cả <ArrowRight className="h-3.5 w-3.5" /></Link>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {isLoading
                ? Array.from({ length: 4 }).map((_, index) => <div key={index} className="aspect-[0.72/1] animate-pulse rounded-2xl bg-muted" />)
                : featuredProducts.map(product => <CompactProductCard key={product.id} product={product} />)}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-10 sm:px-6 lg:px-8">
        <MotionReveal className="mx-auto grid max-w-[1400px] overflow-hidden rounded-2xl border border-border bg-card shadow-[0_18px_48px_rgba(16,63,40,0.07)] lg:grid-cols-[0.92fr_0.78fr_1.3fr]">
          <div className="relative min-h-[260px] overflow-hidden bg-secondary lg:min-h-[300px]">
            <img src={collectionDisplay} alt="Không gian trưng bày B-ECO" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
          </div>
          <div className="flex items-center border-border p-7 lg:border-r lg:p-8">
            <div>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary"><Leaf className="h-5 w-5" /></span>
              <h2 className="mt-5 text-2xl font-extrabold leading-tight tracking-[-0.04em] text-foreground">Biến lá rụng thành sản phẩm hữu ích.</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">B-ECO thu gom, làm sạch và ép nhiệt lá bàng biển tại Phú Yên. Mỗi sản phẩm giữ lại đường gân tự nhiên riêng.</p>
              <Link to="/about" className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-primary">Về B-ECO <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>

          <div className="grid bg-primary text-primary-foreground sm:grid-cols-[0.92fr_1.08fr]">
            <div className="flex items-center p-7 lg:p-8">
              <div>
                <Thermometer className="h-5 w-5 text-accent" />
                <h2 className="mt-4 text-2xl font-extrabold leading-tight tracking-[-0.04em]">Giải pháp xanh cho doanh nghiệp</h2>
                <p className="mt-3 text-sm leading-6 text-primary-foreground/75">Khắc logo, quà tặng sự kiện và đơn hàng định kỳ theo số lượng.</p>
                <Link to="/contact" className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-white px-4 text-xs font-bold text-primary transition-transform hover:-translate-y-0.5">
                  Nhận báo giá <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
            <div className="relative min-h-[250px] overflow-hidden bg-secondary sm:min-h-full">
              <img src={customLogo} alt="Đĩa B-ECO khắc logo theo yêu cầu" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
            </div>
          </div>
        </MotionReveal>
      </section>
    </Layout>
  );
};

export default Home;

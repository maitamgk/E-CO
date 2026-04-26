import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { ProductGrid } from '@/components/product/ProductGrid';
import { useProducts } from '@/context/ProductsContext';
import { Testimonials } from '@/components/home/Testimonials';
import { Leaf, ShieldCheck, Recycle, Heart, ArrowRight, Sparkles, ShoppingCart, Percent, Truck, Thermometer, Palette, Factory, CheckCircle2, ChevronRight } from 'lucide-react';

import collectionDisplay1 from '@/assets/products/collection-display-1.jpg';
import collectionDisplay2 from '@/assets/products/collection-display-2.jpg';
import exhibitionDisplay from '@/assets/products/exhibition-display.jpg';
import customLogoBeco from '@/assets/products/custom-logo-beco.jpg';
import leafPlatesVariety from '@/assets/products/leaf-plates-variety.jpg';
import leafPlatesCloseup from '@/assets/products/leaf-plates-closeup.jpg';
import anh1 from '@/assets/products/anh1.jpg';
import anh2 from '@/assets/products/anh2.jpg';
import anh3 from '@/assets/products/anh3.jpg';

const Home = () => {
  const { products, isLoading } = useProducts();
  const featuredProducts = products.slice(0, 4);

  return (
    <Layout>
      {/* ============ HERO — Full-width BG + text bên phải (giống mockup 100%) ============ */}
      <section className="relative min-h-[80vh] lg:min-h-[85vh] flex items-center overflow-hidden">
        {/* Ảnh nền full-width */}
        <img
          src={collectionDisplay1}
          alt="B-ECO Leaf Plates"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'center center' }}
          loading="eager"
        />

        {/* Overlay: Trái trong suốt thấy ảnh rõ, phải tối đậm cho text */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to right, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.08) 35%, rgba(30,51,42,0.6) 45%, rgba(30,51,42,0.92) 55%, rgba(30,51,42,0.97) 65%, rgba(30,51,42,0.99) 100%)'
        }} />

        {/* Content — căn giữa trong vùng tối bên phải */}
        <div className="absolute inset-0 z-10 flex items-center">
          <div className="w-full flex justify-end">
            <div className="w-[60%] flex items-center justify-center px-4 lg:px-8">
              <div className="text-center">
                <h1 className="font-heading font-extrabold mb-6" style={{ textShadow: '0 2px 30px rgba(0,0,0,0.4)' }}>
                  <span className="block text-3xl md:text-4xl lg:text-5xl xl:text-[3.5rem] whitespace-nowrap text-white leading-[1.1] font-heading" style={{ letterSpacing: '0.04em' }}>
                    CHÉN ĐĨA SINH HỌC
                  </span>
                  <span className="block text-lg md:text-xl lg:text-2xl xl:text-3xl mt-3 font-semibold text-emerald-300 leading-[1.2] font-heading" style={{ letterSpacing: '0.1em', textShadow: '0 2px 20px rgba(52,211,153,0.3)' }}>
                    TỪ LÁ BÀNG BIỂN
                  </span>
                </h1>

                <p className="text-white/80 text-base md:text-lg lg:text-xl mb-8 leading-relaxed mx-auto max-w-md" style={{ fontStyle: 'italic', textShadow: '0 1px 10px rgba(0,0,0,0.3)' }}>
                  Gieo mầm xanh — Từ chiếc lá nhỏ
                </p>

                <Link to="/shop">
                  <Button className="h-12 px-8 rounded-none text-sm font-bold uppercase tracking-[0.25em] bg-[#2d4a3e]/80 backdrop-blur-sm border border-white/50 text-white hover:bg-white hover:text-[#2d4a3e] hover:border-white transition-all duration-300 shadow-lg">
                    KHÁM PHÁ NGAY
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ VÌ SAO CHỌN B-ECO? — 6 cards ngang hàng ============ */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wider mb-12">
            VÌ SAO CHỌN B-ECO?
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { icon: Leaf, title: '100% Tự nhiên', desc: 'Làm từ lá bàng tự nhiên, phân hủy sinh học hoàn toàn trong 45 ngày.' },
              { icon: ShieldCheck, title: 'An toàn sức khỏe', desc: 'Không chứa hóa chất độc hại, an toàn cho sức khỏe người dùng.' },
              { icon: Recycle, title: 'Bền vững & Phân hủy', desc: 'Sản phẩm từ lá bàng biển tự phân hủy, thân thiện môi trường.' },
              { icon: Thermometer, title: 'Chịu nhiệt tốt', desc: 'Chịu nhiệt tốt, bàng dẻo nén, chịu nhiệt tốt.' },
              { icon: Palette, title: 'Mẫu mã đa dạng', desc: 'Mẫu mã đa dạng, nhiều màu sắc và các mẫu mã đa dạng.' },
              { icon: Factory, title: 'Quy trình hiện đại', desc: 'Quy trình hiện đại, sản xuất tại Phú Yên, Việt Nam.' },
            ].map((item, idx) => (
              <div key={idx} className="bg-card border border-border p-5 text-center hover:border-primary/40 hover:shadow-md transition-all duration-300 group">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  <item.icon className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-2">{item.title}</h3>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SẢN PHẨM NỔI BẬT — 3 cards + 1 ảnh lớn (giống mockup) ============ */}
      <section className="py-20 bg-background border-t border-border">
        <div className="container mx-auto px-6 lg:px-12">
          <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wider mb-12">
            SẢN PHẨM NỔI BẬT
          </h2>

          <div className="grid lg:grid-cols-4 gap-4">
            {/* 3 product cards bên trái */}
            {[
              { img: anh1, name: 'Dĩa lá bàng', size: '20cm' },
              { img: anh2, name: 'Chén lá bàng', size: '15cm' },
              { img: anh3, name: 'Khay lá bàng', size: '25cm' },
            ].map((product, idx) => (
              <div key={idx} className="border border-border bg-card group hover:border-primary/40 hover:shadow-md transition-all duration-300">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.img}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-sm uppercase tracking-wider">{product.name}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{product.size}</p>
                  <Link to="/shop" className="text-xs font-bold uppercase tracking-widest text-primary hover:underline inline-flex items-center gap-1">
                    XEM CHI TIẾT
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}

            {/* 1 ảnh lớn bên phải */}
            <div className="border border-border bg-card group hover:border-primary/40 hover:shadow-md transition-all duration-300 relative overflow-hidden">
              <img
                src={leafPlatesCloseup}
                alt="B-ECO Lá bàng biển"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                <Link to="/shop" className="text-xs font-bold uppercase tracking-widest text-white hover:underline inline-flex items-center gap-1">
                  XEM CHI TIẾT
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ VỀ CHÚNG TÔI — grid ảnh + text ============ */}
      <section className="py-20 bg-secondary/30 border-t border-border">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Ảnh */}
            <div className="grid grid-cols-2 gap-3">
              <img src={exhibitionDisplay} alt="B-ECO" className="w-full aspect-square object-cover border border-border" />
              <img src={customLogoBeco} alt="B-ECO" className="w-full aspect-square object-cover border border-border mt-8" />
              <img src={collectionDisplay2} alt="B-ECO" className="w-full aspect-square object-cover border border-border -mt-8" />
              <img src={collectionDisplay1} alt="B-ECO" className="w-full aspect-square object-cover border border-border" />
            </div>

            {/* Text */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-primary/20 bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-[0.25em] mb-6">
                Về chúng tôi
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                Từ thiên nhiên, <span className="text-primary">cho thiên nhiên</span>
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                B-ECO ra đời với sứ mệnh thay thế sản phẩm nhựa dùng một lần bằng các giải pháp từ thiên nhiên,
                góp phần bảo vệ môi trường biển và hệ sinh thái Việt Nam.
              </p>
              <ul className="space-y-3 mb-8">
                {['Lá bàng thu hoạch 100% từ Phú Yên', 'Phân huỷ sinh học trong 45 ngày', 'Chịu nhiệt tốt, an toàn thực phẩm', 'Giá ưu đãi cho doanh nghiệp F&B'].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/about">
                <Button className="h-12 px-8 rounded-none text-sm font-bold uppercase tracking-[0.15em] border-2 border-foreground bg-transparent text-foreground hover:bg-foreground hover:text-background transition-all">
                  Khám phá câu chuyện
                  <ArrowRight className="h-4 w-4 ml-3" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ GIẢM GIÁ BANNER ============ */}
      <section className="eco-dark-bg py-14">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5 text-center lg:text-left">
              <div className="p-3 border border-white/20 hidden sm:flex">
                <Percent className="h-8 w-8 text-white" />
              </div>
              <div className="text-white">
                <div className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight">GIẢM 10%</div>
                <div className="text-sm text-white/60 mt-1">cho đơn hàng từ 1.000 sản phẩm trở lên</div>
              </div>
            </div>
            <Link to="/pricing">
              <Button className="h-12 px-8 rounded-none text-sm font-bold uppercase tracking-[0.15em] bg-white text-[#2d4a3e] hover:bg-emerald-100 border-0 transition-all">
                Xem bảng giá
                <ArrowRight className="ml-3 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ============ PRODUCT GRID — hiện tại ============ */}
      <section className="py-20 bg-background border-t border-border">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4 border-b border-border pb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wider mb-2">Tất cả sản phẩm</h2>
              <p className="text-muted-foreground">Được hàng nghìn khách hàng tin dùng</p>
            </div>
            <Link to="/shop" className="group flex items-center gap-1 text-sm font-bold uppercase tracking-widest text-primary hover:underline">
              Xem tất cả <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <ProductGrid products={featuredProducts} isLoading={isLoading} />
        </div>
      </section>

      {/* ============ COD BANNER ============ */}
      <section className="py-14 bg-secondary/30 border-t border-border">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="border-2 border-border bg-card p-8 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              <div className="p-3 border-2 border-primary/20 bg-primary/5">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold mb-1">Thanh toán khi nhận hàng</h3>
                <p className="text-sm text-muted-foreground">Giao hàng toàn quốc · Nhận hàng rồi mới thanh toán · An tâm mua sắm</p>
              </div>
            </div>
            <Link to="/shop">
              <Button className="h-12 px-8 rounded-none text-sm font-bold uppercase tracking-[0.15em]">
                Đặt hàng ngay <ArrowRight className="ml-3 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <Testimonials />

      {/* ============ FINAL CTA ============ */}
      <section className="eco-dark-bg relative py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src={exhibitionDisplay} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-emerald-300/30 text-emerald-300 text-[10px] font-bold uppercase tracking-[0.25em] mb-8">
              <Leaf className="h-3 w-3" />
              Bắt đầu hành trình xanh
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight uppercase tracking-tight">
              Cùng B-ECO <br /><span className="text-emerald-300">bảo vệ môi trường</span>
            </h2>
            <p className="text-lg text-white/60 mb-10 max-w-xl">
              Mỗi sản phẩm bạn sử dụng là một bước tiến đến tương lai xanh hơn.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/shop">
                <Button className="h-12 px-8 rounded-none text-sm font-bold uppercase tracking-[0.15em] bg-white text-[#2d4a3e] hover:bg-emerald-100 border-0">
                  <Sparkles className="h-4 w-4 mr-3" /> Khám phá ngay
                </Button>
              </Link>
              <Link to="/pricing">
                <Button className="h-12 px-8 rounded-none text-sm font-bold uppercase tracking-[0.15em] bg-transparent border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/60">
                  Báo giá doanh nghiệp
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;

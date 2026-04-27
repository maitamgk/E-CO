import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { ProductGrid } from '@/components/product/ProductGrid';
import { useProducts } from '@/context/ProductsContext';
import { Testimonials } from '@/components/home/Testimonials';
import { Leaf, ShieldCheck, Recycle, ArrowRight, Sparkles, Percent, Truck, Thermometer, Palette, Factory, CheckCircle2, ChevronRight } from 'lucide-react';
import { ScrollAnimate } from '@/components/ui/scroll-animate';

import collectionDisplay1 from '@/assets/products/collection-display-1.jpg';
import collectionDisplay2 from '@/assets/products/collection-display-2.jpg';
import exhibitionDisplay from '@/assets/products/exhibition-display.jpg';
import customLogoBeco from '@/assets/products/custom-logo-beco.jpg';
import leafPlatesVariety from '@/assets/products/leaf-plates-variety.jpg';
import leafPlatesCloseup from '@/assets/products/leaf-plates-closeup.jpg';


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

                <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                  <Link to="/about">
                    <Button className="w-full sm:w-auto h-12 px-8 rounded-none text-sm font-bold uppercase tracking-[0.2em] bg-transparent text-white border-2 border-white hover:bg-white hover:text-foreground transition-all duration-300 shadow-[6px_6px_0px_0px_rgba(52,211,153,1)] hover:shadow-none hover:translate-y-[6px] hover:translate-x-[6px]">
                      KHÁM PHÁ NGAY
                    </Button>
                  </Link>
                  <Link to="/shop">
                    <Button className="w-full sm:w-auto h-12 px-8 rounded-none text-sm font-bold uppercase tracking-[0.2em] bg-background text-foreground border-2 border-primary-foreground hover:bg-emerald-400 hover:border-emerald-400 transition-all duration-300 shadow-[6px_6px_0px_0px_rgba(52,211,153,1)] hover:shadow-none hover:translate-y-[6px] hover:translate-x-[6px]">
                      ĐẶT HÀNG NGAY
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ VÌ SAO CHỌN B-ECO? — 6 cards ngang hàng ============ */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <ScrollAnimate animation="fade-in-up">
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
                <div key={idx} className="bg-white border-2 border-border p-6 text-center hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(30,51,42,1)] transition-all duration-300 group rounded-none">
                  <div className="w-14 h-14 mx-auto mb-5 rounded-none border border-border/10 bg-background flex items-center justify-center text-foreground group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-wider mb-2">{item.title}</h3>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </ScrollAnimate>
        </div>
      </section>

      {/* ============ SẢN PHẨM NỔI BẬT — 3 cards + 1 ảnh lớn (giống mockup) ============ */}
      <section className="py-20 bg-white border-t-2 border-border">
        <div className="container mx-auto px-6 lg:px-12">
          <ScrollAnimate animation="fade-in-up">
            <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wider mb-12">
              SẢN PHẨM NỔI BẬT
            </h2>

            <div className="grid lg:grid-cols-4 gap-4">
              {/* 3 product cards bên trái */}
              {[
                { img: leafPlatesVariety, name: 'Dĩa lá bàng', size: '20cm' },
                { img: exhibitionDisplay, name: 'Chén lá bàng', size: '15cm' },
                { img: customLogoBeco, name: 'Khay lá bàng', size: '25cm' },
              ].map((product, idx) => (
                <div key={idx} className="border-2 border-border bg-white group hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(30,51,42,1)] transition-all duration-300 rounded-none flex flex-col">
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
              <div className="border-2 border-border bg-white group hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(30,51,42,1)] transition-all duration-300 relative overflow-hidden rounded-none">
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
          </ScrollAnimate>
        </div>
      </section>

      {/* ============ VỀ CHÚNG TÔI — grid ảnh + text ============ */}
      <section className="py-20 bg-background border-t-2 border-border">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Ảnh */}
            <ScrollAnimate animation="fade-in-left">
              <div className="grid grid-cols-2 gap-4 relative">
                <img src={exhibitionDisplay} alt="B-ECO" className="w-full aspect-square object-cover border-2 border-border shadow-[4px_4px_0px_0px_rgba(30,51,42,1)]" />
                <img src={customLogoBeco} alt="B-ECO" className="w-full aspect-square object-cover border-2 border-border shadow-[4px_4px_0px_0px_rgba(30,51,42,1)] mt-12" />
                <img src={collectionDisplay2} alt="B-ECO" className="w-full aspect-square object-cover border-2 border-border shadow-[4px_4px_0px_0px_rgba(30,51,42,1)] -mt-12" />
                <img src={collectionDisplay1} alt="B-ECO" className="w-full aspect-square object-cover border-2 border-border shadow-[4px_4px_0px_0px_rgba(30,51,42,1)]" />
                {/* Decorative block */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white p-4 border-2 border-white rounded-none shadow-xl z-10">
                  <Leaf className="w-8 h-8" />
                </div>
              </div>
            </ScrollAnimate>

            {/* Text */}
            <ScrollAnimate animation="fade-in-right" delay={200}>
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-border/20 bg-primary/5 text-foreground text-[10px] font-bold uppercase tracking-[0.25em] mb-6">
                  Về chúng tôi
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight text-foreground">
                  Từ thiên nhiên, <span className="text-emerald-700">cho thiên nhiên</span>
                </h2>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  B-ECO ra đời với sứ mệnh thay thế sản phẩm nhựa dùng một lần bằng các giải pháp từ thiên nhiên,
                  góp phần bảo vệ môi trường biển và hệ sinh thái Việt Nam.
                </p>
                <ul className="space-y-3 mb-8">
                  {['Lá bàng thu hoạch 100% từ Phú Yên', 'Phân huỷ sinh học trong 45 ngày', 'Chịu nhiệt tốt, an toàn thực phẩm', 'Giá ưu đãi cho doanh nghiệp F&B'].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm font-medium text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/about">
                  <Button className="h-12 px-8 rounded-none text-sm font-bold uppercase tracking-[0.15em] border-2 border-border bg-transparent text-foreground hover:bg-primary hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(30,51,42,1)] hover:-translate-y-1">
                    Khám phá câu chuyện
                    <ArrowRight className="h-4 w-4 ml-3" />
                  </Button>
                </Link>
              </div>
            </ScrollAnimate>
          </div>
        </div>
      </section>

      {/* ============ GIẢM GIÁ BANNER ============ */}
      <section className="eco-dark-bg py-14">
        <div className="container mx-auto px-6 lg:px-12">
          <ScrollAnimate animation="fade-in-up">
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
          </ScrollAnimate>
        </div>
      </section>

      {/* ============ PRODUCT GRID — hiện tại ============ */}
      <section className="py-20 bg-white border-t-2 border-border">
        <div className="container mx-auto px-6 lg:px-12">
          <ScrollAnimate animation="fade-in-up">
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4 border-b-2 border-border/20 pb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wider mb-2 text-foreground">Tất cả sản phẩm</h2>
                <p className="text-gray-500 font-medium">Được hàng nghìn khách hàng tin dùng</p>
              </div>
              <Link to="/shop" className="group flex items-center gap-1 text-sm font-bold uppercase tracking-widest text-foreground hover:underline">
                Xem tất cả <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <ProductGrid products={featuredProducts} isLoading={isLoading} />
          </ScrollAnimate>
        </div>
      </section>

      {/* ============ COD BANNER ============ */}
      <section className="py-14 bg-background border-t-2 border-border">
        <div className="container mx-auto px-6 lg:px-12">
          <ScrollAnimate animation="fade-in-up">
            <div className="border-2 border-border bg-white p-8 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-[8px_8px_0px_0px_rgba(30,51,42,1)] relative">
              <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 border-l-2 border-b-2 border-border" />
              <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left relative z-10">
                <div className="p-4 bg-primary text-white shadow-[4px_4px_0px_0px_rgba(45,74,62,1)]">
                  <Truck className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold mb-1 text-foreground">Thanh toán khi nhận hàng</h3>
                  <p className="text-sm text-gray-500 font-medium">Giao hàng toàn quốc · Nhận hàng rồi mới thanh toán · An tâm mua sắm</p>
                </div>
              </div>
              <Link to="/shop">
                <Button className="h-12 px-8 rounded-none text-sm font-bold uppercase tracking-[0.15em] bg-primary text-white hover:bg-white hover:text-foreground border-2 border-border transition-all">
                  Đặt hàng ngay <ArrowRight className="ml-3 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </ScrollAnimate>
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
          <ScrollAnimate animation="fade-in-up">
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
                  <Button className="h-12 px-8 rounded-none text-sm font-bold uppercase tracking-[0.15em] bg-transparent border-2 border-white text-white hover:bg-white hover:text-foreground transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                    Báo giá doanh nghiệp
                  </Button>
                </Link>
              </div>
            </div>
          </ScrollAnimate>
        </div>
      </section>
    </Layout>
  );
};

export default Home;

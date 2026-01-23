import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Layout } from '@/components/layout/Layout';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ScrollAnimate } from '@/components/ui/scroll-animate';
import { useProducts } from '@/context/ProductsContext';
import { Leaf, ShieldCheck, Recycle, Heart, ArrowRight, Percent, Truck, Sparkles, Star, Play, Zap, Award, Users, Package, TreeDeciduous, Waves, Search, ShoppingCart } from 'lucide-react';

// Import real product images
import collectionDisplay1 from '@/assets/products/collection-display-1.jpg';
import exhibitionDisplay from '@/assets/products/exhibition-display.jpg';
import customLogoBeco from '@/assets/products/custom-logo-beco.jpg';
import seaAlmondTree from '@/assets/products/sea-almond-tree.jpg';

const Home = () => {
  const { products, isLoading } = useProducts();
  const featuredProducts = products.slice(0, 4);

  return (
    <Layout>
      {/* Hero Section - Modern Tech Style */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Animated tech grid background */}
        <div className="absolute inset-0">
          {/* Background image - Sea Almond Tree */}
          <img
            src={seaAlmondTree}
            alt="Sea Almond Tree"
            className="w-full h-full object-cover"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-950/60 via-emerald-900/55 to-teal-950/60" />
          
          {/* Network mesh pattern overlay */}
          <div 
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(16, 185, 129, 0.3) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(16, 185, 129, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '80px 80px',
            }}
          />
          
          {/* Glowing orbs */}
          <div className="absolute top-20 left-20 w-96 h-96 bg-emerald-500/15 rounded-full blur-[120px] animate-float" />
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-green-500/15 rounded-full blur-[100px] animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-teal-500/15 rounded-full blur-[80px] animate-float" style={{ animationDelay: '4s' }} />
          
          {/* Network nodes */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-emerald-400/60 rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 3}s`,
                  boxShadow: '0 0 20px rgba(52, 211, 153, 0.6)'
                }}
              />
            ))}
          </div>
          
          {/* Connection lines effect */}
          <svg className="absolute inset-0 w-full h-full opacity-20">
            <defs>
              <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#14b8a6" />
              </linearGradient>
            </defs>
            {[...Array(15)].map((_, i) => (
              <line
                key={i}
                x1={`${Math.random() * 100}%`}
                y1={`${Math.random() * 100}%`}
                x2={`${Math.random() * 100}%`}
                y2={`${Math.random() * 100}%`}
                stroke="url(#line-gradient)"
                strokeWidth="1"
                className="animate-pulse"
                style={{ animationDelay: `${i * 0.3}s` }}
              />
            ))}
          </svg>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left content */}
            <div className="text-white">
              <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <Badge className="mb-8 px-8 py-4 bg-gradient-to-r from-emerald-400/40 to-green-400/40 text-white border-2 border-emerald-300/50 backdrop-blur-xl text-base font-bold rounded-full shadow-lg shadow-emerald-400/25 hover:scale-105 transition-transform duration-300">
                  <Sparkles className="h-5 w-5 mr-3 animate-pulse" />
                  100% TỰ NHIÊN - THÂN THIỆN MÔI TRƯỜNG
                </Badge>
              </div>
              
              <h1 className="text-3xl lg:text-5xl xl:text-6xl font-black italic mb-8 animate-fade-in-up whitespace-nowrap" style={{ 
                animationDelay: '0.4s', 
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', 
                letterSpacing: '0.02em',
                lineHeight: '1.6',
                paddingTop: '0.5rem'
              }}>
                <span className="block bg-gradient-to-r from-white via-emerald-100 to-white bg-clip-text text-transparent drop-shadow-[0_0_50px_rgba(255,255,255,0.8)] mb-8 uppercase" style={{ paddingTop: '0.5rem', paddingBottom: '0.5rem' }}>
                  CHÉN ĐĨA SINH HỌC
                </span>
                <span className="block bg-gradient-to-r from-emerald-200 via-green-300 to-teal-200 bg-clip-text text-transparent drop-shadow-[0_0_60px_rgba(16,185,129,0.8)] uppercase" style={{ paddingTop: '0.5rem', paddingBottom: '0.5rem' }}>
                  TỪ LÁ BÀNG BIỂN
                </span>
              </h1>
              
              <p className="text-lg lg:text-xl text-emerald-200 mb-12 leading-relaxed max-w-lg animate-fade-in-up font-medium" style={{ animationDelay: '0.6s' }}>
                Gieo mầm xanh - Từ chiếc lá nhỏ
              </p>
              
              <div className="flex flex-wrap gap-4 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
                <Link to="/shop">
                  <Button size="lg" className="gap-3 px-10 h-14 text-base font-bold rounded-full shadow-2xl shadow-emerald-500/40 hover:shadow-emerald-500/60 hover:scale-105 transition-all duration-300 group bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 border-0">
                    <ShoppingCart className="h-5 w-5" />
                    Mua ngay
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button size="lg" variant="outline" className="h-14 px-8 text-base font-semibold rounded-full border-2 border-white/30 text-white bg-white/5 backdrop-blur-xl hover:bg-white/10 hover:border-white/50 hover:scale-105 transition-all duration-300 group">
                    <Play className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                    Xem câu chuyện
                  </Button>
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="mt-16 flex flex-wrap items-center gap-8 animate-fade-in" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xl rounded-full px-6 py-3 border border-emerald-400/30 shadow-lg shadow-emerald-500/10">
                  <div className="flex -space-x-1">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className="h-5 w-5 fill-emerald-400 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                    ))}
                  </div>
                  <span className="text-white font-semibold">5.0 <span className="text-white/70 font-normal">(500+ reviews)</span></span>
                </div>
                <div className="flex items-center gap-3 text-white/80 bg-white/10 backdrop-blur-xl rounded-full px-6 py-3 border border-white/20">
                  <Truck className="h-5 w-5 text-emerald-400" />
                  <span className="font-medium">Free ship từ 500K</span>
                </div>
              </div>
            </div>
            
            {/* Right - Product image with tech overlay */}
            <div className="relative animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="relative">
                {/* Glowing frame */}
                <div className="absolute -inset-4 bg-gradient-to-br from-emerald-500/30 via-green-500/20 to-teal-500/30 rounded-3xl blur-2xl" />
                
                {/* Main product card */}
                <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-2 border border-white/20 shadow-2xl overflow-hidden">
                  {/* Tech scan lines effect */}
                  <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent animate-pulse" />
                  
                  <img
                    src={collectionDisplay1}
                    alt="B-ECO Leaf Plates Collection"
                    className="w-full rounded-2xl"
                  />
                  
                  {/* Floating badges */}
                  <div className="absolute top-6 right-6 bg-emerald-500 text-white px-5 py-3 rounded-2xl shadow-xl animate-float font-semibold">
                    <span className="flex items-center gap-2">
                      <Leaf className="h-5 w-5" />
                      Eco-friendly
                    </span>
                  </div>
                  
                  <div className="absolute bottom-6 right-6 bg-white/95 text-gray-900 px-6 py-4 rounded-2xl shadow-xl animate-float border border-gray-200" style={{ animationDelay: '1s' }}>
                    <div className="text-3xl font-bold text-emerald-600">100%</div>
                    <div className="text-sm text-gray-600">Tự nhiên</div>
                  </div>
                  
                  <div className="absolute top-1/2 -translate-y-1/2 -right-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-5 py-3 rounded-xl shadow-lg animate-float font-semibold" style={{ animationDelay: '2s' }}>
                    -10% Wholesale
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-8 h-14 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-emerald-400 rounded-full animate-bounce shadow-lg shadow-emerald-400/50" />
          </div>
        </div>
      </section>

      {/* Stats Bar - Glassmorphism */}
      <section className="relative -mt-20 z-20 pb-10">
        <div className="container mx-auto px-4">
          <div className="bg-card/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-border/50 p-8 lg:p-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { value: '500K+', label: 'Sản phẩm đã bán', icon: Package, color: 'text-primary' },
                { value: '1000+', label: 'Khách hàng', icon: Users, color: 'text-primary' },
                { value: '50+', label: 'Đối tác F&B', icon: Award, color: 'text-primary' },
                { value: '0', label: 'Gram nhựa thải', icon: TreeDeciduous, color: 'text-primary' },
              ].map((stat, idx) => (
                <ScrollAnimate key={idx} animation="fade-in-up" delay={idx * 100}>
                  <div className="text-center group cursor-default">
                    <div className="inline-flex p-4 rounded-2xl bg-primary/10 mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                      <stat.icon className={`h-7 w-7 ${stat.color}`} />
                    </div>
                    <div className="text-3xl lg:text-4xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                </ScrollAnimate>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features - Modern Cards */}
      <section className="py-24 bg-background relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px]" />
        </div>
        
        <div className="container mx-auto px-4 relative">
          <ScrollAnimate animation="fade-in-up" className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 px-4 py-2">Tại sao chọn B-ECO?</Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Sản phẩm xanh,{' '}
              <span className="bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">
                cuộc sống xanh
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Cam kết mang đến những sản phẩm chất lượng cao, an toàn và thân thiện với môi trường
            </p>
          </ScrollAnimate>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Leaf, title: '100% Tự nhiên', desc: 'Làm từ lá bàng tự nhiên, phân hủy sinh học hoàn toàn trong 45 ngày' },
              { icon: ShieldCheck, title: 'An toàn tuyệt đối', desc: 'Không chứa hóa chất độc hại, chịu nhiệt đến 80°C' },
              { icon: Recycle, title: 'Bền vững', desc: 'Góp phần giảm hàng triệu tấn rác thải nhựa mỗi năm' },
              { icon: Heart, title: 'Made in Việt Nam', desc: 'Sản xuất thủ công tại Phú Yên, tạo công ăn việc làm địa phương' },
            ].map((item, idx) => (
              <ScrollAnimate key={idx} animation="fade-in-up" delay={idx * 100}>
                <div className="group relative h-full">
                  {/* Card glow effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/10 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
                  
                  <div className="relative h-full p-8 bg-card rounded-3xl border border-border hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
                    <div className="p-4 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl inline-block mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <item.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-bold text-xl mb-3 group-hover:text-primary transition-colors">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </ScrollAnimate>
            ))}
          </div>
        </div>
      </section>

      {/* Discount Banner - Gradient */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary to-accent-foreground" />
        
        {/* Animated wave pattern */}
        <div className="absolute inset-0 opacity-20">
          <svg className="absolute bottom-0 w-full h-32" viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path fill="currentColor" className="text-background" d="M0,64 C240,120 480,0 720,64 C960,128 1200,32 1440,80 L1440,120 L0,120 Z" />
          </svg>
        </div>
        
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-20 -top-20 w-60 h-60 bg-background/10 rounded-full blur-3xl animate-float" />
          <div className="absolute -right-20 -bottom-20 w-60 h-60 bg-background/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>
        
        <div className="container mx-auto px-4 relative">
          <ScrollAnimate animation="scale-in">
            <div className="flex flex-col lg:flex-row items-center justify-center gap-8 text-center lg:text-left text-primary-foreground">
              <div className="p-5 bg-background/20 rounded-3xl backdrop-blur-xl animate-pulse-glow">
                <Percent className="h-12 w-12" />
              </div>
              <div>
                <div className="text-4xl lg:text-5xl font-bold mb-2">GIẢM 10%</div>
                <div className="text-xl opacity-90">cho đơn hàng từ 1000 sản phẩm trở lên</div>
              </div>
              <Link to="/pricing">
                <Button size="lg" variant="secondary" className="h-14 px-8 text-lg font-semibold rounded-2xl shadow-2xl hover:scale-105 transition-all">
                  Xem bảng giá
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </ScrollAnimate>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-muted/30 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <ScrollAnimate animation="fade-in-up">
            <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-16 gap-6">
              <div>
                <Badge variant="secondary" className="mb-4 px-4 py-2">🔥 Bán chạy nhất</Badge>
                <h2 className="text-4xl lg:text-5xl font-bold mb-3">Sản phẩm nổi bật</h2>
                <p className="text-xl text-muted-foreground">Được hàng nghìn khách hàng tin dùng</p>
              </div>
              <Link to="/shop">
                <Button variant="outline" size="lg" className="gap-3 group h-14 px-8 rounded-2xl text-lg">
                  Xem tất cả sản phẩm
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </ScrollAnimate>
          
          <ScrollAnimate animation="fade-in-up" delay={200}>
            <ProductGrid products={featuredProducts} isLoading={isLoading} />
          </ScrollAnimate>
        </div>
      </section>

      {/* About Section - Split */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <ScrollAnimate animation="fade-in-left">
              <div className="relative">
                {/* Decorative elements */}
                <div className="absolute -inset-8 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 rounded-[4rem] blur-2xl" />
                
                <div className="relative">
                  <img
                    src={exhibitionDisplay}
                    alt="B-ECO Exhibition Display"
                    className="rounded-[2rem] shadow-2xl w-full object-cover hover:scale-[1.02] transition-transform duration-700"
                  />
                  
                  {/* Floating card */}
                  <div className="absolute -bottom-8 -right-8 bg-card p-6 rounded-2xl shadow-2xl border border-border max-w-xs animate-float">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/10 rounded-xl">
                        <Waves className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <div className="font-bold text-lg">Bảo vệ biển</div>
                        <div className="text-sm text-muted-foreground">Phú Yên, Việt Nam</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute -top-6 -left-6 bg-primary text-primary-foreground p-5 rounded-2xl shadow-xl animate-float" style={{ animationDelay: '1.5s' }}>
                    <div className="text-4xl font-bold">45</div>
                    <div className="text-sm opacity-90">ngày phân hủy</div>
                  </div>
                </div>
              </div>
            </ScrollAnimate>
            
            <ScrollAnimate animation="fade-in-right" delay={200}>
              <div>
                <Badge variant="secondary" className="mb-6 px-4 py-2">Về chúng tôi</Badge>
                <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                  Từ thiên nhiên,{' '}
                  <span className="bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">
                    cho thiên nhiên
                  </span>
                </h2>
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  B-ECO ra đời với sứ mệnh thay thế sản phẩm nhựa dùng một lần bằng các giải pháp từ thiên nhiên, 
                  góp phần bảo vệ môi trường biển và hệ sinh thái Việt Nam.
                </p>
                
                <div className="space-y-4 mb-10">
                  {[
                    'Lá bàng thu hoạch 100% từ Phú Yên',
                    'Phân hủy sinh học trong 45 ngày',
                    'Chịu nhiệt tốt, an toàn thực phẩm',
                    'Giá ưu đãi cho doanh nghiệp F&B',
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 group">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                        <Leaf className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors" />
                      </div>
                      <span className="text-lg text-muted-foreground group-hover:text-foreground transition-colors">{item}</span>
                    </div>
                  ))}
                </div>
                
                <Link to="/about">
                  <Button size="lg" variant="outline" className="gap-3 h-14 px-8 rounded-2xl text-lg group">
                    Khám phá câu chuyện
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </ScrollAnimate>
          </div>
        </div>
      </section>

      {/* COD Banner */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <ScrollAnimate animation="scale-in">
            <div className="relative overflow-hidden bg-gradient-to-br from-card to-muted/50 rounded-[2.5rem] p-10 lg:p-16 border border-border/50 group hover:border-primary/30 transition-all duration-500 hover:shadow-2xl">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-2xl" />
              
              <div className="relative flex flex-col lg:flex-row items-center justify-between gap-10">
                <div className="flex items-center gap-8">
                  <div className="p-6 bg-primary/10 rounded-3xl group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-500">
                    <Truck className="h-14 w-14 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-3xl lg:text-4xl font-bold mb-3">Thanh toán khi nhận hàng</h3>
                    <p className="text-xl text-muted-foreground">Giao hàng toàn quốc • Nhận hàng rồi mới thanh toán • An tâm mua sắm</p>
                  </div>
                </div>
                <Link to="/shop">
                  <Button size="lg" className="h-16 px-10 text-xl font-semibold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all group">
                    Đặt hàng ngay
                    <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </ScrollAnimate>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-32 overflow-hidden bg-foreground">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=600&fit=crop"
            alt="Forest"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/90 to-foreground/70" />
        </div>
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-primary/40 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${4 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <ScrollAnimate animation="scale-in">
            <div className="text-center max-w-4xl mx-auto">
              <Badge className="mb-8 px-5 py-2.5 bg-primary/20 text-primary border-primary/40 backdrop-blur-xl text-base">
                <Leaf className="h-4 w-4 mr-2" />
                Bắt đầu hành trình xanh
              </Badge>
              
              <h2 className="text-4xl lg:text-6xl xl:text-7xl font-bold text-background mb-8 leading-tight">
                Cùng B-ECO{' '}
                <span className="bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">
                  bảo vệ môi trường
                </span>
              </h2>
              
              <p className="text-xl lg:text-2xl text-background/70 mb-12 max-w-2xl mx-auto leading-relaxed">
                Mỗi sản phẩm bạn sử dụng là một bước tiến đến tương lai xanh hơn
              </p>
              
              <div className="flex flex-wrap justify-center gap-6">
                <Link to="/shop">
                  <Button size="lg" className="h-16 px-12 text-xl font-semibold rounded-2xl shadow-2xl shadow-primary/40 hover:shadow-primary/60 hover:scale-105 transition-all group">
                    <Sparkles className="h-6 w-6 mr-3" />
                    Khám phá ngay
                    <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button size="lg" variant="outline" className="h-16 px-10 text-xl font-semibold rounded-2xl border-2 border-background/30 text-background bg-background/5 backdrop-blur-xl hover:bg-background/10 hover:border-background/50 transition-all">
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

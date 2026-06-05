import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ScrollAnimate } from '@/components/ui/scroll-animate';
import { useProducts } from '@/context/ProductsContext';
import { Leaf, ArrowRight, CheckCircle } from 'lucide-react';

// Hero Images
import hero1 from '@/assets/hero/hero1.jpg';
import hero2 from '@/assets/hero/hero2.jpg';
import hero3 from '@/assets/hero/hero3.jpg';
import hero4 from '@/assets/hero/hero4.jpg';

// Products/Categories Images
import closeup from '@/assets/products/leaf-plates-closeup.jpg';
import customLogo from '@/assets/products/custom-logo-beco.jpg';
import collection1 from '@/assets/products/collection-display-1.jpg';
import collection2 from '@/assets/products/collection-display-2.jpg';

// Instagram/Gallery Images
import anh1 from '@/assets/products/anh1.jpg';
import anh2 from '@/assets/products/anh2.jpg';
import anh3 from '@/assets/products/anh3.jpg';
import anh4 from '@/assets/products/anh4.jpeg';
import customNtt from '@/assets/products/custom-logo-ntt.jpg';
import customVanHien from '@/assets/products/custom-logo-vanhien.jpg';
import exhibition from '@/assets/products/exhibition-display.jpg';
import variety from '@/assets/products/leaf-plates-variety.jpg';

// Video
import promoVideo from '@/assets/video/video1.mp4';
import backgroundVideo from '@/assets/video/video.mp4';

const heroSlides = [
  {
    image: hero1,
    title: "Vẻ đẹp từ\nthiên nhiên",
    subtitle: "SẢN PHẨM MỚI TỪ LÁ BÀNG BIỂN",
    desc: "Sản phẩm thân thiện với môi trường, được làm hoàn toàn từ lá bàng biển tự nhiên. An toàn, thẩm mỹ và bền vững.",
    bgColor: "bg-gradient-eco-soft",
    textColor: "text-foreground",
  },
  {
    image: hero2,
    title: "In logo\nthương hiệu",
    subtitle: "DẤU ẤN RIÊNG CỦA BẠN",
    desc: "Khẳng định giá trị thương hiệu với dịch vụ in logo trực tiếp lên đĩa lá. Tinh tế và chuyên nghiệp.",
    bgColor: "bg-gradient-eco-soft",
    textColor: "text-foreground",
  },
  {
    image: hero3,
    title: "Sự lựa chọn\nhoàn hảo",
    subtitle: "COMBO DÀNH CHO TIỆC CƯỚI",
    desc: "Đồng hành cùng những sự kiện quan trọng với vẻ đẹp mộc mạc và thân thiện với môi trường.",
    bgColor: "bg-gradient-eco-soft",
    textColor: "text-foreground",
  },
  {
    image: hero4,
    title: "Giảm thiểu\nrác thải nhựa",
    subtitle: "HÀNH ĐỘNG XANH VÌ TƯƠNG LAI",
    desc: "Cùng B-ECO kiến tạo một tương lai xanh và bền vững hơn bằng cách sử dụng các sản phẩm thay thế nhựa.",
    bgColor: "bg-gradient-eco-soft",
    textColor: "text-foreground",
  }
];

const processSteps = [
  {
    num: "01",
    title: "Thu hái lá bàng biển",
    desc: "Chọn lọc những chiếc lá bàng biển tự nhiên rụng xuống, kích thước đạt chuẩn, hoàn toàn không xâm hại đến cây xanh."
  },
  {
    num: "02",
    title: "Làm sạch & Xử lý",
    desc: "Lá được rửa sạch bằng nước tinh khiết và công nghệ siêu âm, phơi khô tự nhiên dưới ánh nắng mặt trời."
  },
  {
    num: "03",
    title: "Ép nhiệt định hình",
    desc: "Sử dụng khuôn ép nhiệt độ cao, định hình đĩa lá cứng cáp, đồng thời tiệt trùng 100% không dùng hóa chất."
  }
];

const categories = [
  { name: "Chén lá bàng", image: closeup, link: "/shop?category=chen" },
  { name: "Dĩa lá bàng", image: collection1, link: "/shop?category=dia" },
  { name: "Combo Tiệc", image: exhibition, link: "/shop?category=combo" },
  { name: "Dịch vụ In", image: customLogo, link: "/shop?category=in-logo" }
];

const mockArticles = [
  {
    tag: "HÀNH TRÌNH XANH",
    title: "Từ chiếc lá bàng biển rụng đến những chiếc đĩa trên bàn tiệc",
    desc: "Khám phá quy trình chế tác tỉ mỉ và tâm huyết để biến lá cây khô thành sản phẩm sinh học cao cấp.",
    image: collection2,
    link: "/blog"
  },
  {
    tag: "TIÊU DÙNG BỀN VỮNG",
    title: "B-ECO đồng hành cùng xu hướng cưới sinh thái (Green Wedding)",
    desc: "Xu hướng sử dụng đĩa lá tự nhiên thay thế nhựa dùng một lần trong các buổi tiệc cưới hiện đại ngày càng được ưa chuộng.",
    image: exhibition,
    link: "/blog"
  },
  {
    tag: "MÔI TRƯỜNG",
    title: "Tại sao đĩa lá bàng biển Phú Yên là lựa chọn hàng đầu bảo vệ đại dương?",
    desc: "Lá bàng biển rụng tự nhiên từ Phú Yên được ép nhiệt không hóa chất, tự phân hủy hoàn toàn trong 45 ngày.",
    image: variety,
    link: "/blog"
  }
];

const Home = () => {
  const { products, isLoading } = useProducts();
  const featuredProducts = products.length > 0 ? [products[0], products[4], products[7], products[1]].filter(Boolean) : [];
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Layout>
      {/* 1. Hero Section - Split Layout (Cocoon Style) */}
      <section className="relative min-h-[90vh] md:h-screen w-full flex flex-col md:flex-row overflow-hidden border-b border-border/10">
        
        {/* Left Side: Image Carousel */}
        <div className="w-full md:w-1/2 relative h-[45vh] md:h-full overflow-hidden">
          {heroSlides.map((slide, index) => (
            <div 
              key={index}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                currentSlide === index ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.subtitle}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Right Side: Text & Color Block */}
        <div className="w-full md:w-1/2 relative h-[45vh] md:h-full flex items-center bg-background dark:bg-[#242b26]">
          {/* Background Colors */}
          {heroSlides.map((slide, index) => (
            <div 
              key={`bg-${index}`}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${slide.bgColor} dark:bg-opacity-20 ${
                currentSlide === index ? 'opacity-100 z-0' : 'opacity-0 z-0'
              }`}
            />
          ))}

          {/* Text Content */}
          <div className="relative z-10 px-6 sm:px-12 md:px-16 lg:px-24 w-full">
            {heroSlides.map((slide, index) => (
              <div 
                key={`text-${index}`}
                className={`transition-all duration-1000 ease-in-out flex flex-col justify-center absolute inset-0 px-6 sm:px-12 md:px-16 lg:px-24 ${
                  currentSlide === index 
                    ? 'opacity-100 translate-y-0 pointer-events-auto' 
                    : 'opacity-0 translate-y-8 pointer-events-none'
                }`}
                style={{ position: currentSlide === index ? 'relative' : 'absolute' }}
              >
                <div className={`${slide.textColor} space-y-4 md:space-y-6 max-w-xl`}>
                  <p className="text-[11px] md:text-xs tracking-[0.25em] font-barlow font-bold uppercase opacity-80">
                    {slide.subtitle}
                  </p>
                  
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading leading-[1.15] whitespace-pre-line font-bold">
                    {slide.title}
                  </h1>
                  
                  <p className="text-sm md:text-base font-nunito font-light leading-relaxed opacity-95 pb-2">
                    {slide.desc}
                  </p>
                  
                  <div>
                    <Link 
                      to="/shop" 
                      className="inline-flex items-center gap-4 border border-primary text-primary hover:bg-gradient-eco hover:text-white hover:border-transparent transition-all duration-300 px-6 py-3 tracking-widest text-[11px] uppercase font-barlow font-semibold group"
                    >
                      XEM NGAY <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {/* Dots Pagination */}
            <div className="absolute bottom-6 left-6 sm:left-12 md:left-16 lg:left-24 z-20 flex gap-2">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    currentSlide === index 
                      ? 'bg-black/60 dark:bg-white/60 w-6' 
                      : 'bg-black/10 dark:bg-white/10 w-2.5 hover:bg-black/30'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Flagship Product Showcase (Cocoon Sen Hậu Giang style) */}
      <section className="py-20 md:py-28 bg-white dark:bg-[#242b26] border-b border-border/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left text column */}
            <div className="lg:col-span-5 order-2 lg:order-1 text-left">
              <ScrollAnimate animation="fade-in-right">
                <p className="text-[11px] tracking-[0.25em] font-barlow font-bold text-muted-foreground uppercase mb-3">
                  TỪ THIÊN NHIÊN — CHO BÀN TIỆC
                </p>
                <h2 className="text-4xl md:text-5xl font-heading text-gradient-eco leading-tight mb-6 font-bold">
                  Khi chiếc lá rụng <br/>
                  <span className="italic font-light font-vollkorn text-gradient-eco">kể câu chuyện xanh</span>
                </h2>
                <p className="text-sm md:text-base text-muted-foreground font-nunito font-light leading-relaxed mb-8">
                  Mỗi chiếc đĩa B-ECO là một tác phẩm độc bản từ thiên nhiên — mang trọn vân gân lá bàng biển Phú Yên, 
                  được ép nhiệt ở nhiệt độ cao mà không cần bất kỳ hóa chất nào. Cứng cáp, thơm nhẹ, và phân hủy hoàn toàn 
                  chỉ sau 45 ngày. Đây không chỉ là sản phẩm thay thế nhựa — mà là cách bạn chọn yêu thương Trái Đất 
                  ngay trên chính bàn ăn của mình.
                </p>
                <div>
                  <Link 
                    to="/shop" 
                    className="inline-flex items-center gap-3 font-barlow text-sm font-semibold tracking-widest text-primary uppercase border-b border-primary hover:border-primary/40 pb-1 transition-all duration-300 group"
                  >
                    KHÁM PHÁ NGAY <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </ScrollAnimate>
            </div>

            {/* Right layered visuals */}
            <div className="lg:col-span-7 order-1 lg:order-2 flex justify-center items-center relative">
              <ScrollAnimate animation="fade-in-left" className="relative w-full max-w-lg aspect-square">
                {/* Layered graphics layout */}
                <div className="absolute inset-0 bg-background dark:bg-[#2c332d] rounded-full scale-90 border border-border/10 -z-10" />
                <img 
                  src={collection1} 
                  alt="Đĩa lá bàng biển Phú Yên" 
                  className="w-4/5 h-4/5 object-cover mx-auto my-auto shadow-xl rounded-none border border-border/10 relative z-10"
                />
                {/* Floating elements styling decoration */}
                <div className="absolute -bottom-4 -left-4 w-1/3 aspect-square bg-[#e8e2d2] dark:bg-[#2c332d] p-2 border border-border/10 shadow-lg hidden md:block">
                  <img src={closeup} alt="Gận lá bàng" className="w-full h-full object-cover" />
                </div>
              </ScrollAnimate>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Brand Video Section */}
      <section className="relative w-full h-[70vh] md:h-screen overflow-hidden border-b border-border/10">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={backgroundVideo} type="video/mp4" />
          Trình duyệt của bạn không hỗ trợ thẻ video.
        </video>
      </section>

      {/* 4. Infinite Marquee */}
      <section className="overflow-hidden border-b border-border/10 bg-background dark:bg-[#242b26] py-5">
        <div className="animate-marquee whitespace-nowrap flex items-center">
          {Array(4).fill([
            "100% Tự Nhiên",
            "Phân Hủy Sinh Học Hoàn Toàn",
            "Không Hóa Chất Độc Hại",
            "An Toàn Cho Sức Khỏe",
            "Bảo Vệ Hệ Sinh Thái"
          ]).flat().map((val, idx) => (
            <span key={idx} className="font-barlow text-[11px] md:text-xs tracking-[0.25em] font-bold text-primary uppercase mx-12 flex items-center">
              {val} <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary/30 ml-12"></span>
            </span>
          ))}
        </div>
      </section>

      {/* 5. Commitments / Certifications */}
      <section className="py-20 md:py-28 bg-white dark:bg-[#242b26] border-b border-border/10">
        <div className="container mx-auto px-4">
          <ScrollAnimate animation="fade-in-up" className="text-center mb-16 max-w-xl mx-auto">
            <p className="text-[11px] tracking-[0.25em] font-barlow font-bold text-muted-foreground uppercase mb-3">
              TIÊU CHUẨN KIỂM ĐỊNH
            </p>
            <h2 className="text-3xl md:text-4xl font-heading text-primary leading-tight font-bold">
              Cam kết chất lượng B-ECO
            </h2>
          </ScrollAnimate>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ScrollAnimate animation="fade-in-up" delay={0} className="border border-border/10 p-8 text-center bg-background dark:bg-[#2c332d] hover:shadow-md transition-shadow">
              <div className="flex justify-center mb-6">
                <CheckCircle className="h-10 w-10 text-primary stroke-[1.2]" />
              </div>
              <h3 className="font-barlow-condensed text-xl tracking-[0.1em] font-bold text-primary uppercase mb-3">
                ĐẠT CHUẨN OCOP
              </h3>
              <p className="text-sm text-muted-foreground font-nunito font-light leading-relaxed">
                Sản phẩm đĩa lá bàng đạt tiêu chuẩn chất lượng OCOP Việt Nam, đại diện cho nông sản đặc hữu Phú Yên sạch, phát triển bền vững cùng cộng đồng địa phương.
              </p>
            </ScrollAnimate>

            <ScrollAnimate animation="fade-in-up" delay={100} className="border border-border/10 p-8 text-center bg-background dark:bg-[#2c332d] hover:shadow-md transition-shadow">
              <div className="flex justify-center mb-6">
                <Leaf className="h-10 w-10 text-primary stroke-[1.2]" />
              </div>
              <h3 className="font-barlow-condensed text-xl tracking-[0.1em] font-bold text-primary uppercase mb-3">
                KIỂM ĐỊNH EUROFINS
              </h3>
              <p className="text-sm text-muted-foreground font-nunito font-light leading-relaxed">
                Được kiểm nghiệm tại hệ thống Eurofins toàn cầu. Kết quả chứng minh sản phẩm không chứa bất kỳ tàn dư kim loại nặng hay hóa chất độc hại nào.
              </p>
            </ScrollAnimate>

            <ScrollAnimate animation="fade-in-up" delay={200} className="border border-border/10 p-8 text-center bg-background dark:bg-[#2c332d] hover:shadow-md transition-shadow">
              <div className="flex justify-center mb-6">
                <CheckCircle className="h-10 w-10 text-primary stroke-[1.2]" />
              </div>
              <h3 className="font-barlow-condensed text-xl tracking-[0.1em] font-bold text-primary uppercase mb-3">
                AN TOÀN FDA HỦY SINH
              </h3>
              <p className="text-sm text-muted-foreground font-nunito font-light leading-relaxed">
                Đáp ứng tiêu chuẩn chứa thực phẩm nguội lẫn nóng (dùng được trong lò vi sóng) và phân hủy sinh học tự nhiên trong vòng 45 ngày ngoài môi trường.
              </p>
            </ScrollAnimate>
          </div>
        </div>
      </section>

      {/* 6. Video & Process Section */}
      <section className="py-20 md:py-28 bg-background dark:bg-[#242b26] overflow-hidden border-b border-border/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Video visual block */}
            <div className="lg:col-span-6">
              <ScrollAnimate animation="fade-in-right">
                <div className="relative border border-border/10 overflow-hidden shadow-lg bg-black">
                  <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    className="w-full aspect-[4/5] md:aspect-video lg:aspect-[4/5] object-cover scale-100 hover:scale-105 transition-transform duration-1000 ease-out"
                  >
                    <source src={promoVideo} type="video/mp4" />
                    Trình duyệt của bạn không hỗ trợ thẻ video.
                  </video>
                </div>
              </ScrollAnimate>
            </div>

            {/* Process description block */}
            <div className="lg:col-span-6">
              <ScrollAnimate animation="fade-in-left">
                <div className="mb-6 flex items-center gap-2">
                  <span className="h-px w-8 bg-primary"></span>
                  <span className="text-xs tracking-widest text-primary font-barlow font-bold">QUY TRÌNH & CHẤT LƯỢNG</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-heading text-gradient-eco mb-6 leading-tight font-bold">
                  Hành trình từ lá rụng <br/> 
                  <span className="italic font-light font-vollkorn text-gradient-eco">đến bàn ăn của bạn</span>
                </h2>
                <p className="text-sm md:text-base text-muted-foreground mb-10 font-nunito font-light leading-relaxed">
                  Chúng tôi kiểm soát nghiêm ngặt từ khâu thu hoạch đến thành phẩm, 
                  đảm bảo 100% tự nhiên, không hóa chất, an toàn tuyệt đối cho sức khỏe.
                </p>

                <div className="space-y-8">
                  {processSteps.map((step, index) => (
                    <div key={index} className="flex gap-6 group">
                      <div className="text-2xl font-heading text-primary/30 font-light group-hover:text-primary transition-colors font-barlow">
                        {step.num}
                      </div>
                      <div>
                        <h3 className="text-lg font-heading text-primary font-bold mb-2">{step.title}</h3>
                        <p className="text-muted-foreground text-sm font-light leading-relaxed font-nunito">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollAnimate>
            </div>

          </div>
        </div>
      </section>

      {/* 7. Product Explorer (Circle links) */}
      <section className="py-20 md:py-24 bg-white dark:bg-[#242b26] border-b border-border/10">
        <div className="container mx-auto px-4 text-center">
          <ScrollAnimate animation="fade-in-up">
            <p className="text-[11px] tracking-[0.25em] font-barlow font-bold text-muted-foreground uppercase mb-3">
              DANH MỤC LỰA CHỌN
            </p>
            <h2 className="text-3xl md:text-4xl font-heading text-gradient-eco font-bold mb-12">Khám phá sản phẩm</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 max-w-4xl mx-auto">
              {categories.map((cat, idx) => (
                <Link to={cat.link} key={idx} className="group flex flex-col items-center">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 rounded-full overflow-hidden border border-border/10 mb-4 bg-background shadow-inner relative">
                    <img 
                      src={cat.image} 
                      alt={cat.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <span className="text-xs font-barlow text-primary uppercase font-bold tracking-widest group-hover:underline underline-offset-4">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          </ScrollAnimate>
        </div>
      </section>

      {/* 8. Featured Products / Best Sellers Grid */}
      <section className="py-20 md:py-28 bg-background dark:bg-[#242b26] border-b border-border/10">
        <div className="container mx-auto px-4">
          <ScrollAnimate animation="fade-in-up">
            <div className="text-center mb-16 max-w-md mx-auto">
              <div className="mb-4 flex items-center justify-center gap-2">
                <span className="h-px w-8 bg-primary"></span>
                <span className="text-xs tracking-widest text-primary font-barlow font-bold">KHÁM PHÁ B-ECO</span>
                <span className="h-px w-8 bg-primary"></span>
              </div>
              <h2 className="text-3xl md:text-4xl font-heading text-gradient-eco uppercase tracking-widest font-bold">Flagship Series</h2>
            </div>
            
            <ProductGrid products={featuredProducts} isLoading={isLoading} />
            
            <div className="mt-16 text-center">
              <Link 
                to="/shop" 
                className="inline-flex items-center gap-3 bg-gradient-eco text-white hover:bg-gradient-eco-hover px-10 py-4 tracking-widest text-xs uppercase font-barlow font-bold shadow-md shadow-primary/10 hover:shadow-primary/20 transition-all duration-300"
              >
                XEM TẤT CẢ SẢN PHẨM <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </ScrollAnimate>
        </div>
      </section>

      {/* 9. Blog & Stories Slider */}
      <section className="py-20 md:py-28 bg-white dark:bg-[#242b26] border-b border-border/10">
        <div className="container mx-auto px-4">
          <ScrollAnimate animation="fade-in-up" className="text-center mb-16 max-w-xl mx-auto">
            <p className="text-[11px] tracking-[0.25em] font-barlow font-bold text-muted-foreground uppercase mb-3">
              CÂU CHUYỆN SẢN PHẨM
            </p>
            <h2 className="text-3xl md:text-4xl font-heading text-gradient-eco leading-tight font-bold">
              Từ B-ECO's Journal
            </h2>
          </ScrollAnimate>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mockArticles.map((article, idx) => (
              <ScrollAnimate key={idx} animation="fade-in-up" delay={idx * 100} className="group border border-border/5 overflow-hidden flex flex-col h-full bg-background dark:bg-[#2c332d] shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <span className="text-[10px] font-barlow font-bold text-primary/60 tracking-widest uppercase mb-3 inline-block">
                    {article.tag}
                  </span>
                  <h3 className="font-heading text-lg font-bold text-primary mb-3 leading-snug group-hover:text-primary/70 transition-colors">
                    <Link to={article.link}>{article.title}</Link>
                  </h3>
                  <p className="text-xs text-muted-foreground font-nunito font-light leading-relaxed mb-6 flex-grow">
                    {article.desc}
                  </p>
                  <div>
                    <Link 
                      to={article.link} 
                      className="inline-flex items-center gap-2 text-xs font-barlow font-bold tracking-widest text-primary uppercase border-b border-primary/20 pb-0.5 hover:border-primary transition-all duration-300"
                    >
                      ĐỌC BÀI VIẾT <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </ScrollAnimate>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Instagram Premium Grid (6 columns layout, asymmetric) */}
      <section className="py-20 bg-background dark:bg-[#242b26]">
        <div className="container mx-auto px-4">
          <ScrollAnimate animation="fade-in-up" className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-heading text-primary uppercase tracking-widest font-bold mb-3">B-ECO trên Mạng Xã Hội</h2>
            <p className="text-muted-foreground font-light font-barlow text-sm tracking-widest">@beco.vietnam</p>
          </ScrollAnimate>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {/* Col 1-2 (Spans 2x2 on lg) */}
            <div className="col-span-2 row-span-2 aspect-square lg:aspect-auto relative group overflow-hidden border border-border/10">
              <img src={anh1} alt="Gallery 0" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white text-xs font-barlow tracking-widest uppercase font-bold">Xem trên Instagram</span>
              </div>
            </div>

            {/* Other single image boxes */}
            {[anh2, anh3, anh4, customNtt, customVanHien, exhibition, variety, collection1].map((img, idx) => (
              <div key={idx} className="aspect-square relative group overflow-hidden border border-border/10">
                <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Leaf className="text-white h-6 w-6 stroke-[1.5]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;

import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Award, Calendar, Building, X, Maximize2, Trophy, ArrowRight, Lightbulb } from 'lucide-react';

interface AwardItem {
  id: string;
  title: string;
  badge: string;
  project: string;
  year: string;
  host: string;
  description: string;
  images: string[];
}

const awardsData: AwardItem[] = [
  {
    id: 'van-hien-2024',
    title: 'Quán quân Cuộc thi “Ý tưởng Sáng tạo Khởi nghiệp Sinh viên Văn Hiến 2024”',
    badge: 'Quán quân',
    project: 'Dự án “Sản xuất chén đĩa từ lá bàng biển”',
    year: '2024',
    host: 'Trường Đại học Văn Hiến',
    description: 'Dự án xuất sắc đạt ngôi vị cao nhất, được hội đồng giám khảo đánh giá cao về tính sáng tạo đột phá, định hướng tiêu dùng xanh và khả năng phát triển bền vững trong tương lai.',
    images: ['/images/achievements/image1.png']
  },
  {
    id: 'agritech-2025',
    title: 'Top 10 Dự án Xuất sắc nhất & Giải “Dự án thuyết trình ấn tượng nhất”',
    badge: 'Top 10 & Thuyết trình Ấn tượng',
    project: 'Dự án sản xuất sản phẩm sinh thái từ lá bàng biển',
    year: '2025',
    host: 'Cuộc thi “Agritech Innovation 2025”',
    description: 'Thành tích nổi bật tại Cuộc thi “Khởi nghiệp đổi mới sáng tạo trong lĩnh vực nông nghiệp ứng dụng công nghệ cao năm 2025”. Dự án nhận được giải phụ nhờ ý tưởng sáng tạo độc đáo, định hướng phát triển bền vững và khả năng truyền tải câu chuyện dự án đầy cảm hứng.',
    images: ['/images/achievements/image3.png']
  },
  {
    id: 'binh-chanh-2024',
    title: 'Á quân Cuộc thi “Khởi nghiệp Đổi mới Sáng tạo Huyện Bình Chánh 2024”',
    badge: 'Á quân',
    project: 'Dự án sản xuất sản phẩm sinh thái từ lá bàng biển',
    year: '2024',
    host: 'UBND Huyện Bình Chánh',
    description: 'Dự án đạt giải nhì và nhận được đánh giá rất cao nhờ tính ứng dụng thực tiễn vượt trội, định hướng phát triển kinh tế tuần hoàn và khả năng lan tỏa giá trị cộng đồng mạnh mẽ tại địa phương.',
    images: ['/images/achievements/image4.png']
  },
  {
    id: 'sv-startup-2024',
    title: 'Top dự án nổi bật tại SV.STARTUP 2024',
    badge: 'Dự án nổi bật Quốc gia',
    project: 'Dự án khởi nghiệp xanh từ lá bàng biển',
    year: '2024',
    host: 'Bộ Giáo dục & Đào tạo & các đơn vị ĐMST quốc gia',
    description: 'Dự án xuất sắc lọt vào danh sách tiêu biểu tại Ngày hội Khởi nghiệp Quốc gia của Học sinh, Sinh viên. Ý tưởng hướng đến phát triển bền vững, giảm thiểu rác thải nhựa dùng một lần và bảo vệ hệ sinh thái.',
    images: ['/images/achievements/image5.png']
  },
  {
    id: 'design-thinking-2024',
    title: 'Top 9 Dự án Xuất sắc Toàn quốc',
    badge: 'Top 9 Toàn quốc',
    project: 'Dự án khởi nghiệp xanh từ lá bàng biển',
    year: '2024',
    host: 'Cuộc thi “Design Thinking – Open Innovation Thủ Đức 2024”',
    description: 'Vượt qua hơn 100 đội thi từ 64 trường đại học, cao đẳng và các startup trên toàn quốc để đứng trong top 9 dự án xuất sắc nhất hướng tới phát triển bền vững và đổi mới sáng tạo mở.',
    images: ['/images/achievements/image2.png']
  },
  {
    id: 'korea-vietnam-2026',
    title: 'Innovation Prize – Korea-Vietnam University Student Startup Idea Competition 2026',
    badge: 'Giải Đổi mới Sáng tạo',
    project: 'Dự án khởi nghiệp đổi mới sáng tạo từ lá bàng biển',
    year: '2026',
    host: 'Korea-Vietnam Student Startup Committee',
    description: 'Giải thưởng quốc tế ghi nhận đóng góp đổi mới sáng tạo hướng đến phát triển bền vững và ứng dụng thực tiễn cao. Cuộc thi quy tụ các đội thi sinh viên xuất sắc nhất của Việt Nam và Hàn Quốc.',
    images: ['/images/achievements/image6.png']
  }
];

const Awards = () => {
  const [activeImage, setActiveImage] = useState<string | null>(null);

  return (
    <Layout>
      <div className="bg-background min-h-screen font-nunito pb-20">
        {/* Hero Section */}
        <section className="relative py-20 border-b border-border/40 overflow-hidden bg-gradient-eco-soft dark:bg-[#1f2621]/30">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-secondary blur-3xl"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10 text-center">
            <div className="max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary dark:text-primary-foreground text-xs uppercase tracking-widest font-semibold mb-2">
                <Trophy className="w-4 h-4" /> Hành trình vinh quang
              </div>
              <h1 className="text-4xl lg:text-5xl font-heading text-primary mb-6 font-bold tracking-tight">
                Giải thưởng & Thành tích
              </h1>
              <p className="text-lg text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto">
                B-ECO tự hào khẳng định giá trị qua những giải thưởng, sự công nhận từ các tổ chức uy tín trong và ngoài nước trên hành trình gieo mầm xanh khởi nghiệp bảo vệ môi trường.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Panel */}
        <div className="container mx-auto px-4 -mt-10 relative z-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto bg-card border border-border/60 shadow-lg rounded-none p-6 md:p-8 backdrop-blur-md">
            <div className="text-center border-r border-border/40 last:border-r-0">
              <div className="text-3xl md:text-4xl font-heading font-extrabold text-primary">06+</div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground mt-2 font-medium">Giải thưởng lớn</div>
            </div>
            <div className="text-center md:border-r border-border/40 last:border-r-0">
              <div className="text-3xl md:text-4xl font-heading font-extrabold text-primary">3 Năm</div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground mt-2 font-medium">Hành trình xanh</div>
            </div>
            <div className="text-center border-r border-border/40 last:border-r-0">
              <div className="text-3xl md:text-4xl font-heading font-extrabold text-primary">01</div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground mt-2 font-medium">Giải Quốc tế</div>
            </div>
            <div className="text-center last:border-r-0">
              <div className="text-3xl md:text-4xl font-heading font-extrabold text-primary">100%</div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground mt-2 font-medium">Vì môi trường</div>
            </div>
          </div>
        </div>

        {/* Awards Grid */}
        <div className="container mx-auto px-4 py-16 mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {awardsData.map((award) => (
              <div 
                key={award.id} 
                className="group flex flex-col bg-card border border-border/40 hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-md relative overflow-hidden"
              >
                {/* Visual Accent top border bar */}
                <div className="h-1.5 w-full bg-gradient-eco opacity-80 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    {/* Header info */}
                    <div className="flex justify-between items-start">
                      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
                        <Calendar className="w-3.5 h-3.5 text-primary/80" /> {award.year}
                      </span>
                      <span className="text-[11px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2.5 py-1 rounded-none">
                        {award.badge}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-heading text-lg font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
                      {award.title}
                    </h3>

                    {/* Context / Project */}
                    <p className="text-xs font-semibold text-secondary flex items-center gap-1.5 bg-secondary/5 py-1 px-2 border-l-2 border-secondary">
                      <Lightbulb className="w-3.5 h-3.5" /> {award.project}
                    </p>

                    {/* Host organization */}
                    <div className="flex items-start gap-2 text-xs text-muted-foreground pt-1">
                      <Building className="w-4 h-4 mt-0.5 text-muted-foreground/80 flex-shrink-0" />
                      <span>{award.host}</span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground/90 font-light leading-relaxed pt-2 border-t border-border/20">
                      {award.description}
                    </p>
                  </div>

                  {/* Images & Lightbox trigger */}
                  <div className="mt-6 pt-4 border-t border-border/20">
                    {award.images.length > 0 ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          {award.images.map((img, index) => (
                            <div 
                              key={index} 
                              className="relative aspect-[4/3] overflow-hidden bg-muted group/img cursor-pointer border border-border/10"
                              onClick={() => setActiveImage(img)}
                            >
                              <img 
                                src={img} 
                                alt={`${award.badge} - Ảnh ${index + 1}`} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                                onError={(e) => {
                                  // Fallback handling if image fails
                                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop';
                                }}
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                <Maximize2 className="w-5 h-5 text-white stroke-[2]" />
                              </div>
                            </div>
                          ))}
                        </div>
                        <button 
                          onClick={() => setActiveImage(award.images[0])}
                          className="w-full text-center text-xs uppercase tracking-widest font-semibold text-white bg-secondary hover:bg-secondary/90 transition-colors flex items-center justify-center gap-1.5 py-2.5 rounded-none"
                        >
                          Xem chứng thư <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="text-center py-4 bg-muted/30 border border-dashed border-border/40 text-xs text-muted-foreground italic">
                        Hình ảnh đang được cập nhật
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <section className="container mx-auto px-4 mt-8 max-w-4xl">
          <div className="bg-gradient-eco text-white p-8 md:p-12 text-center shadow-lg relative overflow-hidden rounded-none">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h2 className="text-2xl md:text-3xl font-heading font-bold">
                Đồng hành cùng hành trình xanh của B-ECO
              </h2>
              <p className="text-white/80 font-light text-sm md:text-base leading-relaxed">
                Mỗi sản phẩm bạn sử dụng từ B-ECO là sự đóng góp to lớn vào sứ mệnh giảm rác thải nhựa và hỗ trợ sinh kế bền vững cho người dân địa phương.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                <a 
                  href="/shop" 
                  className="px-8 py-3 bg-secondary text-white hover:bg-secondary/90 transition-colors font-semibold uppercase tracking-widest text-xs flex items-center justify-center gap-2 rounded-none"
                >
                  Ghé thăm cửa hàng <ArrowRight className="w-4 h-4" />
                </a>
                <a 
                  href="/about" 
                  className="px-8 py-3 border border-white/40 text-white hover:bg-white/10 transition-all font-semibold uppercase tracking-widest text-xs flex items-center justify-center gap-2 rounded-none"
                >
                  Tìm hiểu câu chuyện của chúng tôi
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Lightbox Modal */}
        {activeImage && (
          <div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-fade-in"
            onClick={() => setActiveImage(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white hover:text-white/80 transition-colors p-2 bg-white/10 hover:bg-white/20 rounded-full"
              onClick={() => setActiveImage(null)}
              aria-label="Đóng ảnh"
            >
              <X className="w-6 h-6" />
            </button>
            <div 
              className="relative max-w-4xl max-h-[85vh] overflow-hidden flex items-center justify-center border border-white/10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={activeImage} 
                alt="Chứng nhận phóng to" 
                className="max-w-full max-h-[80vh] object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop';
                }}
              />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Awards;

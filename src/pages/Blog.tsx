import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { ScrollAnimate } from '@/components/ui/scroll-animate';
import { ArrowRight } from 'lucide-react';

// Thumbnails
import collection2 from '@/assets/products/collection-display-2.jpg';
import exhibition from '@/assets/products/exhibition-display.jpg';
import variety from '@/assets/products/leaf-plates-variety.jpg';
import closeup from '@/assets/products/leaf-plates-closeup.jpg';
import customLogo from '@/assets/products/custom-logo-beco.jpg';
import hero2 from '@/assets/hero/hero2.jpg';

const blogTags = ["TẤT CẢ", "HÀNH TRÌNH XANH", "TIÊU DÙNG BỀN VỮNG", "MÔI TRƯỜNG", "NGUYÊN LIỆU"];

const articlesData = [
  {
    tag: "HÀNH TRÌNH XANH",
    title: "Từ chiếc lá bàng biển rụng đến những chiếc đĩa trên bàn tiệc",
    desc: "Khám phá quy trình chế tác tỉ mỉ và tâm huyết từ người dân địa phương Phú Yên để biến lá cây khô thành sản phẩm đĩa lá sinh học cao cấp phục vụ nhà hàng, khách sạn.",
    image: collection2,
    date: "21 Tháng 5, 2026",
    readTime: "5 phút đọc"
  },
  {
    tag: "TIÊU DÙNG BỀN VỮNG",
    title: "B-ECO đồng hành cùng xu hướng cưới sinh thái (Green Wedding)",
    desc: "Xu hướng tổ chức tiệc cưới thân thiện với môi trường ngày càng được các cặp đôi trẻ đón nhận nhiệt tình. B-ECO tự hào cung cấp giải pháp đĩa lá tự nhiên mộc mạc và sang trọng.",
    image: exhibition,
    date: "15 Tháng 5, 2026",
    readTime: "4 phút đọc"
  },
  {
    tag: "MÔI TRƯỜNG",
    title: "Tại sao đĩa lá bàng biển Phú Yên là lựa chọn hàng đầu bảo vệ đại dương?",
    desc: "Khác với các loại đĩa dùng một lần từ nhựa hay xốp mất hàng trăm năm phân hủy, đĩa lá bàng biển tự rụng B-ECO phân hủy hoàn toàn tự nhiên trong vòng 45 ngày và không tạo vi nhựa.",
    image: variety,
    date: "08 Tháng 5, 2026",
    readTime: "6 phút đọc"
  },
  {
    tag: "NGUYÊN LIỆU",
    title: "Khám phá đặc tính dẻo dai tự nhiên của lá bàng biển Phú Yên",
    desc: "Tại sao B-ECO chọn lá bàng biển thay vì các loại lá khác? Hãy cùng tìm hiểu cấu trúc sợi tự nhiên đặc biệt giúp lá bàng chịu được ép nhiệt cao và giữ nguyên độ dẻo dai khi đựng thức ăn nóng.",
    image: closeup,
    date: "28 Tháng 4, 2026",
    readTime: "3 phút đọc"
  },
  {
    tag: "HÀNH TRÌNH XANH",
    title: "Dịch vụ in ấn logo sinh học - Khẳng định cá tính thương hiệu xanh",
    desc: "Chúng tôi sử dụng công nghệ in không dung môi độc hại trực tiếp lên bề mặt đĩa lá bàng, giúp các quán cà phê, nhà hàng xây dựng hình ảnh thương hiệu bền vững chuyên nghiệp.",
    image: customLogo,
    date: "12 Tháng 4, 2026",
    readTime: "5 phút đọc"
  },
  {
    tag: "TIÊU DÙNG BỀN VỮNG",
    title: "Lối sống Zero Waste: Bắt đầu từ những thay đổi nhỏ nhất trong gian bếp",
    desc: "Hành trình giảm thiểu rác thải không hề phức tạp. Thay thế túi nilon bằng túi vải, sử dụng hộp thủy tinh và đĩa lá tự hủy khi có dã ngoại là những bước đi đầu tiên tuyệt vời.",
    image: hero2,
    date: "05 Tháng 4, 2026",
    readTime: "4 phút đọc"
  }
];

const Blog = () => {
  const [activeTag, setActiveTag] = useState("TẤT CẢ");

  const filteredArticles = activeTag === "TẤT CẢ" 
    ? articlesData 
    : articlesData.filter(article => article.tag === activeTag);

  return (
    <Layout>
      <div className="bg-white dark:bg-[#242b26] min-h-screen py-16 sm:py-24 font-nunito text-primary">
        <div className="container mx-auto px-4">
          
          {/* Header */}
          <div className="text-center max-w-xl mx-auto mb-16">
            <ScrollAnimate animation="fade-in-up">
              <p className="text-[11px] tracking-[0.25em] font-barlow font-bold text-muted-foreground uppercase mb-3">
                B-ECO JOURNAL
              </p>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-gradient-eco mb-4">
                Hành trình & Câu chuyện
              </h1>
              <p className="text-sm text-muted-foreground font-light leading-relaxed">
                Nơi chúng tôi chia sẻ những câu chuyện về nguồn nguyên liệu lá bàng biển Phú Yên, các hoạt động cộng đồng xanh và phong cách sống bền vững.
              </p>
            </ScrollAnimate>
          </div>

          {/* Tags bar */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 border-b border-border/10 pb-8 mb-12 max-w-4xl mx-auto font-barlow text-xs tracking-widest uppercase font-bold">
            {blogTags.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-4 py-2 border transition-all duration-300 ${
                  activeTag === tag 
                    ? "bg-gradient-eco text-white border-none hover:bg-gradient-eco-hover" 
                    : "bg-transparent text-primary/70 border-transparent hover:text-primary"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {filteredArticles.map((article, idx) => (
              <ScrollAnimate 
                key={idx} 
                animation="fade-in-up" 
                delay={idx * 100}
                className="group flex flex-col h-full bg-background dark:bg-[#2c332d] border border-border/5 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="aspect-video overflow-hidden relative">
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute top-4 left-4 bg-white/95 dark:bg-[#242b26]/95 text-gradient-eco text-[10px] font-barlow font-bold tracking-widest px-3 py-1 uppercase border border-border/10">
                    {article.tag}
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-4 text-[10px] font-barlow text-muted-foreground uppercase tracking-widest mb-3">
                    <span>{article.date}</span>
                    <span>•</span>
                    <span>{article.readTime}</span>
                  </div>
                  
                  <h2 className="font-heading text-lg font-bold text-primary mb-3 leading-snug group-hover:text-secondary transition-colors">
                    {article.title}
                  </h2>
                  
                  <p className="text-xs text-muted-foreground font-light leading-relaxed mb-6 flex-grow">
                    {article.desc}
                  </p>
                  
                  <div>
                    <button className="inline-flex items-center gap-2 text-xs font-barlow font-bold tracking-widest text-primary hover:text-secondary uppercase border-b border-primary/20 pb-0.5 hover:border-secondary transition-all duration-300">
                      ĐỌC TIẾP <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </ScrollAnimate>
            ))}
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default Blog;

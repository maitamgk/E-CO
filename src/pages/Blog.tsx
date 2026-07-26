import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { ScrollAnimate } from '@/components/ui/scroll-animate';
import { ArrowRight } from 'lucide-react';

// Thumbnails
import collection2 from '@/assets/products/collection-display-1.webp';
import exhibition from '@/assets/products/exhibition-display.webp';
import variety from '@/assets/products/leaf-plates-variety.webp';
import closeup from '@/assets/products/leaf-plates-closeup.webp';
import customLogo from '@/assets/products/custom-logo-beco.webp';
import hero2 from '@/assets/hero/hero2.webp';
import { Seo } from '@/components/Seo';

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
      <Seo
        title="Blog B-ECO"
        description="Câu chuyện về lá bàng biển, kinh tế tuần hoàn và hành trình gieo mầm xanh từ Phú Yên."
      />
      <div className="min-h-[100dvh] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-[1400px]">
          
          {/* Header */}
          <div className="mb-12 max-w-3xl">
            <ScrollAnimate animation="fade-in-up">
              <h1 className="text-4xl font-extrabold tracking-[-0.05em] text-foreground sm:text-6xl">
                Hành trình & Câu chuyện
              </h1>
              <p className="mt-5 max-w-[62ch] text-base leading-7 text-muted-foreground sm:text-lg">
                Nơi chúng tôi chia sẻ những câu chuyện về nguồn nguyên liệu lá bàng biển Phú Yên, các hoạt động cộng đồng xanh và phong cách sống bền vững.
              </p>
            </ScrollAnimate>
          </div>

          {/* Tags bar */}
          <div className="mb-10 flex gap-2 overflow-x-auto pb-2">
            {blogTags.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`h-10 flex-none rounded-full px-4 text-sm font-semibold transition-colors ${
                  activeTag === tag 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-secondary/75 text-foreground hover:bg-secondary"
                }`}
              >
                {tag === 'TẤT CẢ' ? 'Tất cả' : tag.charAt(0) + tag.slice(1).toLocaleLowerCase('vi')}
              </button>
            ))}
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {filteredArticles.map((article, idx) => (
              <ScrollAnimate 
                key={idx} 
                animation="fade-in-up" 
                delay={idx * 100}
                className={`group overflow-hidden rounded-2xl border border-border bg-card transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_22px_55px_hsl(var(--primary)/0.1)] ${idx === 0 ? 'md:col-span-2 md:grid md:grid-cols-[1.1fr_0.9fr]' : 'flex h-full flex-col'}`}
              >
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>
                
                <div className="flex flex-grow flex-col p-6 sm:p-7">
                  <span className="mb-3 text-xs font-bold text-primary">{article.tag.charAt(0) + article.tag.slice(1).toLocaleLowerCase('vi')}</span>
                  <div className="mb-3 flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{article.date}</span>
                    <span>/</span>
                    <span>{article.readTime}</span>
                  </div>
                  
                  <h2 className="mb-3 text-xl font-bold leading-snug tracking-[-0.02em] text-foreground transition-colors group-hover:text-primary">
                    {article.title}
                  </h2>
                  
                  <p className="mb-6 flex-grow text-sm leading-6 text-muted-foreground">
                    {article.desc}
                  </p>
                  
                  <div>
                    <button className="inline-flex items-center gap-2 text-sm font-bold text-primary transition-colors hover:text-accent">
                      Đọc tiếp <ArrowRight className="h-4 w-4" />
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

import { Layout } from '@/components/layout/Layout';
import { Leaf, Heart, Globe, Users } from 'lucide-react';
import anh1 from '@/assets/products/anh1.jpg';
import anh2 from '@/assets/products/anh2.jpg';
import anh3 from '@/assets/products/anh3.jpg';
import anh4 from '@/assets/products/anh4.jpeg';

const About = () => {
  return (
    <Layout>
      {/* Entire page with light background */}
      <div className="bg-[#fcf9f4] min-h-screen">
        {/* Hero Section */}
        <section className="relative py-24 border-b border-border/40">
          <div className="container mx-auto px-4 relative z-10 text-center">
            <div className="max-w-2xl mx-auto">
              <h1 className="text-4xl lg:text-5xl font-heading text-primary mb-6">
                Về B-ECO
              </h1>
              <p className="text-lg text-muted-foreground font-light leading-relaxed">
                Câu chuyện về hành trình biến lá bàng thành giải pháp thay thế nhựa dùng một lần
              </p>
            </div>
          </div>
        </section>

      {/* Story */}
      <div className="container mx-auto px-4 py-16 space-y-24">
        {/* Origin */}
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="mb-6 flex items-center gap-2">
              <span className="h-px w-8 bg-primary"></span>
              <span className="text-xs tracking-widest text-primary font-medium">NGUỒN GỐC</span>
            </div>
            <h2 className="text-3xl font-heading text-primary mb-6">Khởi nguồn từ Phú Yên</h2>
            <p className="text-muted-foreground leading-relaxed font-light">
              B-ECO ra đời tại vùng đất Phú Yên xinh đẹp, nơi những cây bàng cổ thụ đứng 
              sừng sững bên bờ biển trong xanh. Chúng tôi nhận thấy lá bàng rụng xuống 
              mỗi mùa là một nguồn tài nguyên quý giá, có thể biến thành những sản phẩm 
              hữu ích thay thế cho nhựa dùng một lần.
            </p>
          </div>
          <div className="relative">
            <img
              src={anh1}
              alt="Lá bàng"
              className="w-full aspect-square object-cover"
              loading="lazy"
            />
          </div>
        </section>

        {/* Mission */}
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 relative">
            <img
              src={anh2}
              alt="Biển sạch"
              className="w-full aspect-square object-cover"
              loading="lazy"
            />
          </div>
          <div className="order-1 md:order-2">
            <div className="mb-6 flex items-center gap-2">
              <span className="h-px w-8 bg-primary"></span>
              <span className="text-xs tracking-widest text-primary font-medium">SỨ MỆNH</span>
            </div>
            <h2 className="text-3xl font-heading text-primary mb-6">Sứ mệnh của chúng tôi</h2>
            <p className="text-muted-foreground leading-relaxed font-light">
              Chúng tôi tin rằng mỗi chiếc chén, mỗi chiếc dĩa từ lá bàng là một bước 
              nhỏ nhưng ý nghĩa trong hành trình bảo vệ môi trường. B-ECO cam kết mang 
              đến những sản phẩm an toàn cho sức khỏe, thân thiện với thiên nhiên, và 
              góp phần giảm thiểu rác thải nhựa tràn lan.
            </p>
          </div>
        </section>

        {/* Environment */}
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="mb-6 flex items-center gap-2">
              <span className="h-px w-8 bg-primary"></span>
              <span className="text-xs tracking-widest text-primary font-medium">MÔI TRƯỜNG</span>
            </div>
            <h2 className="text-3xl font-heading text-primary mb-6">Bảo vệ biển Phú Yên</h2>
            <p className="text-muted-foreground leading-relaxed font-light">
              Biển Phú Yên với vẻ đẹp hoang sơ đang đối mặt với nguy cơ ô nhiễm từ 
              rác thải nhựa. Mỗi sản phẩm B-ECO bạn sử dụng là một lần bạn nói "không" 
              với nhựa dùng một lần, góp phần giữ gìn vẻ đẹp của biển cả và bảo vệ 
              hệ sinh thái biển cho thế hệ tương lai.
            </p>
          </div>
          <div className="relative">
            <img
              src={anh3}
              alt="Biển Phú Yên"
              className="w-full aspect-square object-cover"
              loading="lazy"
            />
          </div>
        </section>

        {/* Community */}
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 relative">
            <img
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop"
              alt="Cộng đồng"
              className="w-full aspect-square object-cover"
              loading="lazy"
            />
          </div>
          <div className="order-1 md:order-2">
            <div className="mb-6 flex items-center gap-2">
              <span className="h-px w-8 bg-primary"></span>
              <span className="text-xs tracking-widest text-primary font-medium">CỘNG ĐỒNG</span>
            </div>
            <h2 className="text-3xl font-heading text-primary mb-6">Cộng đồng bền vững</h2>
            <p className="text-muted-foreground leading-relaxed font-light">
              B-ECO không chỉ là một thương hiệu, mà là một cộng đồng những người yêu 
              thiên nhiên. Chúng tôi tạo công ăn việc làm cho người dân địa phương, 
              hỗ trợ các hộ gia đình thu gom lá bàng, và chia sẻ kiến thức về lối 
              sống xanh đến mọi người.
            </p>
          </div>
        </section>
      </div>

      {/* Values */}
      <section className="py-20 border-t border-border/40 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading text-primary text-center mb-12">Giá trị cốt lõi</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { value: '100%', label: 'Tự nhiên', desc: 'Làm hoàn toàn từ lá bàng tự nhiên, không hóa chất' },
              { value: '45', label: 'Ngày phân hủy', desc: 'Trở về với đất, không để lại rác thải nhựa' },
              { value: '0%', label: 'Hóa chất', desc: 'Hoàn toàn an toàn cho người sử dụng' },
            ].map((item, idx) => (
              <div key={idx} className="text-center p-8 border border-border/40">
                <div className="text-5xl font-heading text-primary/20 mb-4">{item.value}</div>
                <div className="font-heading text-xl text-primary mb-2">{item.label}</div>
                <p className="text-sm text-muted-foreground font-light">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      </div>
    </Layout>
  );
};

export default About;

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
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 min-h-screen">
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0">
          {/* Background Image */}
          <img
            src={anh4}
            alt="B-ECO Background"
            className="w-full h-full object-cover object-center opacity-50"
            loading="eager"
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-emerald-50/30 to-white/40" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl lg:text-6xl font-black italic text-gray-800 mb-6">
              Về <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">B-ECO</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
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
            <div className="p-3 bg-primary/10 rounded-xl inline-block mb-4">
              <Leaf className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Khởi nguồn từ Phú Yên</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
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
              className="rounded-2xl shadow-2xl w-full h-auto object-cover object-center"
              loading="lazy"
            />
            <div className="absolute -bottom-4 -left-4 bg-primary text-primary-foreground p-4 rounded-xl shadow-lg">
              <Leaf className="h-8 w-8" />
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 relative">
            <img
              src={anh2}
              alt="Biển sạch"
              className="rounded-2xl shadow-2xl w-full h-auto object-cover object-center"
              loading="lazy"
            />
            <div className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground p-4 rounded-xl shadow-lg">
              <Heart className="h-8 w-8" />
            </div>
          </div>
          <div className="order-1 md:order-2">
            <div className="p-3 bg-primary/10 rounded-xl inline-block mb-4">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Sứ mệnh của chúng tôi</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
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
            <div className="p-3 bg-primary/10 rounded-xl inline-block mb-4">
              <Globe className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Bảo vệ biển Phú Yên</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
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
              className="rounded-2xl shadow-2xl w-full h-auto object-cover object-center"
              loading="lazy"
            />
            <div className="absolute -bottom-4 -left-4 bg-primary text-primary-foreground p-4 rounded-xl shadow-lg">
              <Globe className="h-8 w-8" />
            </div>
          </div>
        </section>

        {/* Community */}
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 relative">
            <img
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop"
              alt="Cộng đồng"
              className="rounded-2xl shadow-2xl w-full h-auto object-cover object-center"
              loading="lazy"
            />
            <div className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground p-4 rounded-xl shadow-lg">
              <Users className="h-8 w-8" />
            </div>
          </div>
          <div className="order-1 md:order-2">
            <div className="p-3 bg-primary/10 rounded-xl inline-block mb-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Cộng đồng bền vững</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              B-ECO không chỉ là một thương hiệu, mà là một cộng đồng những người yêu 
              thiên nhiên. Chúng tôi tạo công ăn việc làm cho người dân địa phương, 
              hỗ trợ các hộ gia đình thu gom lá bàng, và chia sẻ kiến thức về lối 
              sống xanh đến mọi người.
            </p>
          </div>
        </section>
      </div>

      {/* Values */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Giá trị cốt lõi</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { value: '100%', label: 'Tự nhiên', desc: 'Làm hoàn toàn từ lá bàng tự nhiên, không hóa chất' },
              { value: '45 ngày', label: 'Phân hủy sinh học', desc: 'Trở về với đất, không để lại rác thải' },
              { value: '0', label: 'Nhựa', desc: 'Hoàn toàn không sử dụng nhựa trong sản xuất' },
            ].map((item, idx) => (
              <div key={idx} className="text-center bg-background rounded-2xl p-8 shadow-lg">
                <div className="text-5xl font-bold text-primary mb-2">{item.value}</div>
                <div className="font-semibold text-lg mb-2">{item.label}</div>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
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

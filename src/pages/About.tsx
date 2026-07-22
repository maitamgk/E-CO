import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Recycle, Users } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { MotionReveal } from '@/components/home/MotionReveal';
import aboutHero from '@/assets/generated/beco-about-origin.png';
import phuYenCoast from '@/assets/products/anh1.jpg';
import coastalSource from '@/assets/products/anh2.jpg';
import collectionDisplay from '@/assets/products/collection-display-1.jpg';
import leafCloseup from '@/assets/products/leaf-plates-closeup.jpg';
import leafVariety from '@/assets/products/leaf-plates-variety.jpg';
import customLogoBeco from '@/assets/products/custom-logo-beco.jpg';
import customLogoNtt from '@/assets/products/custom-logo-ntt.jpg';
import customLogoVanHien from '@/assets/products/custom-logo-vanhien.jpg';
import artDecor from '@/assets/products/art-decor.png';
import artClock from '@/assets/products/art-clock.png';

const facts = [
  ['100%', 'lá bàng biển tự nhiên'],
  ['11', 'mã sản phẩm'],
  ['65°C', 'khả năng chịu nhiệt'],
  ['45 ngày', 'phân hủy sinh học'],
];

const materialJourney = [
  {
    title: 'Từ vùng nguyên liệu',
    text: 'Lá bàng biển rụng được thu gom tại Phú Yên, nơi biển và cây xanh cùng tạo nên bản sắc B-ECO.',
    image: coastalSource,
  },
  {
    title: 'Giữ vẻ đẹp tự nhiên',
    text: 'Mỗi chiếc lá được làm sạch và định hình, vẫn giữ lại đường gân cùng sắc độ riêng của vật liệu.',
    image: leafCloseup,
  },
  {
    title: 'Trở thành sản phẩm',
    text: 'Đĩa, chén và đồ mỹ nghệ bước vào đời sống với giá trị sử dụng, thẩm mỹ và câu chuyện địa phương.',
    image: collectionDisplay,
  },
];

const About = () => (
  <Layout>
    <section className="relative isolate flex min-h-[620px] items-end overflow-hidden bg-primary sm:min-h-[700px]">
      <img
        src={aboutHero}
        alt="Sản phẩm B-ECO từ lá bàng biển bên bờ biển Phú Yên"
        className="absolute inset-0 h-full w-full object-cover object-[62%_center]"
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(14,30,21,0.92)_0%,rgba(14,30,21,0.68)_34%,rgba(14,30,21,0.18)_64%,rgba(14,30,21,0.08)_100%)]" />
      <div className="relative mx-auto w-full max-w-[1500px] px-5 pb-16 pt-24 sm:px-8 sm:pb-20 lg:px-14 lg:pb-24">
        <MotionReveal className="max-w-[760px] text-[#f8f4ea]">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d9bd80]">Về B-ECO</p>
          <h1 className="mt-6 max-w-[17ch] font-heading text-5xl font-medium leading-[0.98] tracking-[-0.035em] sm:text-6xl lg:text-7xl">
            Một vòng đời mới từ lá bàng biển.
          </h1>
          <p className="mt-7 max-w-[55ch] text-sm leading-7 text-[#f8f4ea]/80 sm:text-base">
            B-ECO biến lá rụng tại Phú Yên thành sản phẩm hữu ích, giàu thẩm mỹ và giá trị địa phương.
          </p>
        </MotionReveal>
      </div>
    </section>

    <section className="border-b border-border bg-card px-5 py-20 sm:px-8 sm:py-28 lg:px-14">
      <div className="mx-auto max-w-[1260px]">
        <MotionReveal className="grid gap-9 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Triết lý B-ECO</p>
          <div>
            <h2 className="max-w-[18ch] font-heading text-4xl font-medium leading-[1.08] tracking-[-0.025em] text-foreground sm:text-6xl">
              Sinh thái bắt đầu từ điều đang có.
            </h2>
            <p className="mt-7 max-w-[62ch] text-sm leading-7 text-muted-foreground sm:text-base">
              Chúng tôi không xem lá bàng biển rụng là phế phẩm. Mỗi chiếc lá là một nguồn vật liệu bản địa có thể tiếp tục một đời sống mới trên bàn ăn, trong quà tặng và không gian sáng tạo.
            </p>
          </div>
        </MotionReveal>

        <div className="mt-16 grid grid-cols-2 border-y border-border lg:grid-cols-4">
          {facts.map(([value, label], index) => (
            <MotionReveal
              key={label}
              className={`px-3 py-8 text-center sm:px-7 ${index % 2 ? 'border-l border-border' : ''} ${index > 1 ? 'border-t border-border lg:border-t-0' : ''} ${index === 2 ? 'lg:border-l' : ''}`}
              delay={index * 0.05}
            >
              <strong className="font-heading text-3xl font-medium text-primary sm:text-4xl">{value}</strong>
              <span className="mt-2 block text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">{label}</span>
            </MotionReveal>
          ))}
        </div>
      </div>
    </section>

    <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-14">
      <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:gap-20">
        <MotionReveal className="relative pb-10 pr-5 sm:pb-16 sm:pr-16">
          <img
            src={phuYenCoast}
            alt="Bờ biển Phú Yên, nơi B-ECO khởi nguồn"
            className="aspect-[4/3] w-full object-cover"
            loading="lazy"
          />
          <img
            src={collectionDisplay}
            alt="Sản phẩm lá bàng biển B-ECO được trưng bày"
            className="absolute bottom-0 right-0 aspect-[4/3] w-[42%] border-[10px] border-background object-cover shadow-[0_18px_50px_rgba(29,38,28,0.14)] sm:border-[16px]"
            loading="lazy"
          />
        </MotionReveal>

        <MotionReveal delay={0.08}>
          <h2 className="font-heading text-4xl font-medium leading-tight tracking-[-0.025em] text-foreground sm:text-6xl">Khởi nguồn tại Phú Yên</h2>
          <div className="mt-8 border-l border-primary/35 pl-6 sm:pl-8">
            <p className="text-sm leading-7 text-muted-foreground sm:text-base">
              B-ECO nhận ra lá bàng biển rụng không phải phế phẩm. Đó là nguồn vật liệu tự nhiên có thể trở thành đĩa, chén và sản phẩm mỹ nghệ.
            </p>
            <p className="mt-5 text-sm leading-7 text-muted-foreground sm:text-base">
              Đến năm 2035, B-ECO hướng tới phát triển chuỗi giá trị tuần hoàn tại Việt Nam và từng bước tiếp cận thị trường quốc tế.
            </p>
          </div>
        </MotionReveal>
      </div>
    </section>

    <section className="border-y border-border bg-secondary px-5 py-20 text-foreground sm:px-8 sm:py-28 lg:px-14">
      <div className="mx-auto grid max-w-[1320px] gap-14 lg:grid-cols-[1.08fr_0.92fr] lg:gap-20">
        <MotionReveal>
          <Leaf className="h-8 w-8 stroke-[1.35] text-primary" />
          <p className="mt-9 font-heading text-2xl font-medium text-primary">Sứ mệnh</p>
          <h2 className="mt-5 max-w-[16ch] font-heading text-4xl font-medium leading-[1.12] tracking-[-0.025em] sm:text-6xl">
            Biến vật liệu bản địa thành lựa chọn sống xanh có giá trị.
          </h2>
          <p className="mt-7 max-w-[58ch] text-sm leading-7 text-muted-foreground sm:text-base">
            Tạo ra sản phẩm sinh thái có giá trị sử dụng, thẩm mỹ và văn hóa. Đồng thời giảm rác thải nhựa và lan tỏa lối sống xanh.
          </p>
        </MotionReveal>

        <div className="border-t border-border lg:border-l lg:border-t-0 lg:pl-14">
          <MotionReveal className="py-9 lg:pt-0" delay={0.06}>
            <Recycle className="h-7 w-7 stroke-[1.35] text-primary" />
            <h3 className="mt-6 font-heading text-3xl font-medium">Kinh tế tuần hoàn</h3>
            <p className="mt-4 max-w-[52ch] text-sm leading-7 text-muted-foreground">
              Tận dụng lá rụng, tạo sinh kế địa phương và đưa vật liệu trở lại tự nhiên sau vòng đời sử dụng.
            </p>
          </MotionReveal>
          <MotionReveal className="border-t border-border py-9" delay={0.12}>
            <Users className="h-7 w-7 stroke-[1.35] text-primary" />
            <h3 className="mt-6 font-heading text-3xl font-medium">Cùng cộng đồng phát triển</h3>
            <p className="mt-4 max-w-[52ch] text-sm leading-7 text-muted-foreground">
              Kết nối người thu gom, người làm thủ công, khách hàng và doanh nghiệp trong một lựa chọn tiêu dùng có trách nhiệm.
            </p>
          </MotionReveal>
        </div>
      </div>
    </section>

    <section className="border-b border-border bg-card px-5 py-20 sm:px-8 sm:py-28 lg:px-14">
      <div className="mx-auto max-w-[1400px]">
        <MotionReveal className="border-b border-border pb-9">
          <p className="font-heading text-2xl font-medium text-primary">Từ lá rụng đến sản phẩm</p>
          <h2 className="mt-3 font-heading text-4xl font-medium tracking-[-0.025em] text-foreground sm:text-6xl">Một hành trình có chủ đích</h2>
          <p className="mt-5 max-w-[58ch] text-sm leading-7 text-muted-foreground">Mỗi bước đều tôn trọng vật liệu nguyên bản và hướng đến một vòng đời sử dụng nhẹ nhàng hơn với môi trường.</p>
        </MotionReveal>

        <div className="mt-10 grid gap-10 md:grid-cols-3 md:gap-5">
          {materialJourney.map((item, index) => (
            <MotionReveal key={item.title} delay={index * 0.06}>
              <div className="group overflow-hidden bg-secondary">
                <img src={item.image} alt={item.title} className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]" loading="lazy" />
              </div>
              <div className="mt-5 border-t border-border pt-5">
                <h3 className="font-heading text-2xl font-medium text-foreground">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.text}</p>
              </div>
            </MotionReveal>
          ))}
        </div>
      </div>
    </section>

    <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-14">
      <div className="mx-auto max-w-[1400px]">
        <MotionReveal className="max-w-[760px]">
          <h2 className="font-heading text-4xl font-medium leading-tight tracking-[-0.025em] text-foreground sm:text-6xl">B-ECO trong từng hình hài</h2>
          <p className="mt-5 max-w-[62ch] text-sm leading-7 text-muted-foreground sm:text-base">
            Từ sản phẩm dùng hằng ngày đến quà tặng, khắc logo và đồ mỹ nghệ, mỗi thiết kế đều bắt đầu từ vẻ đẹp của lá.
          </p>
        </MotionReveal>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-12 lg:grid-rows-[310px_310px]">
          <MotionReveal className="group lg:col-span-7 lg:row-span-2">
            <div className="h-full min-h-[420px] overflow-hidden bg-secondary lg:min-h-0">
              <img src={leafVariety} alt="Các mẫu đĩa và chén lá bàng biển B-ECO" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]" loading="lazy" />
            </div>
            <p className="mt-3 font-heading text-xl font-medium text-foreground">Sản phẩm sinh học cho đời sống</p>
          </MotionReveal>

          <MotionReveal className="group lg:col-span-5" delay={0.06}>
            <div className="h-[310px] overflow-hidden bg-secondary">
              <img src={artDecor} alt="Bộ sản phẩm mỹ nghệ từ lá bàng biển B-ECO" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]" loading="lazy" />
            </div>
            <p className="mt-3 font-heading text-xl font-medium text-foreground">B-ECO Art và sản phẩm mỹ nghệ</p>
          </MotionReveal>

          <MotionReveal className="group lg:col-span-5" delay={0.12}>
            <div className="h-[310px] overflow-hidden bg-secondary">
              <img src={artClock} alt="Đồng hồ thủ công từ lá bàng biển B-ECO" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]" loading="lazy" />
            </div>
            <p className="mt-3 font-heading text-xl font-medium text-foreground">Quà tặng mang dấu ấn tự nhiên</p>
          </MotionReveal>
        </div>

        <MotionReveal className="mt-20 border-t border-border pt-10">
          <div className="max-w-[680px]">
            <h3 className="font-heading text-3xl font-medium text-foreground sm:text-4xl">Dấu ấn riêng cho doanh nghiệp</h3>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">Logo và hình ảnh có thể được khắc trực tiếp trên bề mặt lá, tạo nên sản phẩm nhận diện khác biệt.</p>
          </div>
          <div className="mt-9 grid gap-5 sm:grid-cols-3">
            {[
              [customLogoBeco, 'Mẫu khắc logo B-ECO trên đĩa lá'],
              [customLogoNtt, 'Mẫu khắc logo Nguyễn Tất Thành trên đĩa lá'],
              [customLogoVanHien, 'Mẫu khắc logo Đại học Văn Hiến trên đĩa lá'],
            ].map(([image, alt], index) => (
              <MotionReveal key={alt} className="group overflow-hidden bg-secondary" delay={index * 0.05}>
                <img src={image} alt={alt} className="aspect-[4/3] h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]" loading="lazy" />
              </MotionReveal>
            ))}
          </div>
        </MotionReveal>
      </div>
    </section>

    <section className="border-t border-border px-5 py-20 sm:px-8 sm:py-28 lg:px-14">
      <div className="mx-auto grid max-w-[1400px] bg-secondary lg:grid-cols-[0.95fr_1.05fr]">
        <MotionReveal className="flex items-center px-7 py-14 sm:px-12 lg:px-20 lg:py-20">
          <div className="max-w-xl">
            <h2 className="font-heading text-4xl font-medium leading-tight tracking-[-0.025em] text-foreground sm:text-6xl">Cùng B-ECO gieo mầm xanh</h2>
            <p className="mt-6 max-w-[54ch] text-sm leading-7 text-muted-foreground sm:text-base">
              Một lựa chọn nhỏ có thể mở ra giá trị lớn cho môi trường, người làm nghề và câu chuyện của quê hương Phú Yên.
            </p>
            <Link
              to="/contact"
              className="mt-8 inline-flex h-12 items-center gap-2 border border-primary bg-primary px-7 text-xs font-bold uppercase tracking-[0.1em] text-primary-foreground transition-[transform,background-color] hover:-translate-y-0.5 hover:bg-primary/90 active:translate-y-px"
            >
              Kết nối với B-ECO <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </MotionReveal>
        <MotionReveal delay={0.08}>
          <img src={leafCloseup} alt="Cận cảnh sản phẩm đĩa lá bàng biển B-ECO" className="h-full min-h-[430px] w-full object-cover" loading="lazy" />
        </MotionReveal>
      </div>
    </section>
  </Layout>
);

export default About;

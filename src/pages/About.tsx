import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Recycle, Users } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import anh1 from '@/assets/products/anh1.jpg';
import collectionDisplay from '@/assets/products/collection-display-1.jpg';
import leafCloseup from '@/assets/products/leaf-plates-closeup.jpg';

const About = () => (
  <Layout>
    <section className="px-4 pb-14 pt-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1400px] overflow-hidden rounded-2xl border border-border bg-card lg:grid-cols-2">
        <div className="flex items-center p-7 sm:p-12 lg:p-16">
          <div className="max-w-xl">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.16em] text-primary">Về B-ECO</p>
            <h1 className="text-4xl font-extrabold leading-[1.06] tracking-[-0.05em] text-foreground sm:text-6xl">Sinh thái bắt đầu từ điều đang có.</h1>
            <p className="mt-6 text-base leading-7 text-muted-foreground sm:text-lg">B-ECO biến lá bàng biển rụng thành sản phẩm hữu ích, giàu thẩm mỹ và giá trị địa phương.</p>
          </div>
        </div>
        <img src={anh1} alt="Bờ biển Phú Yên, nơi B-ECO khởi nguồn" className="min-h-[360px] h-full w-full object-cover" />
      </div>
    </section>

    <section className="px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto grid max-w-[1400px] gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <img src={collectionDisplay} alt="Sản phẩm lá bàng biển B-ECO được trưng bày" className="aspect-[4/3] w-full rounded-2xl object-cover" loading="lazy" />
        <div className="lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-[-0.04em] text-foreground sm:text-5xl">Khởi nguồn tại Phú Yên</h2>
          <p className="mt-6 leading-7 text-muted-foreground">B-ECO nhận ra lá bàng biển rụng không phải phế phẩm. Đó là nguồn vật liệu tự nhiên có thể trở thành đĩa, chén và sản phẩm mỹ nghệ.</p>
          <p className="mt-4 leading-7 text-muted-foreground">Đến năm 2035, B-ECO hướng tới phát triển chuỗi giá trị tuần hoàn tại Việt Nam và từng bước tiếp cận thị trường quốc tế.</p>
        </div>
      </div>
    </section>

    <section className="px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto grid max-w-[1400px] gap-5 md:grid-cols-12">
        <div className="rounded-2xl bg-primary p-8 text-primary-foreground md:col-span-7 sm:p-10">
          <Leaf className="h-7 w-7 text-accent" />
          <h2 className="mt-8 text-3xl font-extrabold tracking-[-0.035em] sm:text-4xl">Sứ mệnh</h2>
          <p className="mt-5 max-w-[62ch] leading-7 text-primary-foreground/76">Tạo ra sản phẩm sinh thái có giá trị sử dụng, thẩm mỹ và văn hóa. Đồng thời giảm rác thải nhựa và lan tỏa lối sống xanh.</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-8 md:col-span-5 sm:p-10">
          <Recycle className="h-7 w-7 text-primary" />
          <h2 className="mt-8 text-3xl font-extrabold tracking-[-0.035em] text-foreground sm:text-4xl">Kinh tế tuần hoàn</h2>
          <p className="mt-5 leading-7 text-muted-foreground">Tận dụng lá rụng, tạo sinh kế địa phương và đưa vật liệu trở lại tự nhiên sau vòng đời sử dụng.</p>
        </div>
        <div className="grid overflow-hidden rounded-2xl border border-border bg-secondary/55 md:col-span-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="p-8 sm:p-10 lg:p-12">
            <Users className="h-7 w-7 text-primary" />
            <h2 className="mt-8 text-3xl font-extrabold tracking-[-0.035em] text-foreground sm:text-4xl">Cùng cộng đồng phát triển</h2>
            <p className="mt-5 leading-7 text-muted-foreground">B-ECO kết nối người thu gom, người làm thủ công, khách hàng và doanh nghiệp trong một lựa chọn tiêu dùng có trách nhiệm.</p>
            <Link to="/contact" className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-primary">Kết nối với B-ECO <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <img src={leafCloseup} alt="Cận cảnh sản phẩm đĩa lá bàng biển" className="h-full min-h-[340px] w-full object-cover" loading="lazy" />
        </div>
      </div>
    </section>

    <section className="px-4 pb-20 sm:px-6 sm:pb-24 lg:px-8">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 overflow-hidden rounded-2xl border border-border bg-card sm:grid-cols-3">
        {[
          ['100%', 'vật liệu tự nhiên'],
          ['45 ngày', 'phân hủy sinh học'],
          ['0%', 'hóa chất độc hại'],
        ].map(([value, label], index) => (
          <div key={label} className={`p-8 sm:p-10 ${index ? 'border-t border-border sm:border-l sm:border-t-0' : ''}`}>
            <strong className="text-4xl font-extrabold tracking-[-0.04em] text-primary">{value}</strong>
            <p className="mt-3 text-sm text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>
    </section>
  </Layout>
);

export default About;

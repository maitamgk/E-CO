import { useState } from 'react';
import { CheckCircle, Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import zaloCard from '@/assets/contact/zalo-card.png';
import collectionDisplay from '@/assets/products/collection-display-1.jpg';

const ZALO_URL = 'https://zalo.me/0382548419';

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm(current => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => window.setTimeout(resolve, 900));
    setIsSubmitting(false);
    setIsSubmitted(true);
    toast({ title: 'Đã gửi yêu cầu', description: 'B-ECO sẽ liên hệ lại với bạn sớm nhất.' });
  };

  return (
    <Layout>
      <section className="px-4 pb-12 pt-6 sm:px-6 sm:pb-16 lg:px-8">
        <div className="mx-auto grid max-w-[1400px] overflow-hidden rounded-2xl border border-border bg-card lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex items-center p-8 sm:p-12 lg:p-14">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-extrabold tracking-[-0.05em] text-foreground sm:text-6xl">Cùng B-ECO tạo lựa chọn xanh.</h1>
              <p className="mt-5 max-w-[56ch] text-base leading-7 text-muted-foreground sm:text-lg">Gửi nhu cầu mua lẻ, phân phối, khắc logo hoặc quà tặng doanh nghiệp.</p>
            </div>
          </div>
          <div className="relative min-h-[320px] bg-secondary">
            <img src={collectionDisplay} alt="Không gian tư vấn và trưng bày sản phẩm B-ECO" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-y-0 left-0 hidden w-24 bg-gradient-to-r from-card to-transparent lg:block" />
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 sm:pb-24 lg:px-8">
        <div className="mx-auto grid max-w-[1400px] gap-6 lg:grid-cols-12">
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-9 lg:col-span-7">
            {isSubmitted ? (
              <div className="flex min-h-[520px] flex-col items-center justify-center text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-primary"><CheckCircle className="h-8 w-8" /></span>
                <h2 className="mt-6 text-3xl font-extrabold tracking-[-0.035em] text-foreground">Cảm ơn bạn đã liên hệ</h2>
                <p className="mt-3 max-w-md leading-7 text-muted-foreground">Thông tin đã được ghi nhận. B-ECO sẽ phản hồi trong thời gian sớm nhất.</p>
                <Button variant="outline" className="mt-7" onClick={() => setIsSubmitted(false)}>Gửi yêu cầu khác</Button>
              </div>
            ) : (
              <>
                <h2 className="text-3xl font-extrabold tracking-[-0.035em] text-foreground">Thông tin của bạn</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">Các trường có dấu * là bắt buộc.</p>
                <form onSubmit={handleSubmit} className="mt-8 grid gap-6 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Họ và tên *</Label>
                    <Input id="name" name="name" value={form.name} onChange={handleChange} placeholder="Nguyễn Văn A" required className="h-12 rounded-xl bg-background" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Số điện thoại *</Label>
                    <Input id="phone" name="phone" value={form.phone} onChange={handleChange} placeholder="09xx xxx xxx" required className="h-12 rounded-xl bg-background" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="email@example.com" required className="h-12 rounded-xl bg-background" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="subject">Nhu cầu</Label>
                    <Input id="subject" name="subject" value={form.subject} onChange={handleChange} placeholder="Mua lẻ, phân phối, khắc logo" className="h-12 rounded-xl bg-background" />
                  </div>
                  <div className="grid gap-2 sm:col-span-2">
                    <Label htmlFor="message">Nội dung *</Label>
                    <Textarea id="message" name="message" value={form.message} onChange={handleChange} placeholder="Cho B-ECO biết sản phẩm và số lượng bạn quan tâm" required rows={6} className="resize-none rounded-xl bg-background" />
                  </div>
                  <div className="sm:col-span-2">
                    <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
                      {isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
                    </Button>
                  </div>
                </form>
              </>
            )}
          </div>

          <aside className="grid gap-6 lg:col-span-5">
            <div className="rounded-2xl bg-primary p-7 text-primary-foreground sm:p-9">
              <h2 className="text-2xl font-extrabold tracking-[-0.03em]">Liên hệ trực tiếp</h2>
              <div className="mt-7 grid gap-5 text-sm">
                <a href="tel:0382548419" className="flex items-start gap-4"><Phone className="mt-0.5 h-5 w-5 text-accent" /><span><strong className="block">0382 548 419</strong><span className="mt-1 block text-primary-foreground/65">Hỗ trợ đặt hàng</span></span></a>
                <a href="mailto:beco.phuyen@gmai.com" className="flex items-start gap-4"><Mail className="mt-0.5 h-5 w-5 text-accent" /><span><strong className="block break-all">beco.phuyen@gmai.com</strong><span className="mt-1 block text-primary-foreground/65">Phản hồi trong 24 giờ</span></span></a>
                <span className="flex items-start gap-4"><MapPin className="mt-0.5 h-5 w-5 text-accent" /><span><strong className="block">Phú Yên, Việt Nam</strong><span className="mt-1 block text-primary-foreground/65">Nơi B-ECO khởi nguồn</span></span></span>
                <span className="flex items-start gap-4"><Clock className="mt-0.5 h-5 w-5 text-accent" /><span><strong className="block">8:00 - 17:00</strong><span className="mt-1 block text-primary-foreground/65">Thứ 2 đến Thứ 7</span></span></span>
              </div>
            </div>

            <a href={ZALO_URL} target="_blank" rel="noreferrer" className="group grid overflow-hidden rounded-2xl border border-border bg-card sm:grid-cols-[0.8fr_1.2fr]">
              <div className="flex flex-col justify-center p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0068ff] text-white"><MessageCircle className="h-5 w-5" /></span>
                <h2 className="mt-5 text-xl font-bold text-foreground">Chat qua Zalo</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">Quét mã hoặc nhấn để mở Zalo B-ECO.</p>
              </div>
              <div className="max-h-72 overflow-hidden bg-secondary/55 p-3">
                <img src={zaloCard} alt="Mã QR Zalo B-ECO" className="h-full w-full rounded-xl object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]" />
              </div>
            </a>
          </aside>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;

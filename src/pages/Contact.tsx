import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
    Phone,
    Mail,
    MapPin,
    Clock,
    Send,
    MessageCircle,
    Loader2,
    CheckCircle,
    Leaf
} from 'lucide-react';
import { ScrollAnimate } from '@/components/ui/scroll-animate';

const Contact = () => {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsSubmitting(false);
        setIsSubmitted(true);
        toast({
            title: 'Gửi thành công!',
            description: 'Chúng tôi sẽ liên hệ lại trong thời gian sớm nhất.',
        });
    };

    const contactInfo = [
        {
            icon: Phone,
            label: 'Hotline',
            value: '0123 456 789',
            href: 'tel:0123456789',
            description: 'Hỗ trợ 24/7',
        },
        {
            icon: Mail,
            label: 'Email',
            value: 'info@b-eco.vn',
            href: 'mailto:info@b-eco.vn',
            description: 'Phản hồi trong 24h',
        },
        {
            icon: MapPin,
            label: 'Địa chỉ',
            value: 'Phú Yên, Việt Nam',
            href: '#',
            description: 'Nhà máy sản xuất',
        },
        {
            icon: Clock,
            label: 'Giờ làm việc',
            value: '8:00 - 17:00',
            href: '#',
            description: 'Thứ 2 - Thứ 7',
        },
    ];

    return (
        <Layout>
            {/* Hero Section */}
            <section className="relative bg-[#fcf9f4] border-b border-border/40 py-16 text-center">
                <div className="container mx-auto px-4 relative z-10">
                    <h1 className="text-3xl md:text-4xl font-heading text-primary mb-4">
                        Liên hệ với chúng tôi
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto font-light">
                        Hãy để lại thông tin, chúng tôi sẽ liên hệ tư vấn cho bạn
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-16">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <ScrollAnimate animation="fade-in-left">
                        <div className="bg-[#fcf9f4] border border-border/40 p-8 rounded-none">
                            <div className="flex items-center gap-3 mb-6">
                                <div>
                                    <h2 className="text-2xl font-heading text-primary">Gửi tin nhắn</h2>
                                    <p className="text-muted-foreground font-light mt-1">Điền thông tin bên dưới</p>
                                </div>
                            </div>

                            {isSubmitted ? (
                                <div className="text-center py-12">
                                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle className="h-10 w-10 text-primary" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">Cảm ơn bạn!</h3>
                                    <p className="text-muted-foreground mb-6">
                                        Chúng tôi đã nhận được tin nhắn và sẽ phản hồi sớm nhất.
                                    </p>
                                    <Button onClick={() => setIsSubmitted(false)}>
                                        Gửi tin nhắn khác
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="name" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Họ và tên *</Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                value={form.name}
                                                onChange={handleChange}
                                                placeholder="Nguyễn Văn A"
                                                required
                                                className="h-12 rounded-none border-t-0 border-x-0 border-b border-border/40 bg-transparent px-0 focus-visible:ring-0 focus-visible:border-primary"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Số điện thoại *</Label>
                                            <Input
                                                id="phone"
                                                name="phone"
                                                value={form.phone}
                                                onChange={handleChange}
                                                placeholder="0901234567"
                                                required
                                                className="h-12 rounded-none border-t-0 border-x-0 border-b border-border/40 bg-transparent px-0 focus-visible:ring-0 focus-visible:border-primary"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2 mt-6">
                                        <Label htmlFor="email" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Email</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            placeholder="email@example.com"
                                            className="h-12 rounded-none border-t-0 border-x-0 border-b border-border/40 bg-transparent px-0 focus-visible:ring-0 focus-visible:border-primary"
                                        />
                                    </div>

                                    <div className="space-y-2 mt-6">
                                        <Label htmlFor="subject" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Chủ đề</Label>
                                        <Input
                                            id="subject"
                                            name="subject"
                                            value={form.subject}
                                            onChange={handleChange}
                                            placeholder="VD: Hỏi về đơn hàng sỉ"
                                            className="h-12 rounded-none border-t-0 border-x-0 border-b border-border/40 bg-transparent px-0 focus-visible:ring-0 focus-visible:border-primary"
                                        />
                                    </div>

                                    <div className="space-y-2 mt-6">
                                        <Label htmlFor="message" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Nội dung *</Label>
                                        <Textarea
                                            id="message"
                                            name="message"
                                            value={form.message}
                                            onChange={handleChange}
                                            placeholder="Nhập nội dung tin nhắn..."
                                            required
                                            rows={5}
                                            className="rounded-none border-t-0 border-x-0 border-b border-border/40 bg-transparent px-0 resize-none focus-visible:ring-0 focus-visible:border-primary"
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="w-full h-12 rounded-none bg-primary mt-8"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Đang gửi...
                                            </>
                                        ) : (
                                            <>
                                                Gửi tin nhắn
                                            </>
                                        )}
                                    </Button>
                                </form>
                            )}
                        </div>
                    </ScrollAnimate>

                    {/* Contact Info */}
                    <ScrollAnimate animation="fade-in-right" delay={200}>
                        <div className="space-y-6">
                            {/* Contact Cards */}
                            <div className="grid sm:grid-cols-2 gap-4">
                                {contactInfo.map((info, idx) => (
                                    <a
                                        key={idx}
                                        href={info.href}
                                        className="group p-6 bg-[#fcf9f4] border border-border/40 rounded-none hover:border-primary/50 transition-colors duration-300"
                                    >
                                        <div className="flex flex-col gap-4">
                                            <info.icon className="h-5 w-5 text-primary/40" />
                                            <div>
                                                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{info.label}</p>
                                                <p className="font-medium text-foreground">{info.value}</p>
                                                <p className="text-xs text-muted-foreground font-light mt-1">{info.description}</p>
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </div>

                            {/* Map or Image */}
                            <div className="relative overflow-hidden rounded-none border border-border/40 h-[300px]">
                                <img
                                    src="https://images.unsplash.com/photo-1542601098-3adb3e4c6df9?w=800&h=400&fit=crop"
                                    alt="B-ECO Location"
                                    className="w-full h-full object-cover object-center"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-primary/10" />
                                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                                    <div>
                                        <p className="font-heading text-lg text-white">B-ECO</p>
                                        <p className="text-sm text-white/80 font-light">Phú Yên, Việt Nam</p>
                                    </div>
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className="p-6 border border-border/40 bg-white">
                                <h3 className="font-heading text-lg mb-4 text-primary">Kết nối với chúng tôi</h3>
                                <div className="flex gap-3">
                                    {['Facebook', 'Instagram', 'Zalo', 'YouTube'].map((social) => (
                                        <a
                                            key={social}
                                            href="#"
                                            className="flex-1 py-3 px-4 bg-[#fcf9f4] border border-border/20 text-center text-sm hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
                                        >
                                            {social}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </ScrollAnimate>
                </div>
            </div>
        </Layout>
    );
};

export default Contact;

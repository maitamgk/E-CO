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
            <section className="relative overflow-hidden py-20 bg-gradient-to-br from-green-950 via-emerald-900 to-teal-950">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&h=600&fit=crop"
                        alt="Contact"
                        className="w-full h-full object-cover object-center opacity-20"
                        loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-green-950/60 via-emerald-900/65 to-teal-950/70" />
                </div>

                {/* Floating orbs */}
                <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-[100px] animate-float" />
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-500/10 rounded-full blur-[100px] animate-float" style={{ animationDelay: '2s' }} />

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <Badge className="mb-6 px-5 py-2.5 bg-emerald-500/20 text-emerald-300 border-emerald-500/40 backdrop-blur-xl rounded-none">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Liên hệ với chúng tôi
                    </Badge>
                    <h1 className="text-6xl lg:text-7xl font-heading font-bold text-white mb-4 drop-shadow-[0_2px_20px_rgba(0,0,0,0.5)]">
                        Liên hệ
                    </h1>
                    <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
                        Hãy để lại thông tin, chúng tôi sẽ liên hệ tư vấn cho bạn
                    </p>
                </div>
            </section>

            <div className="bg-background min-h-screen">
            <div className="container mx-auto px-4 py-16">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <ScrollAnimate animation="fade-in-left">
                        <div className="bg-white border-2 border-border rounded-none p-8 lg:p-12 relative shadow-[8px_8px_0px_0px_rgba(30,51,42,1)]">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 border-l-2 border-b-2 border-border" />
                            <div className="flex items-center gap-4 mb-8 border-b-2 border-border/20 pb-6 relative z-10">
                                <div className="p-4 bg-primary text-white rounded-none shrink-0 shadow-[4px_4px_0px_0px_rgba(45,74,62,1)]">
                                    <Send className="h-6 w-6" />
                                </div>
                                <div>
                                    <h2 className="text-4xl font-heading font-bold text-foreground">Gửi tin nhắn</h2>
                                    <p className="text-gray-500 font-medium tracking-wide mt-1">Điền thông tin bên dưới</p>
                                </div>
                            </div>

                            {isSubmitted ? (
                                <div className="text-center py-12">
                                    <div className="w-20 h-20 bg-primary/10 rounded-none border border-primary/20 flex items-center justify-center mx-auto mb-6">
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
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Họ và tên *</Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                value={form.name}
                                                onChange={handleChange}
                                                placeholder="Nguyễn Văn A"
                                                required
                                                className="h-14 rounded-none border-2 border-border/20 focus-visible:border-border focus-visible:ring-0 bg-background"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Số điện thoại *</Label>
                                            <Input
                                                id="phone"
                                                name="phone"
                                                value={form.phone}
                                                onChange={handleChange}
                                                placeholder="0901234567"
                                                required
                                                className="h-14 rounded-none border-2 border-border/20 focus-visible:border-border focus-visible:ring-0 bg-background"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            placeholder="email@example.com"
                                            className="h-14 rounded-none border-2 border-border/20 focus-visible:border-border focus-visible:ring-0 bg-background"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="subject">Chủ đề</Label>
                                        <Input
                                            id="subject"
                                            name="subject"
                                            value={form.subject}
                                            onChange={handleChange}
                                            placeholder="VD: Hỏi về đơn hàng sỉ"
                                            className="h-14 rounded-none border-2 border-border/20 focus-visible:border-border focus-visible:ring-0 bg-background"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="message">Nội dung *</Label>
                                        <Textarea
                                            id="message"
                                            name="message"
                                            value={form.message}
                                            onChange={handleChange}
                                            placeholder="Nhập nội dung tin nhắn..."
                                            required
                                            rows={5}
                                            className="rounded-none border-2 border-border/20 focus-visible:border-border focus-visible:ring-0 resize-none bg-background"
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="w-full h-14 text-sm font-bold uppercase tracking-widest rounded-none bg-secondary border border-secondary text-white hover:bg-white hover:text-[#2d4a3e] transition-all duration-300"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                                Đang gửi...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="h-5 w-5 mr-2" />
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
                                        className="group p-6 bg-white border-2 border-border rounded-none hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(30,51,42,1)] transition-all duration-300"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="p-4 bg-background text-foreground border border-border/10 rounded-none shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                                                <info.icon className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium tracking-wider uppercase text-gray-500 mb-1">{info.label}</p>
                                                <p className="font-bold text-foreground text-lg">{info.value}</p>
                                                <p className="text-xs text-gray-500 mt-1">{info.description}</p>
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </div>

                            {/* Map or Image */}
                            <div className="relative overflow-hidden rounded-none border-2 border-border h-[300px] shadow-[8px_8px_0px_0px_rgba(30,51,42,1)]">
                                <img
                                    src="https://images.unsplash.com/photo-1542601098-3adb3e4c6df9?w=800&h=400&fit=crop"
                                    alt="B-ECO Location"
                                    className="w-full h-full object-cover object-center"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-primary text-white rounded-none shadow-[2px_2px_0px_0px_rgba(45,74,62,1)]">
                                            <Leaf className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-white text-lg">B-ECO</p>
                                            <p className="text-sm text-gray-200">Phú Yên, Việt Nam</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className="p-6 bg-primary text-white rounded-none border border-secondary shadow-xl">
                                <h3 className="font-heading font-bold text-2xl mb-4">Kết nối với chúng tôi</h3>
                                <div className="flex gap-3">
                                    {['Facebook', 'Instagram', 'Zalo', 'YouTube'].map((social) => (
                                        <a
                                            key={social}
                                            href="#"
                                            className="flex-1 py-3 px-4 bg-white/10 rounded-none text-center font-bold uppercase tracking-wider text-xs hover:bg-white hover:text-foreground transition-all duration-300 hover:-translate-y-1"
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
            </div>
        </Layout>
    );
};

export default Contact;

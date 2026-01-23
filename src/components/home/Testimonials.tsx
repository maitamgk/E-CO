import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { ScrollAnimate } from '@/components/ui/scroll-animate';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Testimonial {
    id: number;
    name: string;
    role: string;
    content: string;
    rating: number;
    avatar: string;
}

const testimonials: Testimonial[] = [
    {
        id: 1,
        name: 'Nguyễn Thị Mai',
        role: 'Chủ quán cafe',
        content: 'Sản phẩm rất đẹp và chất lượng. Khách hàng của tôi rất thích khi được phục vụ trên chén dĩa từ lá bàng. Đây là cách tuyệt vời để góp phần bảo vệ môi trường!',
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    },
    {
        id: 2,
        name: 'Trần Văn Hùng',
        role: 'Giám đốc Resort',
        content: 'Chúng tôi đã chuyển sang sử dụng sản phẩm B-ECO cho toàn bộ nhà hàng. Khách du lịch quốc tế rất ấn tượng với ý tưởng bảo vệ môi trường này.',
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    },
    {
        id: 3,
        name: 'Lê Thị Hương',
        role: 'Tổ chức sự kiện',
        content: 'Đã đặt hơn 5000 sản phẩm cho các sự kiện lớn. Giá cả hợp lý, giao hàng đúng hẹn, sản phẩm đẹp mắt. Sẽ tiếp tục hợp tác lâu dài.',
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    },
    {
        id: 4,
        name: 'Phạm Minh Tuấn',
        role: 'Chủ chuỗi nhà hàng',
        content: 'B-ECO đã giúp nhà hàng của tôi tiết kiệm chi phí và tạo được hình ảnh thương hiệu xanh. Khách hàng đánh giá rất cao điều này.',
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    },
];

export const Testimonials = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    useEffect(() => {
        if (!isAutoPlaying) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [isAutoPlaying]);

    const goToPrev = () => {
        setIsAutoPlaying(false);
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    const goToNext = () => {
        setIsAutoPlaying(false);
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    return (
        <section className="py-24 bg-gradient-to-br from-primary/5 via-background to-accent/5 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[150px]" />
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-accent/10 rounded-full blur-[100px]" />

            <div className="container mx-auto px-4 relative">
                <ScrollAnimate animation="fade-in-up" className="text-center mb-16">
                    <Badge variant="secondary" className="mb-4 px-4 py-2">
                        <Star className="h-4 w-4 mr-2 fill-yellow-400 text-yellow-400" />
                        Đánh giá từ khách hàng
                    </Badge>
                    <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                        Khách hàng nói gì về{' '}
                        <span className="bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">
                            B-ECO
                        </span>
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Hơn 500+ đánh giá 5 sao từ khách hàng tin dùng
                    </p>
                </ScrollAnimate>

                <ScrollAnimate animation="scale-in">
                    <div className="max-w-4xl mx-auto">
                        <div className="relative bg-card rounded-3xl border border-border p-8 lg:p-12 shadow-2xl">
                            {/* Quote icon */}
                            <div className="absolute -top-6 left-8 p-4 bg-primary rounded-2xl shadow-xl shadow-primary/30">
                                <Quote className="h-8 w-8 text-primary-foreground" />
                            </div>

                            {/* Content */}
                            <div className="pt-8">
                                {/* Stars */}
                                <div className="flex gap-1 mb-6">
                                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                                        <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>

                                {/* Quote */}
                                <blockquote className="text-xl lg:text-2xl text-foreground leading-relaxed mb-8 min-h-[120px]">
                                    "{testimonials[currentIndex].content}"
                                </blockquote>

                                {/* Author */}
                                <div className="flex items-center gap-4">
                                    <img
                                        src={testimonials[currentIndex].avatar}
                                        alt={testimonials[currentIndex].name}
                                        className="w-14 h-14 rounded-full object-cover ring-4 ring-primary/20"
                                    />
                                    <div>
                                        <p className="font-bold text-lg text-foreground">
                                            {testimonials[currentIndex].name}
                                        </p>
                                        <p className="text-muted-foreground">
                                            {testimonials[currentIndex].role}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation */}
                            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                                <div className="flex gap-2">
                                    {testimonials.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                setIsAutoPlaying(false);
                                                setCurrentIndex(idx);
                                            }}
                                            className={cn(
                                                "w-3 h-3 rounded-full transition-all duration-300",
                                                idx === currentIndex
                                                    ? "bg-primary w-8"
                                                    : "bg-muted hover:bg-primary/50"
                                            )}
                                        />
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={goToPrev}
                                        className="rounded-xl h-11 w-11"
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={goToNext}
                                        className="rounded-xl h-11 w-11"
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollAnimate>
            </div>
        </section>
    );
};

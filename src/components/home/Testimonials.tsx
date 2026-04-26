import { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Testimonial {
    id: number;
    name: string;
    role: string;
    content: string;
    rating: number;
}

const testimonials: Testimonial[] = [
    {
        id: 1,
        name: 'Nguyễn Thị Mai',
        role: 'Chủ quán cafe',
        content: 'Sản phẩm rất đẹp và chất lượng. Khách hàng của tôi rất thích khi được phục vụ trên chén dĩa từ lá bàng. Đây là cách tuyệt vời để góp phần bảo vệ môi trường!',
        rating: 5,
    },
    {
        id: 2,
        name: 'Trần Văn Hùng',
        role: 'Giám đốc Resort',
        content: 'Chúng tôi đã chuyển sang sử dụng sản phẩm B-ECO cho toàn bộ nhà hàng. Khách du lịch quốc tế rất ấn tượng với ý tưởng bảo vệ môi trường này.',
        rating: 5,
    },
    {
        id: 3,
        name: 'Lê Thị Hương',
        role: 'Tổ chức sự kiện',
        content: 'Đã đặt hơn 5000 sản phẩm cho các sự kiện lớn. Giá cả hợp lý, giao hàng đúng hẹn, sản phẩm đẹp mắt. Sẽ tiếp tục hợp tác lâu dài.',
        rating: 5,
    },
    {
        id: 4,
        name: 'Phạm Minh Tuấn',
        role: 'Chủ chuỗi nhà hàng',
        content: 'B-ECO đã giúp nhà hàng của tôi tiết kiệm chi phí và tạo được hình ảnh thương hiệu xanh. Khách hàng đánh giá rất cao điều này.',
        rating: 5,
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
        <section className="py-24 bg-background border-b border-border">
            <div className="container mx-auto px-6 lg:px-12">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-1 bg-primary/10 text-primary font-bold text-xs uppercase tracking-[0.2em] border border-primary/20 mb-6">
                        <Star className="h-3 w-3 fill-current" />
                        Đánh giá từ khách hàng
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                        Khách hàng nói gì về <span className="text-primary">B-ECO</span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Hơn 500+ đánh giá 5 sao từ khách hàng tin dùng
                    </p>
                </div>

                {/* Testimonial Card */}
                <div className="max-w-4xl mx-auto">
                    <div className="relative border-2 border-border bg-card p-8 lg:p-12">
                        {/* Quote icon */}
                        <div className="absolute -top-6 left-8 p-3 bg-primary text-primary-foreground">
                            <Quote className="h-6 w-6" />
                        </div>

                        {/* Content */}
                        <div className="pt-6">
                            {/* Stars */}
                            <div className="flex gap-1 mb-6">
                                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                                    <Star key={i} className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                                ))}
                            </div>

                            {/* Quote */}
                            <blockquote className="text-xl lg:text-2xl text-foreground leading-relaxed mb-8 min-h-[100px] font-light italic">
                                "{testimonials[currentIndex].content}"
                            </blockquote>

                            {/* Author */}
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                                    {testimonials[currentIndex].name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-foreground">
                                        {testimonials[currentIndex].name}
                                    </p>
                                    <p className="text-sm text-muted-foreground uppercase tracking-wider">
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
                                            "h-2 transition-all duration-300",
                                            idx === currentIndex
                                                ? "bg-primary w-8"
                                                : "bg-muted hover:bg-primary/50 w-2"
                                        )}
                                    />
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={goToPrev}
                                    className="rounded-none h-10 w-10 border-2"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={goToNext}
                                    className="rounded-none h-10 w-10 border-2"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

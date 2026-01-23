import { Product } from '@/types';
import { ProductCard } from './ProductCard';
import { ScrollAnimate } from '@/components/ui/scroll-animate';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';

interface RelatedProductsProps {
    currentProductId: string;
    category: string;
    products: Product[];
}

export const RelatedProducts = ({ currentProductId, category, products }: RelatedProductsProps) => {
    // Filter products: same category, not current product, max 4
    const relatedProducts = products
        .filter(p => p.id !== currentProductId && p.category === category)
        .slice(0, 4);

    // If not enough in same category, fill with other products
    const otherProducts = products
        .filter(p => p.id !== currentProductId && p.category !== category)
        .slice(0, 4 - relatedProducts.length);

    const displayProducts = [...relatedProducts, ...otherProducts].slice(0, 4);

    if (displayProducts.length === 0) return null;

    return (
        <section className="mt-16 pt-16 border-t border-border">
            <ScrollAnimate animation="fade-in-up">
                <div className="flex items-center gap-3 mb-8">
                    <Badge variant="secondary" className="px-4 py-2">
                        <Sparkles className="h-4 w-4 mr-2" />
                        Sản phẩm liên quan
                    </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {displayProducts.map((product, idx) => (
                        <ScrollAnimate key={product.id} animation="fade-in-up" delay={idx * 100}>
                            <ProductCard product={product} />
                        </ScrollAnimate>
                    ))}
                </div>
            </ScrollAnimate>
        </section>
    );
};

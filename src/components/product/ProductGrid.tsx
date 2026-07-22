import { Product } from '@/types';
import { ProductCard } from './ProductCard';
import { ProductCardSkeleton } from '@/components/ui/loading-skeletons';
import { Leaf } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  showWholesale?: boolean;
}

export const ProductGrid = ({ products, isLoading = false, showWholesale = false }: ProductGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} style={{ animationDelay: `${i * 100}ms` }} className="animate-fade-in opacity-0">
            <ProductCardSkeleton />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12 sm:py-16 px-4">
        <Leaf className="mx-auto mb-4 h-12 w-12 text-primary/50" />
        <p className="text-lg sm:text-xl font-medium text-muted-foreground">Không tìm thấy sản phẩm nào.</p>
        <p className="text-sm sm:text-base text-muted-foreground mt-2">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
      {products.map((product, index) => (
        <div 
          key={product.id} 
          className="animate-fade-in-up opacity-0"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <ProductCard product={product} showWholesale={showWholesale} />
        </div>
      ))}
    </div>
  );
};

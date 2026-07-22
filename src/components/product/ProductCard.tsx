import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Eye, Minus, Plus, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { getCategoryName } from '@/data/mockProducts';
import { formatMoney } from '@/utils/money';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  showWholesale?: boolean;
}

export const ProductCard = ({ product, showWholesale = false }: ProductCardProps) => {
  const navigate = useNavigate();
  const { addToCart, items, updateQuantity } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const cartItem = items[product.id];
  const displayPrice = showWholesale ? product.priceWholesale : product.priceRetail;

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product, 1);
    toast.success('Đã thêm sản phẩm vào giỏ', {
      action: { label: 'Xem giỏ hàng', onClick: () => navigate('/cart') },
      duration: 3000,
    });
    window.setTimeout(() => setIsAdding(false), 500);
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[0_12px_32px_rgba(16,63,40,0.06)] transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_22px_48px_rgba(16,63,40,0.12)]">
      <button
        type="button"
        onClick={() => navigate(`/product/${product.id}`)}
        className="relative aspect-[4/3] overflow-hidden bg-secondary/55 text-left"
        aria-label={`Xem ${product.name}`}
      >
        {!imageLoaded && <span className="absolute inset-0 animate-pulse bg-muted" />}
        <img
          src={product.imageUrl}
          alt={product.name}
          className={cn(
            'h-full w-full transition-[opacity,transform] duration-700 group-hover:scale-[1.055]',
            product.category === 'art' ? 'object-contain p-2' : 'object-cover',
            imageLoaded ? 'opacity-100' : 'opacity-0',
          )}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
      </button>

      <div className="relative flex flex-1 flex-col p-5 sm:p-6">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/14 to-transparent" />
        <div className="flex items-center justify-between gap-3 text-xs font-semibold text-muted-foreground">
          <span>{getCategoryName(product.category)}</span>
          <span>{product.sku}</span>
        </div>

        <button type="button" onClick={() => navigate(`/product/${product.id}`)} className="mt-3 text-left">
          <h3 className="text-lg font-bold leading-snug tracking-[-0.02em] text-foreground transition-colors group-hover:text-primary sm:text-xl">
            {product.name}
          </h3>
        </button>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{product.description}</p>

        <div className="mt-5 flex items-end gap-2">
          <strong className="text-2xl font-extrabold tracking-[-0.035em] text-primary">{formatMoney(displayPrice)}</strong>
          <span className="pb-1 text-xs text-muted-foreground">/ {product.salesUnit ?? 'cái'}</span>
        </div>
        {showWholesale && (
          <p className="mt-2 text-xs leading-5 text-muted-foreground">Áp dụng từ {product.wholesaleThresholdLabel ?? `${product.wholesaleMinQty} cái`}</p>
        )}

        <div className="mt-auto pt-5">
          {cartItem ? (
            <div className="flex h-12 items-center justify-between rounded-xl border border-border bg-secondary/55 p-1">
              <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => updateQuantity(product.id, cartItem.qty - 1)} aria-label="Giảm số lượng">
                <Minus className="h-4 w-4" />
              </Button>
              <span className="font-bold text-foreground">{cartItem.qty}</span>
              <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => updateQuantity(product.id, cartItem.qty + 1)} disabled={cartItem.qty >= product.stock} aria-label="Tăng số lượng">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-[1fr_48px] gap-2">
              <Button className="h-12" onClick={handleAddToCart} disabled={product.stock === 0 || isAdding}>
                {isAdding ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
                {isAdding ? 'Đã thêm' : 'Thêm vào giỏ'}
              </Button>
              <Button variant="outline" size="icon" className="h-12 w-12" onClick={() => navigate(`/product/${product.id}`)} aria-label="Xem chi tiết">
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

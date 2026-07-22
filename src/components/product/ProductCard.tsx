import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Minus, Plus, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { Product } from '@/types';
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
    <article className="group flex h-full min-w-0 flex-col">
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <button type="button" onClick={() => navigate(`/product/${product.id}`)} className="absolute inset-0 h-full w-full text-left" aria-label={`Xem ${product.name}`}>
          {!imageLoaded && <span className="absolute inset-0 animate-pulse bg-muted" />}
          <img
            src={product.imageUrl}
            alt={product.name}
            className={cn(
              'h-full w-full transition-[opacity,transform] duration-700 group-hover:scale-[1.04]',
              product.category === 'art' ? 'object-contain p-5' : 'object-cover',
              imageLoaded ? 'opacity-100' : 'opacity-0',
            )}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />
        </button>

        {!cartItem && (
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={product.stock === 0 || isAdding}
            className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center border border-primary bg-card text-primary shadow-[0_8px_22px_rgba(45,39,29,0.12)] transition-[transform,background-color,color] hover:-translate-y-0.5 hover:bg-primary hover:text-primary-foreground active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={`Thêm ${product.name} vào giỏ`}
          >
            {isAdding ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col pt-5">
        <div className="flex items-center justify-between gap-3 text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
          <span>{getCategoryName(product.category)}</span>
          <span>{product.sku}</span>
        </div>

        <button type="button" onClick={() => navigate(`/product/${product.id}`)} className="mt-2 text-left">
          <h3 className="font-heading text-xl font-medium leading-snug text-foreground transition-colors group-hover:text-primary">{product.name}</h3>
        </button>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{product.description}</p>

        <div className="mt-4 flex items-end gap-2 border-t border-border pt-4">
          <strong className="text-base font-bold text-primary">{formatMoney(displayPrice)}</strong>
          <span className="pb-0.5 text-xs text-muted-foreground">/ {product.salesUnit ?? 'cái'}</span>
        </div>
        {showWholesale && <p className="mt-2 text-xs leading-5 text-muted-foreground">Áp dụng từ {product.wholesaleThresholdLabel ?? `${product.wholesaleMinQty} cái`}</p>}

        {cartItem && (
          <div className="mt-4 flex h-11 items-center justify-between border border-border bg-card">
            <button type="button" className="flex h-10 w-10 items-center justify-center text-foreground hover:text-primary" onClick={() => updateQuantity(product.id, cartItem.qty - 1)} aria-label="Giảm số lượng"><Minus className="h-4 w-4" /></button>
            <span className="text-sm font-bold text-foreground">{cartItem.qty}</span>
            <button type="button" className="flex h-10 w-10 items-center justify-center text-foreground hover:text-primary disabled:opacity-40" onClick={() => updateQuantity(product.id, cartItem.qty + 1)} disabled={cartItem.qty >= product.stock} aria-label="Tăng số lượng"><Plus className="h-4 w-4" /></button>
          </div>
        )}
      </div>
    </article>
  );
};

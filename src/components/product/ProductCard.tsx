import { Product } from '@/types';
import { formatMoney } from '@/utils/money';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Plus, Minus, Sparkles, Eye, Heart, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  showWholesale?: boolean;
}

export const ProductCard = ({ product, showWholesale = false }: ProductCardProps) => {
  const navigate = useNavigate();
  const { addToCart, items, updateQuantity } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const cartItem = items[product.id];
  const displayPrice = showWholesale ? product.priceWholesale : product.priceRetail;
  const savingsPercent = showWholesale ? Math.round((1 - product.priceWholesale / product.priceRetail) * 100) : 0;

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product, 1);
    toast.success('Đã thêm sản phẩm vào giỏ', {
      action: {
        label: 'Xem giỏ hàng',
        onClick: () => navigate('/cart')
      },
      duration: 3000
    });
    setTimeout(() => setIsAdding(false), 600);
  };

  return (
    <div className="group relative bg-white border border-border/40 transition-colors duration-300 hover:border-primary/40 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#fcf9f4]">
        {/* Loading shimmer */}
        {!imageLoaded && (
          <div 
            className="absolute inset-0 bg-gradient-to-r from-muted via-muted/50 to-muted animate-shimmer"
            style={{ backgroundSize: '200% 100%' }}
          />
        )}
        
        {/* Product Image */}
        <img
          src={product.imageUrl}
          alt={product.name}
          className={cn(
            "w-full h-full object-cover object-center transition-transform duration-700 ease-out",
            "group-hover:scale-105",
            imageLoaded ? 'opacity-100' : 'opacity-0'
          )}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
        
        {/* Top Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.stock < 50 && product.stock > 0 && (
            <Badge variant="secondary" className="bg-white/90 backdrop-blur-md rounded-none text-[10px] uppercase tracking-widest font-normal">
              Còn {product.stock}
            </Badge>
          )}
          {product.stock === 0 && (
            <Badge variant="destructive" className="rounded-none text-[10px] uppercase tracking-widest font-normal">
              Hết hàng
            </Badge>
          )}
          {showWholesale && savingsPercent > 0 && (
            <Badge className="bg-primary text-primary-foreground rounded-none text-[10px] uppercase tracking-widest font-normal">
              -{savingsPercent}%
            </Badge>
          )}
        </div>

        {/* Action Buttons - Floating */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={cn(
              "p-2 bg-white/90 backdrop-blur-md border border-border/40 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors",
              isLiked ? "text-red-500" : "text-primary"
            )}
          >
            <Heart className={cn("h-4 w-4 stroke-[1.5]", isLiked && "fill-current")} />
          </button>
          <button 
            onClick={() => navigate(`/product/${product.id}`)}
            className="p-2 bg-white/90 backdrop-blur-md border border-border/40 text-primary hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
          >
            <Eye className="h-4 w-4 stroke-[1.5]" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Category tag */}
        <div className="mb-3">
          <span className="text-[10px] uppercase tracking-widest text-primary/60">
            {product.category === 'chen' ? 'Chén' : product.category === 'dia' ? 'Dĩa' : 'Combo'}
          </span>
        </div>

        {/* Title */}
        <h3 
          onClick={() => navigate(`/product/${product.id}`)}
          className="font-heading text-lg sm:text-xl text-primary mb-2 cursor-pointer hover:text-primary/70 transition-colors"
        >
          {product.name}
        </h3>
        
        {/* Description */}
        <p className="text-sm text-muted-foreground font-light line-clamp-2 mb-4 flex-grow">
          {product.description}
        </p>

        {/* Prices */}
        <div className="flex items-end gap-3 mb-4">
          <span className="text-xl font-heading text-primary">
            {formatMoney(displayPrice)}
          </span>
          {showWholesale && (
            <span className="text-sm text-muted-foreground font-light line-through mb-0.5">
              {formatMoney(product.priceRetail)}
            </span>
          )}
        </div>

        {showWholesale && (
          <p className="text-xs text-muted-foreground font-light mb-4">
            Từ {product.wholesaleMinQty} sản phẩm
          </p>
        )}

        {/* Cart Actions */}
        <div className="mt-auto pt-4 border-t border-border/20">
          {cartItem ? (
            <div className="flex items-center justify-between border border-border/40 p-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-none hover:bg-primary/5 text-primary"
                onClick={() => updateQuantity(product.id, cartItem.qty - 1)}
              >
                <Minus className="h-4 w-4 stroke-[1.5]" />
              </Button>
              <span className="font-heading text-lg text-primary px-4">
                {cartItem.qty}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-none hover:bg-primary/5 text-primary"
                onClick={() => updateQuantity(product.id, cartItem.qty + 1)}
                disabled={cartItem.qty >= product.stock}
              >
                <Plus className="h-4 w-4 stroke-[1.5]" />
              </Button>
            </div>
          ) : (
            <Button
              className="w-full h-12 rounded-none bg-primary text-primary-foreground hover:bg-primary/90 text-xs uppercase tracking-widest font-normal transition-colors"
              onClick={handleAddToCart}
              disabled={product.stock === 0 || isAdding}
            >
              {isAdding ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Đã thêm
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 mr-2 stroke-[1.5]" />
                  Thêm vào giỏ
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};


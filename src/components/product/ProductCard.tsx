import { Product } from '@/types';
import { formatMoney } from '@/utils/money';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Plus, Minus, Sparkles, Eye, Heart, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [isLiked, setIsLiked] = useState(false);

  const cartItem = items[product.id];
  const displayPrice = showWholesale ? product.priceWholesale : product.priceRetail;
  const savingsPercent = showWholesale ? Math.round((1 - product.priceWholesale / product.priceRetail) * 100) : 0;

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product, 1);
    setTimeout(() => setIsAdding(false), 600);
  };

  return (
    <div className="group relative">
      {/* 3D Card Container */}
      <div 
        className="relative bg-card rounded-3xl border border-border overflow-hidden transition-all duration-500 ease-out group-hover:shadow-2xl group-hover:shadow-primary/20"
        style={{
          transformStyle: 'preserve-3d',
          transform: 'perspective(1000px)',
        }}
      >
        {/* Animated gradient border */}
        <div className="absolute -inset-[1px] bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-sm" />
        
        {/* 3D Tilt Effect Container */}
        <div className="group-hover:translate-y-[-8px] transition-transform duration-500 ease-out">
          {/* Image Container */}
          <div className="relative aspect-[4/5] overflow-hidden bg-muted">
            {/* Loading shimmer */}
            {!imageLoaded && (
              <div 
                className="absolute inset-0 bg-gradient-to-r from-muted via-muted/50 to-muted animate-shimmer"
                style={{ backgroundSize: '200% 100%' }}
              />
            )}
            
            {/* Product Image with 3D zoom */}
            <img
              src={product.imageUrl}
              alt={product.name}
              className={cn(
                "w-full h-full object-cover object-center transition-all duration-700 ease-out",
                "group-hover:scale-110 group-hover:rotate-1",
                imageLoaded ? 'opacity-100' : 'opacity-0'
              )}
              onLoad={() => setImageLoaded(true)}
              loading="lazy"
            />
            
            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Top Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.stock < 50 && product.stock > 0 && (
                <Badge variant="secondary" className="bg-background/90 backdrop-blur-xl shadow-lg border-0">
                  ⚡ Còn {product.stock}
                </Badge>
              )}
              {product.stock === 0 && (
                <Badge variant="destructive" className="shadow-lg">
                  Hết hàng
                </Badge>
              )}
              {showWholesale && savingsPercent > 0 && (
                <Badge className="bg-gradient-to-r from-primary to-accent-foreground text-primary-foreground shadow-lg border-0">
                  <Sparkles className="h-3 w-3 mr-1" />
                  -{savingsPercent}%
                </Badge>
              )}
            </div>

            {/* Action Buttons - Floating */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={cn(
                  "p-3 rounded-xl backdrop-blur-xl shadow-lg transition-all duration-300 hover:scale-110",
                  isLiked 
                    ? "bg-destructive text-destructive-foreground" 
                    : "bg-background/90 text-foreground hover:bg-background"
                )}
              >
                <Heart className={cn("h-5 w-5", isLiked && "fill-current")} />
              </button>
              <button 
                onClick={() => navigate(`/product/${product.id}`)}
                className="p-3 bg-background/90 rounded-xl backdrop-blur-xl shadow-lg hover:bg-background hover:scale-110 transition-all duration-300"
              >
                <Eye className="h-5 w-5" />
              </button>
            </div>

            {/* Quick Add - Bottom Overlay */}
            {!cartItem && product.stock > 0 && (
              <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                <Button
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className={cn(
                    "w-full h-14 text-base font-semibold rounded-2xl shadow-2xl transition-all duration-300",
                    isAdding 
                      ? "bg-accent-foreground" 
                      : "bg-background/90 backdrop-blur-xl text-foreground hover:bg-background"
                  )}
                >
                  {isAdding ? (
                    <>
                      <Check className="h-5 w-5 mr-2 animate-scale-in" />
                      Đã thêm!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Thêm nhanh
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 sm:p-5 lg:p-6 space-y-3 sm:space-y-4">
            {/* Category tag */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-md">
                {product.category === 'chen' ? 'Chén' : product.category === 'dia' ? 'Dĩa' : 'Combo'}
              </span>
            </div>

            {/* Title - Clickable */}
            <h3 
              onClick={() => navigate(`/product/${product.id}`)}
              className="font-bold text-lg sm:text-xl text-foreground line-clamp-1 group-hover:text-primary transition-colors duration-300 cursor-pointer hover:underline"
            >
              {product.name}
            </h3>
            
            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {product.description}
            </p>

            {/* Prices */}
            <div className="flex items-end gap-2 sm:gap-3">
              <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">
                {formatMoney(displayPrice)}
              </span>
              {showWholesale && (
                <span className="text-sm sm:text-base text-muted-foreground line-through mb-1">
                  {formatMoney(product.priceRetail)}
                </span>
              )}
            </div>

            {showWholesale && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-primary" />
                Từ {product.wholesaleMinQty} sản phẩm
              </p>
            )}

            {/* Cart Actions */}
            {cartItem ? (
              <div className="flex items-center justify-between bg-primary/5 rounded-2xl p-2 border-2 border-primary/20">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-12 w-12 rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-110"
                  onClick={() => updateQuantity(product.id, cartItem.qty - 1)}
                >
                  <Minus className="h-5 w-5" />
                </Button>
                <span className="font-bold text-2xl text-primary min-w-[4rem] text-center">
                  {cartItem.qty}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-12 w-12 rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-110"
                  onClick={() => updateQuantity(product.id, cartItem.qty + 1)}
                  disabled={cartItem.qty >= product.stock}
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <Button
                className="w-full h-12 sm:h-14 text-sm sm:text-base font-semibold rounded-2xl shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 hover:scale-[1.02] transition-all duration-300 group/btn"
                onClick={handleAddToCart}
                disabled={product.stock === 0 || isAdding}
              >
                {isAdding ? (
                  <>
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 mr-2 animate-bounce" />
                    Đã thêm!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 mr-2 group-hover/btn:animate-wiggle" />
                    Thêm vào giỏ hàng
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

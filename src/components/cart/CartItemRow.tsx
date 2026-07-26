import { CartItem } from '@/types';
import { formatMoney, formatNumber } from '@/utils/money';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Minus, TrendingDown } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { TIER_LABELS, lineTotal, pricingSourceFromCartItem, shortUnit } from '@/utils/pricing';
import { cn } from '@/lib/utils';

interface CartItemRowProps {
  item: CartItem;
}

export const CartItemRow = ({ item }: CartItemRowProps) => {
  const { updateQuantity, removeFromCart, getTier } = useCart();

  const tierInfo = getTier(item.productId);
  const unit = item.salesUnitSnapshot ?? 'sản phẩm';
  const qtyUnit = shortUnit(item.salesUnitSnapshot);
  const retailPrice = item.priceRetail ?? item.priceSnapshot;
  const hasDiscount = tierInfo ? tierInfo.unitPrice < retailPrice : false;
  const total = lineTotal(pricingSourceFromCartItem(item), item.qty);

  return (
    <div className="flex gap-4 py-4 border-b border-border">
      {/* Image */}
      <div className="w-20 h-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
        <img
          src={item.imageUrlSnapshot}
          alt={item.nameSnapshot}
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-foreground truncate">{item.nameSnapshot}</h4>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
          <span className={cn('text-muted-foreground', hasDiscount && 'text-primary font-medium')}>
            {formatMoney(tierInfo?.unitPrice ?? item.priceSnapshot)} / {unit}
          </span>
          {hasDiscount && (
            <span className="text-xs text-muted-foreground line-through">{formatMoney(retailPrice)}</span>
          )}
          {tierInfo && tierInfo.tier !== 'retail' && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
              {TIER_LABELS[tierInfo.tier]}
            </span>
          )}
        </div>

        {/* Gợi ý lên bậc giá tiếp theo */}
        {tierInfo?.nextTier && tierInfo.nextTier.qtyNeeded > 0 && (
          <p className="mt-1.5 flex items-start gap-1.5 text-xs leading-5 text-emerald-700 dark:text-emerald-400">
            <TrendingDown className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
            <span>
              Mua thêm <strong>{formatNumber(tierInfo.nextTier.qtyNeeded)} {qtyUnit}</strong> để được{' '}
              {TIER_LABELS[tierInfo.nextTier.tier].toLowerCase()}{' '}
              <strong>{formatMoney(tierInfo.nextTier.unitPrice)}</strong>/{unit}
            </span>
          </p>
        )}

        {/* Quantity Controls */}
        <div className="flex items-center gap-2 mt-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => updateQuantity(item.productId, item.qty - 1)}
            aria-label={`Giảm số lượng ${item.nameSnapshot}`}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-12 text-center font-medium">{item.qty}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => updateQuantity(item.productId, item.qty + 1)}
            aria-label={`Tăng số lượng ${item.nameSnapshot}`}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Total + Remove */}
      <div className="flex flex-col items-end justify-between">
        <span className="font-semibold text-primary">{formatMoney(total)}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive"
          onClick={() => removeFromCart(item.productId)}
          aria-label={`Xóa ${item.nameSnapshot} khỏi giỏ`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

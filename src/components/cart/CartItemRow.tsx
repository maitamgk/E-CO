import { CartItem } from '@/types';
import { formatMoney } from '@/utils/money';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface CartItemRowProps {
  item: CartItem;
}

export const CartItemRow = ({ item }: CartItemRowProps) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex gap-4 py-4 border-b border-border">
      {/* Image */}
      <div className="w-20 h-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
        <img
          src={item.imageUrlSnapshot}
          alt={item.nameSnapshot}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-foreground truncate">{item.nameSnapshot}</h4>
        <p className="text-sm text-muted-foreground">
          {formatMoney(item.priceSnapshot)} / sản phẩm
        </p>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2 mt-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => updateQuantity(item.productId, item.qty - 1)}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-12 text-center font-medium">{item.qty}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => updateQuantity(item.productId, item.qty + 1)}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Total + Remove */}
      <div className="flex flex-col items-end justify-between">
        <span className="font-semibold text-primary">
          {formatMoney(item.priceSnapshot * item.qty)}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive"
          onClick={() => removeFromCart(item.productId)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

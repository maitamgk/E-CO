import { formatMoney } from '@/utils/money';
import { useCart } from '@/context/CartContext';
import { Badge } from '@/components/ui/badge';
import { Percent } from 'lucide-react';

interface CartSummaryProps {
  discountRate?: number;
  discountAmount?: number;
  total?: number;
}

export const CartSummary = ({ discountRate = 0, discountAmount = 0, total }: CartSummaryProps) => {
  const { getSubtotal, getTotalQty } = useCart();
  
  const subtotal = getSubtotal();
  const totalQty = getTotalQty();
  const finalTotal = total ?? subtotal - discountAmount;

  const qualifiesForDiscount = totalQty >= 1000;

  return (
    <div className="bg-muted/50 rounded-lg p-4 space-y-3">
      {/* Discount Info */}
      {!qualifiesForDiscount && totalQty > 0 && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-primary/10 p-3 rounded-md">
          <Percent className="h-4 w-4 text-primary" />
          <span>
            Thêm <strong>{1000 - totalQty}</strong> sản phẩm để được giảm <strong>10%</strong>
          </span>
        </div>
      )}

      {qualifiesForDiscount && (
        <div className="flex items-center gap-2">
          <Badge variant="default" className="bg-primary">
            <Percent className="h-3 w-3 mr-1" />
            Giảm 10%
          </Badge>
          <span className="text-sm text-muted-foreground">
            Đơn hàng từ 1000 sản phẩm
          </span>
        </div>
      )}

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Số lượng:</span>
          <span className="font-medium">{totalQty} sản phẩm</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tạm tính:</span>
          <span className="font-medium">{formatMoney(subtotal)}</span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between text-primary">
            <span>Giảm giá ({discountRate * 100}%):</span>
            <span>-{formatMoney(discountAmount)}</span>
          </div>
        )}
      </div>

      <div className="border-t border-border pt-3">
        <div className="flex justify-between">
          <span className="font-semibold">Tổng cộng:</span>
          <span className="text-xl font-bold text-primary">{formatMoney(finalTotal)}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          * Giá cuối cùng sẽ được tính khi thanh toán
        </p>
      </div>
    </div>
  );
};

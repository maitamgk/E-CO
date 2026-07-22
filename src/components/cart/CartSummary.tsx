import { formatMoney } from '@/utils/money';
import { useCart } from '@/context/CartContext';

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

  return (
    <div className="bg-muted/50 rounded-lg p-4 space-y-3">
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Số lượng:</span>
          <span className="font-medium">{totalQty} đơn vị bán</span>
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
          * Giá phân phối và giá doanh nghiệp được xác nhận theo điều kiện của từng mã sản phẩm
        </p>
      </div>
    </div>
  );
};

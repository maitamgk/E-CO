import { formatMoney } from '@/utils/money';
import { useCart } from '@/context/CartContext';

export const CartSummary = () => {
  const { totals } = useCart();
  const hasDiscount = totals.discountAmount > 0;

  return (
    <div className="bg-muted/50 rounded-lg p-4 space-y-3">
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Số lượng:</span>
          <span className="font-medium">{totals.totalQty} đơn vị bán</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tạm tính (giá lẻ):</span>
          <span className={hasDiscount ? 'text-muted-foreground line-through' : 'font-medium'}>
            {formatMoney(totals.retailSubtotal)}
          </span>
        </div>
        {hasDiscount && (
          <div className="flex justify-between text-primary">
            <span>Ưu đãi số lượng ({Math.round(totals.discountRate * 100)}%):</span>
            <span className="font-medium">-{formatMoney(totals.discountAmount)}</span>
          </div>
        )}
      </div>

      <div className="border-t border-border pt-3">
        <div className="flex justify-between">
          <span className="font-semibold">Tổng cộng:</span>
          <span className="text-xl font-bold text-primary">{formatMoney(totals.total)}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {hasDiscount
            ? 'Đã áp dụng bậc giá theo số lượng. Phí vận chuyển báo riêng.'
            : 'Giá sỉ và giá doanh nghiệp được áp tự động khi đủ số lượng.'}
        </p>
      </div>
    </div>
  );
};

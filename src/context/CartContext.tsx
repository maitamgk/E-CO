import { createContext, useContext, useState, useCallback, useEffect, useMemo, ReactNode } from 'react';
import { CartItem, PriceTierInfo, Product } from '@/types';
import {
  CartTotals,
  calculateCartTotals,
  pricingSourceFromCartItem,
  resolveTier,
} from '@/utils/pricing';

interface CartContextType {
  items: Record<string, CartItem>;
  itemCount: number;
  addToCart: (product: Product, qty?: number) => void;
  updateQuantity: (productId: string, qty: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getTotalQty: () => number;
  /** Toàn bộ số liệu tiền của giỏ hàng, đã áp bậc giá sỉ/doanh nghiệp. */
  totals: CartTotals;
  /** Bậc giá đang áp dụng cho một dòng hàng, kèm gợi ý bậc kế tiếp. */
  getTier: (productId: string) => PriceTierInfo | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'bco_cart';

/** Đồng bộ lại priceSnapshot/tierSnapshot theo số lượng hiện tại của dòng hàng. */
const withResolvedPrice = (item: CartItem): CartItem => {
  const { tier, unitPrice } = resolveTier(pricingSourceFromCartItem(item), item.qty);
  return { ...item, priceSnapshot: unitPrice, tierSnapshot: tier };
};

const readStoredCart = (): Record<string, CartItem> => {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    if (!saved) return {};
    const parsed: unknown = JSON.parse(saved);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};

    // Tính lại đơn giá ngay khi khôi phục: giỏ hàng lưu trong localStorage có
    // thể mang priceSnapshot cũ (giỏ từ phiên bản trước, hoặc bảng giá đã đổi).
    // Nếu không tính lại, đơn giá sai đó sẽ được ghi thẳng vào đơn hàng.
    return Object.fromEntries(
      Object.entries(parsed as Record<string, CartItem>)
        .filter(([, item]) => item && typeof item.qty === 'number' && item.qty > 0)
        .map(([id, item]) => [id, withResolvedPrice(item)]),
    );
  } catch {
    // Giỏ hàng hỏng thì bỏ qua, không để người dùng kẹt ở màn hình trắng.
    return {};
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<Record<string, CartItem>>(readStoredCart);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Hết quota hoặc chế độ riêng tư — giỏ hàng vẫn chạy trong phiên hiện tại.
    }
  }, [items]);

  const itemCount = useMemo(
    () => Object.values(items).reduce((sum, item) => sum + item.qty, 0),
    [items],
  );

  const totals = useMemo(() => calculateCartTotals(Object.values(items)), [items]);

  const addToCart = useCallback((product: Product, qty: number = 1) => {
    setItems(prev => {
      const existing = prev[product.id];
      const requestedQty = (existing ? existing.qty : 0) + qty;
      const nextQty = Math.max(1, Math.min(requestedQty, product.stock));

      return {
        ...prev,
        [product.id]: withResolvedPrice({
          productId: product.id,
          nameSnapshot: product.name,
          priceSnapshot: product.priceRetail,
          imageUrlSnapshot: product.imageUrl,
          salesUnitSnapshot: product.salesUnit,
          priceRetail: product.priceRetail,
          priceWholesale: product.priceWholesale,
          priceEnterprise: product.priceEnterprise,
          wholesaleMinQty: product.wholesaleMinQty,
          enterpriseMinQty: product.enterpriseMinQty,
          qty: nextQty,
        }),
      };
    });
  }, []);

  const updateQuantity = useCallback((productId: string, qty: number) => {
    setItems(prev => {
      const existing = prev[productId];
      if (!existing) return prev;

      if (qty <= 0) {
        const { [productId]: _removed, ...rest } = prev;
        return rest;
      }

      // Đơn giá phải tính lại theo số lượng mới, nếu không khách mua đủ số
      // lượng sỉ vẫn bị tính giá lẻ.
      return { ...prev, [productId]: withResolvedPrice({ ...existing, qty }) };
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setItems(prev => {
      const { [productId]: _removed, ...rest } = prev;
      return rest;
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems({});
  }, []);

  const getSubtotal = useCallback(() => totals.subtotal, [totals]);

  const getTotalQty = useCallback(() => totals.totalQty, [totals]);

  const getTier = useCallback(
    (productId: string): PriceTierInfo | null => {
      const item = items[productId];
      if (!item) return null;
      return resolveTier(pricingSourceFromCartItem(item), item.qty);
    },
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      itemCount,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      getSubtotal,
      getTotalQty,
      totals,
      getTier,
    }),
    [items, itemCount, addToCart, updateQuantity, removeFromCart, clearCart, getSubtotal, getTotalQty, totals, getTier],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

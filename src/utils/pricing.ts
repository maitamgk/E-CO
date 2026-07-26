import { CartItem, PriceTier, PriceTierInfo, Product } from '@/types';

/**
 * Bảng giá B-ECO có 3 bậc: lẻ → sỉ → doanh nghiệp.
 *
 * - Ngưỡng sỉ (`wholesaleMinQty`) tính theo ĐƠN VỊ BÁN của sản phẩm
 *   (ví dụ "gói 10 cái" thì 100 nghĩa là 100 gói).
 * - Ngưỡng doanh nghiệp (`enterpriseMinQty`) chỉ áp dụng tự động cho những
 *   sản phẩm có công bố ngưỡng rõ ràng. Sản phẩm không khai báo ngưỡng thì
 *   giá doanh nghiệp vẫn hiển thị nhưng phải liên hệ để chốt, hệ thống
 *   không tự hạ giá.
 */

/**
 * Dạng rút gọn của đơn vị bán để ghép với số lượng.
 * "gói 10 cái" → "gói", nên đọc là "từ 100 gói" thay vì "từ 100 gói 10 cái".
 */
export const shortUnit = (salesUnit?: string): string =>
  (salesUnit ?? 'cái').trim().split(/\s+/)[0];

export const TIER_LABELS: Record<PriceTier, string> = {
  retail: 'Giá lẻ',
  wholesale: 'Giá sỉ',
  enterprise: 'Giá doanh nghiệp',
};

/** Phần dữ liệu giá tối thiểu để tính được đơn giá — dùng chung cho Product và CartItem. */
export interface PricingSource {
  priceRetail: number;
  priceWholesale: number;
  priceEnterprise?: number;
  wholesaleMinQty: number;
  enterpriseMinQty?: number;
}

const normalizeQty = (qty: number): number =>
  Number.isFinite(qty) && qty > 0 ? Math.floor(qty) : 0;

/** Đơn giá áp dụng cho một số lượng cụ thể. */
export const resolveUnitPrice = (source: PricingSource, qty: number): number =>
  resolveTier(source, qty).unitPrice;

/** Bậc giá đang áp dụng + gợi ý bậc kế tiếp để khách biết cần mua thêm bao nhiêu. */
export const resolveTier = (source: PricingSource, qty: number): PriceTierInfo => {
  const quantity = normalizeQty(qty);
  const { priceRetail, priceWholesale, priceEnterprise, wholesaleMinQty, enterpriseMinQty } = source;

  const hasEnterpriseTier =
    typeof priceEnterprise === 'number' &&
    typeof enterpriseMinQty === 'number' &&
    enterpriseMinQty > 0 &&
    priceEnterprise < priceWholesale;

  if (hasEnterpriseTier && quantity >= (enterpriseMinQty as number)) {
    return { tier: 'enterprise', unitPrice: priceEnterprise as number };
  }

  if (wholesaleMinQty > 0 && quantity >= wholesaleMinQty && priceWholesale < priceRetail) {
    return {
      tier: 'wholesale',
      unitPrice: priceWholesale,
      nextTier: hasEnterpriseTier
        ? {
            tier: 'enterprise',
            minQty: enterpriseMinQty as number,
            unitPrice: priceEnterprise as number,
            qtyNeeded: (enterpriseMinQty as number) - quantity,
          }
        : undefined,
    };
  }

  return {
    tier: 'retail',
    unitPrice: priceRetail,
    nextTier:
      wholesaleMinQty > 0 && priceWholesale < priceRetail
        ? {
            tier: 'wholesale',
            minQty: wholesaleMinQty,
            unitPrice: priceWholesale,
            qtyNeeded: wholesaleMinQty - quantity,
          }
        : undefined,
  };
};

/** Số tiền tiết kiệm được so với giá lẻ cho một dòng hàng. */
export const lineSavings = (source: PricingSource, qty: number): number => {
  const quantity = normalizeQty(qty);
  return (source.priceRetail - resolveUnitPrice(source, quantity)) * quantity;
};

/** Thành tiền của một dòng hàng, đã áp bậc giá. */
export const lineTotal = (source: PricingSource, qty: number): number => {
  const quantity = normalizeQty(qty);
  return resolveUnitPrice(source, quantity) * quantity;
};

export interface CartTotals {
  /** Tổng theo giá lẻ, trước khi áp bậc sỉ/doanh nghiệp. */
  retailSubtotal: number;
  /** Tổng đã áp bậc giá — đây là số tiền khách phải trả. */
  subtotal: number;
  discountAmount: number;
  /** Tỉ lệ giảm bình quân (0–1), phục vụ hiển thị và lưu vào đơn hàng. */
  discountRate: number;
  total: number;
  totalQty: number;
}

/** Tổng hợp toàn giỏ hàng. Đây là nguồn sự thật duy nhất cho số tiền hiển thị và ghi vào đơn. */
export const calculateCartTotals = (items: CartItem[]): CartTotals => {
  let retailSubtotal = 0;
  let subtotal = 0;
  let totalQty = 0;

  for (const item of items) {
    const qty = normalizeQty(item.qty);
    const source = pricingSourceFromCartItem(item);
    retailSubtotal += source.priceRetail * qty;
    subtotal += resolveUnitPrice(source, qty) * qty;
    totalQty += qty;
  }

  const discountAmount = retailSubtotal - subtotal;

  return {
    retailSubtotal,
    subtotal,
    discountAmount,
    discountRate: retailSubtotal > 0 ? discountAmount / retailSubtotal : 0,
    total: subtotal,
    totalQty,
  };
};

/**
 * Đọc dữ liệu giá từ một dòng giỏ hàng.
 *
 * Giỏ hàng cũ trong localStorage (trước khi có bậc giá) chỉ có `priceSnapshot`.
 * Khi thiếu dữ liệu bậc giá thì coi như sản phẩm chỉ có một mức giá duy nhất,
 * để giỏ hàng cũ không bị tính sai hay vỡ giao diện.
 */
export const pricingSourceFromCartItem = (item: CartItem): PricingSource => ({
  priceRetail: item.priceRetail ?? item.priceSnapshot,
  priceWholesale: item.priceWholesale ?? item.priceRetail ?? item.priceSnapshot,
  priceEnterprise: item.priceEnterprise,
  wholesaleMinQty: item.wholesaleMinQty ?? 0,
  enterpriseMinQty: item.enterpriseMinQty,
});

export const pricingSourceFromProduct = (product: Product): PricingSource => ({
  priceRetail: product.priceRetail,
  priceWholesale: product.priceWholesale,
  priceEnterprise: product.priceEnterprise,
  wholesaleMinQty: product.wholesaleMinQty,
  enterpriseMinQty: product.enterpriseMinQty,
});

// Product types
export interface Product {
  id: string;
  sku?: string;
  name: string;
  description: string;
  priceRetail: number;
  priceWholesale: number;
  priceEnterprise?: number;
  /** Số lượng tối thiểu (theo đơn vị bán) để được giá sỉ. */
  wholesaleMinQty: number;
  /**
   * Số lượng tối thiểu để được giá doanh nghiệp. Chỉ khai báo cho sản phẩm đã
   * công bố ngưỡng; sản phẩm không có ngưỡng thì giá doanh nghiệp phải liên hệ.
   */
  enterpriseMinQty?: number;
  salesUnit?: string;
  wholesaleThresholdLabel?: string;
  stock: number;
  imageUrl: string;
  category: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Pricing types
export type PriceTier = 'retail' | 'wholesale' | 'enterprise';

export interface NextTierHint {
  tier: PriceTier;
  minQty: number;
  unitPrice: number;
  /** Cần mua thêm bao nhiêu đơn vị nữa để lên bậc này. */
  qtyNeeded: number;
}

export interface PriceTierInfo {
  tier: PriceTier;
  unitPrice: number;
  nextTier?: NextTierHint;
}

// Cart types
export interface CartItem {
  productId: string;
  nameSnapshot: string;
  /** Đơn giá thực tế đang áp dụng, đã tính theo bậc số lượng. */
  priceSnapshot: number;
  imageUrlSnapshot: string;
  salesUnitSnapshot?: string;
  qty: number;
  /**
   * Bảng giá tại thời điểm thêm vào giỏ, để tính lại bậc giá khi khách đổi
   * số lượng mà không cần tra lại catalog. Optional vì giỏ hàng lưu từ
   * phiên bản cũ trong localStorage không có các trường này.
   */
  priceRetail?: number;
  priceWholesale?: number;
  priceEnterprise?: number;
  wholesaleMinQty?: number;
  enterpriseMinQty?: number;
  /** Bậc giá đang áp dụng, ghi lại để đối chiếu khi xử lý đơn. */
  tierSnapshot?: PriceTier;
}

export interface Cart {
  uid: string;
  items: Record<string, CartItem>;
  updatedAt: Date;
}

// Order types
export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentMethod = 'COD' | 'BANK_TRANSFER';
export type PaymentStatus = 'unpaid' | 'deposit_50' | 'paid_100';

export interface OrderCustomer {
  fullName: string;
  phone: string;
  address: string;
}

export interface OrderTotals {
  /** Tổng theo giá lẻ, trước khi áp bậc sỉ/doanh nghiệp. */
  retailSubtotal?: number;
  /** Tổng đã áp bậc giá. */
  subtotal: number;
  discountRate: number;
  discountAmount: number;
  total: number;
  totalQty: number;
}

export interface StatusHistoryEntry {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface Order {
  id: string;
  orderCode: string;
  userId: string;
  customer: OrderCustomer;
  items: CartItem[];
  totals: OrderTotals;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  statusHistory?: StatusHistoryEntry[];
  currentLocation?: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

// User types
export type UserRole = 'admin' | 'user';

export interface User {
  uid: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

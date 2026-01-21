// Product types
export interface Product {
  id: string;
  name: string;
  description: string;
  priceRetail: number;
  priceWholesale: number;
  wholesaleMinQty: number;
  stock: number;
  imageUrl: string;
  category: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Cart types
export interface CartItem {
  productId: string;
  nameSnapshot: string;
  priceSnapshot: number;
  imageUrlSnapshot: string;
  qty: number;
}

export interface Cart {
  uid: string;
  items: Record<string, CartItem>;
  updatedAt: Date;
}

// Order types
export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderCustomer {
  fullName: string;
  phone: string;
  address: string;
}

export interface OrderTotals {
  subtotal: number;
  discountRate: number;
  discountAmount: number;
  total: number;
  totalQty: number;
}

export interface Order {
  id: string;
  orderCode: string;
  userId: string;
  customer: OrderCustomer;
  items: CartItem[];
  totals: OrderTotals;
  paymentMethod: 'COD';
  status: OrderStatus;
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

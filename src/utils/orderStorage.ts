import { Order, OrderStatus } from '@/types';

const STORAGE_KEY = 'beco_orders';

export const mockInitialOrders: Order[] = [
  {
    id: '1',
    orderCode: 'BCO001',
    userId: 'user1',
    customer: { fullName: 'Nguyễn Văn A', phone: '0901234567', address: '123 Đường ABC, TP.HCM' },
    items: [{ productId: '1', nameSnapshot: 'Chén lá bàng tròn 12cm', priceSnapshot: 3500, imageUrlSnapshot: '', qty: 100 }],
    totals: { subtotal: 350000, discountRate: 0, discountAmount: 0, total: 350000, totalQty: 100 },
    paymentMethod: 'COD',
    status: 'shipped',
    notes: '',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-16'),
  },
  {
    id: '2',
    orderCode: 'BCO002',
    userId: 'user2',
    customer: { fullName: 'Trần Thị B', phone: '0987654321', address: '456 Lê Lợi, Hà Nội' },
    items: [{ productId: '8', nameSnapshot: 'Combo tiệc 50 người', priceSnapshot: 450000, imageUrlSnapshot: '', qty: 3 }],
    totals: { subtotal: 1350000, discountRate: 0, discountAmount: 0, total: 1350000, totalQty: 3 },
    paymentMethod: 'COD', // Changed to match type
    status: 'pending',
    notes: 'Giao giờ hành chính',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '3',
    orderCode: 'BCO003',
    userId: 'user3',
    customer: { fullName: 'Lê Văn C', phone: '0912223334', address: '789 Nguyễn Huệ, Đà Nẵng' },
    items: [{ productId: '3', nameSnapshot: 'Khay lá bàng chữ nhật', priceSnapshot: 6000, imageUrlSnapshot: '', qty: 200 }],
    totals: { subtotal: 1200000, discountRate: 0, discountAmount: 0, total: 1200000, totalQty: 200 },
    paymentMethod: 'COD', // Changed to match type
    status: 'delivered',
    notes: '',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-12'),
  }
];

export const orderStorage = {
  getOrders: (): Order[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        orderStorage.saveOrders(mockInitialOrders);
        return mockInitialOrders;
      }
      const parsed = JSON.parse(data);
      return parsed.map((o: Order & { createdAt: string; updatedAt: string }) => ({
        ...o,
        createdAt: new Date(o.createdAt),
        updatedAt: new Date(o.updatedAt)
      }));
    } catch {
      return mockInitialOrders;
    }
  },

  saveOrders: (orders: Order[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  },

  addOrder: (order: Order) => {
    const orders = orderStorage.getOrders();
    orders.unshift(order);
    orderStorage.saveOrders(orders);
  },

  updateOrderStatus: (orderId: string, status: OrderStatus) => {
    const orders = orderStorage.getOrders();
    const index = orders.findIndex(o => o.id === orderId);
    if (index !== -1) {
      orders[index].status = status;
      orders[index].updatedAt = new Date();
      orderStorage.saveOrders(orders);
    }
  }
};

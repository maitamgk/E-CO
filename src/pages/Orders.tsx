import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Order, OrderStatus } from '@/types';
import { cn } from '@/lib/utils';
import { formatMoney } from '@/utils/money';
import { Package, ArrowRight, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import { orderService } from '@/services/orderService';

// Mock orders data
const _mockOrders: Order[] = [
  {
    id: '1',
    orderCode: 'BCO001',
    userId: 'user1',
    customer: {
      fullName: 'Nguyễn Văn A',
      phone: '0901234567',
      address: '123 Đường ABC, Phường XYZ, TP.HCM',
    },
    items: [
      { productId: '1', nameSnapshot: 'Chén lá bàng tròn 12cm', priceSnapshot: 3500, imageUrlSnapshot: '', qty: 100 },
      { productId: '2', nameSnapshot: 'Chén lá bàng tròn 15cm', priceSnapshot: 4500, imageUrlSnapshot: '', qty: 50 },
    ],
    totals: { subtotal: 575000, discountRate: 0, discountAmount: 0, total: 575000, totalQty: 150 },
    paymentMethod: 'COD',
    paymentStatus: 'unpaid',
    status: 'shipped',
    notes: '',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-16'),
  },
  {
    id: '2',
    orderCode: 'BCO002',
    userId: 'user1',
    customer: {
      fullName: 'Nguyễn Văn A',
      phone: '0901234567',
      address: '123 Đường ABC, Phường XYZ, TP.HCM',
    },
    items: [
      { productId: '8', nameSnapshot: 'Combo tiệc 50 người', priceSnapshot: 450000, imageUrlSnapshot: '', qty: 3 },
    ],
    totals: { subtotal: 1350000, discountRate: 0, discountAmount: 0, total: 1350000, totalQty: 3 },
    paymentMethod: 'COD',
    paymentStatus: 'unpaid',
    status: 'pending',
    notes: '',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
];

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: 'Chờ xác nhận', color: 'bg-yellow-500', icon: Clock },
  confirmed: { label: 'Đã xác nhận', color: 'bg-blue-500', icon: CheckCircle },
  shipped: { label: 'Đang giao', color: 'bg-purple-500', icon: Truck },
  delivered: { label: 'Đã giao', color: 'bg-green-500', icon: CheckCircle },
  cancelled: { label: 'Đã hủy', color: 'bg-red-500', icon: XCircle },
};

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const data = await orderService.getOrdersByUser(user.uid);
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Tra cứu đơn hàng</h1>
          <p className="text-muted-foreground mb-6">
            Nhập mã đơn và số điện thoại để theo dõi trạng thái giao hàng
          </p>
          <Link to="/order-lookup">
            <Button className="gap-2">
              Tra cứu ngay
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative bg-background border-b border-border/40 py-16 text-center">
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-3xl md:text-4xl font-heading text-primary mb-4">
            Đơn hàng của tôi
          </h1>
          <p className="text-muted-foreground font-light max-w-2xl mx-auto">
            Theo dõi tình trạng đơn hàng của bạn
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="bg-white border border-border/40 p-6 animate-pulse">
                <div className="h-4 bg-muted w-1/4 mb-4" />
                <div className="h-4 bg-muted w-1/2" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Chưa có đơn hàng nào</h2>
            <p className="text-muted-foreground mb-6">
              Hãy khám phá cửa hàng và đặt hàng đầu tiên của bạn
            </p>
            <Link to="/shop">
              <Button className="gap-2">
                Khám phá cửa hàng
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => {
              const status = statusConfig[order.status];
              return (
                <div key={order.id} className="bg-white border border-border/40 p-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-heading text-lg text-primary">{order.orderCode}</span>
                        <Badge variant="outline" className={cn(status.color, "text-white border-0 rounded-none text-[10px] uppercase tracking-widest font-normal px-2 py-1")}>
                          {status.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground font-light">
                        Ngày đặt: {order.createdAt.toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground font-light mb-1">{order.totals.totalQty} sản phẩm</p>
                      <p className="font-heading text-xl text-primary">
                        {formatMoney(order.totals.total)}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-border/40 pt-4">
                    <div className="space-y-3">
                      {order.items.slice(0, 2).map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-muted-foreground font-light">
                            {item.nameSnapshot} x {item.qty}
                          </span>
                          <span className="font-medium text-primary">{formatMoney(item.priceSnapshot * item.qty)}</span>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <p className="text-sm text-muted-foreground font-light mt-2 pt-2 border-t border-border/20">
                          +{order.items.length - 2} sản phẩm khác
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Orders;

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Order, OrderStatus } from '@/types';
import { formatMoney } from '@/utils/money';
import { Package, ArrowRight, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';

// Mock orders data
const mockOrders: Order[] = [
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
    // Simulate fetching orders
    const fetchOrders = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      setOrders(mockOrders);
      setIsLoading(false);
    };
    fetchOrders();
  }, []);

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Đăng nhập để xem đơn hàng</h1>
          <p className="text-muted-foreground mb-6">
            Vui lòng đăng nhập để theo dõi đơn hàng của bạn
          </p>
          <Link to="/auth">
            <Button className="gap-2">
              Đăng nhập
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
      <div className="relative bg-gradient-to-br from-green-950 via-emerald-900 to-teal-950 text-white overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 opacity-35"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1511497584788-876760111969?w=1920&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-950/60 via-emerald-900/65 to-teal-950/70" />
        
        {/* Glowing Orbs */}
        <div className="absolute top-20 -left-20 w-72 h-72 bg-emerald-500/8 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-teal-500/8 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 py-16 relative">
          <h1 className="text-4xl md:text-5xl font-black italic mb-4 bg-gradient-to-r from-emerald-400 via-green-300 to-teal-400 bg-clip-text text-transparent">
            Đơn hàng của tôi
          </h1>
          <p className="text-emerald-100 text-lg max-w-2xl">
            Theo dõi tình trạng đơn hàng của bạn
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="bg-card border border-border rounded-lg p-6 animate-pulse">
                <div className="h-4 bg-muted rounded w-1/4 mb-4" />
                <div className="h-4 bg-muted rounded w-1/2" />
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
              const StatusIcon = status.icon;
              
              return (
                <div key={order.id} className="bg-card border border-border rounded-lg p-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-lg">{order.orderCode}</span>
                        <Badge className={`${status.color} text-white`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {status.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Ngày đặt: {order.createdAt.toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{order.totals.totalQty} sản phẩm</p>
                      <p className="font-bold text-primary text-lg">
                        {formatMoney(order.totals.total)}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4">
                    <div className="space-y-2">
                      {order.items.slice(0, 2).map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {item.nameSnapshot} x {item.qty}
                          </span>
                          <span>{formatMoney(item.priceSnapshot * item.qty)}</span>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <p className="text-sm text-muted-foreground">
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

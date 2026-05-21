import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/context/AuthContext';
import { Order, OrderStatus } from '@/types';
import { formatMoney } from '@/utils/money';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, CheckCircle, Truck, XCircle, Clock } from 'lucide-react';
import { orderService } from '@/services/orderService';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: 'Chờ xác nhận', color: 'bg-yellow-500', icon: Clock },
  confirmed: { label: 'Đã xác nhận', color: 'bg-blue-500', icon: CheckCircle },
  shipped: { label: 'Đang giao', color: 'bg-purple-500', icon: Truck },
  delivered: { label: 'Đã giao', color: 'bg-green-500', icon: CheckCircle },
  cancelled: { label: 'Đã hủy', color: 'bg-red-500', icon: XCircle },
};

const Admin = () => {
  const { user, isAdmin } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');

  useEffect(() => {
    fetchOrders();

    const subscription = supabase
      .channel('orders-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchOrders();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchOrders = async () => {
    const data = await orderService.getOrders();
    setOrders(data);
  };

  const updateStatus = async (orderId: string, newStatus: OrderStatus) => {
    const success = await orderService.updateOrderStatus(orderId, newStatus);
    if (success) {
      await fetchOrders();
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đơn hàng này? Hành động này không thể hoàn tác.')) {
      const success = await orderService.deleteOrder(orderId);
      if (success) {
        await fetchOrders();
      }
    }
  };

  if (!user || !isAdmin) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="text-3xl font-bold mb-4">Truy cập bị từ chối</h1>
          <p className="text-muted-foreground">Bạn không có quyền quản trị viên để xem trang này.</p>
        </div>
      </Layout>
    );
  }

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <Layout>
      <div className="bg-background min-h-screen pb-20">
        {/* Header Dashboard */}
        <div className="bg-[#fcf9f4] border-b border-border/40 py-12 text-center">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-heading text-primary mb-4">Quản trị viên</h1>
            <p className="text-muted-foreground font-light">Hệ thống quản lý đơn hàng B-ECO</p>
          </div>
        </div>

        <div className="container mx-auto px-6 mt-12">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {[
              { label: 'Tổng đơn hàng', value: orders.length, icon: Package },
              { label: 'Doanh thu dự kiến', value: formatMoney(orders.reduce((acc, o) => acc + o.totals.total, 0)), icon: CheckCircle },
              { label: 'Đơn chờ duyệt', value: orders.filter(o => o.status === 'pending').length, icon: Clock },
              { label: 'Đang giao', value: orders.filter(o => o.status === 'shipped').length, icon: Truck },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white border border-border/40 p-6 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-normal text-muted-foreground uppercase tracking-widest mb-2">{stat.label}</p>
                  <p className="text-2xl font-heading text-primary">{stat.value}</p>
                </div>
                <div className="p-3 bg-[#fcf9f4] border border-border/40">
                  <stat.icon className="w-5 h-5 text-primary stroke-[1.5]" />
                </div>
              </div>
            ))}
          </div>

          {/* Orders Table */}
          <div className="bg-white border border-border/40">
            <div className="p-6 border-b border-border/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#fcf9f4]">
              <h2 className="text-xl font-heading text-primary">Danh sách đơn hàng</h2>
              
              <div className="flex gap-2">
                <select 
                  className="bg-white border border-border/40 px-4 py-2 text-sm outline-none focus:border-primary/40 font-light"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as OrderStatus | 'all')}
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="pending">Chờ xác nhận</option>
                  <option value="confirmed">Đã xác nhận</option>
                  <option value="shipped">Đang giao</option>
                  <option value="delivered">Đã giao</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/40 bg-[#fcf9f4]/50">
                    <th className="p-4 text-[11px] font-normal uppercase tracking-widest text-muted-foreground">Mã đơn</th>
                    <th className="p-4 text-[11px] font-normal uppercase tracking-widest text-muted-foreground">Khách hàng</th>
                    <th className="p-4 text-[11px] font-normal uppercase tracking-widest text-muted-foreground">Ngày đặt</th>
                    <th className="p-4 text-[11px] font-normal uppercase tracking-widest text-muted-foreground">Tổng tiền</th>
                    <th className="p-4 text-[11px] font-normal uppercase tracking-widest text-muted-foreground">Trạng thái</th>
                    <th className="p-4 text-[11px] font-normal uppercase tracking-widest text-muted-foreground text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => {
                    const status = statusConfig[order.status];
                    const StatusIcon = status.icon;
                    return (
                      <tr key={order.id} className="border-b border-border/20 hover:bg-muted/30 transition-colors">
                        <td className="p-4 font-medium text-sm">{order.orderCode}</td>
                        <td className="p-4">
                          <p className="font-medium text-sm">{order.customer.fullName}</p>
                          <p className="text-xs text-muted-foreground font-light">{order.customer.phone}</p>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2 max-w-[250px] font-light">{order.customer.address}</p>
                        </td>
                        <td className="p-4 text-sm font-light text-muted-foreground">{order.createdAt.toLocaleDateString('vi-VN')}</td>
                        <td className="p-4 font-heading text-primary">{formatMoney(order.totals.total)}</td>
                        <td className="p-4">
                          <Badge className={cn(status.color, "text-white rounded-none border-0 text-[10px] uppercase tracking-widest font-normal px-2 py-1")}>
                            {status.label}
                          </Badge>
                        </td>
                        <td className="p-4 text-right flex justify-end gap-2 flex-wrap">
                          {order.status === 'pending' && (
                            <Button 
                              size="sm" 
                              onClick={() => updateStatus(order.id, 'confirmed')}
                              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-none text-[10px] uppercase tracking-widest font-normal px-3"
                            >
                              Xác nhận
                            </Button>
                          )}
                          {order.status === 'confirmed' && (
                            <Button 
                              size="sm" 
                              onClick={() => updateStatus(order.id, 'shipped')}
                              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-none text-[10px] uppercase tracking-widest font-normal px-3"
                            >
                              Giao hàng
                            </Button>
                          )}
                          {order.status === 'shipped' && (
                            <Button 
                              size="sm" 
                              onClick={() => updateStatus(order.id, 'delivered')}
                              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-none text-[10px] uppercase tracking-widest font-normal px-3"
                            >
                              Hoàn tất
                            </Button>
                          )}
                          {(order.status === 'pending' || order.status === 'confirmed') && (
                            <Button 
                              size="sm" variant="outline"
                              onClick={() => updateStatus(order.id, 'cancelled')}
                              className="rounded-none text-[10px] uppercase tracking-widest font-normal px-3"
                            >
                              Hủy
                            </Button>
                          )}
                          <Button 
                            size="sm" variant="ghost"
                            onClick={() => deleteOrder(order.id)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-none text-[10px] uppercase tracking-widest font-normal px-3"
                          >
                            Xóa
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredOrders.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted-foreground font-medium">
                        Không tìm thấy đơn hàng nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Admin;

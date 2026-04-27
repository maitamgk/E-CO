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
        <div className="bg-primary text-primary-foreground py-12 px-6 border-b-2 border-border shadow-hard">
          <div className="container mx-auto">
            <h1 className="text-3xl font-heading font-black tracking-wider uppercase mb-2">Quản trị viên</h1>
            <p className="text-primary-foreground/80">Hệ thống quản lý đơn hàng B-ECO</p>
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
              <div key={idx} className="bg-card border-2 border-border p-6 shadow-hard rounded-none flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">{stat.label}</p>
                  <p className="text-2xl font-black text-foreground">{stat.value}</p>
                </div>
                <div className="bg-background border border-border p-3 rounded-none">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
              </div>
            ))}
          </div>

          {/* Orders Table */}
          <div className="bg-card border-2 border-border shadow-hard rounded-none">
            <div className="p-6 border-b-2 border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-background">
              <h2 className="text-xl font-bold uppercase tracking-wider">Danh sách đơn hàng</h2>
              
              <div className="flex gap-2">
                <select 
                  className="bg-card border-2 border-border px-4 py-2 text-sm font-bold uppercase outline-none focus:border-primary shadow-hard-sm"
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
                  <tr className="border-b-2 border-border bg-background/50">
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Mã đơn</th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Khách hàng</th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Ngày đặt</th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Tổng tiền</th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Trạng thái</th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => {
                    const status = statusConfig[order.status];
                    const StatusIcon = status.icon;
                    return (
                      <tr key={order.id} className="border-b border-border/50 hover:bg-background/80 transition-colors">
                        <td className="p-4 font-bold">{order.orderCode}</td>
                        <td className="p-4">
                          <p className="font-bold">{order.customer.fullName}</p>
                          <p className="text-xs font-semibold text-muted-foreground">{order.customer.phone}</p>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2 max-w-[250px]">{order.customer.address}</p>
                        </td>
                        <td className="p-4 text-sm">{order.createdAt.toLocaleDateString('vi-VN')}</td>
                        <td className="p-4 font-bold text-primary">{formatMoney(order.totals.total)}</td>
                        <td className="p-4">
                          <Badge className={`${status.color} text-white rounded-none border border-border shadow-hard-sm`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {status.label}
                          </Badge>
                        </td>
                        <td className="p-4 text-right flex justify-end gap-2 flex-wrap">
                          {order.status === 'pending' && (
                            <Button 
                              size="sm" 
                              onClick={() => updateStatus(order.id, 'confirmed')}
                              className="bg-blue-500 hover:bg-blue-600 text-white rounded-none border border-border shadow-[2px_2px_0px_0px_rgba(30,51,42,1)] hover:shadow-none hover:translate-y-[2px] hover:translate-x-[2px] text-xs font-bold uppercase px-3"
                            >
                              Xác nhận
                            </Button>
                          )}
                          {order.status === 'confirmed' && (
                            <Button 
                              size="sm" 
                              onClick={() => updateStatus(order.id, 'shipped')}
                              className="bg-purple-500 hover:bg-purple-600 text-white rounded-none border border-border shadow-[2px_2px_0px_0px_rgba(30,51,42,1)] hover:shadow-none hover:translate-y-[2px] hover:translate-x-[2px] text-xs font-bold uppercase px-3"
                            >
                              Giao hàng
                            </Button>
                          )}
                          {order.status === 'shipped' && (
                            <Button 
                              size="sm" 
                              onClick={() => updateStatus(order.id, 'delivered')}
                              className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-none border border-border shadow-[2px_2px_0px_0px_rgba(30,51,42,1)] hover:shadow-none hover:translate-y-[2px] hover:translate-x-[2px] text-xs font-bold uppercase px-3"
                            >
                              Hoàn tất
                            </Button>
                          )}
                          {(order.status === 'pending' || order.status === 'confirmed') && (
                            <Button 
                              size="sm" variant="destructive"
                              onClick={() => updateStatus(order.id, 'cancelled')}
                              className="rounded-none shadow-[2px_2px_0px_0px_rgba(30,51,42,1)] hover:shadow-none hover:translate-y-[2px] hover:translate-x-[2px] text-xs font-bold uppercase px-3"
                            >
                              Hủy
                            </Button>
                          )}
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

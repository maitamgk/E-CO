import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/context/AuthContext';
import { Order, OrderStatus } from '@/types';
import { formatMoney } from '@/utils/money';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Package, CheckCircle, Truck, XCircle, Clock, Send } from 'lucide-react';
import { orderService } from '@/services/orderService';
import { ReviewModeration } from '@/components/admin/ReviewModeration';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Seo } from '@/components/Seo';

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: 'Chờ xác nhận', color: 'bg-yellow-500', icon: Clock },
  confirmed: { label: 'Đã xác nhận', color: 'bg-blue-500', icon: CheckCircle },
  shipped: { label: 'Đang giao', color: 'bg-purple-500', icon: Truck },
  delivered: { label: 'Đã giao', color: 'bg-green-500', icon: CheckCircle },
  cancelled: { label: 'Đã hủy', color: 'bg-red-500', icon: XCircle },
};

const Admin = () => {
  const { user, isAdmin, isLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');
  const [locationInputs, setLocationInputs] = useState<Record<string, string>>({});
  const [updatingId, setUpdatingId] = useState<string | null>(null);

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
    // Initialize location inputs
    const initialInputs: Record<string, string> = {};
    data.forEach(o => {
      initialInputs[o.id] = o.currentLocation || '';
    });
    setLocationInputs(prev => ({ ...initialInputs, ...prev }));
  };

  const updateStatus = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    const customNote = locationInputs[orderId];
    const success = await orderService.updateOrderStatus(orderId, newStatus, customNote);
    if (success) {
      toast.success(`Đã cập nhật trạng thái đơn hàng sang "${statusConfig[newStatus].label}"`);
      await fetchOrders();
    } else {
      toast.error('Cập nhật trạng thái thất bại');
    }
    setUpdatingId(null);
  };

  const handleSaveLocation = async (orderId: string, customText?: string) => {
    const textToSave = customText !== undefined ? customText : locationInputs[orderId];
    if (!textToSave.trim()) {
      toast.error('Vui lòng nhập vị trí/ghi chú giao hàng');
      return;
    }

    setUpdatingId(orderId);
    const success = await orderService.updateOrderLocation(orderId, textToSave.trim());
    if (success) {
      toast.success('Đã cập nhật vị trí hành trình đơn hàng!');
      setLocationInputs(prev => ({ ...prev, [orderId]: textToSave.trim() }));
      await fetchOrders();
    } else {
      toast.error('Lỗi khi cập nhật vị trí');
    }
    setUpdatingId(null);
  };

  const deleteOrder = async (orderId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đơn hàng này? Hành động này không thể hoàn tác.')) {
      const success = await orderService.deleteOrder(orderId);
      if (success) {
        toast.success('Đã xóa đơn hàng');
        await fetchOrders();
      }
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-32 text-center text-muted-foreground">
          Đang tải dữ liệu admin...
        </div>
      </Layout>
    );
  }

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
      <Seo
        title="Quản trị đơn hàng"
        description="Bảng điều khiển quản trị đơn hàng B-ECO."
        noindex
      />
      <div className="bg-background min-h-screen pb-20">
        {/* Header Dashboard */}
        <div className="bg-background border-b border-border/40 py-12 text-center">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-heading text-primary mb-4">Quản trị viên</h1>
            <p className="text-muted-foreground font-light">Hệ thống quản lý & cập nhật vị trí vận chuyển B-ECO</p>
          </div>
        </div>

        <div className="container mx-auto px-6 mt-12">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {[
              { label: 'Tổng đơn hàng', value: orders.length, icon: Package },
              { label: 'Doanh thu dự kiến', value: formatMoney(orders.reduce((acc, o) => acc + o.totals.total, 0)), icon: CheckCircle },
              { label: 'Đơn chờ duyệt', value: orders.filter(o => o.status === 'pending').length, icon: Clock },
              { label: 'Đang giao hàng', value: orders.filter(o => o.status === 'shipped').length, icon: Truck },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white border border-border/40 p-6 flex items-center justify-between shadow-sm">
                <div>
                  <p className="text-[11px] font-normal text-muted-foreground uppercase tracking-widest mb-2">{stat.label}</p>
                  <p className="text-2xl font-heading text-primary font-bold">{stat.value}</p>
                </div>
                <div className="p-3 bg-background border border-border/40">
                  <stat.icon className="w-5 h-5 text-primary stroke-[1.5]" />
                </div>
              </div>
            ))}
          </div>

          {/* Orders Table */}
          <div className="bg-white border border-border/40 shadow-sm rounded-lg overflow-hidden">
            <div className="p-6 border-b border-border/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-background">
              <div>
                <h2 className="text-xl font-heading text-primary font-bold">Danh sách đơn hàng</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Cập nhật vị trí vận chuyển realtime cho khách hàng xem trên bản đồ</p>
              </div>
              
              <div className="flex gap-2">
                <select 
                  className="bg-white border border-border/40 px-4 py-2 text-sm outline-none focus:border-primary/40 font-light rounded-md"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as OrderStatus | 'all')}
                >
                  <option value="all">Tất cả trạng thái ({orders.length})</option>
                  <option value="pending">Chờ xác nhận ({orders.filter(o => o.status === 'pending').length})</option>
                  <option value="confirmed">Đã xác nhận ({orders.filter(o => o.status === 'confirmed').length})</option>
                  <option value="shipped">Đang giao ({orders.filter(o => o.status === 'shipped').length})</option>
                  <option value="delivered">Đã giao ({orders.filter(o => o.status === 'delivered').length})</option>
                  <option value="cancelled">Đã hủy ({orders.filter(o => o.status === 'cancelled').length})</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/40 bg-muted/40">
                    <th className="p-4 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Mã đơn</th>
                    <th className="p-4 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Khách hàng</th>
                    <th className="p-4 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Tổng tiền</th>
                    <th className="p-4 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Trạng thái</th>
                    <th className="p-4 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground min-w-[280px]">Vị trí vận chuyển (Realtime)</th>
                    <th className="p-4 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {filteredOrders.map(order => {
                    const status = statusConfig[order.status];
                    const currentLoc = order.currentLocation || 'Kho B-ECO (Phú Yên)';

                    return (
                      <tr key={order.id} className="hover:bg-muted/20 transition-colors">
                        <td className="p-4 font-mono font-bold text-sm text-primary">
                          {order.orderCode}
                          <span className="block text-[11px] font-sans font-normal text-muted-foreground mt-0.5">
                            {order.createdAt.toLocaleDateString('vi-VN')}
                          </span>
                        </td>
                        <td className="p-4">
                          <p className="font-semibold text-sm">{order.customer.fullName}</p>
                          <p className="text-xs text-muted-foreground font-mono">{order.customer.phone}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 max-w-[220px]" title={order.customer.address}>
                            📍 {order.customer.address}
                          </p>
                        </td>
                        <td className="p-4 font-heading text-primary font-bold">
                          {formatMoney(order.totals.total)}
                          <span className="block text-[11px] font-sans font-normal text-muted-foreground">
                            {order.paymentMethod === 'BANK_TRANSFER' ? '🏦 CK' : '💵 COD'} ({order.paymentStatus})
                          </span>
                        </td>
                        <td className="p-4">
                          <Badge className={cn(status.color, "text-white rounded-md border-0 text-[11px] font-medium px-2.5 py-1 flex items-center gap-1.5 w-fit")}>
                            <status.icon className="w-3.5 h-3.5" />
                            {status.label}
                          </Badge>
                        </td>

                        {/* Location Control Input Area */}
                        <td className="p-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-1.5">
                              <Input
                                type="text"
                                placeholder="VD: Đang tại kho Quy Nhơn..."
                                value={locationInputs[order.id] !== undefined ? locationInputs[order.id] : currentLoc}
                                onChange={(e) => setLocationInputs({ ...locationInputs, [order.id]: e.target.value })}
                                className="h-9 text-xs rounded-md border-border/70 bg-background"
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={updatingId === order.id}
                                onClick={() => handleSaveLocation(order.id)}
                                className="h-9 px-3 text-xs bg-primary/5 hover:bg-primary/10 text-primary border-primary/20 flex-shrink-0"
                                title="Lưu vị trí mới"
                              >
                                <Send className="w-3.5 h-3.5" />
                              </Button>
                            </div>

                            {/* Preset Suggestions */}
                            <div className="flex items-center gap-1 flex-wrap">
                              <span className="text-[10px] text-muted-foreground">Nhanh:</span>
                              {[
                                '📍 Tại Kho B-ECO Phú Yên',
                                '🚚 Đang trên QL1A',
                                '🏢 Đến bưu cục đích',
                                '🛵 Shipper đang giao',
                              ].map((preset) => (
                                <button
                                  key={preset}
                                  type="button"
                                  onClick={() => handleSaveLocation(order.id, preset)}
                                  className="text-[10px] bg-muted/60 hover:bg-primary/10 hover:text-primary border border-border/40 rounded px-1.5 py-0.5 transition-colors"
                                >
                                  {preset}
                                </button>
                              ))}
                            </div>
                          </div>
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-1.5 flex-wrap">
                            {order.status === 'pending' && (
                              <Button 
                                size="sm" 
                                disabled={updatingId === order.id}
                                onClick={() => updateStatus(order.id, 'confirmed')}
                                className="bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs px-3 h-8"
                              >
                                Xác nhận
                              </Button>
                            )}
                            {order.status === 'confirmed' && (
                              <Button 
                                size="sm" 
                                disabled={updatingId === order.id}
                                onClick={() => updateStatus(order.id, 'shipped')}
                                className="bg-purple-600 hover:bg-purple-700 text-white rounded-md text-xs px-3 h-8"
                              >
                                Giao hàng
                              </Button>
                            )}
                            {order.status === 'shipped' && (
                              <Button 
                                size="sm" 
                                disabled={updatingId === order.id}
                                onClick={() => updateStatus(order.id, 'delivered')}
                                className="bg-green-600 hover:bg-green-700 text-white rounded-md text-xs px-3 h-8"
                              >
                                Hoàn tất
                              </Button>
                            )}
                            {(order.status === 'pending' || order.status === 'confirmed') && (
                              <Button 
                                size="sm" variant="outline"
                                disabled={updatingId === order.id}
                                onClick={() => updateStatus(order.id, 'cancelled')}
                                className="rounded-md text-xs px-3 h-8 text-muted-foreground"
                              >
                                Hủy
                              </Button>
                            )}
                            <Button 
                              size="sm" variant="ghost"
                              disabled={updatingId === order.id}
                              onClick={() => deleteOrder(order.id)}
                              className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-md text-xs px-2.5 h-8"
                            >
                              Xóa
                            </Button>
                          </div>
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

          <ReviewModeration />
        </div>
      </div>
    </Layout>
  );
};

export default Admin;

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { ScrollAnimate } from '@/components/ui/scroll-animate';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { orderService } from '@/services/orderService';
import { Order, OrderStatus } from '@/types';
import { formatMoney } from '@/utils/money';
import { supabase } from '@/lib/supabase';
import { 
  Search, Clock, CheckCircle, Truck, Package, XCircle, 
  MapPin, Phone, User, Calendar, CreditCard, ChevronRight, Leaf 
} from 'lucide-react';
import { toast } from 'sonner';

const statusTimeline: { status: OrderStatus; label: string; desc: string; icon: React.ElementType }[] = [
  { status: 'pending', label: 'Chờ xác nhận', desc: 'Đơn hàng đang chờ B-ECO tiếp nhận', icon: Clock },
  { status: 'confirmed', label: 'Đã xác nhận', desc: 'Sản phẩm đang được đóng gói chuẩn bị', icon: CheckCircle },
  { status: 'shipped', label: 'Đang giao hàng', desc: 'Đơn hàng đã bàn giao đơn vị vận chuyển', icon: Truck },
  { status: 'delivered', label: 'Đã giao hàng', desc: 'Đơn hàng đã giao thành công', icon: Package },
];

const OrderLookup = () => {
  const [searchParams] = useSearchParams();
  const [orderCode, setOrderCode] = useState(() => searchParams.get('code') || '');
  const [phone, setPhone] = useState(() => searchParams.get('phone') || '');
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);

  // Real-time subscription to order status updates
  useEffect(() => {
    if (!order) return;

    const channel = supabase
      .channel(`order-lookup-${order.id}`)
      .on(
        'postgres_changes',
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'orders', 
          filter: `id=eq.${order.id}` 
        },
        (payload: any) => {
          const updatedRow = payload.new;
          if (updatedRow) {
            setOrder(prev => prev ? {
              ...prev,
              status: updatedRow.status as OrderStatus,
              updatedAt: new Date(updatedRow.updated_at)
            } : null);
            toast.success(`Đơn hàng của bạn đã cập nhật trạng thái mới!`);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [order?.id]);

  const lookupOrder = async (codeVal: string, phoneVal: string) => {
    if (!codeVal.trim() || !phoneVal.trim()) {
      toast.error('Vui lòng nhập đầy đủ mã đơn hàng và số điện thoại');
      return;
    }

    setIsLoading(true);
    setSearched(true);
    try {
      const foundOrder = await orderService.getOrderByCodeAndPhone(
        codeVal.trim(),
        phoneVal.trim()
      );
      if (foundOrder) {
        setOrder(foundOrder);
        toast.success('Tìm thấy thông tin đơn hàng!');
      } else {
        setOrder(null);
        toast.error('Không tìm thấy đơn hàng. Vui lòng kiểm tra lại thông tin.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Đã xảy ra lỗi khi tra cứu đơn hàng.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const codeParam = searchParams.get('code');
    const phoneParam = searchParams.get('phone');
    if (codeParam && phoneParam) {
      lookupOrder(codeParam, phoneParam);
    }
  }, [searchParams]);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    await lookupOrder(orderCode, phone);
  };

  const getStatusIndex = (currentStatus: OrderStatus) => {
    if (currentStatus === 'cancelled') return -1;
    return statusTimeline.findIndex(step => step.status === currentStatus);
  };

  const currentStatusIndex = order ? getStatusIndex(order.status) : -1;

  return (
    <Layout>
      <div className="bg-background dark:bg-[#242b26] min-h-screen py-16 sm:py-24 font-nunito text-primary">
        <div className="container mx-auto px-4 max-w-4xl">
          
          {/* Header */}
          <div className="text-center max-w-xl mx-auto mb-12">
            <ScrollAnimate animation="fade-in-up">
              <p className="text-[11px] tracking-[0.25em] font-barlow font-bold text-muted-foreground uppercase mb-3">
                TRA CỨU HÀNH TRÌNH
              </p>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-gradient-eco mb-4">
                Theo dõi đơn hàng
              </h1>
              <p className="text-sm text-muted-foreground font-light leading-relaxed">
                Xem trạng thái đóng gói, vận chuyển và chi tiết sản phẩm của bạn theo thời gian thực mà không cần tài khoản đăng nhập.
              </p>
            </ScrollAnimate>
          </div>

          {/* Lookup Card Form */}
          <ScrollAnimate animation="fade-in-up" className="mb-12">
            <div className="bg-white dark:bg-[#2c332d] p-6 sm:p-10 border border-border/10 shadow-sm rounded-2xl">
              <form onSubmit={handleLookup} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                <div className="md:col-span-5 space-y-2">
                  <label className="text-xs font-barlow font-bold uppercase tracking-widest text-primary/80">Mã đơn hàng</label>
                  <Input 
                    type="text" 
                    placeholder="Ví dụ: BCO001" 
                    value={orderCode}
                    onChange={(e) => setOrderCode(e.target.value)}
                    className="h-12 border-border/20 rounded-xl bg-transparent px-4 font-light focus-visible:ring-1 focus-visible:ring-primary/20 outline-none"
                    disabled={isLoading}
                  />
                </div>
                <div className="md:col-span-5 space-y-2">
                  <label className="text-xs font-barlow font-bold uppercase tracking-widest text-primary/80">Số điện thoại mua hàng</label>
                  <Input 
                    type="tel" 
                    placeholder="Số điện thoại nhận hàng" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-12 border-border/20 rounded-xl bg-transparent px-4 font-light focus-visible:ring-1 focus-visible:ring-primary/20 outline-none"
                    disabled={isLoading}
                  />
                </div>
                <div className="md:col-span-2">
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full h-12 bg-gradient-eco text-white hover:bg-gradient-eco-hover font-barlow font-bold tracking-widest text-xs rounded-xl uppercase flex items-center justify-center gap-2 shadow-sm transition-all duration-300"
                  >
                    <Search className="w-4 h-4" />
                    {isLoading ? 'Đang tìm...' : 'Tra cứu'}
                  </Button>
                </div>
              </form>
            </div>
          </ScrollAnimate>

          {/* Results Area */}
          {searched && !isLoading && !order && (
            <ScrollAnimate animation="fade-in-up" className="text-center py-12">
              <div className="w-16 h-16 bg-red-50 dark:bg-red-950/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100 dark:border-red-950">
                <XCircle className="w-8 h-8" />
              </div>
              <h3 className="font-heading text-xl font-bold mb-2">Không tìm thấy đơn hàng</h3>
              <p className="text-sm text-muted-foreground font-light max-w-sm mx-auto">
                Vui lòng kiểm tra lại Mã đơn hàng (ví dụ: BCO001) và Số điện thoại đã đăng ký chính xác lúc đặt hàng.
              </p>
            </ScrollAnimate>
          )}

          {order && (
            <div className="space-y-8">
              
              {/* Order Status Timeline Section */}
              <ScrollAnimate animation="fade-in-up">
                <div className="bg-white dark:bg-[#2c332d] p-6 sm:p-10 border border-border/10 shadow-sm rounded-2xl">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-border/10 pb-6 mb-8 gap-4">
                    <div>
                      <span className="text-[10px] font-barlow font-bold uppercase tracking-widest text-muted-foreground">Mã đơn hàng</span>
                      <h2 className="text-2xl font-heading font-bold text-gradient-eco">{order.orderCode}</h2>
                    </div>
                    <div className="text-right sm:text-right">
                      <span className="text-[10px] font-barlow font-bold uppercase tracking-widest text-muted-foreground block">Cập nhật lúc</span>
                      <span className="text-sm font-light">{order.updatedAt.toLocaleString('vi-VN')}</span>
                    </div>
                  </div>

                  {order.status === 'cancelled' ? (
                    <div className="flex items-center gap-4 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-950 p-6 rounded-2xl">
                      <XCircle className="w-12 h-12 text-red-500 stroke-[1.5] shrink-0" />
                      <div>
                        <h3 className="font-heading text-lg font-bold text-red-600">Đơn hàng đã bị hủy</h3>
                        <p className="text-sm text-muted-foreground font-light">Đơn hàng này đã hủy giao dịch hoặc từ chối phục vụ. Liên hệ hotline để biết thêm chi tiết.</p>
                      </div>
                    </div>
                  ) : (
                    /* Step Timeline visual */
                    <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 pt-4">
                      {statusTimeline.map((step, idx) => {
                        const isCompleted = idx <= currentStatusIndex;
                        const isCurrent = idx === currentStatusIndex;
                        const StepIcon = step.icon;

                        return (
                          <div key={idx} className="relative flex md:flex-col items-center md:text-center group">
                            
                            {/* Horizontal Line for Desktop */}
                            {idx < statusTimeline.length - 1 && (
                              <div className="hidden md:block absolute top-7 left-[calc(50%+1.5rem)] right-[calc(-50%+1.5rem)] h-0.5 bg-border/20 z-0">
                                <div 
                                  className="h-full bg-primary transition-all duration-700" 
                                  style={{ width: idx < currentStatusIndex ? '100%' : '0%' }}
                                />
                              </div>
                            )}

                            {/* Timeline Circle */}
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 z-10 transition-all duration-500 shrink-0 ${
                              isCompleted 
                                ? 'bg-primary border-primary text-white shadow-md' 
                                : 'bg-white dark:bg-[#242b26] border-border/20 text-muted-foreground'
                            } ${isCurrent ? 'ring-4 ring-primary/10 scale-105' : ''}`}>
                              <StepIcon className="w-6 h-6 stroke-[1.5]" />
                            </div>

                            {/* Label */}
                            <div className="ml-6 md:ml-0 md:mt-4 text-left md:text-center">
                              <h4 className={`font-barlow-condensed text-sm tracking-wider font-bold uppercase transition-colors ${
                                isCompleted ? 'text-primary' : 'text-muted-foreground'
                              }`}>
                                {step.label}
                              </h4>
                              <p className="text-[11px] text-muted-foreground font-light leading-snug mt-1 hidden md:block max-w-[150px] mx-auto">
                                {step.desc}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </ScrollAnimate>

              {/* Delivery info & details section */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                
                {/* Delivery details left */}
                <ScrollAnimate animation="fade-in-up" className="md:col-span-5 space-y-6">
                  <div className="bg-white dark:bg-[#2c332d] p-6 sm:p-8 border border-border/10 shadow-sm rounded-2xl space-y-6">
                    <h3 className="font-heading text-lg font-bold text-gradient-eco border-b border-border/10 pb-3">Thông tin nhận hàng</h3>
                    
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <User className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[10px] font-barlow font-bold uppercase tracking-widest text-muted-foreground">Người nhận</p>
                          <p className="text-sm font-medium">{order.customer.fullName}</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Phone className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[10px] font-barlow font-bold uppercase tracking-widest text-muted-foreground">Số điện thoại</p>
                          <p className="text-sm font-medium">{order.customer.phone}</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[10px] font-barlow font-bold uppercase tracking-widest text-muted-foreground">Địa chỉ nhận hàng</p>
                          <p className="text-sm font-light leading-relaxed">{order.customer.address}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-[#2c332d] p-6 sm:p-8 border border-border/10 shadow-sm rounded-2xl space-y-4">
                    <h3 className="font-heading text-lg font-bold text-gradient-eco border-b border-border/10 pb-3">Thanh toán & Ghi chú</h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground font-light flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Ngày đặt:</span>
                        <span className="font-medium">{order.createdAt.toLocaleDateString('vi-VN')}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground font-light flex items-center gap-1.5"><CreditCard className="w-3.5 h-3.5" /> Thanh toán:</span>
                        <span className="font-medium uppercase">{order.paymentMethod}</span>
                      </div>
                      {order.notes && (
                        <div className="pt-2 border-t border-border/5">
                          <p className="text-[10px] font-barlow font-bold uppercase tracking-widest text-muted-foreground mb-1">Ghi chú đơn hàng</p>
                          <p className="text-xs italic text-muted-foreground font-light">{order.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </ScrollAnimate>

                {/* Items grid right */}
                <ScrollAnimate animation="fade-in-up" className="md:col-span-7">
                  <div className="bg-white dark:bg-[#2c332d] p-6 sm:p-8 border border-border/10 shadow-sm rounded-2xl flex flex-col h-full">
                    <h3 className="font-heading text-lg font-bold text-gradient-eco border-b border-border/10 pb-3 mb-6">Chi tiết sản phẩm</h3>
                    
                    {/* Products list */}
                    <div className="space-y-4 flex-grow">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex gap-4 items-center pb-4 border-b border-border/5">
                          <div className="w-14 h-14 bg-background dark:bg-[#242b26] border border-border/10 rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
                            {item.imageUrlSnapshot ? (
                              <img src={item.imageUrlSnapshot} alt={item.nameSnapshot} className="w-full h-full object-cover" />
                            ) : (
                              <Leaf className="w-6 h-6 text-primary/40 stroke-[1.2]" />
                            )}
                          </div>
                          <div className="flex-grow min-w-0">
                            <h4 className="text-sm font-medium text-primary truncate leading-tight">{item.nameSnapshot}</h4>
                            <p className="text-xs text-muted-foreground font-light mt-1">
                              {formatMoney(item.priceSnapshot)} × {item.qty}
                            </p>
                          </div>
                          <span className="font-heading text-sm text-primary font-medium">
                            {formatMoney(item.priceSnapshot * item.qty)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Order summary calculations */}
                    <div className="pt-6 border-t border-border/10 space-y-3 font-light text-sm mt-6">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tạm tính ({order.totals.totalQty} sản phẩm)</span>
                        <span>{formatMoney(order.totals.subtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Phí vận chuyển</span>
                        <span>Miễn phí</span>
                      </div>
                      {order.totals.discountAmount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Giảm giá</span>
                          <span>-{formatMoney(order.totals.discountAmount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-heading text-base font-bold text-gradient-eco pt-3 border-t border-border/5">
                        <span>Tổng thanh toán</span>
                        <span>{formatMoney(order.totals.total)}</span>
                      </div>
                    </div>
                  </div>
                </ScrollAnimate>

              </div>
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
};

export default OrderLookup;

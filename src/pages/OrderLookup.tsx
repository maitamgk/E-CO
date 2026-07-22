import { useEffect, useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  Leaf,
  MapPin,
  Package,
  Phone,
  Search,
  ShieldCheck,
  Truck,
  User,
  XCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { Layout } from '@/components/layout/Layout';
import { MotionReveal } from '@/components/home/MotionReveal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { orderService } from '@/services/orderService';
import { supabase } from '@/lib/supabase';
import { Order, OrderStatus } from '@/types';
import { formatMoney } from '@/utils/money';
import collectionDisplay from '@/assets/products/collection-display-1.jpg';

const statusTimeline: { status: OrderStatus; label: string; desc: string; icon: React.ElementType }[] = [
  { status: 'pending', label: 'Chờ xác nhận', desc: 'B-ECO đang tiếp nhận đơn hàng', icon: Clock },
  { status: 'confirmed', label: 'Đã xác nhận', desc: 'Sản phẩm đang được chuẩn bị', icon: CheckCircle },
  { status: 'shipped', label: 'Đang giao hàng', desc: 'Đơn hàng đã bàn giao vận chuyển', icon: Truck },
  { status: 'delivered', label: 'Đã giao hàng', desc: 'Đơn hàng đã giao thành công', icon: Package },
];

const OrderLookup = () => {
  const [searchParams] = useSearchParams();
  const [orderCode, setOrderCode] = useState(() => searchParams.get('code') || '');
  const [phone, setPhone] = useState(() => searchParams.get('phone') || '');
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const orderId = order?.id;

  useEffect(() => {
    if (!orderId) return;

    const channel = supabase
      .channel(`order-lookup-${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          const updatedRow = payload.new;
          if (updatedRow) {
            setOrder((previous) => previous ? {
              ...previous,
              status: updatedRow.status as OrderStatus,
              updatedAt: new Date(updatedRow.updated_at),
            } : null);
            toast.success('Trạng thái đơn hàng vừa được cập nhật.');
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  const lookupOrder = async (codeValue: string, phoneValue: string) => {
    if (!codeValue.trim() || !phoneValue.trim()) {
      setLookupError('Vui lòng nhập đầy đủ mã đơn hàng và số điện thoại mua hàng.');
      return;
    }

    setLookupError(null);
    setIsLoading(true);
    setSearched(true);

    try {
      const foundOrder = await orderService.getOrderByCodeAndPhone(
        codeValue.trim(),
        phoneValue.trim(),
      );

      if (foundOrder) {
        setOrder(foundOrder);
        toast.success('Đã tìm thấy đơn hàng.');
      } else {
        setOrder(null);
      }
    } catch (error) {
      console.error(error);
      setOrder(null);
      setLookupError('Không thể kết nối hệ thống tra cứu. Vui lòng thử lại sau.');
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

  const handleLookup = async (event: FormEvent) => {
    event.preventDefault();
    await lookupOrder(orderCode, phone);
  };

  const getStatusIndex = (currentStatus: OrderStatus) => {
    if (currentStatus === 'cancelled') return -1;
    return statusTimeline.findIndex((step) => step.status === currentStatus);
  };

  const currentStatusIndex = order ? getStatusIndex(order.status) : -1;
  const currentStatus = order?.status === 'cancelled'
    ? null
    : statusTimeline[currentStatusIndex];

  return (
    <Layout>
      <main className="min-h-[calc(100dvh-104px)] bg-background text-foreground">
        <section className="border-b border-border px-5 py-12 sm:px-8 sm:py-16 lg:px-14 lg:py-20">
          <div className="mx-auto grid max-w-[1400px] overflow-hidden border border-border bg-card lg:grid-cols-[0.92fr_1.08fr]">
            <MotionReveal className="flex items-center px-6 py-12 sm:px-10 sm:py-16 lg:px-16 lg:py-20">
              <div className="w-full max-w-[620px]">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Tra cứu đơn hàng</p>
                <h1 className="mt-5 max-w-[13ch] font-heading text-5xl font-medium leading-[1.02] tracking-[-0.03em] sm:text-6xl">
                  Theo dõi hành trình đơn hàng
                </h1>
                <p className="mt-5 max-w-[52ch] text-sm leading-7 text-muted-foreground sm:text-base">
                  Nhập mã đơn hàng và số điện thoại để xem trạng thái giao nhận mới nhất.
                </p>

                <form onSubmit={handleLookup} className="mt-9 border-t border-border pt-7" noValidate>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="order-code" className="block text-xs font-bold text-foreground">Mã đơn hàng</label>
                      <Input
                        id="order-code"
                        type="text"
                        placeholder="Ví dụ: BCO001"
                        value={orderCode}
                        onChange={(event) => {
                          setOrderCode(event.target.value.toUpperCase());
                          setLookupError(null);
                        }}
                        className="h-12 rounded-none border-border bg-background px-4 text-sm uppercase focus-visible:ring-1 focus-visible:ring-primary"
                        autoComplete="off"
                        autoCapitalize="characters"
                        disabled={isLoading}
                        aria-invalid={Boolean(lookupError)}
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="order-phone" className="block text-xs font-bold text-foreground">Số điện thoại mua hàng</label>
                      <Input
                        id="order-phone"
                        type="tel"
                        inputMode="tel"
                        placeholder="Ví dụ: 0382548419"
                        value={phone}
                        onChange={(event) => {
                          setPhone(event.target.value);
                          setLookupError(null);
                        }}
                        className="h-12 rounded-none border-border bg-background px-4 text-sm focus-visible:ring-1 focus-visible:ring-primary"
                        autoComplete="tel"
                        disabled={isLoading}
                        aria-invalid={Boolean(lookupError)}
                      />
                    </div>
                  </div>

                  {lookupError && (
                    <p className="mt-4 flex items-start gap-2 text-sm leading-6 text-destructive" role="alert">
                      <XCircle className="mt-0.5 h-4 w-4 flex-none" />
                      {lookupError}
                    </p>
                  )}

                  <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="h-12 w-full rounded-none bg-primary px-7 text-xs font-bold uppercase tracking-[0.1em] text-primary-foreground transition-[transform,background-color] hover:-translate-y-0.5 hover:bg-primary/90 active:translate-y-px sm:w-auto"
                    >
                      <Search className="mr-2 h-4 w-4" />
                      {isLoading ? 'Đang tra cứu' : 'Tra cứu'}
                    </Button>
                    <p className="flex items-center gap-2 text-xs leading-5 text-muted-foreground">
                      <ShieldCheck className="h-4 w-4 flex-none text-primary" />
                      Thông tin chỉ dùng để xác minh đơn hàng.
                    </p>
                  </div>
                </form>
              </div>
            </MotionReveal>

            <MotionReveal className="border-t border-border lg:border-l lg:border-t-0" delay={0.08}>
              <img
                src={collectionDisplay}
                alt="Sản phẩm B-ECO được chuẩn bị cho khách hàng"
                className="h-full min-h-[360px] w-full object-cover lg:min-h-[660px]"
              />
            </MotionReveal>
          </div>
        </section>

        {isLoading && (
          <section className="px-5 py-14 sm:px-8 lg:px-14" aria-live="polite" aria-busy="true">
            <div className="mx-auto max-w-[1260px] animate-pulse border border-border bg-card p-7 motion-reduce:animate-none sm:p-10">
              <div className="h-4 w-32 bg-secondary" />
              <div className="mt-4 h-10 w-56 bg-secondary" />
              <div className="mt-10 grid gap-5 md:grid-cols-4">
                {[0, 1, 2, 3].map((item) => (
                  <div key={item} className="border-t border-border pt-5">
                    <div className="h-12 w-12 bg-secondary" />
                    <div className="mt-4 h-4 w-28 bg-secondary" />
                    <div className="mt-2 h-3 w-full bg-secondary" />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {searched && !isLoading && !order && (
          <section className="px-5 py-16 sm:px-8 sm:py-20 lg:px-14" aria-live="polite">
            <MotionReveal className="mx-auto grid max-w-[980px] gap-8 border border-border bg-card p-7 sm:p-10 md:grid-cols-[auto_1fr] md:items-center">
              <div className="flex h-16 w-16 items-center justify-center border border-destructive/30 bg-destructive/5 text-destructive">
                <XCircle className="h-8 w-8 stroke-[1.5]" />
              </div>
              <div>
                <h2 className="font-heading text-3xl font-medium text-foreground">Không tìm thấy đơn hàng</h2>
                <p className="mt-3 max-w-[64ch] text-sm leading-7 text-muted-foreground">
                  Hãy kiểm tra lại mã đơn hàng và số điện thoại đã dùng khi đặt hàng. Mã đơn thường có dạng BCO001.
                </p>
              </div>
            </MotionReveal>
          </section>
        )}

        {order && !isLoading && (
          <section className="px-5 py-16 sm:px-8 sm:py-20 lg:px-14" aria-live="polite">
            <div className="mx-auto max-w-[1260px]">
              <MotionReveal className="border border-border bg-card">
                <div className="grid gap-6 border-b border-border p-7 sm:grid-cols-[1fr_auto] sm:items-end sm:p-10">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Mã đơn hàng</p>
                    <h2 className="mt-2 font-heading text-4xl font-medium text-primary sm:text-5xl">{order.orderCode}</h2>
                    <p className="mt-3 text-sm text-muted-foreground">Đặt ngày {order.createdAt.toLocaleDateString('vi-VN')}</p>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Trạng thái hiện tại</p>
                    <p className={`mt-2 font-heading text-2xl font-medium ${order.status === 'cancelled' ? 'text-destructive' : 'text-primary'}`}>
                      {order.status === 'cancelled' ? 'Đã hủy' : currentStatus?.label}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">Cập nhật {order.updatedAt.toLocaleString('vi-VN')}</p>
                  </div>
                </div>

                <div className="p-7 sm:p-10">
                  {order.status === 'cancelled' ? (
                    <div className="grid gap-5 border border-destructive/25 bg-destructive/5 p-6 sm:grid-cols-[auto_1fr] sm:items-center">
                      <XCircle className="h-10 w-10 text-destructive" />
                      <div>
                        <h3 className="font-heading text-2xl font-medium text-destructive">Đơn hàng đã bị hủy</h3>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">Liên hệ B-ECO nếu bạn cần kiểm tra lý do hoặc hỗ trợ đặt lại đơn hàng.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid gap-0 md:grid-cols-4">
                      {statusTimeline.map((step, index) => {
                        const isCompleted = index <= currentStatusIndex;
                        const isCurrent = index === currentStatusIndex;
                        const StepIcon = step.icon;

                        return (
                          <div key={step.status} className="relative flex gap-5 pb-9 last:pb-0 md:block md:pb-0 md:pr-5">
                            {index < statusTimeline.length - 1 && (
                              <>
                                <div className={`absolute left-6 top-12 h-[calc(100%-3rem)] w-px md:hidden ${index < currentStatusIndex ? 'bg-primary' : 'bg-border'}`} />
                                <div className="absolute left-12 right-0 top-6 hidden h-px bg-border md:block">
                                  <div className={`h-full bg-primary transition-[width] duration-700 ${index < currentStatusIndex ? 'w-full' : 'w-0'}`} />
                                </div>
                              </>
                            )}

                            <div className={`relative flex h-12 w-12 flex-none items-center justify-center border transition-colors ${isCompleted ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background text-muted-foreground'} ${isCurrent ? 'outline outline-4 outline-primary/10' : ''}`}>
                              <StepIcon className="h-5 w-5 stroke-[1.6]" />
                            </div>
                            <div className="pt-0.5 md:mt-5 md:pr-4">
                              <h3 className={`text-sm font-bold ${isCompleted ? 'text-primary' : 'text-muted-foreground'}`}>{step.label}</h3>
                              <p className="mt-2 max-w-[24ch] text-xs leading-5 text-muted-foreground">{step.desc}</p>
                              {isCurrent && <p className="mt-2 text-xs font-bold text-primary">Đang ở bước này</p>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </MotionReveal>

              <div className="mt-8 grid gap-8 lg:grid-cols-[0.78fr_1.22fr]">
                <MotionReveal className="space-y-8" delay={0.05}>
                  <section className="border border-border bg-card p-7 sm:p-8">
                    <h2 className="font-heading text-2xl font-medium text-foreground">Thông tin nhận hàng</h2>
                    <div className="mt-6 space-y-6">
                      <div className="grid grid-cols-[22px_1fr] gap-3">
                        <User className="mt-0.5 h-4 w-4 text-primary" />
                        <div>
                          <p className="text-xs font-bold text-muted-foreground">Người nhận</p>
                          <p className="mt-1 text-sm font-semibold text-foreground">{order.customer.fullName}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-[22px_1fr] gap-3">
                        <Phone className="mt-0.5 h-4 w-4 text-primary" />
                        <div>
                          <p className="text-xs font-bold text-muted-foreground">Số điện thoại</p>
                          <p className="mt-1 text-sm font-semibold text-foreground">{order.customer.phone}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-[22px_1fr] gap-3">
                        <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                        <div>
                          <p className="text-xs font-bold text-muted-foreground">Địa chỉ nhận hàng</p>
                          <p className="mt-1 text-sm leading-6 text-foreground">{order.customer.address}</p>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="border border-border bg-secondary p-7 sm:p-8">
                    <h2 className="font-heading text-2xl font-medium text-foreground">Thanh toán</h2>
                    <div className="mt-6 space-y-4 text-sm">
                      <div className="flex items-center justify-between gap-4">
                        <span className="flex items-center gap-2 text-muted-foreground"><Calendar className="h-4 w-4" /> Ngày đặt</span>
                        <span className="font-semibold">{order.createdAt.toLocaleDateString('vi-VN')}</span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="flex items-center gap-2 text-muted-foreground"><CreditCard className="h-4 w-4" /> Phương thức</span>
                        <span className="font-semibold uppercase">{order.paymentMethod}</span>
                      </div>
                      {order.notes && (
                        <div className="border-t border-border pt-4">
                          <p className="text-xs font-bold text-muted-foreground">Ghi chú đơn hàng</p>
                          <p className="mt-2 text-sm leading-6 text-foreground">{order.notes}</p>
                        </div>
                      )}
                    </div>
                  </section>
                </MotionReveal>

                <MotionReveal delay={0.1}>
                  <section className="h-full border border-border bg-card p-7 sm:p-8">
                    <h2 className="font-heading text-2xl font-medium text-foreground">Sản phẩm trong đơn</h2>

                    <div className="mt-6 space-y-5">
                      {order.items.map((item, index) => (
                        <div key={`${item.nameSnapshot}-${index}`} className="grid grid-cols-[64px_1fr_auto] items-center gap-4 border-b border-border pb-5 last:border-b-0">
                          <div className="flex h-16 w-16 items-center justify-center overflow-hidden bg-secondary">
                            {item.imageUrlSnapshot ? (
                              <img src={item.imageUrlSnapshot} alt={item.nameSnapshot} className="h-full w-full object-cover" />
                            ) : (
                              <Leaf className="h-6 w-6 stroke-[1.4] text-primary/45" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-semibold text-foreground">{item.nameSnapshot}</h3>
                            <p className="mt-1 text-xs text-muted-foreground">{formatMoney(item.priceSnapshot)} x {item.qty}</p>
                          </div>
                          <span className="text-sm font-semibold text-foreground">{formatMoney(item.priceSnapshot * item.qty)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 bg-secondary p-6 text-sm">
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Tạm tính ({order.totals.totalQty} sản phẩm)</span>
                        <span>{formatMoney(order.totals.subtotal)}</span>
                      </div>
                      <div className="mt-3 flex justify-between gap-4">
                        <span className="text-muted-foreground">Phí vận chuyển</span>
                        <span>Miễn phí</span>
                      </div>
                      {order.totals.discountAmount > 0 && (
                        <div className="mt-3 flex justify-between gap-4 text-primary">
                          <span>Giảm giá</span>
                          <span>-{formatMoney(order.totals.discountAmount)}</span>
                        </div>
                      )}
                      <div className="mt-5 flex items-end justify-between gap-4 border-t border-border pt-5">
                        <span className="font-bold text-foreground">Tổng thanh toán</span>
                        <span className="font-heading text-2xl font-medium text-primary">{formatMoney(order.totals.total)}</span>
                      </div>
                    </div>
                  </section>
                </MotionReveal>
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
};

export default OrderLookup;

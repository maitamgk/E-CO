import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatMoney } from '@/utils/money';
import { validatePhone, validateRequired } from '@/utils/validators';
import { useToast } from '@/hooks/use-toast';
import {
  Truck,
  CreditCard,
  ArrowLeft,
  Check,
  Loader2,
  Building2,
  Copy,
  CheckCircle2,
  Banknote,
  X,
} from 'lucide-react';
import { orderService } from '@/services/orderService';
import { telegramService } from '@/services/telegramService';
import { discordService } from '@/services/discordService';
import type { Order, PaymentMethod, PaymentStatus } from '@/types';

/* ── Bank Transfer Constants ─────────────────────── */
const BANK_INFO = {
  bankName: 'MBBank (Ngân hàng Quân đội)',
  bankCode: 'MB',
  accountNumber: '0385959294',
  accountName: 'TRAN BIEU',
};

const getVietQRUrl = (amount: number, orderCode: string) =>
  `https://img.vietqr.io/image/${BANK_INFO.bankCode}-${BANK_INFO.accountNumber}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(orderCode)}&accountName=${encodeURIComponent(BANK_INFO.accountName)}`;

/* ══════════════════════════════════════════════════════
   QR Payment Modal Component
   ══════════════════════════════════════════════════════ */
const QRPaymentModal = ({
  order,
  depositType,
  onConfirm,
  onClose,
}: {
  order: Order;
  depositType: 'deposit_50' | 'paid_100';
  onConfirm: () => void;
  onClose: () => void;
}) => {
  const { toast } = useToast();
  const [confirmingSent, setConfirmingSent] = useState(false);
  const [confirmationDone, setConfirmationDone] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Compute from saved order — NOT from cart (which is already cleared)
  const orderTotal = order.totals.total;
  const amount = depositType === 'paid_100' ? orderTotal : Math.round(orderTotal / 2);

  const copyToClipboard = (text: string, field: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      toast({ title: '✅ Đã sao chép!', description: `${label}: ${text}` });
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  const handleConfirmTransfer = async () => {
    if (confirmingSent) return;
    setConfirmingSent(true);
    try {
      await Promise.all([
        telegramService.sendPaymentConfirmation(order, depositType).catch(console.error),
        discordService.sendPaymentConfirmation(order, depositType).catch(console.error),
      ]);
      setConfirmationDone(true);
      toast({
        title: '✅ Đã gửi xác nhận!',
        description: 'Admin sẽ kiểm tra và xác nhận đơn hàng của bạn.',
      });
      setTimeout(() => onConfirm(), 2500);
    } catch {
      toast({
        title: 'Lỗi gửi xác nhận',
        description: 'Vui lòng liên hệ 0382 548 419.',
        variant: 'destructive',
      });
    } finally {
      setConfirmingSent(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[6px]" onClick={onClose} />

      {/* Modal */}
      <div
        className="relative w-full max-w-[26rem] max-h-[92vh] overflow-y-auto rounded-2xl shadow-[0_32px_80px_rgba(0,0,0,0.25)]"
        style={{ animation: 'qr-modal-in 0.35s cubic-bezier(0.16,1,0.3,1) forwards' }}
      >
        <style>{`
          @keyframes qr-modal-in {
            from { opacity: 0; transform: translateY(24px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}</style>

        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-10 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* ─── Green Header ─── */}
        <div className="relative bg-gradient-to-br from-[#166534] via-[#15803d] to-[#166534] text-white text-center px-6 pt-7 pb-16 rounded-t-2xl overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5" />
          <div className="absolute -bottom-4 -left-6 w-24 h-24 rounded-full bg-white/5" />

          <div className="relative">
            <p className="text-sm font-medium text-white/80 mb-1">Đặt hàng thành công! 🎉</p>
            <h2 className="text-xl font-bold tracking-tight">Chuyển khoản thanh toán</h2>
            <div className="mt-3 inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-1.5">
              <span className="text-xs text-white/70">Mã đơn</span>
              <code className="text-sm font-bold">{order.orderCode}</code>
            </div>
          </div>
        </div>

        {/* ─── Body ─── */}
        <div className="bg-white dark:bg-card rounded-b-2xl px-5 pb-5 -mt-10 relative">
          {/* QR Card — overlapping header */}
          <div className="flex justify-center mb-4">
            <div className="bg-white rounded-2xl p-2 shadow-xl border border-border/20 ring-1 ring-black/5">
              {!imgLoaded && (
                <div className="w-56 h-56 flex flex-col items-center justify-center gap-2">
                  <Loader2 className="h-7 w-7 text-primary animate-spin" />
                  <span className="text-xs text-muted-foreground">Đang tải mã QR...</span>
                </div>
              )}
              <img
                src={getVietQRUrl(amount, order.orderCode)}
                alt="QR chuyển khoản VietQR"
                className={`w-56 h-auto rounded-xl ${imgLoaded ? 'block' : 'hidden'}`}
                onLoad={() => setImgLoaded(true)}
                loading="eager"
              />
            </div>
          </div>

          {/* Amount + deposit type */}
          <div className="text-center mb-5">
            <p className="text-2xl font-extrabold text-primary tracking-tight">{formatMoney(amount)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {depositType === 'paid_100'
                ? '💯 Thanh toán toàn bộ 100%'
                : '5️⃣0️⃣ Đặt cọc 50% · Phần còn lại thanh toán khi nhận hàng'}
            </p>
          </div>

          {/* Bank details */}
          <div className="rounded-xl border border-border/50 divide-y divide-border/40 mb-5 overflow-hidden">
            {[
              { label: 'Ngân hàng', value: 'MB Bank (Quân đội)', field: '', copyValue: '' },
              { label: 'Số tài khoản', value: BANK_INFO.accountNumber, field: 'stk', copyValue: BANK_INFO.accountNumber },
              { label: 'Chủ tài khoản', value: BANK_INFO.accountName, field: '', copyValue: '' },
              { label: 'Nội dung CK', value: order.orderCode, field: 'ndck', copyValue: order.orderCode },
            ].map(row => (
              <div key={row.label} className="flex items-center justify-between px-4 py-3 bg-muted/20 hover:bg-muted/40 transition-colors">
                <span className="text-[13px] text-muted-foreground">{row.label}</span>
                <div className="flex items-center gap-1.5">
                  <span className={`text-[13px] font-semibold ${row.field === 'stk' ? 'font-mono tracking-widest text-foreground' : row.field === 'ndck' ? 'font-mono bg-primary/10 text-primary px-2 py-0.5 rounded' : 'text-foreground'}`}>
                    {row.value}
                  </span>
                  {row.copyValue && (
                    <button
                      type="button"
                      onClick={() => copyToClipboard(row.copyValue, row.field, row.label)}
                      className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                      title={`Sao chép ${row.label}`}
                    >
                      {copiedField === row.field ? (
                        <Check className="h-3.5 w-3.5 text-green-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5 text-primary/60" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Confirm / Done */}
          {!confirmationDone ? (
            <Button
              onClick={handleConfirmTransfer}
              disabled={confirmingSent}
              className="w-full gap-2 bg-gradient-eco text-white hover:bg-gradient-eco-hover h-12 text-[15px] font-semibold rounded-xl shadow-lg shadow-primary/20"
            >
              {confirmingSent ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Đang gửi xác nhận...</>
              ) : (
                <><CheckCircle2 className="h-5 w-5" /> Tôi đã chuyển khoản</>
              )}
            </Button>
          ) : (
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800/40 rounded-xl p-5 text-center">
              <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="font-bold text-green-700 dark:text-green-400">Xác nhận thành công!</p>
              <p className="text-sm text-green-600 dark:text-green-500 mt-1">Admin sẽ kiểm tra và xác nhận sớm nhất.</p>
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            className="w-full text-center text-[13px] text-muted-foreground hover:text-foreground transition-colors mt-3 py-1.5"
          >
            Tôi sẽ chuyển khoản sau →
          </button>
        </div>
      </div>
    </div>
  );
};


/* ══════════════════════════════════════════════════════
   Main Checkout Component
   ══════════════════════════════════════════════════════ */
const Checkout = () => {
  const navigate = useNavigate();
  const { items, itemCount, getSubtotal, getTotalQty, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderCode, setOrderCode] = useState('');
  const [savedOrder, setSavedOrder] = useState<Order | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);

  /* Payment state */
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');
  const [depositType, setDepositType] = useState<'deposit_50' | 'paid_100'>('paid_100');

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    note: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);

  const subtotal = getSubtotal();
  const totalQty = getTotalQty();
  const discountRate = 0;
  const discountAmount = 0;
  const total = subtotal;

  const transferAmount = depositType === 'paid_100' ? total : Math.round(total / 2);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!validateRequired(form.fullName)) newErrors.fullName = 'Vui lòng nhập họ tên';
    if (!validatePhone(form.phone)) newErrors.phone = 'Số điện thoại không hợp lệ';
    if (!validateRequired(form.address)) newErrors.address = 'Vui lòng nhập địa chỉ giao hàng';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* Submit order */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const code = 'BCO' + Date.now().toString(36).toUpperCase();

      const paymentStatus: PaymentStatus =
        paymentMethod === 'COD' ? 'unpaid' : depositType;

      const newOrder: Order = {
        id: crypto.randomUUID(),
        orderCode: code,
        userId: user?.uid || 'guest',
        customer: {
          fullName: form.fullName,
          phone: form.phone,
          address: form.address,
        },
        items: Object.values(items),
        totals: { subtotal, discountRate, discountAmount, total, totalQty },
        paymentMethod,
        paymentStatus,
        status: 'pending' as const,
        notes: form.note,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const success = await orderService.addOrder(newOrder);
      if (!success) throw new Error('Không thể tạo đơn hàng trên hệ thống');

      // Send notifications (non-blocking)
      try {
        await Promise.all([
          telegramService.sendOrderNotification(newOrder).catch(console.error),
          discordService.sendOrderNotification(newOrder).catch(console.error),
        ]);
      } catch (err) {
        console.error('Failed to send notifications:', err);
      }

      setOrderCode(code);
      setSavedOrder(newOrder);
      clearCart();

      // If bank transfer → show QR modal, else → go to success
      if (paymentMethod === 'BANK_TRANSFER') {
        setShowQRModal(true);
      } else {
        setOrderPlaced(true);
      }

      toast({
        title: 'Đặt hàng thành công!',
        description: `Mã đơn hàng: ${code}`,
      });
    } catch (error: unknown) {
      toast({
        title: 'Có lỗi xảy ra',
        description: error instanceof Error ? error.message : 'Vui lòng thử lại sau',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (itemCount === 0 && !orderPlaced && !showQRModal) {
    navigate('/cart');
    return null;
  }

  /* ── Order Success Screen ──────────────────────── */
  if (orderPlaced) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gradient-eco rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Đặt hàng thành công!</h1>
            <p className="text-muted-foreground mb-4">
              Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ liên hệ xác nhận sớm nhất.
            </p>
            <div className="bg-muted/50 rounded-lg p-4 mb-6">
              <p className="text-sm text-muted-foreground">Mã đơn hàng</p>
              <p className="text-2xl font-bold text-gradient-eco">{orderCode}</p>
            </div>
            <div className="flex flex-col gap-2">
              {user ? (
                <Link to="/orders">
                  <Button className="w-full bg-gradient-eco text-white hover:bg-gradient-eco-hover rounded-none transition-all duration-300">Xem đơn hàng của tôi</Button>
                </Link>
              ) : (
                <Link to={`/order-lookup?code=${orderCode}&phone=${form.phone}`}>
                  <Button className="w-full bg-gradient-eco text-white hover:bg-gradient-eco-hover rounded-none transition-all duration-300">Xem đơn hàng của tôi</Button>
                </Link>
              )}
              <Link to="/shop">
                <Button variant="outline" className="w-full rounded-none">Tiếp tục mua sắm</Button>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  /* ── Checkout Form ─────────────────────────────── */
  return (
    <Layout>
      {/* QR Payment Modal */}
      {showQRModal && savedOrder && (
        <QRPaymentModal
          order={savedOrder}
          depositType={depositType}
          onConfirm={() => {
            setShowQRModal(false);
            setOrderPlaced(true);
          }}
          onClose={() => {
            setShowQRModal(false);
            setOrderPlaced(true);
          }}
        />
      )}

      {/* Hero Section */}
      <div className="relative bg-background border-b border-border/40 py-12 text-center">
        <div className="container mx-auto px-4 relative z-10">
          <Link to="/cart" className="inline-flex items-center gap-2 text-primary/60 hover:text-primary transition-colors mb-4 text-sm tracking-widest uppercase">
            <ArrowLeft className="h-4 w-4 stroke-[1.5]" />
            Quay lại
          </Link>
          <h1 className="text-3xl md:text-4xl font-heading text-gradient-eco mb-4 font-bold">
            Thanh toán
          </h1>
          <p className="text-muted-foreground font-light max-w-2xl mx-auto">
            Hoàn tất thông tin để đặt hàng
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <div>
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white border border-border/40 p-6">
                <h2 className="text-xl font-heading text-gradient-eco mb-6 font-semibold">Thông tin giao hàng</h2>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Họ và tên *</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      placeholder="Nguyễn Văn A"
                      className={errors.fullName ? 'border-destructive' : ''}
                    />
                    {errors.fullName && <p className="text-sm text-destructive mt-1">{errors.fullName}</p>}
                  </div>

                  <div>
                    <Label htmlFor="phone">Số điện thoại *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="0901234567"
                      className={errors.phone ? 'border-destructive' : ''}
                    />
                    {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <Label htmlFor="address">Địa chỉ giao hàng *</Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                      rows={3}
                      className={errors.address ? 'border-destructive' : ''}
                    />
                    {errors.address && <p className="text-sm text-destructive mt-1">{errors.address}</p>}
                  </div>

                  <div>
                    <Label htmlFor="note">Ghi chú (không bắt buộc)</Label>
                    <Textarea
                      id="note"
                      name="note"
                      value={form.note}
                      onChange={handleChange}
                      placeholder="Ghi chú cho đơn hàng..."
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="bg-white border border-border/40 p-6">
                <h2 className="text-xl font-heading text-gradient-eco mb-6 font-semibold">Phương thức thanh toán</h2>

                <div className="space-y-3">
                  {/* COD option */}
                  <label
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      paymentMethod === 'COD'
                        ? 'border-primary bg-primary/5'
                        : 'border-border/50 hover:border-primary/30'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                      className="accent-primary w-4 h-4"
                    />
                    <Truck className="h-5 w-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm">Thanh toán khi nhận hàng (COD)</p>
                      <p className="text-xs text-muted-foreground">Nhận hàng rồi mới thanh toán</p>
                    </div>
                  </label>

                  {/* Bank Transfer option */}
                  <label
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      paymentMethod === 'BANK_TRANSFER'
                        ? 'border-primary bg-primary/5'
                        : 'border-border/50 hover:border-primary/30'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="BANK_TRANSFER"
                      checked={paymentMethod === 'BANK_TRANSFER'}
                      onChange={() => setPaymentMethod('BANK_TRANSFER')}
                      className="accent-primary w-4 h-4"
                    />
                    <Building2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm">Chuyển khoản ngân hàng</p>
                      <p className="text-xs text-muted-foreground">MBBank — Cọc 50% hoặc thanh toán 100%</p>
                    </div>
                  </label>
                </div>

                {/* Deposit type selection (shown when bank transfer selected) */}
                {paymentMethod === 'BANK_TRANSFER' && (
                  <div className="mt-5 pt-5 border-t border-border/40 space-y-4">
                    <p className="text-sm font-medium flex items-center gap-1.5">
                      <Banknote className="h-4 w-4 text-primary" />
                      Chọn mức thanh toán
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setDepositType('paid_100')}
                        className={`p-3.5 rounded-xl border-2 text-center transition-all ${
                          depositType === 'paid_100'
                            ? 'border-primary bg-primary/5 shadow-sm'
                            : 'border-border/50 hover:border-primary/30'
                        }`}
                      >
                        <p className="font-bold text-sm">💯 100%</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Thanh toán toàn bộ</p>
                        <p className="text-primary font-bold text-sm mt-1.5">{formatMoney(total)}</p>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDepositType('deposit_50')}
                        className={`p-3.5 rounded-xl border-2 text-center transition-all ${
                          depositType === 'deposit_50'
                            ? 'border-primary bg-primary/5 shadow-sm'
                            : 'border-border/50 hover:border-primary/30'
                        }`}
                      >
                        <p className="font-bold text-sm">5️⃣0️⃣ 50%</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Đặt cọc trước</p>
                        <p className="text-primary font-bold text-sm mt-1.5">{formatMoney(Math.round(total / 2))}</p>
                      </button>
                    </div>

                    {/* Info note */}
                    <div className="flex items-start gap-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/30 rounded-lg p-3">
                      <Building2 className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                        Sau khi bấm đặt hàng, mã QR chuyển khoản sẽ hiện lên để bạn thanh toán ngay.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <Button type="submit" size="lg" className="w-full gap-2" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4" />
                    Đặt hàng - {formatMoney(total)}
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white border border-border/40 p-6 sticky top-20">
              <h2 className="text-xl font-heading text-gradient-eco mb-6 font-semibold">Đơn hàng của bạn</h2>

              <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                {Object.values(items).map(item => (
                  <div key={item.productId} className="flex gap-3">
                    <div className="w-12 h-12 rounded bg-muted overflow-hidden flex-shrink-0">
                      <img
                        src={item.imageUrlSnapshot}
                        alt={item.nameSnapshot}
                        className="w-full h-full object-cover object-center"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.nameSnapshot}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.qty} {item.salesUnitSnapshot ?? 'sản phẩm'} × {formatMoney(item.priceSnapshot)}
                      </p>
                    </div>
                    <span className="text-sm font-medium">
                      {formatMoney(item.qty * item.priceSnapshot)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Số lượng:</span>
                  <span>{totalQty} đơn vị bán</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tạm tính:</span>
                  <span>{formatMoney(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Phí vận chuyển:</span>
                  <span>Liên hệ</span>
                </div>
                {paymentMethod === 'BANK_TRANSFER' && (
                  <div className="flex justify-between text-sm text-primary">
                    <span className="font-medium">
                      {depositType === 'paid_100' ? 'Thanh toán 100%:' : 'Đặt cọc 50%:'}
                    </span>
                    <span className="font-bold">{formatMoney(transferAmount)}</span>
                  </div>
                )}
                <div className="border-t border-border pt-2 flex justify-between">
                  <span className="font-semibold">Tổng cộng:</span>
                  <span className="text-xl font-bold text-gradient-eco">{formatMoney(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;

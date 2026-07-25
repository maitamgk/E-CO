import { useState, useRef } from 'react';
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
  QrCode,
  CheckCircle2,
  Banknote,
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

/* ── Main Component ──────────────────────────────── */
const Checkout = () => {
  const navigate = useNavigate();
  const { items, itemCount, getSubtotal, getTotalQty, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderCode, setOrderCode] = useState('');
  const [savedOrder, setSavedOrder] = useState<Order | null>(null);
  const [confirmingSent, setConfirmingSent] = useState(false);
  const [confirmationDone, setConfirmationDone] = useState(false);

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

  /* Transfer amount based on deposit type */
  const transferAmount = depositType === 'paid_100' ? total : Math.round(total / 2);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!validateRequired(form.fullName)) {
      newErrors.fullName = 'Vui lòng nhập họ tên';
    }
    if (!validatePhone(form.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }
    if (!validateRequired(form.address)) {
      newErrors.address = 'Vui lòng nhập địa chỉ giao hàng';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* Copy to clipboard helper */
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: '✅ Đã sao chép!',
        description: `${label}: ${text}`,
      });
    });
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
        totals: {
          subtotal,
          discountRate,
          discountAmount,
          total,
          totalQty,
        },
        paymentMethod,
        paymentStatus,
        status: 'pending' as const,
        notes: form.note,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const success = await orderService.addOrder(newOrder);
      if (!success) {
        throw new Error('Không thể tạo đơn hàng trên hệ thống');
      }

      // Send notification to Telegram Bot and Discord Webhook (non-blocking)
      try {
        await Promise.all([
          telegramService.sendOrderNotification(newOrder).catch(err => {
            console.error('Failed to send Telegram notification:', err);
          }),
          discordService.sendOrderNotification(newOrder).catch(err => {
            console.error('Failed to send Discord notification:', err);
          })
        ]);
      } catch (err) {
        console.error('Failed to send notifications:', err);
      }

      setOrderCode(code);
      setSavedOrder(newOrder);

      clearCart();
      setOrderPlaced(true);

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

  /* Confirm bank transfer */
  const handleConfirmTransfer = async () => {
    if (!savedOrder || confirmingSent) return;

    setConfirmingSent(true);
    try {
      await Promise.all([
        telegramService.sendPaymentConfirmation(savedOrder, depositType).catch(console.error),
        discordService.sendPaymentConfirmation(savedOrder, depositType).catch(console.error),
      ]);

      setConfirmationDone(true);
      toast({
        title: '✅ Đã gửi xác nhận!',
        description: 'Admin sẽ kiểm tra và xác nhận đơn hàng của bạn.',
      });
    } catch {
      toast({
        title: 'Lỗi gửi xác nhận',
        description: 'Vui lòng liên hệ 0382 548 419 để xác nhận.',
        variant: 'destructive',
      });
    } finally {
      setConfirmingSent(false);
    }
  };

  if (itemCount === 0 && !orderPlaced) {
    navigate('/cart');
    return null;
  }

  /* ── Order Success Screen ──────────────────────── */
  if (orderPlaced) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-lg mx-auto">
            {/* Success badge */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-eco rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Đặt hàng thành công!</h1>
              <p className="text-muted-foreground">
                Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ liên hệ xác nhận sớm nhất.
              </p>
            </div>

            {/* Order code */}
            <div className="bg-muted/50 rounded-lg p-4 mb-6 text-center">
              <p className="text-sm text-muted-foreground">Mã đơn hàng</p>
              <p className="text-2xl font-bold text-gradient-eco">{orderCode}</p>
            </div>

            {/* Bank transfer info (only if BANK_TRANSFER) */}
            {savedOrder?.paymentMethod === 'BANK_TRANSFER' && (
              <div className="bg-white dark:bg-card border border-border/60 rounded-xl p-6 mb-6 space-y-5">
                <div className="flex items-center gap-2 text-primary font-semibold">
                  <Building2 className="h-5 w-5" />
                  <span>Thông tin chuyển khoản</span>
                </div>

                {/* QR Code */}
                <div className="flex justify-center">
                  <div className="bg-white rounded-xl p-3 border border-border/50 shadow-sm">
                    <img
                      src={getVietQRUrl(transferAmount, orderCode)}
                      alt="QR chuyển khoản"
                      className="w-56 h-auto rounded-lg"
                      loading="eager"
                    />
                  </div>
                </div>

                <p className="text-center text-xs text-muted-foreground">
                  Quét mã QR bằng app ngân hàng để chuyển khoản tự động
                </p>

                {/* Bank details */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-border/30">
                    <span className="text-sm text-muted-foreground">Ngân hàng</span>
                    <span className="font-semibold text-sm">{BANK_INFO.bankName}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border/30">
                    <span className="text-sm text-muted-foreground">Số tài khoản</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base tracking-wider">{BANK_INFO.accountNumber}</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(BANK_INFO.accountNumber, 'STK')}
                        className="p-1.5 rounded-md hover:bg-muted transition-colors"
                        title="Sao chép STK"
                      >
                        <Copy className="h-3.5 w-3.5 text-primary" />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border/30">
                    <span className="text-sm text-muted-foreground">Chủ tài khoản</span>
                    <span className="font-semibold text-sm">{BANK_INFO.accountName}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border/30">
                    <span className="text-sm text-muted-foreground">Số tiền</span>
                    <span className="font-bold text-primary text-base">{formatMoney(transferAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-muted-foreground">Nội dung CK</span>
                    <div className="flex items-center gap-2">
                      <code className="bg-primary/10 text-primary px-2 py-0.5 rounded font-bold text-sm">{orderCode}</code>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(orderCode, 'Nội dung CK')}
                        className="p-1.5 rounded-md hover:bg-muted transition-colors"
                        title="Sao chép nội dung CK"
                      >
                        <Copy className="h-3.5 w-3.5 text-primary" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Deposit type badge */}
                <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 rounded-lg p-3 text-center">
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                    {depositType === 'paid_100'
                      ? '💯 Thanh toán toàn bộ 100%'
                      : '5️⃣0️⃣ Đặt cọc 50% — Thanh toán phần còn lại khi nhận hàng'}
                  </p>
                </div>

                {/* Confirm transfer button */}
                {!confirmationDone ? (
                  <Button
                    onClick={handleConfirmTransfer}
                    disabled={confirmingSent}
                    className="w-full gap-2 bg-gradient-eco text-white hover:bg-gradient-eco-hover"
                    size="lg"
                  >
                    {confirmingSent ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Đang gửi xác nhận...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        Tôi đã chuyển khoản
                      </>
                    )}
                  </Button>
                ) : (
                  <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800/40 rounded-lg p-4 text-center space-y-1">
                    <CheckCircle2 className="h-6 w-6 text-green-600 mx-auto" />
                    <p className="font-semibold text-green-700 dark:text-green-400">
                      Đã gửi xác nhận thành công!
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-500">
                      Admin sẽ kiểm tra và xác nhận đơn hàng sớm nhất.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Action buttons */}
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
                    {errors.fullName && (
                      <p className="text-sm text-destructive mt-1">{errors.fullName}</p>
                    )}
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
                    {errors.phone && (
                      <p className="text-sm text-destructive mt-1">{errors.phone}</p>
                    )}
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
                    {errors.address && (
                      <p className="text-sm text-destructive mt-1">{errors.address}</p>
                    )}
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

                {/* Bank Transfer Details (shown when selected) */}
                {paymentMethod === 'BANK_TRANSFER' && (
                  <div className="mt-5 pt-5 border-t border-border/40 space-y-5">
                    {/* Deposit type selection */}
                    <div>
                      <p className="text-sm font-medium mb-3 flex items-center gap-1.5">
                        <Banknote className="h-4 w-4 text-primary" />
                        Chọn mức thanh toán
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setDepositType('paid_100')}
                          className={`p-3 rounded-lg border-2 text-center transition-all ${
                            depositType === 'paid_100'
                              ? 'border-primary bg-primary/5'
                              : 'border-border/50 hover:border-primary/30'
                          }`}
                        >
                          <p className="font-bold text-sm">💯 100%</p>
                          <p className="text-xs text-muted-foreground mt-0.5">Thanh toán toàn bộ</p>
                          <p className="text-primary font-bold text-sm mt-1">{formatMoney(total)}</p>
                        </button>
                        <button
                          type="button"
                          onClick={() => setDepositType('deposit_50')}
                          className={`p-3 rounded-lg border-2 text-center transition-all ${
                            depositType === 'deposit_50'
                              ? 'border-primary bg-primary/5'
                              : 'border-border/50 hover:border-primary/30'
                          }`}
                        >
                          <p className="font-bold text-sm">5️⃣0️⃣ 50%</p>
                          <p className="text-xs text-muted-foreground mt-0.5">Đặt cọc trước</p>
                          <p className="text-primary font-bold text-sm mt-1">{formatMoney(Math.round(total / 2))}</p>
                        </button>
                      </div>
                    </div>

                    {/* QR Preview */}
                    <div className="flex justify-center">
                      <div className="bg-white rounded-xl p-3 border border-border/50 shadow-sm">
                        <div className="flex items-center gap-1.5 justify-center mb-2">
                          <QrCode className="h-3.5 w-3.5 text-primary" />
                          <span className="text-xs font-medium text-muted-foreground">QR sẽ hiện sau khi đặt hàng</span>
                        </div>
                        <div className="w-40 h-40 bg-muted/30 rounded-lg flex items-center justify-center">
                          <Building2 className="h-10 w-10 text-muted-foreground/30" />
                        </div>
                      </div>
                    </div>

                    {/* Bank info preview */}
                    <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Ngân hàng:</span>
                        <span className="font-medium">{BANK_INFO.bankName}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">STK:</span>
                        <span className="font-bold tracking-wider">{BANK_INFO.accountNumber}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Chủ TK:</span>
                        <span className="font-medium">{BANK_INFO.accountName}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Số tiền CK:</span>
                        <span className="font-bold text-primary">{formatMoney(transferAmount)}</span>
                      </div>
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

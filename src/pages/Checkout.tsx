import { useState } from 'react';
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
import { Truck, CreditCard, ArrowLeft, Check, Loader2 } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, itemCount, getSubtotal, getTotalQty, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderCode, setOrderCode] = useState('');
  
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    note: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const subtotal = getSubtotal();
  const totalQty = getTotalQty();
  const discountRate = totalQty >= 1000 ? 0.1 : 0;
  const discountAmount = subtotal * discountRate;
  const total = subtotal - discountAmount;

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call - In real app, this calls Firebase Cloud Function
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate order code
      const code = 'BCO' + Date.now().toString(36).toUpperCase();
      setOrderCode(code);
      
      // Clear cart and show success
      clearCart();
      setOrderPlaced(true);
      
      toast({
        title: 'Đặt hàng thành công!',
        description: `Mã đơn hàng: ${code}`,
      });
    } catch (error) {
      toast({
        title: 'Có lỗi xảy ra',
        description: 'Vui lòng thử lại sau',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (itemCount === 0 && !orderPlaced) {
    navigate('/cart');
    return null;
  }

  if (orderPlaced) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Đặt hàng thành công!</h1>
            <p className="text-muted-foreground mb-4">
              Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ liên hệ xác nhận sớm nhất.
            </p>
            <div className="bg-muted/50 rounded-lg p-4 mb-6">
              <p className="text-sm text-muted-foreground">Mã đơn hàng</p>
              <p className="text-2xl font-bold text-primary">{orderCode}</p>
            </div>
            <div className="flex flex-col gap-2">
              <Link to="/orders">
                <Button className="w-full">Xem đơn hàng của tôi</Button>
              </Link>
              <Link to="/shop">
                <Button variant="outline" className="w-full">Tiếp tục mua sắm</Button>
              </Link>
            </div>
          </div>
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
            backgroundImage: 'url(https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-950/60 via-emerald-900/65 to-teal-950/70" />
        
        {/* Glowing Orbs */}
        <div className="absolute top-20 -left-20 w-72 h-72 bg-emerald-500/8 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-teal-500/8 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 py-12 relative">
          <Link to="/cart" className="inline-flex items-center gap-2 text-emerald-100 hover:text-emerald-50 transition-colors mb-4">
            <ArrowLeft className="h-4 w-4" />
            Quay lại giỏ hàng
          </Link>
          <h1 className="text-4xl md:text-5xl font-black italic mb-4 bg-gradient-to-r from-emerald-400 via-green-300 to-teal-400 bg-clip-text text-transparent">
            Thanh toán
          </h1>
          <p className="text-emerald-100 text-lg max-w-2xl">
            Hoàn tất thông tin để đặt hàng
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Thông tin giao hàng</h2>
                
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

              {/* Payment Method */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Phương thức thanh toán</h2>
                <div className="flex items-center gap-3 p-4 bg-primary/10 border border-primary/20 rounded-lg">
                  <Truck className="h-6 w-6 text-primary" />
                  <div>
                    <p className="font-medium">Thanh toán khi nhận hàng (COD)</p>
                    <p className="text-sm text-muted-foreground">
                      Nhận hàng rồi mới thanh toán
                    </p>
                  </div>
                </div>
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
            <div className="bg-card border border-border rounded-lg p-6 sticky top-20">
              <h2 className="text-lg font-semibold mb-4">Đơn hàng của bạn</h2>
              
              <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                {Object.values(items).map(item => (
                  <div key={item.productId} className="flex gap-3">
                    <div className="w-12 h-12 rounded bg-muted overflow-hidden flex-shrink-0">
                      <img
                        src={item.imageUrlSnapshot}
                        alt={item.nameSnapshot}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.nameSnapshot}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.qty} x {formatMoney(item.priceSnapshot)}
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
                  <span>{totalQty} sản phẩm</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tạm tính:</span>
                  <span>{formatMoney(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-primary">
                    <span>Giảm giá (10%):</span>
                    <span>-{formatMoney(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Phí vận chuyển:</span>
                  <span>Liên hệ</span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between">
                  <span className="font-semibold">Tổng cộng:</span>
                  <span className="text-xl font-bold text-primary">{formatMoney(total)}</span>
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

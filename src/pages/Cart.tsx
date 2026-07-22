import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { CartItemRow } from '@/components/cart/CartItemRow';
import { CartSummary } from '@/components/cart/CartSummary';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';

const Cart = () => {
  const { items, itemCount, clearCart } = useCart();
  const cartItems = Object.values(items);

  if (itemCount === 0) {
    return (
      <Layout>
        <div className="mx-auto max-w-xl px-4 py-24 text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-primary"><ShoppingBag className="h-7 w-7" /></span>
          <h1 className="mt-6 text-3xl font-extrabold tracking-[-0.035em]">Giỏ hàng trống</h1>
          <p className="text-muted-foreground mb-6">
            Bạn chưa thêm sản phẩm nào vào giỏ hàng
          </p>
          <Link to="/shop">
            <Button className="gap-2">
              Tiếp tục mua sắm
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 pb-10 pt-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1400px]">
          <h1 className="text-4xl font-extrabold tracking-[-0.05em] text-foreground sm:text-5xl">
            Giỏ hàng của bạn
          </h1>
          <p className="mt-4 text-muted-foreground">
            {itemCount} đơn vị bán đang chờ thanh toán
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-4 pb-20 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={clearCart}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Xóa tất cả
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-border bg-card p-4 sm:p-6">
              {cartItems.map(item => (
                <CartItemRow key={item.productId} item={item} />
              ))}
            </div>

            <div className="mt-4">
              <Link to="/shop">
                <Button variant="outline" className="gap-2 border-primary/20 hover:border-primary hover:bg-gradient-eco hover:text-white transition-all duration-300">
                  Tiếp tục mua sắm
                </Button>
              </Link>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <CartSummary />
              
              <Link to="/checkout" className="block mt-4">
                <Button className="w-full gap-2" size="lg">
                  Tiến hành thanh toán
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>

              <p className="text-xs text-muted-foreground text-center mt-3">
                Giá cuối cùng sẽ được tính tại bước thanh toán
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;

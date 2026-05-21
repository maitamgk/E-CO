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
        <div className="container mx-auto px-4 py-16 text-center">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Giỏ hàng trống</h1>
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
      {/* Hero Section */}
      <div className="relative bg-background border-b border-border/40 py-16 text-center">
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-3xl md:text-4xl font-heading text-primary mb-4">
            Giỏ hàng của bạn
          </h1>
          <p className="text-muted-foreground font-light max-w-2xl mx-auto">
            {itemCount} sản phẩm đang chờ thanh toán
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
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
            <div className="bg-white border border-border/40 p-4">
              {cartItems.map(item => (
                <CartItemRow key={item.productId} item={item} />
              ))}
            </div>

            <div className="mt-4">
              <Link to="/shop">
                <Button variant="outline" className="gap-2">
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

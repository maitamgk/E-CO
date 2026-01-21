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
      <div className="relative bg-gradient-to-br from-green-950 via-emerald-900 to-teal-950 text-white overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 opacity-35"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=1920&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-950/60 via-emerald-900/65 to-teal-950/70" />
        
        {/* Glowing Orbs */}
        <div className="absolute top-20 -left-20 w-72 h-72 bg-emerald-500/8 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-teal-500/8 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 py-16 relative">
          <h1 className="text-4xl md:text-5xl font-black italic mb-4 bg-gradient-to-r from-emerald-400 via-green-300 to-teal-400 bg-clip-text text-transparent">
            Giỏ hàng của bạn
          </h1>
          <p className="text-emerald-100 text-lg max-w-2xl">
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
            <div className="bg-card border border-border rounded-lg p-4">
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

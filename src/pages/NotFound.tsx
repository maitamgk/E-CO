import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Home, ShoppingBag, ArrowLeft, Leaf, Search } from 'lucide-react';

const NotFound = () => {
  return (
    <Layout>
      <div className="min-h-[70vh] flex items-center justify-center relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-[100px] animate-float" style={{ animationDelay: '2s' }} />

        {/* Floating leaves */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <Leaf
              key={i}
              className="absolute text-primary/20 animate-float"
              style={{
                left: `${15 + i * 15}%`,
                top: `${10 + (i % 3) * 30}%`,
                width: `${24 + i * 8}px`,
                height: `${24 + i * 8}px`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${4 + i}s`,
                transform: `rotate(${i * 30}deg)`,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            {/* 404 Number with gradient */}
            <div className="relative mb-8">
              <h1 className="text-[150px] md:text-[200px] font-black leading-none bg-gradient-to-br from-primary via-accent-foreground to-primary bg-clip-text text-transparent select-none">
                404
              </h1>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="p-6 bg-background/80 backdrop-blur-xl rounded-3xl border border-border shadow-2xl">
                  <Search className="h-12 w-12 text-muted-foreground" />
                </div>
              </div>
            </div>

            {/* Message */}
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Trang không tồn tại
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
              Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/">
                <Button size="lg" className="gap-2 h-14 px-8 text-lg rounded-2xl shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 hover:scale-105 transition-all">
                  <Home className="h-5 w-5" />
                  Về trang chủ
                </Button>
              </Link>
              <Link to="/shop">
                <Button size="lg" variant="outline" className="gap-2 h-14 px-8 text-lg rounded-2xl hover:scale-105 transition-all">
                  <ShoppingBag className="h-5 w-5" />
                  Xem sản phẩm
                </Button>
              </Link>
            </div>

            {/* Back button */}
            <button
              onClick={() => window.history.back()}
              className="mt-8 inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại trang trước
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;

import { Layout } from '@/components/layout/Layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useProducts } from '@/context/ProductsContext';
import { formatMoney } from '@/utils/money';
import { Percent, Check, ArrowRight, Package, Boxes } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ScrollAnimate } from '@/components/ui/scroll-animate';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const Pricing = () => {
  const { products } = useProducts();

  return (
    <Layout>
      {/* Hero Section with Background */}
      <section className="relative overflow-hidden py-16 bg-gradient-to-br from-green-950 via-emerald-900 to-teal-950">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1505934346881-b72b27e84530?w=1920&h=600&fit=crop"
            alt="Green Forest"
            className="w-full h-full object-cover object-center opacity-40"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-green-950/55 via-emerald-900/60 to-teal-950/65" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-6xl xl:text-7xl font-heading font-bold text-white mb-4 drop-shadow-[0_2px_20px_rgba(0,0,0,0.5)]">
              Bảng giá <span className="text-emerald-300">sản phẩm</span>
            </h1>
            <p className="text-emerald-100 max-w-2xl mx-auto text-lg">
              Chúng tôi cung cấp giá sỉ ưu đãi cho các đơn hàng lớn. 
              Đặc biệt, đơn hàng từ 1000 sản phẩm được giảm thêm 10%.
            </p>
          </div>

          {/* Discount Highlight */}
          <div className="bg-primary text-white rounded-none p-8 mb-12 text-center shadow-2xl border border-secondary">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Percent className="h-10 w-10" />
              <span className="text-4xl font-bold">GIẢM 10%</span>
            </div>
            <p className="text-xl mb-2 font-semibold">Cho đơn hàng từ 1000 sản phẩm trở lên</p>
            <p className="text-emerald-50">
              Áp dụng tự động khi thanh toán. Giảm giá được tính trên server để đảm bảo chính xác.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Pricing Tiers - Enhanced */}
        <ScrollAnimate animation="fade-in-up">
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Retail Card */}
            <div className="group relative overflow-hidden border border-border rounded-none p-8 bg-white dark:bg-gray-950 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-none blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-3xl font-heading font-bold text-foreground">Giá lẻ</h3>
                  <div className="p-3 bg-primary/10 rounded-none group-hover:scale-110 transition-transform duration-300">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
                  Phù hợp cho cá nhân, hộ gia đình, sự kiện nhỏ
                </p>
                
                <ul className="space-y-4">
                  <li className="flex items-start gap-3 group/item">
                    <div className="mt-0.5 p-1 bg-primary/10 rounded-none group-hover/item:scale-110 transition-transform">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm text-foreground flex-1">Đặt hàng số lượng bất kỳ</span>
                  </li>
                  <li className="flex items-start gap-3 group/item">
                    <div className="mt-0.5 p-1 bg-primary/10 rounded-none group-hover/item:scale-110 transition-transform">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm text-foreground flex-1">Giao hàng COD toàn quốc</span>
                  </li>
                  <li className="flex items-start gap-3 group/item">
                    <div className="mt-0.5 p-1 bg-primary/10 rounded-none group-hover/item:scale-110 transition-transform">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm text-foreground flex-1">Bảo hành 3 tháng</span>
                  </li>
                </ul>
                
                <Link to="/shop" className="block mt-8">
                  <Button variant="outline" className="w-full rounded-none border border-primary text-primary hover:bg-primary hover:text-primary-foreground font-bold uppercase tracking-widest transition-all duration-300">
                    Mua ngay
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Wholesale Card - Featured */}
            <div className="group relative overflow-hidden border border-secondary rounded-none bg-primary hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]">
              {/* Popular Badge */}
              <div className="relative z-10 flex justify-center pt-3">
                <Badge className="px-6 py-2 bg-emerald-600 rounded-none text-white border-0 shadow-lg font-bold text-xs uppercase tracking-widest">
                  ⭐ Phổ biến nhất
                </Badge>
              </div>
              
              {/* Content with padding */}
              <div className="p-8 pt-6">
                
                <div className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-3xl font-heading font-bold text-white">
                      Giá sỉ
                    </h3>
                    <div className="p-3 bg-white/10 rounded-none group-hover:scale-110 transition-all duration-300">
                      <Boxes className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  
                  <p className="text-emerald-100 mb-6 text-sm font-medium">
                    Phù hợp cho nhà hàng, quán ăn, đại lý phân phối
                  </p>
                  
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start gap-3 group/item">
                      <div className="mt-0.5 p-1 bg-white/10 rounded-none group-hover/item:scale-110 transition-transform">
                        <Check className="h-4 w-4 text-emerald-300" />
                      </div>
                      <span className="text-sm text-white flex-1 font-medium">Giá ưu đãi theo số lượng</span>
                    </li>
                    <li className="flex items-start gap-3 group/item">
                      <div className="mt-0.5 p-1 bg-white/10 rounded-none group-hover/item:scale-110 transition-transform">
                        <Check className="h-4 w-4 text-emerald-300" />
                      </div>
                      <span className="text-sm text-white flex-1 font-medium">Giảm thêm 10% khi ≥ 1000 sp</span>
                    </li>
                    <li className="flex items-start gap-3 group/item">
                      <div className="mt-0.5 p-1 bg-white/10 rounded-none group-hover/item:scale-110 transition-transform">
                        <Check className="h-4 w-4 text-emerald-300" />
                      </div>
                      <span className="text-sm text-white flex-1 font-medium">Hỗ trợ đặt hàng định kỳ</span>
                    </li>
                    <li className="flex items-start gap-3 group/item">
                      <div className="mt-0.5 p-1 bg-white/10 rounded-none group-hover/item:scale-110 transition-transform">
                        <Check className="h-4 w-4 text-emerald-300" />
                      </div>
                      <span className="text-sm text-white flex-1 font-medium">Tư vấn miễn phí</span>
                    </li>
                  </ul>
                  
                  <Link to="/shop" className="block">
                    <Button className="w-full rounded-none bg-white text-foreground hover:bg-primary hover:text-white border border-white transition-all duration-300 font-bold text-sm uppercase tracking-widest h-12">
                      Đặt hàng ngay
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </ScrollAnimate>

        {/* Price Table */}
        <ScrollAnimate animation="fade-in-up" delay={200}>
          <div className="border border-border rounded-none overflow-hidden mb-12 shadow-xl bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sản phẩm</TableHead>
                  <TableHead className="text-right">Giá lẻ</TableHead>
                  <TableHead className="text-right">Giá sỉ</TableHead>
                  <TableHead className="text-right">SL tối thiểu (sỉ)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map(product => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="text-right">{formatMoney(product.priceRetail)}</TableCell>
                    <TableCell className="text-right text-primary font-semibold">
                      {formatMoney(product.priceWholesale)}
                    </TableCell>
                    <TableCell className="text-right">{product.wholesaleMinQty}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </ScrollAnimate>

        {/* CTA */}
        <ScrollAnimate animation="fade-in-up" delay={300}>
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              Liên hệ ngay để được tư vấn và báo giá chi tiết
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/shop">
                <Button size="lg" className="gap-2 rounded-none uppercase tracking-widest font-bold">
                  Đặt hàng ngay
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="rounded-none uppercase tracking-widest font-bold border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                Liên hệ tư vấn: 0123 456 789
              </Button>
            </div>
          </div>
        </ScrollAnimate>
      </div>
    </Layout>
  );
};

export default Pricing;

import { Layout } from '@/components/layout/Layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useProducts } from '@/context/ProductsContext';
import { formatMoney } from '@/utils/money';
import { Percent, Check, ArrowRight, Package, Boxes } from 'lucide-react';
import { Link } from 'react-router-dom';
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
            <h1 className="text-4xl lg:text-5xl font-black italic text-white mb-4 drop-shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              Bảng giá <span className="bg-gradient-to-r from-emerald-300 via-green-300 to-teal-300 bg-clip-text text-transparent">sản phẩm</span>
            </h1>
            <p className="text-emerald-100 max-w-2xl mx-auto text-lg">
              Chúng tôi cung cấp giá sỉ ưu đãi cho các đơn hàng lớn. 
              Đặc biệt, đơn hàng từ 1000 sản phẩm được giảm thêm 10%.
            </p>
          </div>

          {/* Discount Highlight */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl p-8 mb-12 text-center shadow-2xl shadow-emerald-500/30 border border-emerald-400/30">
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
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Retail Card */}
          <div className="group relative overflow-hidden border-2 border-gray-200 dark:border-gray-800 rounded-3xl p-8 bg-white dark:bg-gray-950 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Giá lẻ</h3>
                <div className="p-3 bg-emerald-100 dark:bg-emerald-950/30 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <Package className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
                Phù hợp cho cá nhân, hộ gia đình, sự kiện nhỏ
              </p>
              
              <ul className="space-y-4">
                <li className="flex items-start gap-3 group/item">
                  <div className="mt-0.5 p-1 bg-emerald-100 dark:bg-emerald-950/30 rounded-full group-hover/item:scale-110 transition-transform">
                    <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">Đặt hàng số lượng bất kỳ</span>
                </li>
                <li className="flex items-start gap-3 group/item">
                  <div className="mt-0.5 p-1 bg-emerald-100 dark:bg-emerald-950/30 rounded-full group-hover/item:scale-110 transition-transform">
                    <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">Giao hàng COD toàn quốc</span>
                </li>
                <li className="flex items-start gap-3 group/item">
                  <div className="mt-0.5 p-1 bg-emerald-100 dark:bg-emerald-950/30 rounded-full group-hover/item:scale-110 transition-transform">
                    <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">Bảo hành 3 tháng</span>
                </li>
              </ul>
              
              <Link to="/shop" className="block mt-8">
                <Button variant="outline" className="w-full rounded-full border-2 group-hover:border-emerald-500 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/30 transition-all duration-300">
                  Mua ngay
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Wholesale Card - Featured */}
          <div className="group relative overflow-hidden border-2 border-emerald-500 dark:border-emerald-600 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]">
            {/* Popular Badge */}
            <div className="relative z-10 flex justify-center pt-3">
              <Badge className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 shadow-lg shadow-emerald-500/30 font-bold text-sm">
                ⭐ Phổ biến nhất
              </Badge>
            </div>
            
            {/* Content with padding */}
            <div className="p-8 pt-6">
              {/* Animated background orb */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
              
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 dark:from-emerald-300 dark:to-teal-300 bg-clip-text text-transparent">
                    Giá sỉ
                  </h3>
                  <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg shadow-emerald-500/30">
                    <Boxes className="h-6 w-6 text-white" />
                  </div>
                </div>
                
                <p className="text-emerald-800 dark:text-emerald-200 mb-6 text-sm font-medium">
                  Phù hợp cho nhà hàng, quán ăn, đại lý phân phối
                </p>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3 group/item">
                    <div className="mt-0.5 p-1 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full group-hover/item:scale-110 transition-transform shadow-sm">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm text-emerald-900 dark:text-emerald-100 flex-1 font-medium">Giá ưu đãi theo số lượng</span>
                  </li>
                  <li className="flex items-start gap-3 group/item">
                    <div className="mt-0.5 p-1 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full group-hover/item:scale-110 transition-transform shadow-sm">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm text-emerald-900 dark:text-emerald-100 flex-1 font-medium">Giảm thêm 10% khi ≥ 1000 sp</span>
                  </li>
                  <li className="flex items-start gap-3 group/item">
                    <div className="mt-0.5 p-1 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full group-hover/item:scale-110 transition-transform shadow-sm">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm text-emerald-900 dark:text-emerald-100 flex-1 font-medium">Hỗ trợ đặt hàng định kỳ</span>
                  </li>
                  <li className="flex items-start gap-3 group/item">
                    <div className="mt-0.5 p-1 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full group-hover/item:scale-110 transition-transform shadow-sm">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm text-emerald-900 dark:text-emerald-100 flex-1 font-medium">Tư vấn miễn phí</span>
                  </li>
                </ul>
                
                <Link to="/shop" className="block">
                  <Button className="w-full rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-300 font-bold text-base h-12">
                    Đặt hàng ngay
                    <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Price Table */}
        <div className="border-2 border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden mb-12 shadow-xl">
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

        {/* CTA */}
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Liên hệ ngay để được tư vấn và báo giá chi tiết
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/shop">
              <Button size="lg" className="gap-2">
                Đặt hàng ngay
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              Liên hệ tư vấn: 0123 456 789
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Pricing;

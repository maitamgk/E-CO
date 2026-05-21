import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useProducts } from '@/context/ProductsContext';
import { formatMoney } from '@/utils/money';
import { Percent, Check, Package, Boxes } from 'lucide-react';
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
      <section className="relative overflow-hidden py-16 bg-background border-b border-border/40">
        <div className="container mx-auto px-4 relative z-10 text-center">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-3xl md:text-4xl font-heading text-gradient-eco mb-4 font-bold">
              Bảng giá sản phẩm
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto font-light">
              Chúng tôi cung cấp giá sỉ ưu đãi cho các đơn hàng lớn. 
              Đặc biệt, đơn hàng từ 1000 sản phẩm được giảm thêm 10%.
            </p>
          </div>

          {/* Discount Highlight */}
          <div className="bg-background border border-border/40 text-primary p-8 mb-12 text-center max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Percent className="h-8 w-8 text-primary/40 stroke-[1.5]" />
              <span className="text-2xl font-heading">GIẢM 10%</span>
            </div>
            <p className="mb-2 font-medium">Cho đơn hàng từ 1000 sản phẩm trở lên</p>
            <p className="text-sm text-muted-foreground font-light">
              Áp dụng tự động khi thanh toán. Giảm giá được tính trên server để đảm bảo chính xác.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Pricing Tiers - Enhanced */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Retail Card */}
          <div className="group relative bg-background border border-border/40 p-8 hover:border-primary/50 transition-colors duration-300">
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-heading text-primary">Giá lẻ</h3>
                <Package className="h-6 w-6 text-primary/40 stroke-[1.5]" />
              </div>
              
              <p className="text-muted-foreground font-light mb-6 text-sm">
                Phù hợp cho cá nhân, hộ gia đình, sự kiện nhỏ
              </p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 mt-0.5 text-primary stroke-[1.5]" />
                  <span className="text-sm font-light text-foreground flex-1">Đặt hàng số lượng bất kỳ</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 mt-0.5 text-primary stroke-[1.5]" />
                  <span className="text-sm font-light text-foreground flex-1">Giao hàng COD toàn quốc</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 mt-0.5 text-primary stroke-[1.5]" />
                  <span className="text-sm font-light text-foreground flex-1">Bảo hành 3 tháng</span>
                </li>
              </ul>
              
              <Link to="/shop" className="block mt-auto">
                <Button variant="outline" className="w-full rounded-none border-primary/20 hover:border-primary hover:bg-primary/5 text-primary h-12">
                  Mua ngay
                </Button>
              </Link>
            </div>
          </div>

          {/* Wholesale Card - Featured */}
          <div className="group relative bg-gradient-eco p-8 hover:opacity-95 transition-all duration-300 text-white shadow-lg">
            {/* Popular Badge */}
            <div className="absolute top-4 right-4">
              <span className="text-xs uppercase tracking-widest text-primary-foreground/70 font-medium border border-primary-foreground/20 px-3 py-1">
                Phổ biến nhất
              </span>
            </div>
            
            <div className="relative pt-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-heading text-primary-foreground">Giá sỉ</h3>
                <Boxes className="h-6 w-6 text-primary-foreground/40 stroke-[1.5]" />
              </div>
              
              <p className="text-primary-foreground/80 mb-6 text-sm font-light">
                Phù hợp cho nhà hàng, quán ăn, đại lý phân phối
              </p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 mt-0.5 text-primary-foreground stroke-[1.5]" />
                  <span className="text-sm font-light text-primary-foreground/90 flex-1">Giá ưu đãi theo số lượng</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 mt-0.5 text-primary-foreground stroke-[1.5]" />
                  <span className="text-sm font-light text-primary-foreground/90 flex-1">Giảm thêm 10% khi ≥ 1000 sp</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 mt-0.5 text-primary-foreground stroke-[1.5]" />
                  <span className="text-sm font-light text-primary-foreground/90 flex-1">Hỗ trợ đặt hàng định kỳ</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 mt-0.5 text-primary-foreground stroke-[1.5]" />
                  <span className="text-sm font-light text-primary-foreground/90 flex-1">Tư vấn miễn phí</span>
                </li>
              </ul>
              
              <Link to="/shop" className="block">
                <Button className="w-full rounded-none bg-background text-primary hover:bg-white h-12">
                  Đặt hàng ngay
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Price Table */}
        <div className="border border-border/40 mb-12">
          <Table>
            <TableHeader>
              <TableRow className="border-border/40 hover:bg-transparent">
                <TableHead className="font-heading text-primary">Sản phẩm</TableHead>
                <TableHead className="text-right font-heading text-primary">Giá lẻ</TableHead>
                <TableHead className="text-right font-heading text-primary">Giá sỉ</TableHead>
                <TableHead className="text-right font-heading text-primary">SL tối thiểu (sỉ)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map(product => (
                <TableRow key={product.id} className="border-border/20 hover:bg-background">
                  <TableCell className="font-medium text-primary">{product.name}</TableCell>
                  <TableCell className="text-right font-light">{formatMoney(product.priceRetail)}</TableCell>
                  <TableCell className="text-right text-primary">
                    {formatMoney(product.priceWholesale)}
                  </TableCell>
                  <TableCell className="text-right font-light">{product.wholesaleMinQty}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* CTA */}
        <div className="text-center p-8 bg-background border border-border/40">
          <p className="text-muted-foreground mb-6 font-light">
            Liên hệ ngay để được tư vấn và báo giá chi tiết
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/shop">
              <Button size="lg" className="rounded-none">
                Đặt hàng ngay
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="rounded-none border-primary text-primary hover:bg-gradient-eco hover:text-white hover:border-transparent transition-all duration-300">
              Liên hệ tư vấn: 0385 959 294
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Pricing;

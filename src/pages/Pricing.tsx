import { Link } from 'react-router-dom';
import { Building2, Check, Package, Store } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useProducts } from '@/context/ProductsContext';
import { formatMoney } from '@/utils/money';
import customLogo from '@/assets/products/custom-logo-beco.jpg';

const Pricing = () => {
  const { products } = useProducts();

  return (
    <Layout>
      <section className="px-4 pb-12 pt-6 sm:px-6 sm:pb-16 lg:px-8">
        <div className="mx-auto grid max-w-[1400px] overflow-hidden rounded-2xl border border-border bg-card lg:grid-cols-[0.92fr_1.08fr]">
          <div className="flex items-center p-8 sm:p-12 lg:p-14">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-extrabold tracking-[-0.05em] text-foreground sm:text-6xl">Bảng giá minh bạch</h1>
              <p className="mt-5 max-w-[55ch] text-base leading-7 text-muted-foreground sm:text-lg">Giá bán lẻ, phân phối và doanh nghiệp được công khai theo từng mã sản phẩm.</p>
              <Button asChild className="mt-7"><Link to="/contact">Nhận báo giá</Link></Button>
            </div>
          </div>
          <div className="relative min-h-[320px] bg-secondary">
            <img src={customLogo} alt="Sản phẩm B-ECO khắc logo doanh nghiệp" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-y-0 left-0 hidden w-24 bg-gradient-to-r from-card to-transparent lg:block" />
          </div>
        </div>
      </section>

      <section className="px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1400px] gap-5 lg:grid-cols-12">
          <div className="rounded-2xl border border-border bg-card p-7 lg:col-span-5 lg:p-9">
            <Package className="h-7 w-7 text-primary" />
            <h2 className="mt-7 text-3xl font-extrabold tracking-[-0.035em] text-foreground">Giá bán lẻ</h2>
            <p className="mt-3 leading-7 text-muted-foreground">Cho gia đình, quà tặng và sự kiện quy mô nhỏ.</p>
            <div className="mt-7 grid gap-3 text-sm text-foreground">
              {['Đơn vị bán ghi rõ theo từng sản phẩm', 'Giao hàng COD toàn quốc', 'Thanh toán theo giá niêm yết'].map(item => (
                <span key={item} className="flex items-center gap-3"><Check className="h-4 w-4 text-accent" />{item}</span>
              ))}
            </div>
            <Button asChild variant="outline" className="mt-8"><Link to="/shop">Mua sản phẩm</Link></Button>
          </div>

          <div className="rounded-2xl bg-primary p-7 text-primary-foreground lg:col-span-7 lg:p-9">
            <Store className="h-7 w-7 text-accent" />
            <h2 className="mt-7 text-3xl font-extrabold tracking-[-0.035em]">Giá phân phối</h2>
            <p className="mt-3 max-w-[55ch] leading-7 text-primary-foreground/72">Cho nhà hàng, đại lý, khách sạn và đơn vị đặt hàng định kỳ.</p>
            <div className="mt-7 grid gap-3 text-sm sm:grid-cols-2">
              {['Mức giá theo số lượng', 'Điều kiện riêng cho từng mã', 'Hỗ trợ đơn hàng định kỳ', 'Tư vấn trước khi xác nhận'].map(item => (
                <span key={item} className="flex items-center gap-3"><Check className="h-4 w-4 text-accent" />{item}</span>
              ))}
            </div>
            <Button asChild className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90"><Link to="/contact">Nhận tư vấn</Link></Button>
          </div>

          <div className="flex flex-col gap-5 rounded-2xl border border-border bg-secondary/70 p-7 sm:flex-row sm:items-center sm:justify-between lg:col-span-12 lg:p-9">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-card text-primary"><Building2 className="h-5 w-5" /></span>
              <div>
                <h2 className="text-xl font-bold text-foreground">Giá doanh nghiệp</h2>
                <p className="mt-2 max-w-[65ch] text-sm leading-6 text-muted-foreground">Dành cho đơn hàng lớn, khắc logo và quà tặng theo yêu cầu. Điều kiện áp dụng được xác nhận trực tiếp.</p>
              </div>
            </div>
            <Button asChild className="flex-none"><a href="tel:0382548419">Gọi 0382 548 419</a></Button>
          </div>
        </div>
      </section>

      <section className="bg-secondary/45 px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-8 max-w-2xl">
            <h2 className="text-3xl font-extrabold tracking-[-0.04em] text-foreground sm:text-4xl">Chi tiết theo mã sản phẩm</h2>
            <p className="mt-3 leading-7 text-muted-foreground">Bảng giá cập nhật cho 11 sản phẩm B-ECO Daily và B-ECO Art.</p>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-[0_18px_50px_hsl(var(--primary)/0.07)]">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/60 hover:bg-secondary/60">
                  <TableHead className="whitespace-nowrap font-bold text-foreground">Mã SP</TableHead>
                  <TableHead className="min-w-64 font-bold text-foreground">Sản phẩm</TableHead>
                  <TableHead className="whitespace-nowrap font-bold text-foreground">Đơn vị</TableHead>
                  <TableHead className="whitespace-nowrap text-right font-bold text-foreground">Bán lẻ</TableHead>
                  <TableHead className="whitespace-nowrap text-right font-bold text-foreground">Phân phối</TableHead>
                  <TableHead className="whitespace-nowrap text-right font-bold text-foreground">Điều kiện</TableHead>
                  <TableHead className="whitespace-nowrap text-right font-bold text-foreground">Doanh nghiệp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map(product => (
                  <TableRow key={product.id}>
                    <TableCell className="whitespace-nowrap font-mono text-xs">{product.sku ?? '-'}</TableCell>
                    <TableCell className="font-semibold text-foreground">{product.name}</TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">{product.salesUnit ?? 'cái'}</TableCell>
                    <TableCell className="whitespace-nowrap text-right">{formatMoney(product.priceRetail)}</TableCell>
                    <TableCell className="whitespace-nowrap text-right font-bold text-primary">{formatMoney(product.priceWholesale)}</TableCell>
                    <TableCell className="whitespace-nowrap text-right text-muted-foreground">{product.wholesaleThresholdLabel ?? product.wholesaleMinQty}</TableCell>
                    <TableCell className="whitespace-nowrap text-right font-semibold">{product.priceEnterprise !== undefined ? formatMoney(product.priceEnterprise) : 'Liên hệ'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Pricing;

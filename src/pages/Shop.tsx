import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Grid3X3, LayoutGrid, Leaf, Search, X } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { useProducts } from '@/context/ProductsContext';
import { categories } from '@/data/mockProducts';
import { cn } from '@/lib/utils';
import leafVariety from '@/assets/products/leaf-plates-variety.webp';
import { Seo } from '@/components/Seo';

const Shop = () => {
  const { products, isLoading } = useProducts();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [showWholesale, setShowWholesale] = useState(false);
  const [gridSize, setGridSize] = useState<'normal' | 'large'>('normal');

  useEffect(() => {
    const requestedCategory = searchParams.get('category');
    const requestedSearch = searchParams.get('search');
    setCategory(requestedCategory && categories.some(item => item.id === requestedCategory) ? requestedCategory : 'all');
    setSearch(requestedSearch ?? '');
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('vi');
    return products.filter(product => {
      const matchesQuery = !query || product.name.toLocaleLowerCase('vi').includes(query) || product.description.toLocaleLowerCase('vi').includes(query) || product.sku?.toLocaleLowerCase('vi').includes(query);
      return matchesQuery && (category === 'all' || product.category === category);
    });
  }, [products, search, category]);

  return (
    <Layout>
      <Seo
        title="Cửa hàng sản phẩm B-ECO"
        description="Toàn bộ sản phẩm sinh học và mỹ nghệ từ lá bàng biển: chén, dĩa, combo, khắc logo doanh nghiệp và dòng B-ECO Art. Ba mức giá minh bạch."
      />
      <section className="px-4 pb-8 pt-6 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1400px] overflow-hidden rounded-2xl border border-border bg-card lg:grid-cols-[0.86fr_1.14fr]">
          <div className="flex items-center p-8 sm:p-12 lg:p-14">
            <div className="max-w-xl">
              <h1 className="text-4xl font-extrabold tracking-[-0.05em] text-foreground sm:text-6xl">Sản phẩm B-ECO</h1>
              <p className="mt-5 max-w-[52ch] text-base leading-7 text-muted-foreground sm:text-lg">Vật dụng sinh học và mỹ nghệ từ lá bàng biển, với ba mức giá minh bạch.</p>
            </div>
          </div>
          <div className="relative min-h-[300px] bg-secondary">
            <img src={leafVariety} alt="Bộ sản phẩm B-ECO từ lá bàng biển" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-y-0 left-0 hidden w-24 bg-gradient-to-r from-card to-transparent lg:block" />
          </div>
        </div>
      </section>

      <section className="sticky top-[72px] z-30 border-y border-border/70 bg-background/94 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={event => setSearch(event.target.value)}
                placeholder="Tìm theo tên hoặc mã sản phẩm"
                className="h-12 rounded-xl border-border bg-card pl-11 pr-11 shadow-none"
              />
              {search && (
                <button type="button" onClick={() => setSearch('')} className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary" aria-label="Xóa từ khóa">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <label className="flex h-12 cursor-pointer items-center justify-between gap-4 rounded-xl border border-border bg-card px-4 text-sm lg:min-w-64">
              <span>
                <strong className="block font-semibold text-foreground">Giá phân phối</strong>
                <span className="text-xs text-muted-foreground">Xem theo điều kiện số lượng</span>
              </span>
              <Switch checked={showWholesale} onCheckedChange={setShowWholesale} />
            </label>
            <div className="hidden h-12 items-center rounded-xl border border-border bg-card p-1 md:flex">
              <button type="button" onClick={() => setGridSize('normal')} className={cn('flex h-10 w-10 items-center justify-center rounded-lg', gridSize === 'normal' ? 'bg-secondary text-primary' : 'text-muted-foreground hover:text-foreground')} aria-label="Lưới ba cột"><Grid3X3 className="h-4 w-4" /></button>
              <button type="button" onClick={() => setGridSize('large')} className={cn('flex h-10 w-10 items-center justify-center rounded-lg', gridSize === 'large' ? 'bg-secondary text-primary' : 'text-muted-foreground hover:text-foreground')} aria-label="Lưới hai cột"><LayoutGrid className="h-4 w-4" /></button>
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map(item => (
              <button
                type="button"
                key={item.id}
                onClick={() => setCategory(item.id)}
                className={cn(
                  'h-10 flex-none rounded-full px-4 text-sm font-semibold transition-colors',
                  category === item.id ? 'bg-primary text-primary-foreground' : 'bg-secondary/75 text-foreground hover:bg-secondary',
                )}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-7 flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground"><strong className="text-foreground">{filteredProducts.length}</strong> sản phẩm phù hợp</p>
            {(search || category !== 'all') && (
              <Button variant="ghost" size="sm" onClick={() => { setSearch(''); setCategory('all'); }}>Xóa bộ lọc</Button>
            )}
          </div>

          {isLoading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="overflow-hidden rounded-2xl border border-border bg-card">
                  <Skeleton className="aspect-[4/3] rounded-none" />
                  <div className="space-y-4 p-6"><Skeleton className="h-4 w-2/3" /><Skeleton className="h-6 w-full" /><Skeleton className="h-5 w-1/2" /><Skeleton className="h-12 w-full rounded-xl" /></div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-20 text-center">
              <Leaf className="mx-auto h-12 w-12 text-primary/45" />
              <h2 className="mt-5 text-2xl font-bold text-foreground">Chưa tìm thấy sản phẩm</h2>
              <p className="mt-2 text-sm text-muted-foreground">Hãy thử một từ khóa hoặc danh mục khác.</p>
              <Button className="mt-6" onClick={() => { setSearch(''); setCategory('all'); }}>Xem tất cả</Button>
            </div>
          ) : (
            <div className={cn('grid gap-5 sm:grid-cols-2', gridSize === 'normal' ? 'lg:grid-cols-3 xl:grid-cols-4' : 'lg:grid-cols-2 xl:grid-cols-3')}>
              {filteredProducts.map(product => <ProductCard key={product.id} product={product} showWholesale={showWholesale} />)}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Shop;

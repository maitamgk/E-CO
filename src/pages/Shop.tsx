import { useState, useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/product/ProductCard';
import { ScrollAnimate } from '@/components/ui/scroll-animate';
import { useProducts } from '@/context/ProductsContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { categories } from '@/data/mockProducts';
import {
  Percent, Sparkles, ShoppingBag, Search, X, Filter,
  Grid3X3, LayoutGrid, SlidersHorizontal, Leaf, ChevronDown,
  Package, Tag, Boxes
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Shop = () => {
  const { products, isLoading } = useProducts();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [showWholesale, setShowWholesale] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [gridSize, setGridSize] = useState<'normal' | 'large'>('normal');

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'all' || product.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  const stats = useMemo(() => ({
    total: products.length,
    inStock: products.filter(p => p.stock > 0).length,
    lowStock: products.filter(p => p.stock > 0 && p.stock < 50).length,
  }), [products]);

  return (
    <Layout>
      {/* Hero Banner */}
      <section className="relative bg-background border-b border-border/40 py-16 lg:py-24 text-center">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading text-primary mb-4">
              Cửa hàng B-ECO
            </h1>
            <p className="text-muted-foreground font-light mb-8">
              Gieo mầm xanh - Từ chiếc lá nhỏ
            </p>

            {/* Search Bar - Flat */}
            <div className="max-w-xl mx-auto">
              <div className="relative flex items-center bg-white border border-border/40 rounded-none overflow-hidden h-12">
                <Search className="h-5 w-5 text-primary/40 ml-4 stroke-[1.5]" />
                <Input
                  placeholder="Tìm kiếm sản phẩm..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="flex-1 h-full border-0 focus-visible:ring-0 bg-transparent px-4 rounded-none shadow-none text-sm font-light"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="p-2 text-primary/40 hover:text-primary transition-colors"
                  >
                    <X className="h-4 w-4 stroke-[1.5]" />
                  </button>
                )}
                <Button className="h-full px-6 rounded-none bg-background text-primary hover:bg-primary/5 border-l border-border/40 font-normal uppercase tracking-widest text-[11px]">
                  Tìm
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="bg-muted/30 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Discount Banner */}
          <ScrollAnimate animation="fade-in-up">
            <div className="border border-border/40 bg-background p-4 lg:p-6 mb-8 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Percent className="h-6 w-6 text-primary stroke-[1.5]" />
                <div>
                  <div className="text-sm font-heading text-primary uppercase tracking-widest mb-1">
                    Giảm 10% từ 1000sp
                  </div>
                  <p className="text-xs text-muted-foreground font-light">Tự động khi thanh toán</p>
                </div>
              </div>
              <span className="text-[10px] uppercase tracking-widest text-primary border border-primary/20 px-2 py-1">Hot</span>
            </div>
          </ScrollAnimate>

          {/* Filter Bar */}
          <ScrollAnimate animation="fade-in-up" delay={100}>
            <div className="flex flex-wrap items-center gap-2 mb-4 sm:mb-6">
              {/* Toggle Sidebar */}
              <Button
                variant={sidebarOpen ? 'default' : 'outline'}
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="gap-2 rounded-none h-10 px-4 flex-shrink-0 text-xs uppercase tracking-widest font-normal"
              >
                <Filter className="h-4 w-4 stroke-[1.5]" />
                <span className="hidden xs:inline">Bộ lọc</span>
                <ChevronDown className={cn("h-4 w-4 transition-transform", sidebarOpen && "rotate-180")} />
              </Button>

              {/* Categories - Quick Access */}
              <div className="flex-1 flex flex-wrap gap-2">
                {categories.map(cat => (
                  <Button
                    key={cat.id}
                    variant={category === cat.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setCategory(cat.id);
                      if (window.innerWidth < 1024) {
                        setSidebarOpen(false);
                      }
                    }}
                    className={cn(
                      "rounded-none px-4 h-10 text-xs font-normal uppercase tracking-widest transition-colors",
                      category === cat.id
                        ? ''
                        : 'border-border/40 hover:bg-background hover:text-primary'
                    )}
                  >
                    {cat.name}
                  </Button>
                ))}
              </div>

              {/* Grid Toggle */}
              <div className="hidden md:flex items-center gap-1 bg-background border border-border/40 h-10 p-1">
                <button
                  onClick={() => setGridSize('normal')}
                  className={cn(
                    "p-1.5 transition-colors",
                    gridSize === 'normal' ? 'bg-primary text-primary-foreground' : 'hover:bg-primary/5 text-primary/60'
                  )}
                >
                  <Grid3X3 className="h-4 w-4 stroke-[1.5]" />
                </button>
                <button
                  onClick={() => setGridSize('large')}
                  className={cn(
                    "p-1.5 transition-colors",
                    gridSize === 'large' ? 'bg-primary text-primary-foreground' : 'hover:bg-primary/5 text-primary/60'
                  )}
                >
                  <LayoutGrid className="h-4 w-4 stroke-[1.5]" />
                </button>
              </div>
            </div>
          </ScrollAnimate>

          <div className="flex gap-4 lg:gap-8 relative">
            {/* Sidebar - Mobile Overlay */}
            {sidebarOpen && (
              <div 
                className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}
            
            <aside
              className={cn(
                "transition-all duration-500 ease-out z-50",
                "lg:w-72 lg:flex-shrink-0 lg:relative lg:translate-x-0 lg:opacity-100",
                // Mobile styles - fixed overlay
                "fixed lg:static top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-background lg:bg-transparent",
                "overflow-y-auto lg:overflow-visible border-r lg:border-0 border-border",
                sidebarOpen 
                  ? "translate-x-0 opacity-100 shadow-2xl lg:shadow-none" 
                  : "-translate-x-full opacity-0 lg:opacity-0 lg:-translate-x-full lg:w-0 lg:overflow-hidden"
              )}
            >
              {/* Mobile Close Button */}
              <div className="lg:hidden sticky top-0 bg-background z-10 p-4 border-b border-border flex items-center justify-between">
                <h3 className="font-bold text-lg">Bộ lọc</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(false)}
                  className="h-8 w-8"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="lg:sticky lg:top-24 space-y-6 p-4 lg:p-0">
                {/* Stats Cards */}
                <div className="bg-white border border-border/40 p-6 space-y-4">
                  <h3 className="font-heading text-lg text-primary flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4 stroke-[1.5]" />
                    Thống kê
                  </h3>
                  <div className="grid grid-cols-3 lg:grid-cols-1 gap-3">
                    {[
                      { label: 'Tổng sản phẩm', value: stats.total, icon: Package },
                      { label: 'Còn hàng', value: stats.inStock, icon: Boxes },
                      { label: 'Sắp hết', value: stats.lowStock, icon: Tag },
                    ].map((stat, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 border border-border/20">
                        <stat.icon className="h-4 w-4 text-primary/40 stroke-[1.5]" />
                        <div>
                          <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{stat.label}</div>
                          <div className="font-medium">{stat.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Wholesale Toggle */}
                <div className="bg-white border border-border/40 p-6">
                  <h3 className="font-heading text-lg text-primary flex items-center gap-2 mb-4">
                    <Tag className="h-4 w-4 stroke-[1.5]" />
                    Loại giá
                  </h3>
                  <div
                    className={cn(
                      "flex items-center justify-between p-4 border transition-colors cursor-pointer",
                      showWholesale ? "border-primary bg-primary/5" : "border-border/40 hover:border-primary/40"
                    )}
                    onClick={() => {
                      setShowWholesale(!showWholesale);
                      if (window.innerWidth < 1024) {
                        setTimeout(() => setSidebarOpen(false), 300);
                      }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <Percent className="h-4 w-4 text-primary/60 stroke-[1.5]" />
                      <div>
                        <div className="font-medium text-sm">Giá sỉ</div>
                        <div className="text-xs text-muted-foreground font-light">Tiết kiệm đến 15%</div>
                      </div>
                    </div>
                    <Switch
                      checked={showWholesale}
                      onCheckedChange={setShowWholesale}
                    />
                  </div>
                </div>

                {/* Eco Badge */}
                <div className="border border-border/40 p-6 text-center bg-background">
                  <Leaf className="h-6 w-6 text-primary mx-auto mb-3 stroke-[1.5]" />
                  <h4 className="font-heading text-base mb-2">100% Sinh học</h4>
                  <p className="text-[13px] text-muted-foreground font-light">
                    Tất cả sản phẩm đều làm từ lá bàng tự nhiên, phân hủy trong 45 ngày
                  </p>
                </div>
              </div>
            </aside>

            {/* Products Grid */}
            <main className="flex-1 min-w-0">
              {/* Results count */}
              <div className="flex items-center justify-between mb-4 lg:mb-6">
                <p className="text-sm lg:text-base text-muted-foreground">
                  Hiển thị <span className="font-semibold text-foreground">{filteredProducts.length}</span> sản phẩm
                  {category !== 'all' && (
                    <span className="hidden sm:inline"> trong <Badge variant="secondary" className="ml-1">{categories.find(c => c.id === category)?.name}</Badge></span>
                  )}
                </p>
              </div>

              {/* Grid */}
              {isLoading ? (
                <div className={cn(
                  "grid gap-4 sm:gap-5 lg:gap-6",
                  gridSize === 'normal'
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1 sm:grid-cols-2"
                )}>
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white border border-border/40 overflow-hidden">
                      <Skeleton className="aspect-square rounded-none" />
                      <div className="p-6 space-y-4">
                        <Skeleton className="h-4 w-3/4 rounded-none" />
                        <Skeleton className="h-4 w-full rounded-none" />
                        <Skeleton className="h-6 w-1/2 rounded-none" />
                        <Skeleton className="h-10 w-full rounded-none" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-12 lg:py-20">
                  <div className="p-4 lg:p-6 bg-muted/50 rounded-full inline-block mb-4 lg:mb-6">
                    <Search className="h-8 w-8 lg:h-12 lg:w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl lg:text-2xl font-bold mb-2">Không tìm thấy sản phẩm</h3>
                  <p className="text-sm lg:text-base text-muted-foreground mb-4 lg:mb-6">Thử thay đổi từ khóa hoặc bộ lọc</p>
                  <Button onClick={() => { setSearch(''); setCategory('all'); }}>
                    Xóa bộ lọc
                  </Button>
                </div>
              ) : (
                <div className={cn(
                  "grid gap-4 sm:gap-5 lg:gap-6",
                  gridSize === 'normal'
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1 sm:grid-cols-2"
                )}>
                  {filteredProducts.map((product, idx) => (
                    <ScrollAnimate key={product.id} animation="fade-in-up" delay={idx * 50}>
                      <ProductCard product={product} showWholesale={showWholesale} />
                    </ScrollAnimate>
                  ))}
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Shop;

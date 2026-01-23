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
  const [sidebarOpen, setSidebarOpen] = useState(true);
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
      {/* Hero Banner - with Almond Tree Background */}
      <section className="relative overflow-hidden py-12 sm:py-16 lg:py-28">
        {/* Background with leaf canopy */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1920&h=800&fit=crop"
            alt="Leaf Canopy"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-green-950/60 via-emerald-900/55 to-teal-950/60" />

          {/* Floating orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] animate-float" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-green-500/10 rounded-full blur-[100px] animate-float" style={{ animationDelay: '2s' }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4 lg:mb-6 px-3 py-1.5 lg:px-5 lg:py-2.5 text-xs lg:text-sm bg-emerald-500/20 text-emerald-300 border-emerald-500/40 backdrop-blur-xl animate-fade-in">
              <ShoppingBag className="h-3 w-3 lg:h-4 lg:w-4 mr-1.5 lg:mr-2" />
              {stats.total} sản phẩm có sẵn
            </Badge>

            <h1 className="text-3xl sm:text-4xl lg:text-6xl xl:text-7xl font-black italic text-white mb-4 lg:mb-6 animate-fade-in-up drop-shadow-[0_0_30px_rgba(16,185,129,0.3)]" style={{ animationDelay: '0.1s' }}>
              Cửa hàng{' '}
              <span className="bg-gradient-to-r from-emerald-300 via-green-300 to-teal-300 bg-clip-text text-transparent">
                B-ECO
              </span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-emerald-100 mb-6 lg:mb-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Gieo mầm xanh - Từ chiếc lá nhỏ
            </p>

            {/* Search Bar - Floating */}
            <div className="max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/50 to-teal-500/50 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative flex items-center bg-white dark:bg-gray-950 rounded-xl lg:rounded-2xl shadow-2xl border border-emerald-500/20 overflow-hidden">
                  <Search className="h-4 w-4 lg:h-5 lg:w-5 text-muted-foreground ml-3 lg:ml-5" />
                  <Input
                    placeholder="Tìm kiếm sản phẩm..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="flex-1 h-10 sm:h-12 lg:h-14 text-sm lg:text-lg border-0 focus-visible:ring-0 bg-transparent px-2 lg:px-4"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch('')}
                      className="p-1.5 lg:p-2 mr-1 lg:mr-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all"
                    >
                      <X className="h-4 w-4 lg:h-5 lg:w-5" />
                    </button>
                  )}
                  <Button className="h-8 sm:h-10 lg:h-12 px-3 sm:px-4 lg:px-6 mr-1 rounded-lg lg:rounded-xl text-xs sm:text-sm lg:text-base bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600">
                    <span className="hidden sm:inline">Tìm kiếm</span>
                    <Search className="h-4 w-4 sm:hidden" />
                  </Button>
                </div>
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
            <div className="relative overflow-hidden bg-gradient-to-r from-primary via-primary to-accent-foreground rounded-2xl lg:rounded-3xl p-4 sm:p-5 lg:p-8 mb-6 lg:mb-8 text-primary-foreground group hover:shadow-2xl transition-shadow">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute -right-20 -top-20 w-60 h-60 bg-background rounded-full" />
                <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-background rounded-full" />
              </div>

              <div className="relative flex flex-col lg:flex-row items-center gap-3 sm:gap-4 lg:gap-6">
                <div className="p-2.5 sm:p-3 lg:p-4 bg-background/20 rounded-xl lg:rounded-2xl backdrop-blur-xl group-hover:scale-110 transition-transform duration-300">
                  <Percent className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10" />
                </div>
                <div className="text-center lg:text-left flex-1">
                  <div className="text-base sm:text-lg lg:text-3xl font-bold mb-1">
                    <span className="hidden sm:inline">Giảm 10% cho đơn hàng từ 1000 sản phẩm</span>
                    <span className="sm:hidden">Giảm 10% từ 1000sp</span>
                  </div>
                  <p className="text-xs sm:text-sm lg:text-base opacity-90">Giảm giá được tính tự động khi thanh toán</p>
                </div>
                <Badge className="bg-background/20 text-primary-foreground border-background/30 px-3 py-1.5 lg:px-4 lg:py-2 text-xs sm:text-sm lg:text-base animate-pulse-glow">
                  <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                  Hot Deal
                </Badge>
              </div>
            </div>
          </ScrollAnimate>

          {/* Filter Bar */}
          <ScrollAnimate animation="fade-in-up" delay={100}>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 lg:gap-4 mb-6 lg:mb-8">
              {/* Toggle Sidebar */}
              <Button
                variant={sidebarOpen ? 'default' : 'outline'}
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl h-9 sm:h-10 lg:h-12 text-xs sm:text-sm px-3 sm:px-4"
              >
                <Filter className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Bộ lọc
                <ChevronDown className={cn("h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform", sidebarOpen && "rotate-180")} />
              </Button>

              {/* Categories - Quick Access */}
              <div className="flex-1 flex flex-wrap gap-1.5 sm:gap-2">
                {categories.map(cat => (
                  <Button
                    key={cat.id}
                    variant={category === cat.id ? 'default' : 'secondary'}
                    size="sm"
                    onClick={() => setCategory(cat.id)}
                    className={cn(
                      "rounded-full px-3 sm:px-4 lg:px-5 h-8 sm:h-9 lg:h-10 text-xs sm:text-sm transition-all duration-300",
                      category === cat.id
                        ? 'shadow-lg shadow-primary/25 scale-105'
                        : 'hover:scale-105'
                    )}
                  >
                    {cat.name}
                  </Button>
                ))}
              </div>

              {/* Grid Toggle */}
              <div className="hidden sm:flex items-center gap-1 bg-card rounded-xl p-1 border border-border">
                <button
                  onClick={() => setGridSize('normal')}
                  className={cn(
                    "p-2 rounded-lg transition-all",
                    gridSize === 'normal' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                  )}
                >
                  <Grid3X3 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setGridSize('large')}
                  className={cn(
                    "p-2 rounded-lg transition-all",
                    gridSize === 'large' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                  )}
                >
                  <LayoutGrid className="h-5 w-5" />
                </button>
              </div>
            </div>
          </ScrollAnimate>

          <div className="flex gap-4 lg:gap-8">
            {/* Sidebar */}
            <aside
              className={cn(
                "w-full lg:w-72 flex-shrink-0 transition-all duration-500 ease-out",
                sidebarOpen ? "opacity-100 translate-x-0" : "hidden lg:opacity-0 lg:-translate-x-full lg:w-0 lg:overflow-hidden"
              )}
            >
              <div className="sticky top-24 space-y-4 lg:space-y-6">
                {/* Stats Cards */}
                <div className="bg-card rounded-xl lg:rounded-2xl border border-border p-4 lg:p-5 space-y-3 lg:space-y-4">
                  <h3 className="font-bold flex items-center gap-2 text-base lg:text-lg">
                    <SlidersHorizontal className="h-4 w-4 lg:h-5 lg:w-5 text-primary" />
                    Thống kê
                  </h3>
                  <div className="grid grid-cols-3 lg:grid-cols-1 gap-2 lg:gap-3">
                    {[
                      { label: 'Tổng sản phẩm', value: stats.total, icon: Package, color: 'bg-primary/10 text-primary' },
                      { label: 'Còn hàng', value: stats.inStock, icon: Boxes, color: 'bg-accent text-accent-foreground' },
                      { label: 'Sắp hết', value: stats.lowStock, icon: Tag, color: 'bg-destructive/10 text-destructive' },
                    ].map((stat, idx) => (
                      <div key={idx} className="flex flex-col lg:flex-row items-center gap-2 lg:gap-3 p-2.5 lg:p-3 bg-muted/50 rounded-lg lg:rounded-xl group hover:bg-muted transition-colors">
                        <div className={cn("p-1.5 lg:p-2 rounded-lg", stat.color)}>
                          <stat.icon className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                        </div>
                        <div className="flex-1 text-center lg:text-left">
                          <div className="text-xs lg:text-sm text-muted-foreground">{stat.label}</div>
                          <div className="font-bold text-base lg:text-lg">{stat.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Wholesale Toggle */}
                <div className="bg-card rounded-xl lg:rounded-2xl border border-border p-4 lg:p-5">
                  <h3 className="font-bold flex items-center gap-2 text-base lg:text-lg mb-3 lg:mb-4">
                    <Tag className="h-4 w-4 lg:h-5 lg:w-5 text-primary" />
                    Loại giá
                  </h3>
                  <div
                    className={cn(
                      "flex items-center justify-between p-3 lg:p-4 rounded-xl border-2 cursor-pointer transition-all duration-300",
                      showWholesale ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    )}
                    onClick={() => setShowWholesale(!showWholesale)}
                  >
                    <div className="flex items-center gap-2 lg:gap-3">
                      <div className={cn(
                        "p-1.5 lg:p-2 rounded-lg transition-colors",
                        showWholesale ? "bg-primary text-primary-foreground" : "bg-muted"
                      )}>
                        <Percent className="h-4 w-4 lg:h-5 lg:w-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm lg:text-base">Giá sỉ</div>
                        <div className="text-xs lg:text-sm text-muted-foreground">Tiết kiệm đến 15%</div>
                      </div>
                    </div>
                    <Switch
                      checked={showWholesale}
                      onCheckedChange={setShowWholesale}
                    />
                  </div>
                </div>

                {/* Eco Badge */}
                <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl lg:rounded-2xl border border-primary/20 p-4 lg:p-5 text-center">
                  <div className="p-3 lg:p-4 bg-primary/10 rounded-xl lg:rounded-2xl inline-block mb-2 lg:mb-3">
                    <Leaf className="h-6 w-6 lg:h-8 lg:w-8 text-primary" />
                  </div>
                  <h4 className="font-bold mb-1.5 lg:mb-2 text-sm lg:text-base">100% Sinh học</h4>
                  <p className="text-xs lg:text-sm text-muted-foreground">
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
                    <div key={i} className="bg-card rounded-2xl border border-border overflow-hidden">
                      <Skeleton className="aspect-square" />
                      <div className="p-5 space-y-3">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-8 w-1/2" />
                        <Skeleton className="h-12 w-full" />
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

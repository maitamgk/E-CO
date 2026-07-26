import { useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useProducts } from '@/context/ProductsContext';
import { useCart } from '@/context/CartContext';
import { formatMoney, formatNumber } from '@/utils/money';
import { TIER_LABELS, pricingSourceFromProduct, resolveTier, shortUnit } from '@/utils/pricing';
import { SITE_URL, Seo } from '@/components/Seo';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { ProductReviews } from '@/components/product/ProductReviews';
import { RelatedProducts } from '@/components/product/RelatedProducts';
import {
  ShoppingCart,
  Plus,
  Minus,
  Check,
  ArrowLeft,
  Sparkles,
  Heart,
  Share2,
  Truck,
  Shield,
  Leaf,
  ZoomIn,
  X,
  Package,
  MessageSquare,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getCategoryName } from '@/data/mockProducts';

// Import all product images for gallery
import collectionDisplay1 from '@/assets/products/collection-display-1.webp';
import exhibitionDisplay from '@/assets/products/exhibition-display.webp';
import leafPlatesCloseup from '@/assets/products/leaf-plates-closeup.webp';
import leafPlatesVariety from '@/assets/products/leaf-plates-variety.webp';

// Gallery images pool for demo
const galleryImages = [
  leafPlatesCloseup,
  leafPlatesVariety,
  collectionDisplay1,
  exhibitionDisplay,
];

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProduct, isLoading, products } = useProducts();
  const { addToCart, items, updateQuantity } = useCart();

  const product = getProduct(id || '');
  const cartItem = items[product?.id || ''];

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [isLiked, setIsLiked] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showLightbox, setShowLightbox] = useState(false);

  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Generate gallery from product image + related images
  const productGallery = product
    ? product.category === 'art'
      ? [product.imageUrl]
      : [product.imageUrl, ...galleryImages.filter(img => img !== product.imageUrl).slice(0, 3)]
    : [];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const handleAddToCart = () => {
    if (!product) return;
    setIsAdding(true);
    addToCart(product, quantity);
    toast.success('Đã thêm sản phẩm vào giỏ', {
      action: {
        label: 'Xem giỏ hàng',
        onClick: () => navigate('/cart')
      },
      duration: 3000
    });
    setTimeout(() => setIsAdding(false), 600);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20">
          <div className="animate-pulse grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="aspect-square bg-muted rounded-3xl" />
            <div className="space-y-6">
              <div className="h-8 bg-muted rounded w-1/3" />
              <div className="h-12 bg-muted rounded w-2/3" />
              <div className="h-24 bg-muted rounded" />
              <div className="h-16 bg-muted rounded w-1/2" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Không tìm thấy sản phẩm</h1>
          <p className="text-muted-foreground mb-8">Sản phẩm bạn tìm kiếm không tồn tại hoặc đã bị xóa.</p>
          <Button onClick={() => navigate('/shop')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại cửa hàng
          </Button>
        </div>
      </Layout>
    );
  }

  const savingsPercent = Math.round((1 - product.priceWholesale / product.priceRetail) * 100);
  const categoryName = getCategoryName(product.category);
  const unitLabel = product.salesUnit ?? 'cái';
  const qtyUnit = shortUnit(product.salesUnit);
  // Số lượng đang được chọn: đã trong giỏ thì lấy theo giỏ, chưa thì lấy ô chọn.
  const selectedQty = cartItem ? cartItem.qty : quantity;
  const activeTier = resolveTier(pricingSourceFromProduct(product), selectedQty);

  // Dữ liệu có cấu trúc để Google hiển thị giá và tình trạng hàng trong kết quả tìm kiếm.
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    sku: product.sku,
    image: `${SITE_URL}${product.imageUrl}`,
    brand: { '@type': 'Brand', name: 'B-ECO' },
    category: categoryName,
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/product/${product.id}`,
      priceCurrency: 'VND',
      price: product.priceRetail,
      availability:
        product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@type': 'Organization', name: 'B-ECO' },
    },
  };

  return (
    <Layout>
      <Seo
        title={product.name}
        description={product.description}
        image={product.imageUrl}
        type="product"
        jsonLd={productJsonLd}
      />
      <div className="px-4 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1400px]">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4 stroke-[1.5]" />
            Quay lại cửa hàng
          </Link>
        </div>
      </div>

      {/* Lightbox */}
      {showLightbox && (
        <div
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex items-center justify-center"
          onClick={() => setShowLightbox(false)}
        >
          <button
            className="absolute top-6 right-6 p-3 bg-card rounded-full hover:bg-muted transition-colors"
            onClick={() => setShowLightbox(false)}
          >
            <X className="h-6 w-6" />
          </button>
          <img
            src={productGallery[selectedImageIndex]}
            alt={product.name}
            className="max-w-[90vw] max-h-[90vh] object-contain object-center rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          {/* Lightbox thumbnails */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
            {productGallery.map((img, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageIndex(index);
                }}
                className={cn(
                  "w-16 h-16 rounded-xl overflow-hidden border-2 transition-all",
                  selectedImageIndex === index
                    ? "border-primary scale-110"
                    : "border-transparent opacity-60 hover:opacity-100"
                )}
              >
                <img src={img} alt="" className="w-full h-full object-cover object-center" />
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-foreground transition-colors">Trang chủ</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-foreground transition-colors">Cửa hàng</Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Left - Gallery */}
          <div className="space-y-4">
            {/* Main Image with Zoom */}
            <div
              ref={imageContainerRef}
              className="group relative aspect-square cursor-zoom-in overflow-hidden rounded-2xl border border-border bg-secondary/45"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
              onClick={() => setShowLightbox(true)}
            >
              <img
                src={productGallery[selectedImageIndex]}
                alt={product.name}
                className={cn(
                  "h-full w-full object-center transition-transform duration-300",
                  product.category === 'art' ? "object-contain p-3" : "object-cover",
                  isZoomed && "scale-150"
                )}
                style={isZoomed ? {
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
                } : undefined}
              />

              {/* Zoom indicator */}
              <div className="absolute bottom-4 right-4 p-2 bg-background/80 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-sm">
                <ZoomIn className="h-4 w-4" />
                Click để phóng to
              </div>

            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {productGallery.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={cn(
                    "h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-border transition-all duration-300 lg:h-24 lg:w-24",
                    selectedImageIndex === index
                      ? "border-primary"
                      : "hover:border-primary/50"
                  )}
                >
                  <img
                    src={img}
                    alt={`${product.name} - ${index + 1}`}
                    className={cn('h-full w-full', product.category === 'art' ? 'object-contain p-1' : 'object-cover')}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right - Product Info */}
          <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            {/* Category & Actions */}
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-primary border-primary/30">
                {categoryName}
              </Badge>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={cn(
                    "rounded-xl border border-border p-3 transition-all duration-300 hover:border-primary",
                    isLiked
                      ? "text-red-500"
                      : "text-primary hover:text-primary"
                  )}
                >
                  <Heart className={cn("h-5 w-5 stroke-[1.5]", isLiked && "fill-current")} />
                </button>
                <button className="rounded-xl border border-border p-3 text-primary transition-all duration-300 hover:border-primary">
                  <Share2 className="h-5 w-5 stroke-[1.5]" />
                </button>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
              {product.name}
            </h1>

            {/* Description */}
            <p className="text-lg text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            {/* Prices — bậc giá áp dụng theo số lượng đang chọn */}
            <div className="space-y-3 rounded-2xl border border-border bg-card p-6 shadow-[0_18px_48px_hsl(var(--primary)/0.07)]">
              <div className="flex flex-wrap items-end gap-x-4 gap-y-1">
                <span className="text-3xl font-heading text-primary">
                  {formatMoney(activeTier.unitPrice)}
                </span>
                <span className="text-muted-foreground font-light mb-1">/ {unitLabel}</span>
                {activeTier.unitPrice < product.priceRetail && (
                  <span className="mb-1.5 text-sm text-muted-foreground line-through">
                    {formatMoney(product.priceRetail)}
                  </span>
                )}
                {activeTier.tier !== 'retail' && (
                  <Badge className="mb-1 rounded-lg bg-primary/10 text-xs font-semibold text-primary hover:bg-primary/10">
                    Đang áp {TIER_LABELS[activeTier.tier].toLowerCase()}
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 text-sm">
                <Sparkles className="h-4 w-4 text-primary stroke-[1.5]" />
                <span className="text-muted-foreground font-light">
                  Giá sỉ từ {formatNumber(product.wholesaleMinQty)} {qtyUnit}:
                </span>
                <span className="font-heading text-primary">{formatMoney(product.priceWholesale)}</span>
                <Badge className="rounded-lg bg-secondary text-xs font-semibold text-primary hover:bg-secondary">
                  Tiết kiệm {savingsPercent}%
                </Badge>
              </div>

              {product.priceEnterprise !== undefined && (
                <div className="flex flex-wrap items-center gap-2 border-t border-border/40 pt-3 text-sm">
                  <span className="text-muted-foreground font-light">
                    Giá doanh nghiệp
                    {product.enterpriseMinQty
                      ? ` từ ${formatNumber(product.enterpriseMinQty)} ${qtyUnit}:`
                      : ':'}
                  </span>
                  <span className="font-heading text-primary">{formatMoney(product.priceEnterprise)}</span>
                  {!product.enterpriseMinQty && (
                    <span className="text-xs text-muted-foreground">liên hệ để chốt điều kiện áp dụng</span>
                  )}
                </div>
              )}

              {activeTier.nextTier && activeTier.nextTier.qtyNeeded > 0 && (
                <p className="rounded-xl bg-emerald-50 px-3 py-2 text-xs leading-5 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300">
                  Chọn thêm <strong>{formatNumber(activeTier.nextTier.qtyNeeded)} {qtyUnit}</strong> để hạ xuống{' '}
                  <strong>{formatMoney(activeTier.nextTier.unitPrice)}</strong>/{unitLabel} — tiết kiệm{' '}
                  {formatMoney(
                    (product.priceRetail - activeTier.nextTier.unitPrice) * activeTier.nextTier.minQty,
                  )}{' '}
                  cho {formatNumber(activeTier.nextTier.minQty)} {qtyUnit}.
                </p>
              )}

              {selectedQty > 0 && (
                <div className="flex items-center justify-between border-t border-border/40 pt-3 text-sm">
                  <span className="text-muted-foreground font-light">
                    Thành tiền cho {formatNumber(selectedQty)} {qtyUnit}:
                  </span>
                  <span className="font-heading text-lg text-primary">
                    {formatMoney(activeTier.unitPrice * selectedQty)}
                  </span>
                </div>
              )}
            </div>

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              {cartItem ? (
                <div className="flex items-center justify-between rounded-2xl border border-border bg-secondary/55 p-4">
                  <span className="text-sm font-light text-muted-foreground">Trong giỏ hàng:</span>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 text-primary hover:bg-primary/10"
                      onClick={() => updateQuantity(product.id, cartItem.qty - 1)}
                    >
                      <Minus className="h-4 w-4 stroke-[1.5]" />
                    </Button>
                    <span className="font-heading text-xl text-primary min-w-[3rem] text-center">
                      {cartItem.qty}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 text-primary hover:bg-primary/10"
                      onClick={() => updateQuantity(product.id, cartItem.qty + 1)}
                      disabled={cartItem.qty >= product.stock}
                    >
                      <Plus className="h-4 w-4 stroke-[1.5]" />
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-4">
                    <span className="text-muted-foreground font-light">Số lượng:</span>
                    <div className="flex items-center rounded-xl border border-border bg-card p-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        <Minus className="h-4 w-4 stroke-[1.5]" />
                      </Button>
                      <span className="font-heading text-lg min-w-[3rem] text-center">
                        {quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10"
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      >
                        <Plus className="h-4 w-4 stroke-[1.5]" />
                      </Button>
                    </div>
                  </div>

                  <Button
                    size="lg"
                    className="h-14 w-full text-sm"
                    onClick={handleAddToCart}
                    disabled={product.stock === 0 || isAdding}
                  >
                    {isAdding ? (
                      <>
                        <Check className="h-5 w-5 mr-2" />
                        Đã thêm vào giỏ hàng
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-5 w-5 mr-2 stroke-[1.5]" />
                        Thêm vào giỏ hàng
                      </>
                    )}
                  </Button>
                </>
              )}

              <Button
                variant="outline"
                size="lg"
                className="h-14 w-full text-sm"
                onClick={() => navigate('/cart')}
              >
                Xem giỏ hàng
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border/40">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 mx-auto bg-background border border-border/40 flex items-center justify-center">
                  <Leaf className="h-5 w-5 text-primary stroke-[1.5]" />
                </div>
                <p className="text-xs font-medium text-muted-foreground">100% thiên nhiên</p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 mx-auto bg-background border border-border/40 flex items-center justify-center">
                  <Truck className="h-5 w-5 text-primary stroke-[1.5]" />
                </div>
                <p className="text-xs font-medium text-muted-foreground">Giao toàn quốc</p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 mx-auto bg-background border border-border/40 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-primary stroke-[1.5]" />
                </div>
                <p className="text-xs font-medium text-muted-foreground">Đảm bảo</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section - Product Details & Reviews */}
        <div className="mt-16">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="mx-auto grid h-12 w-full max-w-md grid-cols-2 rounded-xl border border-border bg-card p-1">
              <TabsTrigger value="details" className="h-full rounded-lg text-sm font-semibold data-[state=active]:bg-secondary data-[state=active]:text-primary data-[state=active]:shadow-none">
                <Info className="h-4 w-4 mr-2 stroke-[1.5]" />
                Chi tiết
              </TabsTrigger>
              <TabsTrigger value="reviews" className="h-full rounded-lg text-sm font-semibold data-[state=active]:bg-secondary data-[state=active]:text-primary data-[state=active]:shadow-none">
                <MessageSquare className="h-4 w-4 mr-2 stroke-[1.5]" />
                Đánh giá (200)
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product Specifications */}
                <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
                  <h3 className="font-heading text-lg text-primary flex items-center gap-2 mb-6">
                    <Package className="h-5 w-5 stroke-[1.5]" />
                    Thông số sản phẩm
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-border/40">
                      <span className="text-muted-foreground font-light text-sm">Chất liệu</span>
                      <span className="font-medium text-sm">Lá bàng tự nhiên 100%</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border/40">
                      <span className="text-muted-foreground font-light text-sm">Xuất xứ</span>
                      <span className="font-medium text-sm">Phú Yên, Việt Nam</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border/40">
                      <span className="text-muted-foreground font-light text-sm">Thời gian phân hủy</span>
                      <span className="font-medium text-sm">45-60 ngày</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border/40">
                      <span className="text-muted-foreground font-light text-sm">Chịu nhiệt</span>
                      <span className="font-medium text-sm">Đến 65°C</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-muted-foreground font-light text-sm">Bảo quản</span>
                      <span className="font-medium text-sm">Nơi khô ráo, thoáng mát</span>
                    </div>
                  </div>
                </div>

                {/* Features & Benefits */}
                <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
                  <h3 className="font-heading text-lg text-primary flex items-center gap-2 mb-6">
                    <Leaf className="h-5 w-5 stroke-[1.5]" />
                    Đặc điểm nổi bật
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="mt-1">
                        <Check className="h-4 w-4 text-primary stroke-[1.5]" />
                      </div>
                      <span className="text-muted-foreground font-light text-sm">100% từ thiên nhiên, không hóa chất độc hại</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-1">
                        <Check className="h-4 w-4 text-primary stroke-[1.5]" />
                      </div>
                      <span className="text-muted-foreground font-light text-sm">Tự phân hủy sinh học, thân thiện môi trường</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-1">
                        <Check className="h-4 w-4 text-primary stroke-[1.5]" />
                      </div>
                      <span className="text-muted-foreground font-light text-sm">Chịu nước, chịu dầu trong thời gian sử dụng</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-1">
                        <Check className="h-4 w-4 text-primary stroke-[1.5]" />
                      </div>
                      <span className="text-muted-foreground font-light text-sm">Thiết kế độc đáo, phù hợp mọi sự kiện</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-1">
                        <Check className="h-4 w-4 text-primary stroke-[1.5]" />
                      </div>
                      <span className="text-muted-foreground font-light text-sm">An toàn cho sức khỏe, đạt tiêu chuẩn VSATTP</span>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-8">
              <ProductReviews productId={product.id} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        <RelatedProducts
          currentProductId={product.id}
          category={product.category}
          products={products}
        />
      </div>
    </Layout>
  );
};

export default ProductDetail;

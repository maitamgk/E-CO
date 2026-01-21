import { useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useProducts } from '@/context/ProductsContext';
import { useCart } from '@/context/CartContext';
import { formatMoney } from '@/utils/money';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductReviews } from '@/components/product/ProductReviews';
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

// Import all product images for gallery
import collectionDisplay1 from '@/assets/products/collection-display-1.jpg';
import collectionDisplay2 from '@/assets/products/collection-display-2.jpg';
import exhibitionDisplay from '@/assets/products/exhibition-display.jpg';
import leafPlatesCloseup from '@/assets/products/leaf-plates-closeup.jpg';
import leafPlatesVariety from '@/assets/products/leaf-plates-variety.jpg';

// Gallery images pool for demo
const galleryImages = [
  leafPlatesCloseup,
  leafPlatesVariety,
  collectionDisplay1,
  collectionDisplay2,
  exhibitionDisplay,
];

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProduct, isLoading } = useProducts();
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
  const productGallery = product ? [
    product.imageUrl,
    ...galleryImages.filter(img => img !== product.imageUrl).slice(0, 3)
  ] : [];

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
  const categoryName = product.category === 'chen' ? 'Chén' : product.category === 'dia' ? 'Dĩa' : product.category === 'in-logo' ? 'In logo' : 'Combo';

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-green-950 via-emerald-900 to-teal-950 text-white overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 opacity-35"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1470058869958-2a77ade41c02?w=1920&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-950/60 via-emerald-900/65 to-teal-950/70" />
        
        {/* Glowing Orbs */}
        <div className="absolute top-20 -left-20 w-72 h-72 bg-emerald-500/8 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-teal-500/8 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 py-12 relative">
          <Link 
            to="/shop" 
            className="inline-flex items-center gap-2 text-emerald-100 hover:text-emerald-50 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại cửa hàng
          </Link>
          <h1 className="text-4xl md:text-5xl font-black italic mb-4 bg-gradient-to-r from-emerald-400 via-green-300 to-teal-400 bg-clip-text text-transparent">
            {product.name}
          </h1>
          <p className="text-emerald-100 text-lg">
            {categoryName}
          </p>
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
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-2xl"
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
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 lg:py-12">
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
              className="relative aspect-square rounded-3xl overflow-hidden bg-muted cursor-zoom-in group"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
              onClick={() => setShowLightbox(true)}
            >
              <img
                src={productGallery[selectedImageIndex]}
                alt={product.name}
                className={cn(
                  "w-full h-full object-cover transition-transform duration-300",
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

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.stock < 50 && product.stock > 0 && (
                  <Badge variant="secondary" className="bg-background/90 backdrop-blur-xl shadow-lg border-0">
                    ⚡ Còn {product.stock}
                  </Badge>
                )}
                {product.stock === 0 && (
                  <Badge variant="destructive" className="shadow-lg">
                    Hết hàng
                  </Badge>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {productGallery.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={cn(
                    "flex-shrink-0 w-20 h-20 lg:w-24 lg:h-24 rounded-xl overflow-hidden border-2 transition-all duration-300",
                    selectedImageIndex === index 
                      ? "border-primary ring-2 ring-primary/20 scale-105" 
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <img 
                    src={img} 
                    alt={`${product.name} - ${index + 1}`}
                    className="w-full h-full object-cover"
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
                    "p-3 rounded-xl border transition-all duration-300 hover:scale-110",
                    isLiked 
                      ? "bg-destructive text-destructive-foreground border-destructive" 
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <Heart className={cn("h-5 w-5", isLiked && "fill-current")} />
                </button>
                <button className="p-3 rounded-xl border border-border hover:border-primary/50 transition-all duration-300 hover:scale-110">
                  <Share2 className="h-5 w-5" />
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

            {/* Prices */}
            <div className="space-y-3 p-6 bg-card rounded-2xl border border-border">
              <div className="flex items-end gap-4">
                <span className="text-4xl font-bold bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">
                  {formatMoney(product.priceRetail)}
                </span>
                <span className="text-muted-foreground mb-1">/ cái</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Giá sỉ từ {product.wholesaleMinQty} cái:</span>
                <span className="font-semibold text-primary">{formatMoney(product.priceWholesale)}</span>
                <Badge className="bg-primary/10 text-primary border-0 ml-2">
                  Tiết kiệm {savingsPercent}%
                </Badge>
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              {cartItem ? (
                <div className="flex items-center justify-between bg-primary/5 rounded-2xl p-4 border-2 border-primary/20">
                  <span className="text-sm text-muted-foreground">Trong giỏ hàng:</span>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-12 w-12 rounded-xl hover:bg-primary/10 hover:text-primary"
                      onClick={() => updateQuantity(product.id, cartItem.qty - 1)}
                    >
                      <Minus className="h-5 w-5" />
                    </Button>
                    <span className="font-bold text-2xl text-primary min-w-[3rem] text-center">
                      {cartItem.qty}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-12 w-12 rounded-xl hover:bg-primary/10 hover:text-primary"
                      onClick={() => updateQuantity(product.id, cartItem.qty + 1)}
                      disabled={cartItem.qty >= product.stock}
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-4">
                    <span className="text-muted-foreground">Số lượng:</span>
                    <div className="flex items-center border border-border rounded-xl">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-12 w-12 rounded-l-xl"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="font-semibold text-xl min-w-[3rem] text-center">
                        {quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-12 w-12 rounded-r-xl"
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <Button
                    size="lg"
                    className="w-full h-16 text-lg font-semibold rounded-2xl shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 hover:scale-[1.02] transition-all duration-300"
                    onClick={handleAddToCart}
                    disabled={product.stock === 0 || isAdding}
                  >
                    {isAdding ? (
                      <>
                        <Check className="h-6 w-6 mr-2 animate-bounce" />
                        Đã thêm vào giỏ hàng!
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-6 w-6 mr-2" />
                        Thêm vào giỏ hàng
                      </>
                    )}
                  </Button>
                </>
              )}

              <Button 
                variant="outline" 
                size="lg" 
                className="w-full h-14 text-base rounded-2xl"
                onClick={() => navigate('/cart')}
              >
                Xem giỏ hàng
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center">
                  <Leaf className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">100% Thiên nhiên</p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">Giao toàn quốc</p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">Đảm bảo chất lượng</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section - Product Details & Reviews */}
        <div className="mt-16">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="w-full max-w-md mx-auto grid grid-cols-2 h-14 rounded-2xl bg-muted p-1">
              <TabsTrigger value="details" className="rounded-xl text-base data-[state=active]:bg-background data-[state=active]:shadow-lg">
                <Info className="h-4 w-4 mr-2" />
                Chi tiết
              </TabsTrigger>
              <TabsTrigger value="reviews" className="rounded-xl text-base data-[state=active]:bg-background data-[state=active]:shadow-lg">
                <MessageSquare className="h-4 w-4 mr-2" />
                Đánh giá (200)
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product Specifications */}
                <div className="p-6 bg-card rounded-2xl border border-border space-y-4">
                  <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    Thông số sản phẩm
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Chất liệu</span>
                      <span className="font-medium text-foreground">Lá bàng tự nhiên 100%</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Xuất xứ</span>
                      <span className="font-medium text-foreground">Phú Yên, Việt Nam</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Thời gian phân hủy</span>
                      <span className="font-medium text-foreground">45-60 ngày</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Chịu nhiệt</span>
                      <span className="font-medium text-foreground">Đến 80°C</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-muted-foreground">Bảo quản</span>
                      <span className="font-medium text-foreground">Nơi khô ráo, thoáng mát</span>
                    </div>
                  </div>
                </div>

                {/* Features & Benefits */}
                <div className="p-6 bg-card rounded-2xl border border-border space-y-4">
                  <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
                    <Leaf className="h-5 w-5 text-primary" />
                    Đặc điểm nổi bật
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-muted-foreground">100% từ thiên nhiên, không hóa chất độc hại</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-muted-foreground">Tự phân hủy sinh học, thân thiện môi trường</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-muted-foreground">Chịu nước, chịu dầu trong thời gian sử dụng</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-muted-foreground">Thiết kế độc đáo, phù hợp mọi sự kiện</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-muted-foreground">An toàn cho sức khỏe, đạt tiêu chuẩn VSATTP</span>
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
      </div>
    </Layout>
  );
};

export default ProductDetail;

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import {
  AlertTriangle,
  Boxes,
  ImagePlus,
  Loader2,
  Package,
  PackageCheck,
  Pencil,
  Plus,
  Save,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { categories, getCategoryName, mockProducts } from '@/data/mockProducts';
import { productService, generateProductId } from '@/services/productService';
import { supabase } from '@/lib/supabase';
import { Product } from '@/types';
import { formatMoney } from '@/utils/money';
import {
  ProductDraft,
  draftFromProduct,
  emptyDraft,
  parseDraft,
} from '@/utils/productForm';
import { cn } from '@/lib/utils';

/** Dưới ngưỡng này hiển thị cảnh báo sắp hết hàng trên bảng và thẻ thống kê. */
const LOW_STOCK_THRESHOLD = 100;

type StatusFilter = 'all' | 'active' | 'inactive' | 'low';

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'active', label: 'Đang bán' },
  { value: 'inactive', label: 'Đang ẩn' },
  { value: 'low', label: 'Sắp hết hàng' },
];

export const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  /** null = bảng products chưa có → chỉ đọc từ fallback, khóa mọi thao tác ghi. */
  const [isFallbackMode, setIsFallbackMode] = useState(false);

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [draft, setDraft] = useState<ProductDraft>(emptyDraft());
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  /** Tồn kho chỉnh nhanh ngay trên dòng: id → giá trị đang gõ. */
  const [stockEdits, setStockEdits] = useState<Record<string, string>>({});
  const [savingStockId, setSavingStockId] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    const data = await productService.getProducts(true);
    if (data === null) {
      setIsFallbackMode(true);
      setProducts(mockProducts);
    } else {
      setIsFallbackMode(false);
      setProducts(data);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void fetchProducts();

    const subscription = productService.subscribeToProducts(() => {
      void fetchProducts();
    }, 'products-admin-channel');

    return () => {
      void supabase.removeChannel(subscription);
    };
  }, [fetchProducts]);

  // ------------------------------------------------------------------
  // Form tạo / sửa
  // ------------------------------------------------------------------
  const openCreateForm = () => {
    setEditingProduct(null);
    setDraft(emptyDraft());
    setFormErrors({});
    setIsFormOpen(true);
  };

  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    setDraft(draftFromProduct(product));
    setFormErrors({});
    setIsFormOpen(true);
  };

  const setField = <K extends keyof ProductDraft>(field: K, value: ProductDraft[K]) => {
    setDraft(prev => ({ ...prev, [field]: value }));
    setFormErrors(prev => {
      if (!prev[field as string]) return prev;
      const next = { ...prev };
      delete next[field as string];
      return next;
    });
  };

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    const url = await productService.uploadProductImage(file);
    setIsUploading(false);
    if (url) {
      setField('imageUrl', url);
      toast.success('Đã tải ảnh lên');
    } else {
      toast.error('Tải ảnh thất bại — kiểm tra dung lượng (tối đa 5MB) và định dạng ảnh');
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const { values, errors } = parseDraft(draft);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      toast.error('Vui lòng sửa các trường bị đánh dấu đỏ');
      return;
    }

    setIsSaving(true);
    const payload = {
      name: values.name,
      sku: values.sku || undefined,
      description: values.description,
      category: values.category,
      salesUnit: values.salesUnit || undefined,
      wholesaleThresholdLabel: values.wholesaleThresholdLabel || undefined,
      priceRetail: values.priceRetail,
      priceWholesale: values.priceWholesale,
      priceEnterprise: values.priceEnterprise ?? undefined,
      wholesaleMinQty: values.wholesaleMinQty,
      enterpriseMinQty: values.enterpriseMinQty ?? undefined,
      stock: values.stock,
      imageUrl: values.imageUrl,
      active: values.active,
    };

    const success = editingProduct
      ? await productService.updateProduct(editingProduct.id, payload)
      : await productService.createProduct({
          ...payload,
          id: generateProductId(),
          createdAt: new Date(),
          updatedAt: new Date(),
        });

    setIsSaving(false);

    if (!success) {
      toast.error(editingProduct ? 'Cập nhật sản phẩm thất bại' : 'Tạo sản phẩm thất bại');
      return;
    }

    toast.success(editingProduct ? `Đã cập nhật "${values.name}"` : `Đã thêm "${values.name}" vào cửa hàng`);
    setIsFormOpen(false);
    await fetchProducts();
  };

  // ------------------------------------------------------------------
  // Tồn kho & trạng thái
  // ------------------------------------------------------------------
  const saveStock = async (product: Product) => {
    const raw = stockEdits[product.id];
    const newStock = Number(raw);
    if (!Number.isInteger(newStock) || newStock < 0) {
      toast.error('Tồn kho phải là số nguyên không âm');
      return;
    }
    if (newStock === product.stock) {
      setStockEdits(prev => {
        const next = { ...prev };
        delete next[product.id];
        return next;
      });
      return;
    }

    setSavingStockId(product.id);
    const success = await productService.updateProduct(product.id, { stock: newStock });
    setSavingStockId(null);

    if (success) {
      toast.success(`Đã cập nhật tồn kho "${product.name}" → ${newStock.toLocaleString('vi-VN')}`);
      setStockEdits(prev => {
        const next = { ...prev };
        delete next[product.id];
        return next;
      });
      await fetchProducts();
    } else {
      toast.error('Lưu tồn kho thất bại');
    }
  };

  const toggleActive = async (product: Product, active: boolean) => {
    // Cập nhật lạc quan cho Switch mượt ngay lập tức
    setProducts(prev => prev.map(p => (p.id === product.id ? { ...p, active } : p)));
    const success = await productService.updateProduct(product.id, { active });
    if (!success) {
      setProducts(prev => prev.map(p => (p.id === product.id ? { ...p, active: !active } : p)));
      toast.error(active ? 'Hiện sản phẩm thất bại' : 'Ẩn sản phẩm thất bại');
      return;
    }
    toast.success(active ? `Đã hiện "${product.name}" trên cửa hàng` : `Đã ẩn "${product.name}" khỏi cửa hàng`);
  };

  const confirmDelete = async () => {
    if (!deletingProduct) return;
    setIsDeleting(true);
    const success = await productService.deleteProduct(deletingProduct.id);
    setIsDeleting(false);
    if (success) {
      toast.success(`Đã xóa "${deletingProduct.name}"`);
      setDeletingProduct(null);
      await fetchProducts();
    } else {
      toast.error('Xóa sản phẩm thất bại');
    }
  };

  // ------------------------------------------------------------------
  // Bộ lọc & thống kê
  // ------------------------------------------------------------------
  const visibleProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return products.filter(product => {
      if (categoryFilter !== 'all' && product.category !== categoryFilter) return false;
      if (statusFilter === 'active' && !product.active) return false;
      if (statusFilter === 'inactive' && product.active) return false;
      if (statusFilter === 'low' && product.stock > LOW_STOCK_THRESHOLD) return false;
      if (keyword) {
        const haystack = `${product.name} ${product.sku ?? ''}`.toLowerCase();
        if (!haystack.includes(keyword)) return false;
      }
      return true;
    });
  }, [products, search, categoryFilter, statusFilter]);

  const stats = useMemo(
    () => [
      { label: 'Tổng sản phẩm', value: String(products.length), icon: Package },
      { label: 'Đang bán', value: String(products.filter(p => p.active).length), icon: PackageCheck },
      {
        label: 'Sắp hết hàng',
        value: String(products.filter(p => p.stock <= LOW_STOCK_THRESHOLD).length),
        icon: AlertTriangle,
      },
      {
        label: 'Giá trị tồn kho (giá sỉ)',
        value: formatMoney(products.reduce((acc, p) => acc + p.stock * p.priceWholesale, 0)),
        icon: Boxes,
      },
    ],
    [products],
  );

  const fieldError = (field: string) =>
    formErrors[field] ? <p className="text-xs text-red-500 mt-1">{formErrors[field]}</p> : null;

  return (
    <div>
      {isFallbackMode && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-sm text-yellow-800">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p>
            Bảng <strong>products</strong> chưa được khởi tạo trên Supabase — đang hiển thị dữ liệu
            fallback (chỉ đọc). Chạy <code className="bg-yellow-100 px-1 rounded">supabase_migration_products.sql</code>{' '}
            trong SQL Editor để bật đầy đủ quản lý sản phẩm &amp; tồn kho.
          </p>
        </div>
      )}

      {/* Thống kê nhanh */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white border border-border/40 p-6 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-[11px] font-normal text-muted-foreground uppercase tracking-widest mb-2">{stat.label}</p>
              <p className="text-2xl font-heading text-primary font-bold">{stat.value}</p>
            </div>
            <div className="p-3 bg-background border border-border/40">
              <stat.icon className="w-5 h-5 text-primary stroke-[1.5]" />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-border/40 shadow-sm rounded-lg overflow-hidden">
        {/* Header + bộ lọc */}
        <div className="p-6 border-b border-border/40 bg-background">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-heading text-primary font-bold">Sản phẩm &amp; tồn kho</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Thay đổi tại đây sẽ tự động cập nhật lên cửa hàng theo thời gian thực
              </p>
            </div>
            <Button
              onClick={openCreateForm}
              disabled={isFallbackMode}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-md text-sm px-4 h-10"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Thêm sản phẩm
            </Button>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Tìm theo tên hoặc mã SKU..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 h-9 text-sm rounded-md bg-white"
              />
            </div>
            <select
              className="bg-white border border-border/40 px-3 py-2 text-sm outline-none focus:border-primary/40 font-light rounded-md"
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
            >
              <option value="all">Tất cả danh mục</option>
              {categories.filter(c => c.id !== 'all').map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <select
              className="bg-white border border-border/40 px-3 py-2 text-sm outline-none focus:border-primary/40 font-light rounded-md"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as StatusFilter)}
            >
              {STATUS_FILTERS.map(f => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Bảng sản phẩm */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/40 bg-muted/40">
                <th className="p-4 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Sản phẩm</th>
                <th className="p-4 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Danh mục</th>
                <th className="p-4 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Giá bán</th>
                <th className="p-4 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground min-w-[190px]">Tồn kho</th>
                <th className="p-4 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Trạng thái</th>
                <th className="p-4 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground font-medium">
                    Đang tải sản phẩm...
                  </td>
                </tr>
              ) : visibleProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground font-medium">
                    Không tìm thấy sản phẩm phù hợp bộ lọc.
                  </td>
                </tr>
              ) : (
                visibleProducts.map(product => {
                  const isLowStock = product.stock <= LOW_STOCK_THRESHOLD;
                  const stockEditValue = stockEdits[product.id];
                  const hasStockEdit = stockEditValue !== undefined && Number(stockEditValue) !== product.stock;

                  return (
                    <tr key={product.id} className="hover:bg-muted/20 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-14 h-14 rounded-md object-cover border border-border/40 flex-shrink-0"
                            loading="lazy"
                          />
                          <div className="min-w-0">
                            <p className="font-semibold text-sm line-clamp-1">{product.name}</p>
                            <p className="text-xs text-muted-foreground font-mono mt-0.5">
                              {product.sku ? `SKU: ${product.sku}` : `#${product.id}`}
                              {product.salesUnit && <span className="font-sans"> · {product.salesUnit}</span>}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm">{getCategoryName(product.category)}</td>
                      <td className="p-4">
                        <p className="font-heading text-primary font-bold text-sm">{formatMoney(product.priceRetail)}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          Sỉ: {formatMoney(product.priceWholesale)}
                          {product.priceEnterprise !== undefined && ` · DN: ${formatMoney(product.priceEnterprise)}`}
                        </p>
                      </td>
                      <td className="p-4">
                        {isFallbackMode ? (
                          <span className={cn('text-sm font-semibold', isLowStock && 'text-orange-600')}>
                            {product.stock.toLocaleString('vi-VN')}
                          </span>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <Input
                              type="number"
                              min={0}
                              value={stockEditValue !== undefined ? stockEditValue : product.stock}
                              onChange={e =>
                                setStockEdits(prev => ({ ...prev, [product.id]: e.target.value }))
                              }
                              className="h-9 w-24 text-sm rounded-md bg-background"
                            />
                            {hasStockEdit ? (
                              <>
                                <Button
                                  size="sm"
                                  disabled={savingStockId === product.id}
                                  onClick={() => saveStock(product)}
                                  className="h-9 px-2.5 text-xs bg-primary hover:bg-primary/90 text-primary-foreground flex-shrink-0"
                                  title="Lưu tồn kho"
                                >
                                  {savingStockId === product.id
                                    ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    : <Save className="w-3.5 h-3.5" />}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() =>
                                    setStockEdits(prev => {
                                      const next = { ...prev };
                                      delete next[product.id];
                                      return next;
                                    })
                                  }
                                  className="h-9 px-2 text-xs text-muted-foreground flex-shrink-0"
                                  title="Bỏ thay đổi"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </Button>
                              </>
                            ) : (
                              <StockValue low={isLowStock} stock={product.stock} />
                            )}
                          </div>
                        )}
                        {isLowStock && (
                          <Badge className="mt-1.5 bg-orange-500 hover:bg-orange-500 text-white border-0 text-[10px] px-1.5 py-0 flex items-center gap-1 w-fit">
                            <AlertTriangle className="w-3 h-3" />
                            Sắp hết hàng
                          </Badge>
                        )}
                      </td>
                      <td className="p-4">
                        {isFallbackMode ? (
                          <Badge
                            className={cn(
                              product.active ? 'bg-green-600' : 'bg-gray-400',
                              'text-white border-0 text-[11px] px-2.5 py-1',
                            )}
                          >
                            {product.active ? 'Đang bán' : 'Đang ẩn'}
                          </Badge>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={product.active}
                              onCheckedChange={checked => toggleActive(product, checked)}
                              aria-label={product.active ? 'Ẩn sản phẩm' : 'Hiện sản phẩm'}
                            />
                            <span className="text-xs text-muted-foreground">
                              {product.active ? 'Đang bán' : 'Đang ẩn'}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={isFallbackMode}
                            onClick={() => openEditForm(product)}
                            className="h-8 rounded-md text-xs px-3 text-primary border-primary/20 hover:bg-primary/10"
                          >
                            <Pencil className="w-3.5 h-3.5 mr-1" />
                            Sửa
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={isFallbackMode}
                            onClick={() => setDeletingProduct(product)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-md text-xs px-2.5 h-8"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Dialog tạo / sửa sản phẩm */}
      {/* ---------------------------------------------------------------- */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-primary text-xl">
              {editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}
            </DialogTitle>
            <DialogDescription>
              {editingProduct
                ? 'Thay đổi sẽ hiển thị lên cửa hàng ngay sau khi lưu.'
                : 'Sản phẩm mới sẽ xuất hiện trên cửa hàng nếu bật trạng thái bán.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Ảnh */}
            <div>
              <Label className="text-sm font-medium">Ảnh sản phẩm</Label>
              <div className="mt-2 flex items-start gap-4">
                <div className="w-28 h-28 rounded-lg border border-border/40 overflow-hidden bg-muted flex-shrink-0">
                  {draft.imageUrl ? (
                    <img src={draft.imageUrl} alt="Xem trước" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <ImagePlus className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <Input
                    type="text"
                    placeholder="/images/products/... hoặc URL từ Supabase Storage"
                    value={draft.imageUrl}
                    onChange={e => setField('imageUrl', e.target.value)}
                    className="h-9 text-sm rounded-md"
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) void handleImageUpload(file);
                      e.target.value = '';
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isUploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="h-9 rounded-md text-xs"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                        Đang tải...
                      </>
                    ) : (
                      <>
                        <ImagePlus className="w-3.5 h-3.5 mr-1.5" />
                        Tải ảnh lên (tối đa 5MB)
                      </>
                    )}
                  </Button>
                  {fieldError('imageUrl')}
                </div>
              </div>
            </div>

            {/* Tên + SKU */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <Label className="text-sm font-medium">Tên sản phẩm *</Label>
                <Input
                  type="text"
                  value={draft.name}
                  onChange={e => setField('name', e.target.value)}
                  placeholder="VD: Đĩa Sinh Học Oval (Size L)"
                  className={cn('mt-1.5 h-10 text-sm rounded-md', formErrors.name && 'border-red-400')}
                />
                {fieldError('name')}
              </div>
              <div>
                <Label className="text-sm font-medium">Mã SKU</Label>
                <Input
                  type="text"
                  value={draft.sku}
                  onChange={e => setField('sku', e.target.value)}
                  placeholder="TW-OVL-01"
                  className={cn('mt-1.5 h-10 text-sm rounded-md font-mono', formErrors.sku && 'border-red-400')}
                />
                {fieldError('sku')}
              </div>
            </div>

            {/* Mô tả */}
            <div>
              <Label className="text-sm font-medium">Mô tả *</Label>
              <Textarea
                value={draft.description}
                onChange={e => setField('description', e.target.value)}
                placeholder="Mô tả sản phẩm, chất liệu, công dụng..."
                rows={3}
                className={cn('mt-1.5 text-sm rounded-md', formErrors.description && 'border-red-400')}
              />
              {fieldError('description')}
            </div>

            {/* Danh mục + đơn vị bán */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Danh mục *</Label>
                <select
                  value={draft.category}
                  onChange={e => setField('category', e.target.value)}
                  className={cn(
                    'mt-1.5 w-full bg-background border border-border/40 px-3 py-2.5 text-sm rounded-md outline-none focus:border-primary/40',
                    formErrors.category && 'border-red-400',
                  )}
                >
                  {categories.filter(c => c.id !== 'all').map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {fieldError('category')}
              </div>
              <div>
                <Label className="text-sm font-medium">Đơn vị bán</Label>
                <Input
                  type="text"
                  value={draft.salesUnit}
                  onChange={e => setField('salesUnit', e.target.value)}
                  placeholder="gói 10 cái / cái / bộ"
                  className="mt-1.5 h-10 text-sm rounded-md"
                />
              </div>
            </div>

            {/* Giá bán */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium">Giá lẻ (VNĐ) *</Label>
                <Input
                  type="number"
                  min={0}
                  step={1000}
                  value={draft.priceRetail}
                  onChange={e => setField('priceRetail', e.target.value)}
                  placeholder="30000"
                  className={cn('mt-1.5 h-10 text-sm rounded-md', formErrors.priceRetail && 'border-red-400')}
                />
                {fieldError('priceRetail')}
              </div>
              <div>
                <Label className="text-sm font-medium">Giá sỉ (VNĐ) *</Label>
                <Input
                  type="number"
                  min={0}
                  step={1000}
                  value={draft.priceWholesale}
                  onChange={e => setField('priceWholesale', e.target.value)}
                  placeholder="28000"
                  className={cn('mt-1.5 h-10 text-sm rounded-md', formErrors.priceWholesale && 'border-red-400')}
                />
                {fieldError('priceWholesale')}
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Giá doanh nghiệp</Label>
                  <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
                    <Switch
                      checked={draft.priceEnterpriseEnabled}
                      onCheckedChange={checked => setField('priceEnterpriseEnabled', checked)}
                    />
                    Áp giá
                  </label>
                </div>
                <Input
                  type="number"
                  min={0}
                  step={1000}
                  disabled={!draft.priceEnterpriseEnabled}
                  value={draft.priceEnterprise}
                  onChange={e => setField('priceEnterprise', e.target.value)}
                  placeholder="25000"
                  className={cn('mt-1.5 h-10 text-sm rounded-md', formErrors.priceEnterprise && 'border-red-400')}
                />
                {fieldError('priceEnterprise')}
              </div>
            </div>

            {/* Ngưỡng số lượng */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium">Ngưỡng giá sỉ *</Label>
                <Input
                  type="number"
                  min={1}
                  value={draft.wholesaleMinQty}
                  onChange={e => setField('wholesaleMinQty', e.target.value)}
                  className={cn('mt-1.5 h-10 text-sm rounded-md', formErrors.wholesaleMinQty && 'border-red-400')}
                />
                {fieldError('wholesaleMinQty')}
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Ngưỡng doanh nghiệp</Label>
                  <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
                    <Switch
                      checked={draft.enterpriseMinQtyEnabled}
                      onCheckedChange={checked => setField('enterpriseMinQtyEnabled', checked)}
                    />
                    Tự hạ giá
                  </label>
                </div>
                <Input
                  type="number"
                  min={1}
                  disabled={!draft.enterpriseMinQtyEnabled}
                  value={draft.enterpriseMinQty}
                  onChange={e => setField('enterpriseMinQty', e.target.value)}
                  placeholder="1000"
                  className={cn('mt-1.5 h-10 text-sm rounded-md', formErrors.enterpriseMinQty && 'border-red-400')}
                />
                {fieldError('enterpriseMinQty')}
              </div>
              <div>
                <Label className="text-sm font-medium">Nhãn ngưỡng hiển thị</Label>
                <Input
                  type="text"
                  value={draft.wholesaleThresholdLabel}
                  onChange={e => setField('wholesaleThresholdLabel', e.target.value)}
                  placeholder="1.000 cái"
                  className="mt-1.5 h-10 text-sm rounded-md"
                />
              </div>
            </div>

            {/* Tồn kho + trạng thái */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Tồn kho *</Label>
                <Input
                  type="number"
                  min={0}
                  value={draft.stock}
                  onChange={e => setField('stock', e.target.value)}
                  className={cn('mt-1.5 h-10 text-sm rounded-md', formErrors.stock && 'border-red-400')}
                />
                {fieldError('stock')}
              </div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-3 cursor-pointer">
                  <Switch
                    checked={draft.active}
                    onCheckedChange={checked => setField('active', checked)}
                  />
                  <div>
                    <p className="text-sm font-medium">Bán trên cửa hàng</p>
                    <p className="text-xs text-muted-foreground">Tắt để ẩn tạm mà không xóa dữ liệu</p>
                  </div>
                </label>
              </div>
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFormOpen(false)}
                className="rounded-md text-sm"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-md text-sm"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-1.5" />
                    {editingProduct ? 'Lưu thay đổi' : 'Thêm sản phẩm'}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog xác nhận xóa */}
      <AlertDialog open={deletingProduct !== null} onOpenChange={open => !open && setDeletingProduct(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa sản phẩm "{deletingProduct?.name}"?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2">
                <p>
                  Hành động này xóa vĩnh viễn sản phẩm khỏi cửa hàng và bảng products. Đơn hàng &amp;
                  đánh giá cũ vẫn giữ nguyên dữ liệu đã chụp (tên, giá) nên không bị ảnh hưởng.
                </p>
                <p className="text-orange-600">
                  Nếu sản phẩm từng được bán, cân nhắc tắt trạng thái bán (ẩn) thay vì xóa để giữ
                  lịch sử danh mục.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-md text-sm">Không xóa nữa</AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              onClick={e => {
                e.preventDefault(); // giữ dialog mở tới khi xóa xong
                void confirmDelete();
              }}
              className="bg-red-600 hover:bg-red-700 text-white rounded-md text-sm"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                  Đang xóa...
                </>
              ) : (
                'Xóa vĩnh viễn'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

/** Hiển thị tồn kho hiện tại dạng chữ khi chưa có chỉnh sửa nào. */
const StockValue = ({ low, stock }: { low: boolean; stock: number }) => (
  <span className={cn('text-sm font-semibold', low && 'text-orange-600')}>
    {stock.toLocaleString('vi-VN')}
  </span>
);

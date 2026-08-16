import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { Product } from '@/types';

/** Dòng bảng `products` theo đặt tên snake_case của Postgres. */
interface ProductRow {
  id: string;
  sku: string | null;
  name: string;
  description: string;
  price_retail: number;
  price_wholesale: number;
  price_enterprise: number | null;
  wholesale_min_qty: number;
  enterprise_min_qty: number | null;
  sales_unit: string | null;
  wholesale_threshold_label: string | null;
  stock: number;
  image_url: string;
  category: string;
  active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

type ProductPayload = Record<string, unknown>;

const parseProduct = (row: ProductRow): Product => ({
  id: row.id,
  sku: row.sku ?? undefined,
  name: row.name,
  description: row.description,
  priceRetail: row.price_retail,
  priceWholesale: row.price_wholesale,
  priceEnterprise: row.price_enterprise ?? undefined,
  wholesaleMinQty: row.wholesale_min_qty,
  enterpriseMinQty: row.enterprise_min_qty ?? undefined,
  salesUnit: row.sales_unit ?? undefined,
  wholesaleThresholdLabel: row.wholesale_threshold_label ?? undefined,
  stock: row.stock,
  imageUrl: row.image_url,
  category: row.category,
  active: row.active,
  createdAt: new Date(row.created_at),
  updatedAt: new Date(row.updated_at),
});

/** Bỏ qua các trường undefined để Postgres giữ nguyên giá trị cũ. */
const toRow = (product: Partial<Product>): ProductPayload => {
  const row: ProductPayload = {};
  if (product.sku !== undefined) row.sku = product.sku?.trim() || null;
  if (product.name !== undefined) row.name = product.name.trim();
  if (product.description !== undefined) row.description = product.description.trim();
  if (product.priceRetail !== undefined) row.price_retail = product.priceRetail;
  if (product.priceWholesale !== undefined) row.price_wholesale = product.priceWholesale;
  if (product.priceEnterprise !== undefined) row.price_enterprise = product.priceEnterprise;
  if (product.wholesaleMinQty !== undefined) row.wholesale_min_qty = product.wholesaleMinQty;
  if (product.enterpriseMinQty !== undefined) row.enterprise_min_qty = product.enterpriseMinQty;
  if (product.salesUnit !== undefined) row.sales_unit = product.salesUnit?.trim() || null;
  if (product.wholesaleThresholdLabel !== undefined) {
    row.wholesale_threshold_label = product.wholesaleThresholdLabel?.trim() || null;
  }
  if (product.stock !== undefined) row.stock = product.stock;
  if (product.imageUrl !== undefined) row.image_url = product.imageUrl.trim();
  if (product.category !== undefined) row.category = product.category;
  if (product.active !== undefined) row.active = product.active;
  return row;
};

/** Sinh id dạng TEXT — bảng products dùng TEXT để tương thích dữ liệu cũ ('1'..'11'). */
export const generateProductId = (): string =>
  `p_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

export const productService = {
  /**
   * Danh sách sản phẩm theo thứ tự hiển thị trên cửa hàng.
   * Trả về null khi bảng chưa tồn tại/lỗi để caller quyết định fallback
   * (về mockProducts) thay vì coi như "không có sản phẩm".
   */
  getProducts: async (includeInactive = false): Promise<Product[] | null> => {
    let query = supabase
      .from('products')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (!includeInactive) query = query.eq('active', true);

    const { data, error } = await query;

    if (error) {
      console.warn('Bảng products chưa sẵn sàng, dùng dữ liệu fallback. Hãy chạy supabase_migration_products.sql.', error.message);
      return null;
    }

    return (data as ProductRow[]).map(parseProduct);
  },

  createProduct: async (product: Product): Promise<boolean> => {
    const { error } = await supabase
      .from('products')
      .insert({ ...toRow(product), id: product.id });

    if (error) {
      console.error('Lỗi khi tạo sản phẩm:', error.message);
      return false;
    }
    return true;
  },

  updateProduct: async (id: string, updates: Partial<Product>): Promise<boolean> => {
    // updated_at do trigger của DB tự ghi
    const { error } = await supabase
      .from('products')
      .update(toRow(updates))
      .eq('id', id);

    if (error) {
      console.error('Lỗi khi cập nhật sản phẩm:', error.message);
      return false;
    }
    return true;
  },

  deleteProduct: async (id: string): Promise<boolean> => {
    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) {
      console.error('Lỗi khi xóa sản phẩm:', error.message);
      return false;
    }
    return true;
  },

  /**
   * Tải ảnh sản phẩm lên bucket công khai `product-images` của Supabase
   * Storage và trả về URL công khai để lưu vào products.image_url.
   */
  uploadProductImage: async (file: File): Promise<string | null> => {
    if (!file.type.startsWith('image/')) {
      console.error('File tải lên không phải hình ảnh');
      return null;
    }
    if (file.size > 5 * 1024 * 1024) {
      console.error('Ảnh sản phẩm tối đa 5MB');
      return null;
    }

    const extension = file.name.split('.').pop()?.toLowerCase() || 'webp';
    const path = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}.${extension}`;

    const { error } = await supabase.storage
      .from('product-images')
      .upload(path, file, { cacheControl: '31536000', upsert: false });

    if (error) {
      console.error('Lỗi khi tải ảnh lên Storage:', error.message);
      return null;
    }

    const { data } = supabase.storage.from('product-images').getPublicUrl(path);
    return data.publicUrl;
  },

  /**
   * Lắng nghe thay đổi bảng products để đẩy realtime tới các giao diện.
   * Mỗi nơi đăng ký nên truyền channelName riêng để không đấu nhau khi
   * removeChannel (ví dụ cửa hàng và trang Admin cùng mở).
   */
  subscribeToProducts: (
    onChange: () => void,
    channelName = 'products-channel',
  ): RealtimeChannel => {
    const subscription = supabase
      .channel(channelName)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, onChange)
      .subscribe();

    return subscription;
  },
};

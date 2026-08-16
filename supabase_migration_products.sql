-- =====================================================================
-- B-ECO — Bảng products: quản lý sản phẩm & tồn kho từ trang Admin
-- Chạy toàn bộ file này trong Supabase SQL Editor. Script idempotent.
--
-- Nguyên tắc thiết kế:
--   1. `id` dùng TEXT (không phải UUID) vì orders.items[].productId và
--      product_reviews.product_id đang lưu id dạng '1'..'11' — giữ type
--      này để toàn bộ đơn hàng & đánh giá cũ không đứt gãy tham chiếu.
--   2. Khách (anon) chỉ đọc được sản phẩm đang bán (active = true).
--      Admin đọc/ghi/xóa toàn bộ — xác thực bằng email admin như RLS
--      của product_reviews.
--   3. Ảnh sản phẩm lưu URL công khai: hoặc file tĩnh trong /public của
--      website, hoặc object trong bucket `product-images` (Storage).
--   4. Seed 11 sản phẩm hiện hành với ON CONFLICT DO NOTHING để chạy lại
--      nhiều lần không đè dữ liệu admin đã sửa.
-- =====================================================================

CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    sku TEXT UNIQUE,
    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    price_retail INTEGER NOT NULL CHECK (price_retail >= 0),
    price_wholesale INTEGER NOT NULL CHECK (price_wholesale >= 0),
    price_enterprise INTEGER CHECK (price_enterprise >= 0),
    wholesale_min_qty INTEGER NOT NULL DEFAULT 100 CHECK (wholesale_min_qty > 0),
    enterprise_min_qty INTEGER CHECK (enterprise_min_qty > 0),
    sales_unit TEXT,
    wholesale_threshold_label TEXT,
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    image_url TEXT NOT NULL DEFAULT '/placeholder.svg',
    category TEXT NOT NULL DEFAULT 'art',
    active BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 100,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS products_active_sort_idx
  ON products (active, sort_order, created_at DESC);

CREATE INDEX IF NOT EXISTS products_category_idx
  ON products (category);

-- Tự cập nhật updated_at mỗi lần ghi
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS products_set_updated_at ON products;
CREATE TRIGGER products_set_updated_at
BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------------------
-- RLS
-- --------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can read active products" ON products;
CREATE POLICY "Public can read active products"
ON products FOR SELECT
USING (active = true);

DROP POLICY IF EXISTS "Admin can read all products" ON products;
CREATE POLICY "Admin can read all products"
ON products FOR SELECT
USING (lower(auth.jwt() ->> 'email') = 'admin@beco.com');

DROP POLICY IF EXISTS "Admin can insert products" ON products;
CREATE POLICY "Admin can insert products"
ON products FOR INSERT
WITH CHECK (lower(auth.jwt() ->> 'email') = 'admin@beco.com');

DROP POLICY IF EXISTS "Admin can update products" ON products;
CREATE POLICY "Admin can update products"
ON products FOR UPDATE
USING (lower(auth.jwt() ->> 'email') = 'admin@beco.com')
WITH CHECK (lower(auth.jwt() ->> 'email') = 'admin@beco.com');

DROP POLICY IF EXISTS "Admin can delete products" ON products;
CREATE POLICY "Admin can delete products"
ON products FOR DELETE
USING (lower(auth.jwt() ->> 'email') = 'admin@beco.com');

-- --------------------------------------------------------------------
-- Storage: bucket công khai `product-images` cho ảnh admin upload
-- --------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public can view product images" ON storage.objects;
CREATE POLICY "Public can view product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Admin can upload product images" ON storage.objects;
CREATE POLICY "Admin can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images'
  AND lower(auth.jwt() ->> 'email') = 'admin@beco.com'
);

DROP POLICY IF EXISTS "Admin can replace product images" ON storage.objects;
CREATE POLICY "Admin can replace product images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'product-images'
  AND lower(auth.jwt() ->> 'email') = 'admin@beco.com'
);

DROP POLICY IF EXISTS "Admin can delete product images" ON storage.objects;
CREATE POLICY "Admin can delete product images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-images'
  AND lower(auth.jwt() ->> 'email') = 'admin@beco.com'
);

-- --------------------------------------------------------------------
-- Seed 11 sản phẩm hiện hành (khớp src/data/mockProducts.ts)
-- --------------------------------------------------------------------
INSERT INTO products (
  id, sku, name, description,
  price_retail, price_wholesale, price_enterprise,
  wholesale_min_qty, enterprise_min_qty,
  sales_unit, wholesale_threshold_label,
  stock, image_url, category, active, sort_order
) VALUES
  ('1', 'TW-OVL-01', 'Đĩa Sinh Học Oval (Size L)',
   'Đĩa oval cỡ lớn thuộc dòng B-ECO Daily, chế tác từ lá bàng biển tự nhiên và phù hợp cho nhu cầu sử dụng hằng ngày.',
   30000, 28000, 25000, 100, 1000, 'gói 10 cái', '1.000 cái',
   5000, '/images/products/leaf-plates-closeup.webp', 'dia', true, 1),
  ('2', 'TW-RND-01', 'Đĩa Sinh Học Tròn (Size M)',
   'Đĩa tròn cỡ vừa thuộc dòng B-ECO Daily, an toàn khi dùng với thực phẩm và có thiết kế tự nhiên, mộc mạc.',
   29000, 26000, 22000, 100, 1000, 'gói 10 cái', '1.000 cái',
   3000, '/images/products/leaf-plates-variety.webp', 'dia', true, 2),
  ('3', 'TW-OVM-01', 'Đĩa Sinh Học Oval (Size M)',
   'Đĩa oval cỡ vừa từ lá bàng biển, phù hợp cho gia đình, nhà hàng, khách sạn, khu du lịch và sự kiện.',
   25000, 22000, 19000, 100, 1000, 'gói 10 cái', '1.000 cái',
   2500, '/images/products/collection-display-1.webp', 'dia', true, 3),
  ('4', 'TW-BWL-01', 'Chén Sinh Học Mini',
   'Chén mini sinh học từ lá bàng biển, phù hợp đựng món ăn nhẹ, bánh, trái cây và các phần ăn nhỏ.',
   20000, 19000, 16000, 100, 1000, 'gói 10 cái', '1.000 cái',
   2000, '/images/products/leaf-plates-variety.webp', 'chen', true, 4),
  ('5', 'TW-SET-01', 'Bộ Bàn Ăn Sinh Học B-ECO',
   'Bộ bàn ăn sinh học đồng bộ thuộc dòng B-ECO Daily, mang vẻ đẹp tự nhiên và góp phần giảm vật liệu dùng một lần.',
   99000, 85000, 80000, 1000, NULL, 'bộ', '1.000 bộ',
   1500, '/images/products/exhibition-display.webp', 'combo', true, 5),
  ('6', 'CG-SIG-01', 'Bộ Sưu Tập Khắc Logo Doanh Nghiệp',
   'Sản phẩm khắc logo theo yêu cầu, phù hợp làm quà tặng doanh nghiệp, quà lưu niệm và vật phẩm sự kiện.',
   15000, 12000, 10000, 1000, NULL, 'cái', '1.000 cái',
   1200, '/images/products/custom-logo-beco.webp', 'in-logo', true, 6),
  ('7', 'AR-POR-01', 'Bộ Sưu Tập Chân Dung Nghệ Thuật',
   'Chân dung nghệ thuật thủ công theo yêu cầu, lưu giữ dấu ấn riêng trên nền lá bàng biển tự nhiên.',
   30000, 28000, 26000, 1000, NULL, 'cái', '1.000 cái',
   1000, '/images/products/art-portrait.webp', 'art', true, 7),
  ('8', 'AR-CLK-01', 'Đồng Hồ Nghệ Thuật Sinh Học từ Lá Bàng Biển',
   'Đồng hồ thủ công từ lá bàng biển, kết hợp vật liệu tự nhiên với thiết kế trang trí và quà tặng giàu ý nghĩa.',
   180000, 150000, 140000, 100, NULL, 'cái', '100 cái',
   1000, '/images/products/art-clock.webp', 'art', true, 8),
  ('9', 'AR-FAN-01', 'Quạt Thủ Công Lá Bàng Biển',
   'Quạt cầm tay làm từ lá bàng biển tự nhiên, ép phẳng và hoàn thiện thủ công, phù hợp làm quà tặng xanh.',
   35000, 30000, 29000, 100, NULL, 'cái', '100 cái',
   1000, '/images/products/art-fan.webp', 'art', true, 9),
  ('10', 'AR-ART-01', 'Tranh Vẽ Thủ Công Nghệ Thuật Lá Bàng Biển',
   'Tranh thủ công độc bản trên lá bàng biển, tôn vinh thiên nhiên, văn hóa Việt Nam và dấu ấn sáng tạo của nghệ nhân.',
   159000, 130000, 130000, 50, NULL, 'cái', '50 cái',
   500, '/images/products/art-portrait.webp', 'art', true, 10),
  ('11', 'DC-LEF-01', 'Lá Bàng Biển Trang Trí (Decor Collection)',
   'Bộ sưu tập lá bàng biển trang trí giữ vẻ đẹp nguyên bản của vật liệu tự nhiên, phù hợp cho không gian và quà tặng.',
   20000, 18000, 18000, 1000, NULL, 'cái', '1.000 cái',
   1000, '/images/products/art-decor.webp', 'art', true, 11)
ON CONFLICT (id) DO NOTHING;

-- Đồng bộ realtime để mọi thay đổi từ Admin đẩy ngay tới cửa hàng
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE products;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- --------------------------------------------------------------------
-- Đồng bộ tồn kho với đơn hàng
--
--   * Tạo đơn  → trừ tồn theo từng dòng item (ràng buộc stock >= 0 khiến
--     đơn vượt tồn bị DB từ chối ngay, không cần tin UI phía khách).
--   * Hủy đơn  → hoàn lại tồn đã trừ (chỉ hoàn một lần nhờ so sánh
--     trạng thái cũ/mới).
--   * Xóa đơn  → hoàn tồn nếu đơn chưa từng hủy (đơn đã hủy thì tồn đã
--     được hoàn ở bước hủy, tránh hoàn hai lần).
--   * Sản phẩm đã bị xóa khỏi bảng products thì bỏ qua (đơn lịch sử
--     vẫn tạo được bình thường).
-- --------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.sync_product_stock_on_order()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  item JSONB;
  v_product_id TEXT;
  v_qty INTEGER;
BEGIN
  IF TG_OP = 'INSERT' THEN
    FOR item IN SELECT * FROM jsonb_array_elements(NEW.items) LOOP
      v_product_id := item->>'productId';
      v_qty := COALESCE((item->>'qty')::int, 0);
      IF v_product_id IS NOT NULL AND v_qty > 0 THEN
        UPDATE products SET stock = stock - v_qty WHERE id = v_product_id;
      END IF;
    END LOOP;

  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.status = 'cancelled' AND OLD.status <> 'cancelled' THEN
      FOR item IN SELECT * FROM jsonb_array_elements(NEW.items) LOOP
        v_product_id := item->>'productId';
        v_qty := COALESCE((item->>'qty')::int, 0);
        IF v_product_id IS NOT NULL AND v_qty > 0 THEN
          UPDATE products SET stock = stock + v_qty WHERE id = v_product_id;
        END IF;
      END LOOP;

    ELSIF NEW.status <> 'cancelled' AND OLD.status = 'cancelled' THEN
      -- Mở lại đơn đã hủy: trừ lại như lần đầu
      FOR item IN SELECT * FROM jsonb_array_elements(NEW.items) LOOP
        v_product_id := item->>'productId';
        v_qty := COALESCE((item->>'qty')::int, 0);
        IF v_product_id IS NOT NULL AND v_qty > 0 THEN
          UPDATE products SET stock = stock - v_qty WHERE id = v_product_id;
        END IF;
      END LOOP;
    END IF;

  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.status <> 'cancelled' THEN
      FOR item IN SELECT * FROM jsonb_array_elements(OLD.items) LOOP
        v_product_id := item->>'productId';
        v_qty := COALESCE((item->>'qty')::int, 0);
        IF v_product_id IS NOT NULL AND v_qty > 0 THEN
          UPDATE products SET stock = stock + v_qty WHERE id = v_product_id;
        END IF;
      END LOOP;
    END IF;
  END IF;

  RETURN NULL; -- trigger AFTER, không can thiệp dòng dữ liệu
END;
$$;

DROP TRIGGER IF EXISTS orders_sync_product_stock ON orders;
CREATE TRIGGER orders_sync_product_stock
AFTER INSERT OR UPDATE OF status OR DELETE ON orders
FOR EACH ROW EXECUTE FUNCTION public.sync_product_stock_on_order();

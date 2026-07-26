-- =====================================================================
-- B-ECO — Migration v2 cho bảng orders
-- Chạy toàn bộ file này trong Supabase SQL Editor. Script idempotent,
-- chạy lại nhiều lần không gây lỗi.
--
-- Giải quyết:
--   1. Bổ sung 3 cột code đang ghi nhưng schema chưa có
--      (payment_status, status_history, current_location)
--   2. Thêm RPC lookup_order để tra cứu đơn mà không cần mở SELECT
--      công khai toàn bảng
-- =====================================================================

-- --------------------------------------------------------------------
-- 1. Bổ sung cột còn thiếu
-- --------------------------------------------------------------------
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status TEXT NOT NULL DEFAULT 'unpaid';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS status_history JSONB NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS current_location TEXT;

-- Ràng buộc giá trị hợp lệ (bỏ qua nếu đã có)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'orders_payment_status_check') THEN
    ALTER TABLE orders ADD CONSTRAINT orders_payment_status_check
      CHECK (payment_status IN ('unpaid', 'deposit_50', 'paid_100'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'orders_status_check') THEN
    ALTER TABLE orders ADD CONSTRAINT orders_status_check
      CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'orders_payment_method_check') THEN
    ALTER TABLE orders ADD CONSTRAINT orders_payment_method_check
      CHECK (payment_method IN ('COD', 'BANK_TRANSFER'));
  END IF;
END $$;

-- Mã đơn phải là duy nhất — tra cứu đơn dựa hoàn toàn vào mã này
CREATE UNIQUE INDEX IF NOT EXISTS orders_order_code_key ON orders (order_code);

-- Lấp dữ liệu cho đơn cũ đang có status_history rỗng
UPDATE orders
SET status_history = jsonb_build_array(
      jsonb_build_object(
        'status', status,
        'timestamp', to_char(created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
        'note', COALESCE(current_location, 'Khởi tạo đơn hàng tại Kho B-ECO')
      )
    )
WHERE status_history = '[]'::jsonb OR status_history IS NULL;

-- --------------------------------------------------------------------
-- 2. RPC tra cứu đơn hàng
--
-- Cho phép khách tra đơn bằng (mã đơn + số điện thoại) mà KHÔNG cần
-- policy SELECT công khai. So khớp số điện thoại thực hiện trong DB,
-- chỉ trả về đúng 1 dòng khi khớp.
-- --------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.lookup_order(p_order_code TEXT, p_phone TEXT)
RETURNS SETOF orders
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT *
  FROM orders
  WHERE upper(trim(order_code)) = upper(trim(p_order_code))
    AND regexp_replace(COALESCE(customer_info->>'phone', ''), '[^0-9]', '', 'g')
        = regexp_replace(COALESCE(p_phone, ''), '[^0-9]', '', 'g')
    AND length(regexp_replace(COALESCE(p_phone, ''), '[^0-9]', '', 'g')) >= 9
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.lookup_order(TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.lookup_order(TEXT, TEXT) TO anon, authenticated;

-- --------------------------------------------------------------------
-- 3. (TÙY CHỌN — chạy sau khi đã deploy code mới)
--
-- Sau khi front-end đã dùng lookup_order, gỡ policy SELECT công khai để
-- không ai dump được toàn bộ dữ liệu khách hàng bằng anon key.
--
-- ⚠️ Chỉ bỏ comment khối này khi bản deploy hiện tại đã dùng RPC.
--    Kiểm tra bằng cách tra thử một đơn ở trang /order-lookup trước.
-- --------------------------------------------------------------------
-- DROP POLICY IF EXISTS "Allow anonymous select orders" ON orders;
--
-- CREATE POLICY "Admin can select orders"
-- ON orders FOR SELECT
-- USING (lower(auth.jwt() ->> 'email') = 'admin@beco.com');

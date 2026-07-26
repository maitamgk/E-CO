-- =====================================================================
-- B-ECO — Hệ thống đánh giá sản phẩm
-- Chạy toàn bộ file này trong Supabase SQL Editor. Script idempotent.
--
-- Nguyên tắc thiết kế:
--   1. Mọi đánh giá vào trạng thái 'pending', phải được admin duyệt mới
--      hiển thị công khai — chặn spam và nội dung xấu.
--   2. Nhãn "Đã mua hàng" do DB tự xác minh từ bảng orders, client KHÔNG
--      tự đặt được. Nếu để client gửi lên thì ai cũng gắn nhãn giả được.
--   3. Không mở INSERT trực tiếp vào bảng — mọi ghi đều qua RPC để ràng
--      buộc được các quy tắc trên.
-- =====================================================================

CREATE TABLE IF NOT EXISTS product_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id TEXT NOT NULL,
    author_name TEXT NOT NULL,
    rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    content TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    verified BOOLEAN NOT NULL DEFAULT false,
    helpful_count INTEGER NOT NULL DEFAULT 0 CHECK (helpful_count >= 0),
    order_code TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS product_reviews_product_idx
  ON product_reviews (product_id, status, created_at DESC);

-- Một mã đơn chỉ được đánh giá một lần cho mỗi sản phẩm
CREATE UNIQUE INDEX IF NOT EXISTS product_reviews_order_product_key
  ON product_reviews (order_code, product_id)
  WHERE order_code IS NOT NULL;

ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------------------
-- RLS
-- --------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can read approved reviews" ON product_reviews;
CREATE POLICY "Public can read approved reviews"
ON product_reviews FOR SELECT
USING (status = 'approved');

DROP POLICY IF EXISTS "Admin can read all reviews" ON product_reviews;
CREATE POLICY "Admin can read all reviews"
ON product_reviews FOR SELECT
USING (lower(auth.jwt() ->> 'email') = 'admin@beco.com');

DROP POLICY IF EXISTS "Admin can moderate reviews" ON product_reviews;
CREATE POLICY "Admin can moderate reviews"
ON product_reviews FOR UPDATE
USING (lower(auth.jwt() ->> 'email') = 'admin@beco.com')
WITH CHECK (lower(auth.jwt() ->> 'email') = 'admin@beco.com');

DROP POLICY IF EXISTS "Admin can delete reviews" ON product_reviews;
CREATE POLICY "Admin can delete reviews"
ON product_reviews FOR DELETE
USING (lower(auth.jwt() ->> 'email') = 'admin@beco.com');

-- Cố ý KHÔNG có policy INSERT: khách gửi đánh giá qua RPC submit_review.

-- --------------------------------------------------------------------
-- RPC gửi đánh giá
--
-- Trả về id + verified để giao diện biết đánh giá có được gắn nhãn
-- "đã mua hàng" hay không. Luôn vào trạng thái pending.
-- --------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.submit_review(
  p_product_id TEXT,
  p_author_name TEXT,
  p_rating SMALLINT,
  p_content TEXT,
  p_order_code TEXT DEFAULT NULL,
  p_phone TEXT DEFAULT NULL
)
RETURNS TABLE (id UUID, verified BOOLEAN)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_author TEXT := nullif(btrim(p_author_name), '');
  v_content TEXT := nullif(btrim(p_content), '');
  v_code TEXT := nullif(btrim(p_order_code), '');
  v_verified BOOLEAN := false;
  v_id UUID;
BEGIN
  IF v_author IS NULL OR length(v_author) > 60 THEN
    RAISE EXCEPTION 'Tên người đánh giá không hợp lệ';
  END IF;

  IF v_content IS NULL OR length(v_content) < 10 OR length(v_content) > 1500 THEN
    RAISE EXCEPTION 'Nội dung đánh giá phải từ 10 đến 1500 ký tự';
  END IF;

  IF p_rating IS NULL OR p_rating < 1 OR p_rating > 5 THEN
    RAISE EXCEPTION 'Số sao phải từ 1 đến 5';
  END IF;

  -- Xác minh đã mua hàng: đơn phải tồn tại, đúng số điện thoại, đã giao,
  -- và thực sự có chứa sản phẩm đang được đánh giá.
  IF v_code IS NOT NULL AND p_phone IS NOT NULL THEN
    SELECT EXISTS (
      SELECT 1
      FROM orders o
      WHERE upper(btrim(o.order_code)) = upper(v_code)
        AND regexp_replace(COALESCE(o.customer_info->>'phone', ''), '[^0-9]', '', 'g')
            = regexp_replace(p_phone, '[^0-9]', '', 'g')
        AND o.status = 'delivered'
        AND EXISTS (
          SELECT 1 FROM jsonb_array_elements(o.items) AS item
          WHERE item->>'productId' = p_product_id
        )
    ) INTO v_verified;

    IF NOT v_verified THEN
      v_code := NULL; -- không khớp thì không giữ mã đơn để tránh khóa nhầm unique index
    END IF;
  END IF;

  INSERT INTO product_reviews (product_id, author_name, rating, content, order_code, verified, status)
  VALUES (p_product_id, v_author, p_rating, v_content, v_code, v_verified, 'pending')
  RETURNING product_reviews.id INTO v_id;

  RETURN QUERY SELECT v_id, v_verified;
END;
$$;

REVOKE ALL ON FUNCTION public.submit_review(TEXT, TEXT, SMALLINT, TEXT, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_review(TEXT, TEXT, SMALLINT, TEXT, TEXT, TEXT) TO anon, authenticated;

-- --------------------------------------------------------------------
-- RPC bình chọn "hữu ích"
--
-- Chỉ tăng đếm trên đánh giá đã duyệt. Chống spam ở mức cơ bản bằng cách
-- giới hạn ở phía giao diện (một lần mỗi máy); đây là số liệu tham khảo
-- nên không cần định danh người bình chọn.
-- --------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.mark_review_helpful(p_review_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count INTEGER;
BEGIN
  UPDATE product_reviews
  SET helpful_count = helpful_count + 1,
      updated_at = timezone('utc'::text, now())
  WHERE id = p_review_id AND status = 'approved'
  RETURNING helpful_count INTO v_count;

  RETURN COALESCE(v_count, 0);
END;
$$;

REVOKE ALL ON FUNCTION public.mark_review_helpful(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.mark_review_helpful(UUID) TO anon, authenticated;

-- --------------------------------------------------------------------
-- RPC thống kê điểm đánh giá
--
-- Trả về điểm trung bình và phân bố sao cho mọi sản phẩm trong một lần
-- gọi, để trang cửa hàng không phải tải toàn bộ nội dung đánh giá.
-- --------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.review_summary(p_product_id TEXT DEFAULT NULL)
RETURNS TABLE (
  product_id TEXT,
  total BIGINT,
  average NUMERIC,
  star_1 BIGINT,
  star_2 BIGINT,
  star_3 BIGINT,
  star_4 BIGINT,
  star_5 BIGINT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    r.product_id,
    count(*) AS total,
    round(avg(r.rating)::numeric, 1) AS average,
    count(*) FILTER (WHERE r.rating = 1) AS star_1,
    count(*) FILTER (WHERE r.rating = 2) AS star_2,
    count(*) FILTER (WHERE r.rating = 3) AS star_3,
    count(*) FILTER (WHERE r.rating = 4) AS star_4,
    count(*) FILTER (WHERE r.rating = 5) AS star_5
  FROM product_reviews r
  WHERE r.status = 'approved'
    AND (p_product_id IS NULL OR r.product_id = p_product_id)
  GROUP BY r.product_id;
$$;

REVOKE ALL ON FUNCTION public.review_summary(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.review_summary(TEXT) TO anon, authenticated;

-- Cho phép admin nhận thông báo realtime khi có đánh giá mới
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE product_reviews;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

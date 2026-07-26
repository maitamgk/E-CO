import { supabase } from '@/lib/supabase';
import { ProductReview, ReviewDraft, ReviewStatus, ReviewSummary } from '@/types';

interface ReviewRow {
  id: string;
  product_id: string;
  author_name: string;
  rating: number;
  content: string;
  status: ReviewStatus;
  verified: boolean;
  helpful_count: number;
  created_at: string;
}

interface SummaryRow {
  product_id: string;
  total: number;
  average: number;
  star_1: number;
  star_2: number;
  star_3: number;
  star_4: number;
  star_5: number;
}

export const EMPTY_SUMMARY: ReviewSummary = {
  total: 0,
  average: 0,
  distribution: [0, 0, 0, 0, 0],
};

export const REVIEW_LIMITS = {
  authorMax: 60,
  contentMin: 10,
  contentMax: 1500,
} as const;

const parseReview = (row: ReviewRow): ProductReview => ({
  id: row.id,
  productId: row.product_id,
  authorName: row.author_name,
  rating: row.rating,
  content: row.content,
  status: row.status,
  verified: row.verified,
  helpfulCount: row.helpful_count ?? 0,
  createdAt: new Date(row.created_at),
});

const parseSummary = (row: SummaryRow): ReviewSummary => ({
  total: Number(row.total) || 0,
  average: Number(row.average) || 0,
  distribution: [
    Number(row.star_1) || 0,
    Number(row.star_2) || 0,
    Number(row.star_3) || 0,
    Number(row.star_4) || 0,
    Number(row.star_5) || 0,
  ],
});

/** Kiểm tra ở client để báo lỗi ngay; DB vẫn kiểm lại lần nữa trong RPC. */
export const validateReviewDraft = (draft: ReviewDraft): string | null => {
  const name = draft.authorName.trim();
  const content = draft.content.trim();

  if (!name) return 'Vui lòng nhập tên của bạn';
  if (name.length > REVIEW_LIMITS.authorMax) return `Tên tối đa ${REVIEW_LIMITS.authorMax} ký tự`;
  if (draft.rating < 1 || draft.rating > 5) return 'Vui lòng chọn số sao';
  if (content.length < REVIEW_LIMITS.contentMin) {
    return `Nội dung đánh giá cần ít nhất ${REVIEW_LIMITS.contentMin} ký tự`;
  }
  if (content.length > REVIEW_LIMITS.contentMax) {
    return `Nội dung tối đa ${REVIEW_LIMITS.contentMax} ký tự`;
  }
  // Mã đơn và số điện thoại đi thành cặp — thiếu một trong hai thì không xác minh được.
  if (draft.orderCode?.trim() && !draft.phone?.trim()) {
    return 'Nhập kèm số điện thoại đặt hàng để xác minh đơn';
  }
  return null;
};

export interface SubmitReviewResult {
  ok: boolean;
  verified: boolean;
  error?: string;
}

export const reviewService = {
  /** Đánh giá đã duyệt của một sản phẩm, mới nhất trước. */
  getApproved: async (productId: string): Promise<ProductReview[]> => {
    const { data, error } = await supabase
      .from('product_reviews')
      .select('*')
      .eq('product_id', productId)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Không tải được đánh giá:', error);
      return [];
    }

    return (data as ReviewRow[]).map(parseReview);
  },

  getSummary: async (productId: string): Promise<ReviewSummary> => {
    const { data, error } = await supabase.rpc('review_summary', { p_product_id: productId });

    if (error) {
      console.error('Không tải được thống kê đánh giá:', error);
      return EMPTY_SUMMARY;
    }

    const rows = (data ?? []) as SummaryRow[];
    return rows.length > 0 ? parseSummary(rows[0]) : EMPTY_SUMMARY;
  },

  submit: async (draft: ReviewDraft): Promise<SubmitReviewResult> => {
    const validationError = validateReviewDraft(draft);
    if (validationError) {
      return { ok: false, verified: false, error: validationError };
    }

    const { data, error } = await supabase.rpc('submit_review', {
      p_product_id: draft.productId,
      p_author_name: draft.authorName.trim(),
      p_rating: draft.rating,
      p_content: draft.content.trim(),
      p_order_code: draft.orderCode?.trim() || null,
      p_phone: draft.phone?.trim() || null,
    });

    if (error) {
      console.error('Không gửi được đánh giá:', error);
      return {
        ok: false,
        verified: false,
        error: error.message?.includes('product_reviews_order_product_key')
          ? 'Đơn hàng này đã đánh giá sản phẩm rồi.'
          : 'Không gửi được đánh giá. Vui lòng thử lại sau.',
      };
    }

    const rows = (data ?? []) as { id: string; verified: boolean }[];
    return { ok: true, verified: rows[0]?.verified ?? false };
  },

  markHelpful: async (reviewId: string): Promise<number | null> => {
    const { data, error } = await supabase.rpc('mark_review_helpful', { p_review_id: reviewId });

    if (error) {
      console.error('Không ghi nhận được lượt hữu ích:', error);
      return null;
    }
    return typeof data === 'number' ? data : null;
  },

  /* ── Dành cho admin ─────────────────────────────── */

  getAll: async (status?: ReviewStatus): Promise<ProductReview[]> => {
    let query = supabase.from('product_reviews').select('*').order('created_at', { ascending: false });
    if (status) query = query.eq('status', status);

    const { data, error } = await query;

    if (error) {
      console.error('Không tải được danh sách đánh giá:', error);
      return [];
    }

    return (data as ReviewRow[]).map(parseReview);
  },

  setStatus: async (reviewId: string, status: ReviewStatus): Promise<boolean> => {
    const { error } = await supabase
      .from('product_reviews')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', reviewId);

    if (error) {
      console.error('Không cập nhật được trạng thái đánh giá:', error);
      return false;
    }
    return true;
  },

  remove: async (reviewId: string): Promise<boolean> => {
    const { error } = await supabase.from('product_reviews').delete().eq('id', reviewId);

    if (error) {
      console.error('Không xóa được đánh giá:', error);
      return false;
    }
    return true;
  },
};

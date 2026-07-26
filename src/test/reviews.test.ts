import { describe, expect, it } from 'vitest';
import { EMPTY_SUMMARY, REVIEW_LIMITS, validateReviewDraft } from '@/services/reviewService';
import type { ReviewDraft } from '@/types';

const draft = (overrides: Partial<ReviewDraft> = {}): ReviewDraft => ({
  productId: '1',
  authorName: 'Nguyễn Văn A',
  rating: 5,
  content: 'Sản phẩm dùng tốt, đóng gói cẩn thận.',
  ...overrides,
});

describe('validateReviewDraft', () => {
  it('chấp nhận đánh giá hợp lệ', () => {
    expect(validateReviewDraft(draft())).toBeNull();
  });

  it('bắt buộc có tên', () => {
    expect(validateReviewDraft(draft({ authorName: '   ' }))).toBe('Vui lòng nhập tên của bạn');
  });

  it('chặn tên quá dài', () => {
    expect(validateReviewDraft(draft({ authorName: 'a'.repeat(REVIEW_LIMITS.authorMax + 1) })))
      .toContain('Tên tối đa');
  });

  it('bắt buộc chọn số sao trong khoảng 1-5', () => {
    expect(validateReviewDraft(draft({ rating: 0 }))).toBe('Vui lòng chọn số sao');
    expect(validateReviewDraft(draft({ rating: 6 }))).toBe('Vui lòng chọn số sao');
  });

  it('chặn nội dung quá ngắn hoặc quá dài', () => {
    expect(validateReviewDraft(draft({ content: 'ngắn' }))).toContain('ít nhất');
    expect(validateReviewDraft(draft({ content: 'a'.repeat(REVIEW_LIMITS.contentMax + 1) })))
      .toContain('tối đa');
  });

  it('đòi số điện thoại khi có nhập mã đơn', () => {
    expect(validateReviewDraft(draft({ orderCode: 'BCO-260726-ABCDE' })))
      .toBe('Nhập kèm số điện thoại đặt hàng để xác minh đơn');
  });

  it('cho phép bỏ trống cả mã đơn lẫn số điện thoại', () => {
    expect(validateReviewDraft(draft({ orderCode: '', phone: '' }))).toBeNull();
  });

  it('chấp nhận khi có đủ cặp mã đơn và số điện thoại', () => {
    expect(validateReviewDraft(draft({ orderCode: 'BCO-260726-ABCDE', phone: '0901234567' })))
      .toBeNull();
  });

  it('không tính khoảng trắng đầu cuối vào độ dài nội dung', () => {
    const padded = `   ${'a'.repeat(REVIEW_LIMITS.contentMin - 1)}   `;
    expect(validateReviewDraft(draft({ content: padded }))).toContain('ít nhất');
  });
});

describe('EMPTY_SUMMARY', () => {
  it('là trạng thái rỗng an toàn để hiển thị khi chưa có đánh giá', () => {
    expect(EMPTY_SUMMARY.total).toBe(0);
    expect(EMPTY_SUMMARY.average).toBe(0);
    expect(EMPTY_SUMMARY.distribution).toHaveLength(5);
    expect(EMPTY_SUMMARY.distribution.every(count => count === 0)).toBe(true);
  });
});

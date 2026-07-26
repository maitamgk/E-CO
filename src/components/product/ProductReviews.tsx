import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Star, ThumbsUp, User, CheckCircle2, MessageSquare, Loader2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { REVIEW_LIMITS, reviewService } from '@/services/reviewService';
import { ProductReview, ReviewSummary } from '@/types';

const PAGE_SIZE = 5;
const HELPFUL_STORAGE_KEY = 'beco_helpful_reviews';

/** Lượt "hữu ích" đã bấm trên máy này — chặn bấm lại nhiều lần. */
const readHelpfulVotes = (): Record<string, boolean> => {
  try {
    const raw = localStorage.getItem(HELPFUL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const StarRating = ({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = { sm: 'h-3 w-3', md: 'h-4 w-4', lg: 'h-5 w-5' };

  return (
    <div className="flex gap-0.5" aria-label={`${rating} trên 5 sao`}>
      {[1, 2, 3, 4, 5].map(star => (
        <Star
          key={star}
          className={cn(
            sizeClasses[size],
            star <= rating ? 'fill-yellow-400 text-yellow-400' : 'fill-muted text-muted',
          )}
        />
      ))}
    </div>
  );
};

interface ProductReviewsProps {
  productId: string;
  summary: ReviewSummary;
  /** Gọi sau khi gửi đánh giá thành công để trang cha tải lại thống kê. */
  onReviewSubmitted?: () => void;
}

export const ProductReviews = ({ productId, summary, onReviewSubmitted }: ProductReviewsProps) => {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ authorName: '', content: '', orderCode: '', phone: '' });
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, boolean>>(readHelpfulVotes);

  const loadReviews = useCallback(async () => {
    setIsLoading(true);
    const data = await reviewService.getApproved(productId);
    setReviews(data);
    setVisibleCount(PAGE_SIZE);
    setIsLoading(false);
  }, [productId]);

  useEffect(() => {
    void loadReviews();
  }, [loadReviews]);

  const handleHelpful = async (reviewId: string) => {
    if (helpfulVotes[reviewId]) return;

    const nextVotes = { ...helpfulVotes, [reviewId]: true };
    setHelpfulVotes(nextVotes);
    try {
      localStorage.setItem(HELPFUL_STORAGE_KEY, JSON.stringify(nextVotes));
    } catch {
      // Không lưu được thì thôi, không chặn thao tác.
    }

    const newCount = await reviewService.markHelpful(reviewId);
    if (newCount === null) return;

    setReviews(prev =>
      prev.map(review => (review.id === reviewId ? { ...review, helpfulCount: newCount } : review)),
    );
  };

  const handleSubmitReview = async () => {
    setIsSubmitting(true);
    try {
      const result = await reviewService.submit({
        productId,
        authorName: form.authorName,
        rating: userRating,
        content: form.content,
        orderCode: form.orderCode,
        phone: form.phone,
      });

      if (!result.ok) {
        toast.error(result.error ?? 'Không gửi được đánh giá');
        return;
      }

      toast.success('Đã gửi đánh giá!', {
        description: result.verified
          ? 'Đánh giá của bạn được xác minh "đã mua hàng" và sẽ hiển thị sau khi B-ECO duyệt.'
          : 'Đánh giá sẽ hiển thị sau khi B-ECO duyệt. Cảm ơn bạn!',
        duration: 6000,
      });

      setShowReviewForm(false);
      setUserRating(0);
      setForm({ authorName: '', content: '', orderCode: '', phone: '' });
      onReviewSubmitted?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasReviews = summary.total > 0;
  const visibleReviews = reviews.slice(0, visibleCount);

  return (
    <div className="space-y-8">
      {/* Tổng quan điểm đánh giá */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-card rounded-2xl border border-border">
        <div className="text-center md:text-left space-y-4">
          {hasReviews ? (
            <div className="flex items-center justify-center md:justify-start gap-4">
              <span className="text-6xl font-bold text-foreground">
                {summary.average.toFixed(1)}
              </span>
              <div className="space-y-1">
                <StarRating rating={Math.round(summary.average)} size="lg" />
                <p className="text-sm text-muted-foreground">{summary.total} đánh giá</p>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-lg font-semibold text-foreground">Chưa có đánh giá nào</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Hãy là người đầu tiên chia sẻ trải nghiệm về sản phẩm này.
              </p>
            </div>
          )}

          <Button onClick={() => setShowReviewForm(!showReviewForm)} className="rounded-xl">
            <MessageSquare className="h-4 w-4 mr-2" />
            Viết đánh giá
          </Button>
        </div>

        {hasReviews && (
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(stars => {
              const count = summary.distribution[stars - 1];
              const percentage = summary.total > 0 ? (count / summary.total) * 100 : 0;

              return (
                <div key={stars} className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground w-12">{stars} sao</span>
                  <Progress value={percentage} className="flex-1 h-2" />
                  <span className="text-sm text-muted-foreground w-10 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Form gửi đánh giá */}
      {showReviewForm && (
        <div className="p-6 bg-card rounded-2xl border border-border space-y-4 animate-fade-in">
          <h3 className="font-semibold text-lg text-foreground">Viết đánh giá của bạn</h3>

          <div className="space-y-2">
            <Label>Đánh giá của bạn *</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setUserRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-110"
                  aria-label={`Chấm ${star} sao`}
                >
                  <Star
                    className={cn(
                      'h-8 w-8 transition-colors',
                      (hoverRating || userRating) >= star
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-muted text-muted',
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="review-author">Tên của bạn *</Label>
            <Input
              id="review-author"
              value={form.authorName}
              maxLength={REVIEW_LIMITS.authorMax}
              onChange={e => setForm(prev => ({ ...prev, authorName: e.target.value }))}
              placeholder="Nguyễn Văn A"
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="review-content">Nội dung đánh giá *</Label>
            <Textarea
              id="review-content"
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
              value={form.content}
              maxLength={REVIEW_LIMITS.contentMax}
              onChange={e => setForm(prev => ({ ...prev, content: e.target.value }))}
              className="min-h-[120px] rounded-xl"
            />
            <p className="text-xs text-muted-foreground text-right">
              {form.content.trim().length}/{REVIEW_LIMITS.contentMax}
            </p>
          </div>

          {/* Xác minh đã mua hàng */}
          <div className="rounded-xl border border-dashed border-border p-4 space-y-3">
            <div className="flex items-start gap-2">
              <ShieldCheck className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-xs leading-5 text-muted-foreground">
                Nhập mã đơn và số điện thoại đã đặt hàng để nhận nhãn{' '}
                <strong className="text-foreground">Đã mua hàng</strong>. Không bắt buộc — bỏ trống
                vẫn gửi được đánh giá.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                value={form.orderCode}
                onChange={e => setForm(prev => ({ ...prev, orderCode: e.target.value }))}
                placeholder="Mã đơn (BCO-...)"
                className="rounded-xl"
                aria-label="Mã đơn hàng"
              />
              <Input
                value={form.phone}
                onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Số điện thoại đặt hàng"
                className="rounded-xl"
                aria-label="Số điện thoại đặt hàng"
              />
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Đánh giá sẽ hiển thị công khai sau khi B-ECO kiểm duyệt.
          </p>

          <div className="flex gap-3">
            <Button
              onClick={handleSubmitReview}
              disabled={
                isSubmitting ||
                !userRating ||
                !form.authorName.trim() ||
                form.content.trim().length < REVIEW_LIMITS.contentMin
              }
              className="rounded-xl"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang gửi...
                </>
              ) : (
                'Gửi đánh giá'
              )}
            </Button>
            <Button variant="outline" onClick={() => setShowReviewForm(false)} className="rounded-xl">
              Hủy
            </Button>
          </div>
        </div>
      )}

      {/* Danh sách đánh giá */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          Đánh giá từ khách hàng
        </h3>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="p-5 bg-card rounded-2xl border border-border space-y-3">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        ) : visibleReviews.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center">
            <MessageSquare className="mx-auto h-10 w-10 text-muted-foreground/50" />
            <p className="mt-4 font-medium text-foreground">Sản phẩm chưa có đánh giá</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Đánh giá của bạn sẽ giúp khách hàng khác chọn đúng sản phẩm.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {visibleReviews.map(review => (
              <div
                key={review.id}
                className="p-5 bg-card rounded-2xl border border-border hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-3 gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-foreground">{review.authorName}</span>
                        {review.verified && (
                          <Badge variant="secondary" className="text-xs px-2 py-0">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Đã mua hàng
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {review.createdAt.toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                  <StarRating rating={review.rating} size="sm" />
                </div>

                <p className="text-muted-foreground leading-relaxed mb-4 whitespace-pre-line">
                  {review.content}
                </p>

                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => handleHelpful(review.id)}
                    disabled={helpfulVotes[review.id]}
                    className={cn(
                      'flex items-center gap-2 text-sm transition-colors',
                      helpfulVotes[review.id]
                        ? 'text-primary cursor-default'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    <ThumbsUp className={cn('h-4 w-4', helpfulVotes[review.id] && 'fill-current')} />
                    Hữu ích ({review.helpfulCount})
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {visibleCount < reviews.length && (
          <div className="text-center pt-4">
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => setVisibleCount(count => count + PAGE_SIZE)}
            >
              Xem thêm đánh giá ({reviews.length - visibleCount})
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

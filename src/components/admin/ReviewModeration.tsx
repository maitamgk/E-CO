import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Check, MessageSquare, Star, Trash2, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { reviewService } from '@/services/reviewService';
import { ProductReview, ReviewStatus } from '@/types';
import { useProducts } from '@/context/ProductsContext';
import { cn } from '@/lib/utils';

const STATUS_TABS: { value: ReviewStatus; label: string }[] = [
  { value: 'pending', label: 'Chờ duyệt' },
  { value: 'approved', label: 'Đã duyệt' },
  { value: 'rejected', label: 'Đã từ chối' },
];

const STATUS_BADGE: Record<ReviewStatus, string> = {
  pending: 'bg-yellow-500',
  approved: 'bg-green-600',
  rejected: 'bg-red-500',
};

export const ReviewModeration = () => {
  const { products } = useProducts();
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [activeTab, setActiveTab] = useState<ReviewStatus>('pending');
  const [isLoading, setIsLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    setIsLoading(true);
    setReviews(await reviewService.getAll());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void fetchReviews();

    const channel = supabase
      .channel('reviews-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'product_reviews' }, () => {
        void fetchReviews();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchReviews]);

  const productName = (productId: string) =>
    products.find(p => p.id === productId)?.name ?? `Sản phẩm #${productId}`;

  const updateStatus = async (reviewId: string, status: ReviewStatus) => {
    setBusyId(reviewId);
    const ok = await reviewService.setStatus(reviewId, status);
    if (ok) {
      toast.success(status === 'approved' ? 'Đã duyệt đánh giá' : 'Đã từ chối đánh giá');
      await fetchReviews();
    } else {
      toast.error('Cập nhật thất bại');
    }
    setBusyId(null);
  };

  const removeReview = async (reviewId: string) => {
    if (!window.confirm('Xóa vĩnh viễn đánh giá này?')) return;

    setBusyId(reviewId);
    const ok = await reviewService.remove(reviewId);
    if (ok) {
      toast.success('Đã xóa đánh giá');
      await fetchReviews();
    } else {
      toast.error('Xóa thất bại');
    }
    setBusyId(null);
  };

  const countByStatus = (status: ReviewStatus) => reviews.filter(r => r.status === status).length;
  const visibleReviews = reviews.filter(review => review.status === activeTab);
  const pendingCount = countByStatus('pending');

  return (
    <div className="bg-white border border-border/40 shadow-sm rounded-lg overflow-hidden">
      <div className="p-6 border-b border-border/40 bg-background">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-heading text-primary font-bold flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Kiểm duyệt đánh giá
              {pendingCount > 0 && (
                <span className="rounded-full bg-yellow-500 px-2 py-0.5 text-xs font-semibold text-white">
                  {pendingCount} chờ duyệt
                </span>
              )}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Đánh giá chỉ hiển thị công khai sau khi được duyệt
            </p>
          </div>

          <div className="flex gap-1 rounded-lg border border-border/40 p-1">
            {STATUS_TABS.map(tab => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setActiveTab(tab.value)}
                className={cn(
                  'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                  activeTab === tab.value
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted',
                )}
              >
                {tab.label} ({countByStatus(tab.value)})
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="divide-y divide-border/30">
        {isLoading ? (
          <p className="p-8 text-center text-sm text-muted-foreground">Đang tải đánh giá...</p>
        ) : visibleReviews.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">
            Không có đánh giá nào ở mục này.
          </p>
        ) : (
          visibleReviews.map(review => (
            <div key={review.id} className="p-5 hover:bg-muted/20 transition-colors">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-sm">{review.authorName}</span>

                    <span className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star
                          key={star}
                          className={cn(
                            'h-3.5 w-3.5',
                            star <= review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'fill-muted text-muted',
                          )}
                        />
                      ))}
                    </span>

                    {review.verified && (
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                        Đã mua hàng
                      </Badge>
                    )}

                    <Badge
                      className={cn(
                        STATUS_BADGE[review.status],
                        'text-white border-0 text-[10px] px-1.5 py-0',
                      )}
                    >
                      {STATUS_TABS.find(t => t.value === review.status)?.label}
                    </Badge>
                  </div>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {productName(review.productId)} · {review.createdAt.toLocaleString('vi-VN')}
                  </p>

                  <p className="mt-2 text-sm text-foreground whitespace-pre-line">{review.content}</p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {review.status !== 'approved' && (
                    <Button
                      size="sm"
                      disabled={busyId === review.id}
                      onClick={() => updateStatus(review.id, 'approved')}
                      className="h-8 rounded-md bg-green-600 px-3 text-xs text-white hover:bg-green-700"
                    >
                      <Check className="mr-1 h-3.5 w-3.5" />
                      Duyệt
                    </Button>
                  )}
                  {review.status !== 'rejected' && (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={busyId === review.id}
                      onClick={() => updateStatus(review.id, 'rejected')}
                      className="h-8 rounded-md px-3 text-xs text-muted-foreground"
                    >
                      <X className="mr-1 h-3.5 w-3.5" />
                      Từ chối
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={busyId === review.id}
                    onClick={() => removeReview(review.id)}
                    className="h-8 rounded-md px-2.5 text-xs text-red-500 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

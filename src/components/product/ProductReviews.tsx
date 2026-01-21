import { useState } from 'react';
import { Star, ThumbsUp, User, CheckCircle2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  content: string;
  helpful: number;
  verified: boolean;
  avatar?: string;
}

// Mock reviews data
const mockReviews: Review[] = [
  {
    id: '1',
    author: 'Nguyễn Văn An',
    rating: 5,
    date: '15/01/2026',
    content: 'Sản phẩm rất chất lượng, lá bàng tự nhiên 100%. Mình đặt cho tiệc cưới, khách ai cũng khen. Giao hàng nhanh, đóng gói cẩn thận.',
    helpful: 24,
    verified: true,
  },
  {
    id: '2',
    author: 'Trần Thị Mai',
    rating: 5,
    date: '12/01/2026',
    content: 'Đã mua lần thứ 3 rồi. Sản phẩm eco-friendly, phù hợp với xu hướng bảo vệ môi trường. Chất lượng ổn định qua các lần đặt.',
    helpful: 18,
    verified: true,
  },
  {
    id: '3',
    author: 'Lê Hoàng Nam',
    rating: 4,
    date: '08/01/2026',
    content: 'Chất lượng tốt, giá cả hợp lý. Chỉ có điều giao hàng hơi lâu do ở xa. Nhưng sản phẩm thì không có gì phải chê.',
    helpful: 12,
    verified: true,
  },
  {
    id: '4',
    author: 'Phạm Thị Hương',
    rating: 5,
    date: '05/01/2026',
    content: 'Mua cho quán ăn chay, khách hàng rất thích vì ý tưởng thân thiện môi trường. Sẽ tiếp tục đặt hàng thường xuyên.',
    helpful: 15,
    verified: true,
  },
  {
    id: '5',
    author: 'Võ Minh Tuấn',
    rating: 4,
    date: '02/01/2026',
    content: 'Sản phẩm đẹp, độc đáo. Dùng làm quà tặng đối tác, ai cũng ấn tượng. Giá sỉ rất tốt khi đặt số lượng lớn.',
    helpful: 9,
    verified: false,
  },
];

const ratingDistribution = [
  { stars: 5, count: 156, percentage: 78 },
  { stars: 4, count: 32, percentage: 16 },
  { stars: 3, count: 8, percentage: 4 },
  { stars: 2, count: 3, percentage: 1.5 },
  { stars: 1, count: 1, percentage: 0.5 },
];

const StarRating = ({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            sizeClasses[size],
            star <= rating
              ? 'fill-yellow-400 text-yellow-400'
              : 'fill-muted text-muted'
          )}
        />
      ))}
    </div>
  );
};

interface ProductReviewsProps {
  productId: string;
}

export const ProductReviews = ({ productId }: ProductReviewsProps) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [helpfulClicked, setHelpfulClicked] = useState<Record<string, boolean>>({});

  const averageRating = 4.7;
  const totalReviews = 200;

  const handleHelpful = (reviewId: string) => {
    setHelpfulClicked(prev => ({ ...prev, [reviewId]: !prev[reviewId] }));
  };

  const handleSubmitReview = () => {
    // In a real app, this would submit to the backend
    console.log('Submitting review:', { rating: userRating, content: reviewText, productId });
    setShowReviewForm(false);
    setUserRating(0);
    setReviewText('');
  };

  return (
    <div className="space-y-8">
      {/* Rating Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-card rounded-2xl border border-border">
        {/* Left - Average Rating */}
        <div className="text-center md:text-left space-y-4">
          <div className="flex items-center justify-center md:justify-start gap-4">
            <span className="text-6xl font-bold text-foreground">{averageRating}</span>
            <div className="space-y-1">
              <StarRating rating={Math.round(averageRating)} size="lg" />
              <p className="text-sm text-muted-foreground">{totalReviews} đánh giá</p>
            </div>
          </div>
          <Button 
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="rounded-xl"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Viết đánh giá
          </Button>
        </div>

        {/* Right - Rating Distribution */}
        <div className="space-y-2">
          {ratingDistribution.map((item) => (
            <div key={item.stars} className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground w-12">{item.stars} sao</span>
              <Progress value={item.percentage} className="flex-1 h-2" />
              <span className="text-sm text-muted-foreground w-10 text-right">{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="p-6 bg-card rounded-2xl border border-border space-y-4 animate-fade-in">
          <h3 className="font-semibold text-lg text-foreground">Viết đánh giá của bạn</h3>
          
          {/* Star Selection */}
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Đánh giá của bạn</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setUserRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={cn(
                      'h-8 w-8 transition-colors',
                      (hoverRating || userRating) >= star
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-muted text-muted'
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Review Text */}
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Nội dung đánh giá</label>
            <Textarea
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="min-h-[120px] rounded-xl"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={handleSubmitReview}
              disabled={!userRating || !reviewText.trim()}
              className="rounded-xl"
            >
              Gửi đánh giá
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowReviewForm(false)}
              className="rounded-xl"
            >
              Hủy
            </Button>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          Đánh giá từ khách hàng
        </h3>

        <div className="space-y-4">
          {mockReviews.map((review) => (
            <div
              key={review.id}
              className="p-5 bg-card rounded-2xl border border-border hover:border-primary/30 transition-colors"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{review.author}</span>
                      {review.verified && (
                        <Badge variant="secondary" className="text-xs px-2 py-0">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Đã mua hàng
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{review.date}</p>
                  </div>
                </div>
                <StarRating rating={review.rating} size="sm" />
              </div>

              {/* Content */}
              <p className="text-muted-foreground leading-relaxed mb-4">
                {review.content}
              </p>

              {/* Actions */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleHelpful(review.id)}
                  className={cn(
                    'flex items-center gap-2 text-sm transition-colors',
                    helpfulClicked[review.id]
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <ThumbsUp className={cn('h-4 w-4', helpfulClicked[review.id] && 'fill-current')} />
                  Hữu ích ({review.helpful + (helpfulClicked[review.id] ? 1 : 0)})
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center pt-4">
          <Button variant="outline" className="rounded-xl">
            Xem thêm đánh giá
          </Button>
        </div>
      </div>
    </div>
  );
};

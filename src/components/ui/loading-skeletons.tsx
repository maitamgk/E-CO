import { Skeleton } from '@/components/ui/skeleton';

export const ProductCardSkeleton = () => {
  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <div className="relative aspect-square overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-muted via-muted/50 to-muted animate-shimmer" 
          style={{ backgroundSize: '200% 100%' }} 
        />
      </div>
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/2" />
        <div className="pt-2">
          <Skeleton className="h-6 w-1/3" />
        </div>
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    </div>
  );
};

export const ProductGridSkeleton = ({ count = 8 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};

export const HeroSkeleton = () => {
  return (
    <div className="relative h-[600px] bg-muted animate-pulse">
      <div className="container mx-auto px-4 pt-32">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-16 w-3/4 mb-6" />
        <Skeleton className="h-6 w-1/2 mb-8" />
        <div className="flex gap-4">
          <Skeleton className="h-12 w-32 rounded-lg" />
          <Skeleton className="h-12 w-32 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export const PageSkeleton = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSkeleton />
      <div className="container mx-auto px-4 py-16">
        <ProductGridSkeleton />
      </div>
    </div>
  );
};

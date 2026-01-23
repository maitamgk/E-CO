import { Loader2, Leaf } from 'lucide-react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    text?: string;
    fullScreen?: boolean;
}

const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
};

export const LoadingSpinner = ({
    size = 'md',
    text,
    fullScreen = false,
}: LoadingSpinnerProps) => {
    const content = (
        <div className="flex flex-col items-center justify-center gap-4">
            <div className="relative">
                <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
                <Leaf className={`${sizeClasses[size]} absolute inset-0 text-primary/30 animate-pulse`} />
            </div>
            {text && (
                <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                {content}
            </div>
        );
    }

    return content;
};

// Page loading component for lazy loaded pages
export const PageLoading = () => (
    <LoadingSpinner fullScreen text="Đang tải..." size="lg" />
);

export default LoadingSpinner;

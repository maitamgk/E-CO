import { ReactNode } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';

type AnimationType = 'fade-in' | 'fade-in-up' | 'fade-in-left' | 'fade-in-right' | 'scale-in';

interface ScrollAnimateProps {
  children: ReactNode;
  animation?: AnimationType;
  delay?: number;
  className?: string;
  threshold?: number;
}

export const ScrollAnimate = ({
  children,
  animation = 'fade-in-up',
  delay = 0,
  className,
  threshold = 0.1,
}: ScrollAnimateProps) => {
  const { ref, isVisible } = useScrollAnimation({ threshold });

  const animationClass = {
    'fade-in': 'animate-fade-in',
    'fade-in-up': 'animate-fade-in-up',
    'fade-in-left': 'animate-fade-in-left',
    'fade-in-right': 'animate-fade-in-right',
    'scale-in': 'animate-scale-in',
  }[animation];

  return (
    <div
      ref={ref}
      className={cn(
        'opacity-0',
        isVisible && animationClass,
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

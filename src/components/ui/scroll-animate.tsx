import { ReactNode, useEffect, useState } from 'react';
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
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setReduceMotion(query.matches);
    updatePreference();
    query.addEventListener('change', updatePreference);
    return () => query.removeEventListener('change', updatePreference);
  }, []);

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
        reduceMotion ? 'opacity-100' : 'opacity-0',
        !reduceMotion && isVisible && animationClass,
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

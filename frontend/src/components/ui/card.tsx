import React from 'react';
import { cn } from '../../utils/theme';

interface CardProps {
  className?: string;
  children: React.ReactNode;
  hoverable?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className, children, hoverable = false, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'bg-white rounded-2xl border border-neutral-200 shadow-soft-sm overflow-hidden transition-all duration-300',
        hoverable && 'hover:shadow-soft-md hover:-translate-y-0.5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
Card.displayName = 'Card';

export default Card;
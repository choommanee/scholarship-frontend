import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-md hover:shadow-lg',
        secondary: 'bg-white text-primary-600 border-2 border-primary-300 hover:bg-primary-50 hover:border-primary-400',
        success: 'bg-success-600 text-white hover:bg-success-700 shadow-md hover:shadow-lg',
        warning: 'bg-warning-600 text-white hover:bg-warning-700 shadow-md hover:shadow-lg',
        danger: 'bg-danger-600 text-white hover:bg-danger-700 shadow-md hover:shadow-lg',
        ghost: 'hover:bg-secondary-100 text-secondary-700 hover:text-secondary-900',
        outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white',
        thammasat: 'bg-gradient-to-r from-primary-700 to-primary-800 text-white hover:from-primary-800 hover:to-primary-900 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5',
        gold: 'bg-gradient-to-r from-accent-500 to-accent-600 text-white hover:from-accent-600 hover:to-accent-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        default: 'h-10 px-4 py-2',
        lg: 'h-12 px-8 text-base',
        xl: 'h-14 px-12 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {leftIcon && !loading && <span className="mr-2">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
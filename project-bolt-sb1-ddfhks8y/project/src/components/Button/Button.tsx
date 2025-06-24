/**
 * Accessible button component with child-friendly design
 * Implements proper touch targets and visual feedback
 */

import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large' | 'touch';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  fullWidth = false,
  disabled,
  className = '',
  children,
  ...props
}) => {
  const baseClasses = [
    'inline-flex items-center justify-center',
    'font-medium font-primary',
    'rounded-xl',
    'transition-all duration-200',
    'focus-ring',
    'disabled:opacity-60 disabled:cursor-not-allowed',
    'active:scale-95',
    fullWidth ? 'w-full' : '',
  ].filter(Boolean).join(' ');

  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-medium hover:shadow-large',
    secondary: 'bg-secondary-500 text-white hover:bg-secondary-600 shadow-medium hover:shadow-large',
    tertiary: 'bg-tertiary-500 text-white hover:bg-tertiary-600 shadow-medium hover:shadow-large',
    ghost: 'bg-transparent text-primary-600 hover:bg-primary-50 border-2 border-primary-200 hover:border-primary-300',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-medium hover:shadow-large',
  };

  const sizeClasses = {
    small: 'px-3 py-2 text-sm min-h-[36px]',
    medium: 'px-4 py-3 text-base min-h-[44px]',
    large: 'px-6 py-4 text-lg min-h-[52px]',
    touch: 'px-6 py-4 text-lg min-h-[56px] min-w-[56px]', // Extra large for children
  };

  const combinedClasses = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className,
  ].join(' ');

  return (
    <button
      className={combinedClasses}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="mr-2 animate-spin">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
        </div>
      )}
      
      {Icon && iconPosition === 'left' && !loading && (
        <Icon className={`h-5 w-5 ${children ? 'mr-2' : ''}`} />
      )}
      
      {children}
      
      {Icon && iconPosition === 'right' && !loading && (
        <Icon className={`h-5 w-5 ${children ? 'ml-2' : ''}`} />
      )}
    </button>
  );
};

export default Button;
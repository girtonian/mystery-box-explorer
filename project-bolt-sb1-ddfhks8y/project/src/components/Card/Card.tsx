/**
 * Card component for content organization
 * Provides consistent spacing and visual hierarchy
 */

import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'interactive';
  padding?: 'none' | 'small' | 'medium' | 'large';
  className?: string;
  onClick?: () => void;
  role?: string;
  'aria-label'?: string;
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'medium',
  className = '',
  onClick,
  role,
  'aria-label': ariaLabel,
  ...props
}) => {
  const baseClasses = [
    'bg-white',
    'rounded-2xl',
    'transition-all duration-200',
    onClick ? 'cursor-pointer hover:scale-[1.02] focus-ring' : '',
  ].filter(Boolean).join(' ');

  const variantClasses = {
    default: 'shadow-soft',
    elevated: 'shadow-large',
    outlined: 'border-2 border-gray-200 hover:border-primary-300',
    interactive: 'shadow-soft hover:shadow-medium active:shadow-soft',
  };

  const paddingClasses = {
    none: '',
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8',
  };

  const combinedClasses = [
    baseClasses,
    variantClasses[variant],
    paddingClasses[padding],
    className,
  ].join(' ');

  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      className={combinedClasses}
      onClick={onClick}
      role={role}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Card;
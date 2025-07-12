import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  loading = false,
  fullWidth = false,
  className,
  disabled,
  ...props
}) => {
  const baseClasses = 'btn';
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    destructive: 'btn-destructive',
    outline: 'btn-outline',
    ghost: 'btn-ghost',
    link: 'btn-link',
  };
  const sizeClasses = {
    sm: 'btn-sm',
    md: 'h-10 px-4 py-2',
    lg: 'btn-lg',
  };

  return (
    <button
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], fullWidth && 'w-full', className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      )}
      {!loading && Icon && <Icon className="w-4 h-4 mr-2" />}
      {children}
    </button>
  );
};

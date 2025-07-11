import React from 'react';
import { cn } from '@/utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth = false,
  className,
  ...props
}) => {
  return (
    <div className={cn('flex flex-col space-y-1', fullWidth && 'w-full')}>
      {label && (
        <label className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <input
        className={cn(
          'input',
          error && 'border-destructive',
          fullWidth && 'w-full',
          className
        )}
        {...props}
      />
      {error && (
        <span className="text-sm text-destructive">
          {error}
        </span>
      )}
    </div>
  );
};
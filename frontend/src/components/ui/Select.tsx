import type { SelectHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean;
}

export function Select({ hasError, className, children, ...rest }: SelectProps) {
  return (
    <select
      aria-invalid={hasError || undefined}
      className={cn(
        'w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900',
        'transition-colors focus:outline-none focus:ring-2',
        hasError
          ? 'border-red-500 bg-red-50/60 focus:border-red-500 focus:ring-red-500/20'
          : 'border-slate-300 focus:border-slate-400 focus:ring-slate-900/10',
        className
      )}
      {...rest}
    >
      {children}
    </select>
  );
}

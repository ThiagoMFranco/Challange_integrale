import type { TextareaHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

export function Textarea({ hasError, className, ...rest }: TextareaProps) {
  return (
    <textarea
      aria-invalid={hasError || undefined}
      className={cn(
        'w-full rounded-lg border px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400',
        'transition-colors focus:outline-none focus:ring-2',
        hasError
          ? 'border-red-500 bg-red-50/60 focus:border-red-500 focus:ring-red-500/20'
          : 'border-slate-300 focus:border-slate-400 focus:ring-slate-900/10',
        className
      )}
      {...rest}
    />
  );
}

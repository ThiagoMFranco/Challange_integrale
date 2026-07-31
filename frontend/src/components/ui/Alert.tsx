import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface AlertProps {
  variant: 'success' | 'error';
  children: ReactNode;
  onDismiss?: () => void;
}

const VARIANT_CLASSES: Record<AlertProps['variant'], string> = {
  success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  error: 'bg-red-50 text-red-800 border-red-200',
};

export function Alert({ variant, children, onDismiss }: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex items-start justify-between gap-3 rounded-lg border px-4 py-3 text-sm',
        VARIANT_CLASSES[variant]
      )}
    >
      <span>{children}</span>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Fechar aviso"
          className="shrink-0 text-current opacity-70 hover:opacity-100"
        >
          ✕
        </button>
      )}
    </div>
  );
}

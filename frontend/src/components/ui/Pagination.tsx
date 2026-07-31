import { Button } from './Button';

interface PaginationProps {
  page: number;
  hasMore: boolean;
  total: number;
  onPageChange: (page: number) => void;
}


export function Pagination({ page, hasMore, total, onPageChange }: PaginationProps) {
  if (total === 0) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-4 sm:flex-row">
      <p className="text-sm text-slate-500">
        Página {page} · {total} {total === 1 ? 'lead' : 'leads'} no total
      </p>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="secondary"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          Anterior
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => onPageChange(page + 1)}
          disabled={!hasMore}
        >
          Próxima
        </Button>
      </div>
    </div>
  );
}

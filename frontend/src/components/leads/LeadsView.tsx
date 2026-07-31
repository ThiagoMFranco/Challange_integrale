import { Spinner } from '../ui/Spinner';
import { Alert } from '../ui/Alert';
import { EmptyState } from '../ui/EmptyState';
import { LeadsTable } from './LeadsTable';
import { LeadCard } from './LeadCard';
import type { Lead } from '../../types/lead.types';

interface LeadsViewProps {
  leads: Lead[];
  isLoading: boolean;
  error: string | null;
}

export function LeadsView({ leads, isLoading, error }: LeadsViewProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-12 text-slate-500">
        <Spinner className="h-5 w-5" />
        <span className="text-sm">Carregando leads...</span>
      </div>
    );
  }

  if (error) {
    return <Alert variant="error">{error}</Alert>;
  }

  if (leads.length === 0) {
    return (
      <EmptyState
        title="Nenhum lead encontrado"
        description="Ajuste os filtros ou cadastre um novo lead para vê-lo aqui."
      />
    );
  }

  return (
    <>
      <LeadsTable leads={leads} className="hidden lg:block" />
      <ul className="flex flex-col gap-3 lg:hidden">
        {leads.map((lead) => (
          <LeadCard key={lead.id} lead={lead} />
        ))}
      </ul>
    </>
  );
}

import { PageHeader } from '../components/layout/PageHeader';
import { LeadFilters } from '../components/leads/LeadFilters';
import { LeadsView } from '../components/leads/LeadsView';
import { Pagination } from '../components/ui/Pagination';
import { useLeadFilters } from '../hooks/useLeadFilters';
import { useLeads } from '../hooks/useLeads';

export default function ListagemPage() {
  const {
    searchNameInput,
    searchOrigin,
    filters,
    setSearchNameInput,
    setSearchOrigin,
    setPage,
    resetFilters,
  } = useLeadFilters();

  const { leads, total, hasMore, isLoading, error } = useLeads(filters);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <PageHeader
        title="Leads cadastrados"
        description="Consulte e filtre os leads cadastrados."
      />

      <LeadFilters
        searchName={searchNameInput}
        searchOrigin={searchOrigin}
        onSearchNameChange={setSearchNameInput}
        onSearchOriginChange={setSearchOrigin}
        onClear={resetFilters}
      />

      <LeadsView leads={leads} isLoading={isLoading} error={error} />

      <Pagination page={filters.page} hasMore={hasMore} total={total} onPageChange={setPage} />
    </div>
  );
}

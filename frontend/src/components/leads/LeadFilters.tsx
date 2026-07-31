import { LEAD_ORIGIN_LABELS, LEAD_ORIGIN_VALUES, type LeadOrigin } from '@integrale/shared';
import { FormField } from '../ui/FormField';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';

interface LeadFiltersProps {
  searchName: string;
  searchOrigin: LeadOrigin | '';
  onSearchNameChange: (value: string) => void;
  onSearchOriginChange: (value: LeadOrigin | '') => void;
  onClear: () => void;
}

/**
 * Filter bar for the leads listing. Wired to the same `searchName` /
 * `searchOrigin` query params GET /leads already accepts, so filtering
 * here is fully functional today -- not just a placeholder for a future
 * backend capability.
 */
export function LeadFilters({
  searchName,
  searchOrigin,
  onSearchNameChange,
  onSearchOriginChange,
  onClear,
}: LeadFiltersProps) {
  const hasActiveFilters = Boolean(searchName || searchOrigin);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
        <FormField label="Buscar por nome" htmlFor="filter-name">
          <Input
            id="filter-name"
            value={searchName}
            onChange={(e) => onSearchNameChange(e.target.value)}
            placeholder="Digite o nome do lead"
          />
        </FormField>

        <FormField label="Origem" htmlFor="filter-origin">
          <Select
            id="filter-origin"
            value={searchOrigin}
            onChange={(e) => onSearchOriginChange(e.target.value as LeadOrigin | '')}
          >
            <option value="">Todas as origens</option>
            {LEAD_ORIGIN_VALUES.map((origin) => (
              <option key={origin} value={origin}>
                {LEAD_ORIGIN_LABELS[origin]}
              </option>
            ))}
          </Select>
        </FormField>

        <Button
          type="button"
          variant="secondary"
          onClick={onClear}
          disabled={!hasActiveFilters}
          className="w-full lg:w-auto"
        >
          Limpar filtros
        </Button>
      </div>
    </section>
  );
}

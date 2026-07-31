import { LEAD_ORIGIN_LABELS } from '@integrale/shared';
import { formatDate } from '../../utils/formatDate';
import type { Lead } from '../../types/lead.types';

interface LeadCardProps {
  lead: Lead;
}

/** Mobile/tablet-portrait representation of a Lead, showing every field the API returns. */
export function LeadCard({ lead }: LeadCardProps) {
  return (
    <li className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-medium text-slate-900">{lead.name}</p>
          <p className="text-sm text-slate-500">{lead.email}</p>
        </div>
        <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
          {LEAD_ORIGIN_LABELS[lead.origin]}
        </span>
      </div>

      <dl className="mt-3 grid grid-cols-1 gap-x-4 gap-y-1.5 text-sm text-slate-600 sm:grid-cols-2">
        <div className="flex gap-1">
          <dt className="shrink-0 text-slate-400">Telefone:</dt>
          <dd className="break-words">{lead.phone}</dd>
        </div>
        <div className="flex gap-1">
          <dt className="shrink-0 text-slate-400">Empresa:</dt>
          <dd className="break-words">{lead.company || '—'}</dd>
        </div>
      </dl>

      <div className="mt-2.5 flex gap-1 text-sm text-slate-600">
        <dt className="shrink-0 text-slate-400">Observações:</dt>
        <dd className="break-words">{lead.notes || '—'}</dd>
      </div>

      <p className="mt-3 text-xs text-slate-400">Cadastrado em {formatDate(lead.created_at)}</p>
    </li>
  );
}

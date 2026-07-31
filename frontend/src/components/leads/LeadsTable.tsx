import { LEAD_ORIGIN_LABELS } from '@integrale/shared';
import { formatDate } from '../../utils/formatDate';
import { cn } from '../../utils/cn';
import type { Lead } from '../../types/lead.types';

interface LeadsTableProps {
  leads: Lead[];
  className?: string;
}

const HEADERS = [
  'Nome',
  'E-mail',
  'Telefone',
  'Empresa',
  'Origem',
  'Observações',
  'Cadastrado em',
];

export function LeadsTable({ leads, className }: LeadsTableProps) {
  return (
    <div
      className={cn(
        'overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm',
        className
      )}
    >
      <table className="w-full table-fixed border-collapse text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            {HEADERS.map((header) => (
              <th key={header} scope="col" className="px-4 py-3 font-medium">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {leads.map((lead) => (
            <tr key={lead.id} className="align-top">
              <td className="break-words px-4 py-3 font-medium text-slate-900">{lead.name}</td>
              <td className="break-words px-4 py-3 text-slate-600">{lead.email}</td>
              <td className="break-words px-4 py-3 text-slate-600">{lead.phone}</td>
              <td className="break-words px-4 py-3 text-slate-600">{lead.company || '—'}</td>
              <td className="px-4 py-3">
                <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                  {LEAD_ORIGIN_LABELS[lead.origin]}
                </span>
              </td>
              <td className="break-words px-4 py-3 text-slate-600">{lead.notes || '—'}</td>
              <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                {formatDate(lead.created_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

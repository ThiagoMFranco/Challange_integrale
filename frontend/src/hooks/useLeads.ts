import { useEffect, useState } from "react";
import { getLeads, type GetLeadsParams } from "../services/leads.service";
import { ApiError } from "../services/api";
import type { Lead } from "../types/lead.types";

interface UseLeadsResult {
  leads: Lead[];
  total: number;
  hasMore: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useLeads(params: GetLeadsParams): UseLeadsResult {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getLeads(params);
        if (!cancelled) {
          setLeads(result.data);
          setTotal(result.total);
          setHasMore(result.hasMore);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiError
              ? err.message
              : "Não foi possível carregar os leads.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.searchName, params.searchOrigin, params.page, params.limit]);

  return { leads, total, hasMore, isLoading, error };
}

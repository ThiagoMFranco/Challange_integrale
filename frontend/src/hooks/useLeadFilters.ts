import { useCallback, useEffect, useState } from "react";
import type { LeadOrigin } from "@integrale/shared";
import type { GetLeadsParams } from "../services/leads.service";

const SEARCH_DEBOUNCE_MS = 400;
export const LEADS_PAGE_SIZE = 10;

interface UseLeadFiltersResult {
  searchNameInput: string;
  searchOrigin: LeadOrigin | "";
  filters: GetLeadsParams & { page: number; limit: number };
  setSearchNameInput: (value: string) => void;
  setSearchOrigin: (value: LeadOrigin | "") => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
}

export function useLeadFilters(): UseLeadFiltersResult {
  const [searchNameInput, setSearchNameInput] = useState("");
  const [debouncedSearchName, setDebouncedSearchName] = useState("");
  const [searchOrigin, setSearchOrigin] = useState<LeadOrigin | "">("");
  const [page, setPageState] = useState(1);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearchName(searchNameInput.trim());
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timeout);
  }, [searchNameInput]);

  useEffect(() => {
    setPageState(1);
  }, [debouncedSearchName, searchOrigin]);

  const setPage = useCallback((next: number) => {
    setPageState((current) => Math.max(1, next === current ? current : next));
  }, []);

  const resetFilters = useCallback(() => {
    setSearchNameInput("");
    setDebouncedSearchName("");
    setSearchOrigin("");
    setPageState(1);
  }, []);

  return {
    searchNameInput,
    searchOrigin,
    filters: {
      searchName: debouncedSearchName || undefined,
      searchOrigin: searchOrigin || undefined,
      page,
      limit: LEADS_PAGE_SIZE,
    },
    setSearchNameInput,
    setSearchOrigin,
    setPage,
    resetFilters,
  };
}

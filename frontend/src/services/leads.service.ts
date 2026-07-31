import { apiRequest } from "./api";
import type { Lead, PaginatedResponse } from "../types/lead.types";
import type { LeadFormValues } from "../validators/lead.validator";

export interface GetLeadsParams {
  searchName?: string;
  searchOrigin?: string;
  page?: number;
  limit?: number;
}

export function getLeads(
  params: GetLeadsParams = {},
): Promise<PaginatedResponse<Lead>> {
  const query = new URLSearchParams();

  if (params.searchName) query.set("searchName", params.searchName);
  if (params.searchOrigin) query.set("searchOrigin", params.searchOrigin);
  query.set("page", String(params.page ?? 1));
  query.set("limit", String(params.limit ?? 50));

  return apiRequest<PaginatedResponse<Lead>>(`/leads?${query.toString()}`);
}

export function createLead(input: LeadFormValues): Promise<Lead> {
  return apiRequest<Lead>("/leads", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

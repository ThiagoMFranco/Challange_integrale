import { z } from "zod";

export const listLeadsFiltersSchema = z.object({
  searchName: z.string().max(255).optional(),
  searchOrigin: z.string().max(100).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type ListLeadsFilters = z.infer<typeof listLeadsFiltersSchema>;

import { supabase } from "../config/supabase.js";
import { CustomError } from "../utils/error-handler.js";
import { Lead, PaginatedResponse } from "../types/leads.types.js";
import { ListLeadsFilters } from "../validators/getLeads.validator.js";

const TABLE_NAME = "leads";

export const getLeads = async (
  filters: ListLeadsFilters,
): Promise<PaginatedResponse<Lead>> => {
  try {
    const { page = 1, limit = 20, searchName, searchOrigin } = filters;
    const offset = (page - 1) * limit;

    let query = supabase.from(TABLE_NAME).select("*", { count: "exact" });

    if (searchName) {
      query = query.ilike("name", `%${searchName}%`);
    }

    if (searchOrigin) {
      query = query.ilike("origin", `%${searchOrigin}%`);
    }

    // Apply ordering and pagination
    query = query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error("Supabase error:", error);
      throw new CustomError("Failed to fetch leads", 500, error.message);
    }

    const total = count || 0;
    const hasMore = offset + limit < total;

    return {
      data: (data || []) as Lead[],
      total,
      page,
      limit,
      hasMore,
    };
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError(
      "An error occurred while fetching leads",
      500,
      error instanceof Error ? error.message : String(error),
    );
  }
};

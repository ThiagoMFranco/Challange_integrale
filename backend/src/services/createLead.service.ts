import { randomUUID } from "node:crypto";
import { supabase } from "../config/supabase.js";
import { CustomError } from "../utils/error-handler.js";
import { Lead } from "../types/leads.types.js";
import { CreateLeadInput } from "../validators/createLead.validator.js";

const TABLE_NAME = "leads";

export const createLead = async (input: CreateLeadInput): Promise<Lead> => {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert([
        {
          id: randomUUID(),
          name: input.name,
          email: input.email,
          phone: input.phone,
          company: input.company || null,
          origin: input.origin,
          notes: input.notes || null,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      throw new CustomError("Failed to create lead", 500, error.message);
    }

    if (!data) {
      throw new CustomError("No data returned from database", 500);
    }

    return data as Lead;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError(
      "An error occurred while creating the lead",
      500,
      error instanceof Error ? error.message : String(error),
    );
  }
};

import { z } from "zod";
import { LEAD_ORIGIN_VALUES } from "@integrale/shared";

// Letters (incl. accented), spaces, apostrophes and hyphens -- covers
// real names ("D'Angelo", "Jean-Paul") without allowing pure symbol input.
const NAME_PATTERN = /^[\p{L}\p{M}\s'-]+$/u;

// Digits plus the formatting characters real phone numbers use
// (+55 (11) 91234-5678). The digit-count refine below is what actually
// guards against junk like "!#!@#".
const PHONE_PATTERN = /^[\d\s()+-]+$/;

export const createLeadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(255, "Name too long")
    .regex(
      NAME_PATTERN,
      "Name can only contain letters, spaces, apostrophes and hyphens",
    )
    .refine(
      (value) => /\p{L}/u.test(value),
      "Name must contain at least one letter",
    ),
  email: z.string().email("Invalid email format"),
  phone: z
    .string()
    .trim()
    .min(1, "Phone is required")
    .max(20, "Phone too long")
    .regex(
      PHONE_PATTERN,
      "Phone can only contain digits, spaces, parentheses, + and -",
    )
    .refine(
      (value) => (value.match(/\d/g) ?? []).length >= 8,
      "Phone must contain at least 8 digits",
    ),
  company: z.string().max(255, "Company name too long").optional().nullable(),
  origin: z.enum(LEAD_ORIGIN_VALUES, {
    errorMap: () => ({
      message: `Origin must be one of: ${LEAD_ORIGIN_VALUES.join(", ")}`,
    }),
  }),
  notes: z.string().max(1000, "Notes too long").optional().nullable(),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;

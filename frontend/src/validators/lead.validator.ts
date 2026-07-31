/**
 * Lead form validation schema.
 *
 * Mirrors the backend's createLeadSchema (backend/src/validators/createLead.validator.ts)
 * field-by-field so the user sees the same validation client-side before
 * the request ever reaches the API. Only the origin enum values are
 * actually shared code (@integrale/shared) -- duplicating the schema
 * itself is expected: the frontend needs it to run synchronously in the
 * browser for form UX, independent of the backend's Node-only code.
 */
import { z } from 'zod';
import { LEAD_ORIGIN_VALUES, type LeadOrigin } from '@integrale/shared';

// Letters (incl. accented), spaces, apostrophes and hyphens -- covers
// real names ("D'Angelo", "Jean-Paul") without allowing pure symbol input.
const NAME_PATTERN = /^[\p{L}\p{M}\s'-]+$/u;

// Digits plus the formatting characters real phone numbers use
// (+55 (11) 91234-5678). The digit-count refine below is what actually
// guards against junk like "!#!@#".
const PHONE_PATTERN = /^[\d\s()+-]+$/;

export const leadFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Informe o nome')
    .max(255, 'Nome muito longo')
    .regex(NAME_PATTERN, 'Nome deve conter apenas letras, espaços, apóstrofos e hífens')
    .refine((value) => /\p{L}/u.test(value), 'Informe um nome válido'),
  email: z.string().min(1, 'Informe o e-mail').email('E-mail inválido'),
  phone: z
    .string()
    .trim()
    .min(1, 'Informe o telefone')
    .max(20, 'Telefone muito longo')
    .regex(PHONE_PATTERN, 'Telefone deve conter apenas números e ( ) + -')
    .refine(
      (value) => (value.match(/\d/g) ?? []).length >= 8,
      'Telefone deve ter pelo menos 8 dígitos'
    ),
  company: z.string().max(255, 'Nome da empresa muito longo').optional(),
  origin: z.enum(LEAD_ORIGIN_VALUES, {
    errorMap: () => ({ message: 'Selecione a origem do lead' }),
  }),
  notes: z.string().max(1000, 'Observações muito longas').optional(),
});

export type LeadFormValues = z.infer<typeof leadFormSchema>;

/**
 * Shape of the controlled form state while the user is still typing.
 * `origin` starts empty (no option selected) even though the validated
 * LeadFormValues type requires one of LEAD_ORIGIN_VALUES -- the empty
 * string only ever exists in the browser and gets rejected by
 * leadFormSchema.safeParse before a submit is allowed through.
 */
export type LeadFormState = Omit<LeadFormValues, 'origin'> & { origin: LeadOrigin | '' };

export const emptyLeadFormState: LeadFormState = {
  name: '',
  email: '',
  phone: '',
  company: '',
  origin: '',
  notes: '',
};

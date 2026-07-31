/**
 * Canonical list of allowed lead origins.
 *
 * Shared between the backend (Zod validation + Lead typing) and the
 * frontend (populates the origin <Select>), so the allowed values only
 * ever need to change in one place.
 */
export const LEAD_ORIGIN_VALUES = [
  'website',
  'referral',
  'event',
  'social_media',
  'other',
] as const;

export type LeadOrigin = (typeof LEAD_ORIGIN_VALUES)[number];

/** Human-readable label for each origin, e.g. for rendering the <Select>. */
export const LEAD_ORIGIN_LABELS: Record<LeadOrigin, string> = {
  website: 'Site',
  referral: 'Indicação',
  event: 'Evento',
  social_media: 'Redes Sociais',
  other: 'Outro',
};

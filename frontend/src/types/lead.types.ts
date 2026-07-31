/**
 * Re-exports the shared API contract types so the rest of the frontend
 * imports from a local, app-owned path instead of reaching into
 * @integrale/shared everywhere.
 */
export type { Lead, ApiResponse, PaginatedResponse } from '@integrale/shared';

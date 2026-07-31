/**
 * Shape of a Lead record as returned by the API, plus the generic
 * response envelopes the backend wraps every response in. Shared
 * between backend (source of truth for what Supabase returns) and
 * frontend (typing API responses), so both sides describe the same
 * contract instead of each keeping their own copy.
 */
import type { LeadOrigin } from '../enums/lead-origin.enum.js';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string | null;
  origin: LeadOrigin;
  notes?: string | null;
  created_at: string;
  updated_at?: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

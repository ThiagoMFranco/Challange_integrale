/**
 * Supabase Client Configuration
 * Initializes and exports the Supabase client
 *
 * Uses the service_role key: this client only ever runs on the server
 * (never shipped to a browser), so it is safe and appropriate to bypass
 * RLS here. Request-level validation is handled by Zod in the
 * validators layer instead of by Postgres policies.
 */

import { createClient } from '@supabase/supabase-js';
import env from './env.js';

export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export default supabase;

import "server-only";
import { createClient } from "@supabase/supabase-js";

// Client con privilegi service-role: bypassa la RLS. USARE SOLO lato server
// per operazioni amministrative (es. cleanup oggetti nel bucket Storage).
// Richiede SUPABASE_SERVICE_ROLE_KEY (non esporre mai al client).
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

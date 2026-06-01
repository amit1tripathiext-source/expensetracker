import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  // The app still loads enough to show a clear auth error during local setup.
  console.warn("Missing Supabase environment variables. Copy .env.example to .env.local.");
}

export const supabase = createClient(supabaseUrl ?? "", supabaseAnonKey ?? "", {
  db: {
    schema: "exptrack"
  },
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

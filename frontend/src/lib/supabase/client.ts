import { Database } from "@/types/supabase";
import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseApiKey = process.env.NEXT_PUBLIC_SUPABASE_API_KEY || "";

export const supabaseClient = createBrowserClient<Database>(
  supabaseUrl,
  supabaseApiKey,
);

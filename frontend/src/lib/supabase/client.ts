import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseApiKey = process.env.SUPABASE_API_KEY || "";

export const supabaseClient = () => {
  return createBrowserClient(supabaseUrl, supabaseApiKey);
};

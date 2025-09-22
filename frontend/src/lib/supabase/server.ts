import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseApiKey = process.env.SUPABASE_API_KEY || "";

export const supabaseServerClient = async () => {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseApiKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Happens in Server Components where `cookies().set` is not allowed.
          // Safe to ignore if you refresh sessions in middleware.
        }
      },
    },
  });
};

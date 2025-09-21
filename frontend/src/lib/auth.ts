import { AuthTokenResponse } from "@supabase/supabase-js";
import { supabaseServerClient } from "./supabase/server";

type LoginResult =
  | { success: true; data: AuthTokenResponse["data"] }
  | { success: false; error: string };

export async function loginWithEmailPassword(
  email: string,
  password: string,
): Promise<LoginResult> {
  try {
    const supabase = await supabaseServerClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Unexpected login error:", err);
    return {
      success: false,
      error: "Unexpected error, please try again later.",
    };
  }
}

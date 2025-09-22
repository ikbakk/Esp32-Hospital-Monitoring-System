"use server";

import { supabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await supabaseServerClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  // ✅ session cookies are automatically set here
  redirect("/"); // or return { success: true }
}

export async function logoutAction() {
  const supabase = await supabaseServerClient();
  await supabase.auth.signOut({ scope: "local" });
  redirect("/login");
}

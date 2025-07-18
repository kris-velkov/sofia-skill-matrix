import { Database } from "@/types/supabase";
import { createClient } from "@supabase/supabase-js";

export const supabaseAuthClient = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function getSession() {
  const {
    data: { session },
    error,
  } = await supabaseAuthClient.auth.getSession();
  if (error) {
    console.error("Error getting session:", error);
    return null;
  }
  return session;
}

export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabaseAuthClient.auth.getUser();
  if (error) {
    console.error("Error getting user:", error);
    return null;
  }
  return user;
}

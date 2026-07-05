"use server";

import { redirect } from "next/navigation";
import { createAuthClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { User } from "@supabase/supabase-js";

async function getUser(): Promise<User | null> {
  const supabase = await createAuthClient();

  const { data: { user } } = await supabase.auth.getUser();

  return user;
}

export async function requireAdmin(): Promise<User> {
  const user = await getUser();
  if (!user) redirect("/");

  const supabase = createAdminClient();

  const { data: adminRow } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .single();

  if (!adminRow) redirect("/");

  return user;
}

export async function signIn(
  email: string,
  password: string
): Promise<{ error: string } | void> {
  const authSupabase = await createAuthClient();

  const { data, error } = await authSupabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };

  const adminSupabase = createAdminClient();

  const { data: adminRow } = await adminSupabase
    .from("admins")
    .select("user_id")
    .eq("user_id", data.user.id)
    .single();

  if (!adminRow) {
    await authSupabase.auth.signOut();
    return { error: "You are not authorized to access the admin dashboard." };
  }

  const { data: brand } = await adminSupabase.from("brands").select("slug").limit(1).single();
  redirect(`/admin/${brand!.slug}`);
}

export async function signOut() {
  const supabase = await createAuthClient();

  await supabase.auth.signOut();
}

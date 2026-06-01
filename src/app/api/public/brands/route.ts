import { createAdminClient } from "@/lib/supabase/admin";
import { ok, err } from "@/lib/api";

export async function POST() {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("brands")
    .select("id, name, slug")
    .order("name");

  if (error) return err("Failed to fetch brands");

  return ok(data);
}

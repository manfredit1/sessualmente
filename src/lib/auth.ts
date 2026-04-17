import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { CurrentUser, Role } from "./user";

export type { CurrentUser, Role } from "./user";
export { displayName, initialsOf } from "./user";

async function loadProfile(userId: string, email: string): Promise<CurrentUser> {
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "id, role, first_name, last_name, phone, city, birth_year, created_at"
    )
    .eq("id", userId)
    .maybeSingle();

  let effectiveRole: Role = (profile?.role as Role) ?? "patient";
  if (effectiveRole === "patient") {
    const { data: therapist } = await supabase
      .from("therapists")
      .select("id")
      .eq("auth_user_id", userId)
      .maybeSingle();
    if (therapist) effectiveRole = "pro";
  }

  return {
    id: userId,
    email,
    role: effectiveRole,
    firstName: (profile?.first_name as string | null) ?? null,
    lastName: (profile?.last_name as string | null) ?? null,
    phone: (profile?.phone as string | null) ?? null,
    city: (profile?.city as string | null) ?? null,
    birthYear: (profile?.birth_year as number | null) ?? null,
    createdAt:
      (profile?.created_at as string | null) ?? new Date().toISOString(),
  };
}

export async function requireUser(requireRole?: Role): Promise<CurrentUser> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/accedi");

  const profile = await loadProfile(user.id, user.email ?? "");

  if (requireRole && profile.role !== requireRole) {
    if (profile.role === "admin") redirect("/admin");
    else if (profile.role === "pro") redirect("/pro/dashboard");
    else redirect("/app/dashboard");
  }
  return profile;
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  return loadProfile(user.id, user.email ?? "");
}

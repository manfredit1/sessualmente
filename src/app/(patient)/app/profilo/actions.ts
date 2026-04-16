"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";

export type UpdateProfileState = {
  success?: boolean;
  error?: string;
} | null;

export async function updateProfile(
  _prev: UpdateProfileState,
  formData: FormData
): Promise<UpdateProfileState> {
  const user = await requireUser("patient");
  const supabase = await createClient();

  const firstName = String(formData.get("firstName") ?? "").trim() || null;
  const lastName = String(formData.get("lastName") ?? "").trim() || null;
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const city = String(formData.get("city") ?? "").trim() || null;
  const birthYearRaw = String(formData.get("birthYear") ?? "").trim();
  const birthYear = birthYearRaw ? parseInt(birthYearRaw, 10) : null;

  if (birthYear !== null && (isNaN(birthYear) || birthYear < 1900 || birthYear > new Date().getFullYear() - 18)) {
    return { error: "Anno di nascita non valido (devi avere almeno 18 anni)." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      first_name: firstName,
      last_name: lastName,
      phone,
      city,
      birth_year: birthYear,
    })
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/app/profilo");
  revalidatePath("/app", "layout");
  return { success: true };
}

export async function deleteAccount(): Promise<{ error?: string }> {
  const user = await requireUser("patient");
  const supabase = await createClient();
  // RLS: l'utente può cancellare il proprio profile (cascade elimina tutto).
  // NOTA: auth.users resta, solo il profile è cancellato.
  // Per cancellare anche auth.users serve service_role → endpoint admin.
  // TODO: implementare via service_role quando pronti.
  const { error } = await supabase.from("profiles").delete().eq("id", user.id);
  if (error) return { error: error.message };
  await supabase.auth.signOut();
  return {};
}

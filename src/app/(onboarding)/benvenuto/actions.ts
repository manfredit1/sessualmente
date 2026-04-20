"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export type WelcomeState = {
  error?: string;
} | null;

export async function completeWelcome(
  _prev: WelcomeState,
  formData: FormData
): Promise<WelcomeState> {
  const user = await requireUser("patient");
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const city = String(formData.get("city") ?? "").trim() || null;
  const birthYearRaw = String(formData.get("birthYear") ?? "").trim();
  const birthYear = birthYearRaw ? parseInt(birthYearRaw, 10) : null;

  if (!firstName || !lastName) {
    return { error: "Nome e cognome sono obbligatori." };
  }
  if (
    birthYear !== null &&
    (!Number.isFinite(birthYear) ||
      birthYear < 1900 ||
      birthYear > new Date().getFullYear() - 18)
  ) {
    return { error: "Anno di nascita non valido (minimo 18 anni)." };
  }

  // Admin client per evitare casi limite RLS/sessione su server action.
  // UPSERT: se il trigger handle_new_user non e' scattato (edge case), il
  // profilo viene creato qui direttamente. L'identita' e' gia' verificata
  // da requireUser('patient') sopra.
  const admin = createAdminClient();
  const { error } = await admin
    .from("profiles")
    .upsert(
      {
        id: user.id,
        role: "patient",
        first_name: firstName,
        last_name: lastName,
        phone,
        city,
        birth_year: birthYear,
      },
      { onConflict: "id" }
    );

  if (error) return { error: error.message };

  revalidatePath("/app", "layout");
  redirect("/app/dashboard");
}

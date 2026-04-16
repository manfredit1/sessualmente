"use server";

import { createClient } from "@/lib/supabase/server";

export type SubmitApplicationState = {
  success?: boolean;
  error?: string;
} | null;

export async function submitApplication(
  _prev: SubmitApplicationState,
  formData: FormData
): Promise<SubmitApplicationState> {
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const qualification = String(formData.get("qualification") ?? "").trim();
  const albo = String(formData.get("albo") ?? "").trim();
  const yearsRaw = String(formData.get("years") ?? "").trim();
  const approach = String(formData.get("approach") ?? "").trim();
  const motivation = String(formData.get("motivation") ?? "").trim() || null;

  if (!firstName || !lastName || !email || !qualification || !albo || !approach) {
    return { error: "Compila tutti i campi obbligatori." };
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return { error: "Email non valida." };
  }
  const years = parseInt(yearsRaw, 10);
  if (!Number.isFinite(years) || years < 0) {
    return { error: "Anni di pratica non validi." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("pro_applications").insert({
    first_name: firstName,
    last_name: lastName,
    email,
    phone,
    qualification,
    albo,
    years_of_practice: years,
    approach,
    motivation,
  });

  if (error) return { error: `Errore invio: ${error.message}` };
  return { success: true };
}

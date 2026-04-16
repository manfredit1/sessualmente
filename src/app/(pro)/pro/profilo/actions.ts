"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";

export type UpdateProState = {
  success?: boolean;
  error?: string;
} | null;

export async function updateProProfile(
  _prev: UpdateProState,
  formData: FormData
): Promise<UpdateProState> {
  const user = await requireUser("pro");
  const supabase = await createClient();

  const bio = String(formData.get("bio") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim() || null;
  const approach = String(formData.get("approach") ?? "").trim() || null;
  const calCom = String(formData.get("calComUsername") ?? "").trim() || null;
  const codiceFiscale = String(formData.get("codiceFiscale") ?? "").trim() || null;
  const partitaIva = String(formData.get("partitaIva") ?? "").trim() || null;
  const iban = String(formData.get("iban") ?? "").trim() || null;

  if (bio.length < 50 || bio.length > 1200) {
    return { error: "La bio deve essere tra 50 e 1200 caratteri." };
  }

  const update: Record<string, unknown> = {
    bio,
    cal_com_username: calCom,
    codice_fiscale: codiceFiscale,
    partita_iva: partitaIva,
    iban,
  };
  if (role) update.role = role;
  if (approach) update.approach = approach;

  const { error } = await supabase
    .from("therapists")
    .update(update)
    .eq("auth_user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/pro/profilo");
  revalidatePath("/pro", "layout");
  return { success: true };
}

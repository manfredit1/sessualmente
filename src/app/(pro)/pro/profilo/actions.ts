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

  // Testo base
  const bio = String(formData.get("bio") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim() || null;
  const approach = String(formData.get("approach") ?? "").trim() || null;
  const orientation =
    String(formData.get("orientation") ?? "").trim() || null;
  const selfDescription =
    String(formData.get("selfDescription") ?? "").trim() || null;

  // Meta
  const region = String(formData.get("region") ?? "").trim() || null;
  const ageRaw = String(formData.get("age") ?? "").trim();
  const age = ageRaw ? parseInt(ageRaw, 10) : null;

  // Cal.com & fatturazione
  const calCom = String(formData.get("calComUsername") ?? "").trim() || null;
  const codiceFiscale =
    String(formData.get("codiceFiscale") ?? "").trim() || null;
  const partitaIva =
    String(formData.get("partitaIva") ?? "").trim() || null;
  const iban = String(formData.get("iban") ?? "").trim() || null;

  // Style profile (4 slider 0-100)
  const styleProfile = {
    formale_informale: parseSliderValue(formData.get("style_fi")),
    riflessivo_razionale: parseSliderValue(formData.get("style_rr")),
    spazio_scaletta: parseSliderValue(formData.get("style_ss")),
    lascia_guida: parseSliderValue(formData.get("style_lg")),
  };

  // Education: textarea, una voce per riga "tipo|descrizione"
  const educationRaw = String(formData.get("education") ?? "").trim();
  const education = educationRaw
    ? educationRaw
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const [type, ...rest] = line.split("|");
          return {
            type: (type ?? "").trim().toLowerCase(),
            description: rest.join("|").trim() || line,
          };
        })
    : null;

  // Courses: una riga per corso
  const coursesRaw = String(formData.get("courses") ?? "").trim();
  const courses = coursesRaw
    ? coursesRaw.split("\n").map((s) => s.trim()).filter(Boolean)
    : null;

  // Validazione
  if (bio.length < 50 || bio.length > 1200) {
    return { error: "La bio deve essere tra 50 e 1200 caratteri." };
  }
  if (age !== null && (!Number.isFinite(age) || age < 25 || age > 80)) {
    return { error: "Età non valida." };
  }

  const update: Record<string, unknown> = {
    bio,
    role,
    approach,
    orientation,
    self_description: selfDescription,
    region,
    age,
    style_profile: styleProfile,
    education,
    courses,
    cal_com_username: calCom,
    codice_fiscale: codiceFiscale,
    partita_iva: partitaIva,
    iban,
  };

  const { error } = await supabase
    .from("therapists")
    .update(update)
    .eq("auth_user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/pro/profilo");
  revalidatePath("/pro", "layout");
  revalidatePath("/app/prenota", "layout");
  revalidatePath("/specialisti", "layout");
  return { success: true };
}

function parseSliderValue(v: FormDataEntryValue | null): number | undefined {
  if (v === null) return undefined;
  const n = parseInt(String(v), 10);
  if (!Number.isFinite(n)) return undefined;
  return Math.max(0, Math.min(100, n));
}

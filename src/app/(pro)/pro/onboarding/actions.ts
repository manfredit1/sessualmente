"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export type OnboardingResult = { success?: boolean; error?: string };

export type OnboardingPayload = {
  bio: string;
  tags: string[];
  calComUsername: string;
  iban: string;
  codiceFiscale: string;
  partitaIva: string;
};

function normalizeSlug(value: string): string {
  return value
    .trim()
    .replace(/^https?:\/\/(app\.)?cal\.com\//i, "")
    .replace(/\/+$/, "")
    .replace(/^@/, "");
}

function normalizeIban(value: string): string {
  return value.replace(/\s+/g, "").toUpperCase();
}

export async function completeOnboarding(
  payload: OnboardingPayload
): Promise<OnboardingResult> {
  const user = await requireUser("pro");
  const admin = createAdminClient();

  const bio = payload.bio.trim();
  const tags = payload.tags.map((t) => t.trim()).filter(Boolean);
  const calComUsername = normalizeSlug(payload.calComUsername);
  const iban = normalizeIban(payload.iban);
  const codiceFiscale = payload.codiceFiscale.trim().toUpperCase();
  const partitaIva = payload.partitaIva.trim();

  if (bio.length < 150)
    return { error: "La bio deve essere di almeno 150 caratteri." };
  if (tags.length < 1)
    return { error: "Inserisci almeno un tag di specializzazione." };
  if (calComUsername.length < 3)
    return { error: "Username Cal.com non valido." };
  if (iban.length < 15 || !/^[A-Z]{2}/.test(iban))
    return { error: "IBAN non valido (atteso formato IT...)." };
  if (!codiceFiscale && !partitaIva)
    return { error: "Inserisci codice fiscale o partita IVA." };
  if (codiceFiscale && codiceFiscale.length !== 16)
    return { error: "Il codice fiscale deve essere di 16 caratteri." };
  if (partitaIva && !/^\d{11}$/.test(partitaIva))
    return { error: "La partita IVA deve essere di 11 cifre." };

  const { data: therapist, error: loadErr } = await admin
    .from("therapists")
    .select("id, status")
    .eq("auth_user_id", user.id)
    .maybeSingle();
  if (loadErr || !therapist)
    return { error: "Profilo professionista non trovato." };

  const { error: updErr } = await admin
    .from("therapists")
    .update({
      bio,
      tags,
      cal_com_username: calComUsername,
      iban,
      codice_fiscale: codiceFiscale || null,
      partita_iva: partitaIva || null,
    })
    .eq("id", therapist.id);
  if (updErr) return { error: `Aggiornamento fallito: ${updErr.message}` };

  revalidatePath("/pro/dashboard");
  revalidatePath("/pro/profilo");
  revalidatePath("/admin/terapisti");
  return { success: true };
}

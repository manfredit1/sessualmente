import "server-only";
import { redirect } from "next/navigation";
import { requireUser, type CurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export type ProTherapist = {
  id: string;
  name: string;
  role: string;
  slug: string;
  status: "pending" | "active" | "suspended";
  bio: string;
  tags: string[];
  cal_com_username: string | null;
  iban: string | null;
  codice_fiscale: string | null;
  partita_iva: string | null;
};

export function isOnboarded(t: ProTherapist): boolean {
  return Boolean(
    t.cal_com_username &&
      t.iban &&
      (t.codice_fiscale || t.partita_iva) &&
      t.bio &&
      t.bio.trim().length >= 150 &&
      t.tags &&
      t.tags.length >= 1
  );
}

export async function getProTherapist(userId: string): Promise<ProTherapist | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("therapists")
    .select(
      "id, name, role, slug, status, bio, tags, cal_com_username, iban, codice_fiscale, partita_iva"
    )
    .eq("auth_user_id", userId)
    .maybeSingle();
  return (data as ProTherapist | null) ?? null;
}

/**
 * Per pagine pro che richiedono profilo onboarded. Se il therapist esiste
 * ma non ha ancora completato il wizard, redirige a /pro/onboarding.
 *
 * Da NON usare in /pro/onboarding stesso (provocherebbe loop).
 */
export async function requireOnboardedPro(): Promise<{
  user: CurrentUser;
  therapist: ProTherapist;
}> {
  const user = await requireUser("pro");
  const therapist = await getProTherapist(user.id);
  if (!therapist) {
    // Nessun record therapist collegato: account pro senza setup admin → homepage.
    redirect("/");
  }
  if (!isOnboarded(therapist)) {
    redirect("/pro/onboarding");
  }
  return { user, therapist };
}

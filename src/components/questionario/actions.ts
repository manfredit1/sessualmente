"use server";

import { createClient } from "@/lib/supabase/server";
import type { Answers } from "./steps";

export type SubmitIntakeState = {
  success?: boolean;
  error?: string;
} | null;

export async function submitIntake(
  answers: Answers
): Promise<SubmitIntakeState> {
  if (!answers.email || !/^\S+@\S+\.\S+$/.test(answers.email)) {
    return { error: "Email mancante o non valida." };
  }
  if (!answers.consent) {
    return { error: "Devi accettare il trattamento dei dati sanitari." };
  }

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3002";

  // 1. Salva intake_responses (profile_id è null finché l'utente non conferma
  //    l'email via magic link; lo linkeremo via trigger o endpoint dopo).
  const { error: intakeError } = await supabase
    .from("intake_responses")
    .insert({
      email: answers.email,
      responses: answers,
      clinical_consent: Boolean(answers.consent),
      marketing_consent: Boolean(answers.marketing),
    });

  if (intakeError) {
    return { error: `Errore salvataggio risposte: ${intakeError.message}` };
  }

  // 2. Manda magic link all'email indicata.
  const { error: otpError } = await supabase.auth.signInWithOtp({
    email: answers.email,
    options: {
      emailRedirectTo: `${siteUrl}/callback`,
      shouldCreateUser: true,
    },
  });

  if (otpError) {
    return { error: `Errore invio email: ${otpError.message}` };
  }

  return { success: true };
}

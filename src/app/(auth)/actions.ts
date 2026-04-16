"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type SendMagicLinkState = {
  success?: boolean;
  error?: string;
  email?: string;
} | null;

export async function sendMagicLink(
  _prev: SendMagicLinkState,
  formData: FormData
): Promise<SendMagicLinkState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return { error: "Email non valida.", email };
  }

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3002";

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${siteUrl}/callback`,
      // Creiamo l'utente automaticamente al primo accesso.
      shouldCreateUser: true,
    },
  });

  if (error) {
    return { error: error.message, email };
  }

  return { success: true, email };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

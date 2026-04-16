import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Supabase OAuth / magic link callback.
 *
 * 1. Scambia il `code` con una sessione.
 * 2. Linka eventuali risposte-questionario pre-auth (intake_responses) al
 *    profilo appena creato, se l'email coincide.
 * 3. Reindirizza in base al ruolo:
 *      - pro (therapist collegato) → /pro/dashboard
 *      - patient / default         → /app/dashboard
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const explicitNext = searchParams.get("next");

  if (!code) {
    return NextResponse.redirect(`${origin}/accedi?error=missing_code`);
  }

  const supabase = await createClient();
  const { error, data } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user?.email) {
    return NextResponse.redirect(`${origin}/accedi?error=magic_link`);
  }

  const user = data.user;

  // Backfill: collega intake pre-auth al profilo (bypassa RLS via service_role).
  try {
    const admin = createAdminClient();
    await admin
      .from("intake_responses")
      .update({ profile_id: user.id })
      .eq("email", user.email)
      .is("profile_id", null);
  } catch {
    // Non-blocking: un intake non linkato non deve impedire il login.
  }

  if (explicitNext) {
    return NextResponse.redirect(`${origin}${explicitNext}`);
  }

  const { data: therapist } = await supabase
    .from("therapists")
    .select("id")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  const target = therapist ? "/pro/dashboard" : "/app/dashboard";
  return NextResponse.redirect(`${origin}${target}`);
}

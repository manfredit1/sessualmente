import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Magic link callback.
 *
 *  1. Scambia il `code` con una sessione.
 *  2. Linka eventuali intake_responses pre-auth al profilo.
 *  3. Dispatch per ruolo + stato onboarding:
 *     - pro (therapist collegato) → /pro/dashboard
 *     - patient nuovo (senza nome) → /benvenuto
 *     - patient con profilo → /app/dashboard
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

  try {
    const admin = createAdminClient();
    await admin
      .from("intake_responses")
      .update({ profile_id: user.id })
      .eq("email", user.email)
      .is("profile_id", null);
  } catch {
    // Non-blocking.
  }

  if (explicitNext) {
    return NextResponse.redirect(`${origin}${explicitNext}`);
  }

  // Pro link?
  const { data: therapist } = await supabase
    .from("therapists")
    .select("id")
    .eq("auth_user_id", user.id)
    .maybeSingle();
  if (therapist) {
    return NextResponse.redirect(`${origin}/pro/dashboard`);
  }

  // Profilo completo?
  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, last_name")
    .eq("id", user.id)
    .maybeSingle();
  const profileComplete = Boolean(profile?.first_name && profile?.last_name);

  return NextResponse.redirect(
    `${origin}${profileComplete ? "/app/dashboard" : "/benvenuto"}`
  );
}

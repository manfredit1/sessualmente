"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export type ActionResult = { success?: boolean; error?: string };

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function initialsOf(first: string, last: string): string {
  return `${(first[0] ?? "").toUpperCase()}${(last[0] ?? "").toUpperCase()}`;
}

async function pickUniqueSlug(
  supabase: ReturnType<typeof createAdminClient>,
  base: string
): Promise<string> {
  let candidate = base || "sessuologo";
  let i = 1;
  while (i < 100) {
    const { data } = await supabase
      .from("therapists")
      .select("id")
      .eq("slug", candidate)
      .maybeSingle();
    if (!data) return candidate;
    i += 1;
    candidate = `${base}-${i}`;
  }
  throw new Error("Impossibile generare slug unico dopo 100 tentativi.");
}

export async function approveApplication(
  applicationId: string
): Promise<ActionResult> {
  await requireUser("admin");
  const supabase = createAdminClient();

  const { data: app, error: loadErr } = await supabase
    .from("pro_applications")
    .select("*")
    .eq("id", applicationId)
    .maybeSingle();

  if (loadErr || !app) return { error: "Candidatura non trovata." };
  if (!["new", "review"].includes(app.status))
    return { error: `Candidatura già ${app.status}.` };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const redirectTo = siteUrl
    ? `${siteUrl.replace(/\/$/, "")}/pro/profilo`
    : undefined;

  const { data: invited, error: inviteErr } =
    await supabase.auth.admin.inviteUserByEmail(app.email, {
      data: { source: "pro_application", application_id: applicationId },
      redirectTo,
    });

  if (inviteErr || !invited?.user) {
    return {
      error: `Impossibile invitare: ${inviteErr?.message ?? "utente esistente?"}`,
    };
  }

  const userId = invited.user.id;

  const { error: roleErr } = await supabase
    .from("profiles")
    .update({ role: "pro" })
    .eq("id", userId);
  if (roleErr) return { error: `Update profile fallito: ${roleErr.message}` };

  const fullName = `${app.first_name} ${app.last_name}`.trim();
  const baseSlug = slugify(fullName);
  const slug = await pickUniqueSlug(supabase, baseSlug);

  const { error: insertErr } = await supabase.from("therapists").insert({
    auth_user_id: userId,
    slug,
    name: fullName,
    initials: initialsOf(app.first_name, app.last_name),
    role: app.qualification,
    approach: app.approach,
    bio: app.motivation ?? "Profilo in completamento.",
    email: app.email,
    phone: app.phone,
    status: "pending",
  });
  if (insertErr) return { error: `Insert therapist fallito: ${insertErr.message}` };

  const { error: statusErr } = await supabase
    .from("pro_applications")
    .update({ status: "approved" })
    .eq("id", applicationId);
  if (statusErr)
    return { error: `Update candidatura fallito: ${statusErr.message}` };

  revalidatePath("/admin");
  return { success: true };
}

export async function rejectApplication(
  applicationId: string
): Promise<ActionResult> {
  await requireUser("admin");
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("pro_applications")
    .update({ status: "rejected" })
    .eq("id", applicationId);

  if (error) return { error: `Update fallito: ${error.message}` };
  revalidatePath("/admin");
  return { success: true };
}

"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";

export async function updateMeetUrl(
  bookingId: string,
  meetUrl: string | null
): Promise<{ error?: string } | null> {
  const user = await requireUser("pro");
  const supabase = await createClient();

  // Verifica che la booking appartenga a questo terapista.
  const { data: booking } = await supabase
    .from("bookings")
    .select("id, therapist_id")
    .eq("id", bookingId)
    .maybeSingle();

  if (!booking) return { error: "Booking non trovata." };

  const { data: therapist } = await supabase
    .from("therapists")
    .select("id")
    .eq("auth_user_id", user.id)
    .eq("id", booking.therapist_id)
    .maybeSingle();

  if (!therapist) return { error: "Non autorizzato." };

  // Validazione URL base
  if (meetUrl && !meetUrl.startsWith("https://")) {
    return { error: "Il link deve iniziare con https://" };
  }

  const { error } = await supabase
    .from("bookings")
    .update({ meet_url: meetUrl })
    .eq("id", bookingId);

  if (error) return { error: error.message };

  revalidatePath("/pro/agenda");
  revalidatePath("/pro/dashboard");
  revalidatePath("/app/sedute");
  revalidatePath("/app/dashboard");
  return null;
}

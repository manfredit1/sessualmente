"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export type CancelResult = { success?: boolean; error?: string };

const CANCEL_WINDOW_MS = 24 * 60 * 60 * 1000;

export async function cancelBooking(bookingId: string): Promise<CancelResult> {
  const user = await requireUser("patient");
  const admin = createAdminClient();

  const { data: booking, error: loadErr } = await admin
    .from("bookings")
    .select("id, patient_id, status, starts_at, cal_event_id")
    .eq("id", bookingId)
    .maybeSingle();

  if (loadErr || !booking) return { error: "Seduta non trovata." };
  if (booking.patient_id !== user.id) return { error: "Non autorizzato." };
  if (booking.status !== "scheduled")
    return { error: `Seduta già ${booking.status}.` };

  const startMs = new Date(booking.starts_at).getTime();
  if (startMs - Date.now() < CANCEL_WINDOW_MS) {
    return {
      error: "Cancellazione non disponibile: mancano meno di 24 ore.",
    };
  }

  const apiKey = process.env.CAL_API_KEY;
  if (!apiKey) return { error: "CAL_API_KEY non configurato su Vercel." };
  if (!booking.cal_event_id)
    return { error: "Event ID Cal.com mancante su questo booking." };

  const calRes = await fetch(
    `https://api.cal.com/v2/bookings/${booking.cal_event_id}/cancel`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "cal-api-version": "2024-08-13",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cancellationReason: "Cancellato dal paziente" }),
    }
  );

  if (!calRes.ok) {
    const text = await calRes.text().catch(() => "");
    return {
      error: `Cal.com ha rifiutato la cancellazione (${calRes.status}): ${text.slice(0, 200)}`,
    };
  }

  const { error: updErr } = await admin
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("id", bookingId);
  if (updErr) return { error: `Aggiornamento DB fallito: ${updErr.message}` };

  revalidatePath("/app/sedute");
  revalidatePath("/app/dashboard");
  return { success: true };
}

import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Endpoint che riceve i webhook Cal.com.
 *
 * Eventi gestiti:
 *  - BOOKING_CREATED      → inserisce riga in public.bookings
 *  - BOOKING_RESCHEDULED  → aggiorna starts_at/ends_at/meet_url
 *  - BOOKING_CANCELLED    → sposta a status = 'cancelled'
 *
 * Matching:
 *  - Therapist: via payload.metadata.therapistSlug (lo passiamo dall'embed)
 *    o in fallback via organizer.username (cal_com_username nel DB)
 *  - Patient:   via attendees[0].email → lookup in auth.users, se non esiste
 *    il booking viene rifiutato (non vogliamo creare utenti fantasma).
 *
 * Security:
 *  - Se CAL_WEBHOOK_SECRET è configurato, verifica HMAC SHA-256 sul payload.
 */
export async function POST(request: NextRequest) {
  const rawBody = await request.text();

  const secret = process.env.CAL_WEBHOOK_SECRET;
  if (secret) {
    const signature = request.headers.get("x-cal-signature-256");
    if (!signature) {
      return NextResponse.json({ error: "missing signature" }, { status: 401 });
    }
    const expected = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");
    if (
      !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
    ) {
      return NextResponse.json({ error: "invalid signature" }, { status: 401 });
    }
  }

  let body: CalWebhookPayload;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const admin = createAdminClient();
  const p = body.payload;

  // Match therapist ------------------------------------------------------
  const therapistSlug =
    (p.metadata?.therapistSlug as string | undefined) ?? null;
  const organizerUsername = p.organizer?.username ?? null;

  let therapistId: string | null = null;
  if (therapistSlug) {
    const { data } = await admin
      .from("therapists")
      .select("id")
      .eq("slug", therapistSlug)
      .maybeSingle();
    therapistId = (data?.id as string | null) ?? null;
  }
  if (!therapistId && organizerUsername) {
    // Fallback: cerca cal_com_username che contenga lo username
    const { data } = await admin
      .from("therapists")
      .select("id")
      .ilike("cal_com_username", `%${organizerUsername}%`)
      .maybeSingle();
    therapistId = (data?.id as string | null) ?? null;
  }

  if (!therapistId) {
    return NextResponse.json(
      { error: "therapist not found", organizerUsername, therapistSlug },
      { status: 404 }
    );
  }

  // Match patient --------------------------------------------------------
  const attendeeEmail = p.attendees?.[0]?.email?.toLowerCase() ?? null;
  if (!attendeeEmail) {
    return NextResponse.json({ error: "attendee email missing" }, { status: 400 });
  }

  const { data: authUsers } = await admin.auth.admin.listUsers();
  const matchingUser = authUsers?.users.find(
    (u) => u.email?.toLowerCase() === attendeeEmail
  );
  if (!matchingUser) {
    // Patient non registrato: invitiamo via magic link? Per ora saltiamo.
    return NextResponse.json(
      { error: "patient not registered in app", email: attendeeEmail },
      { status: 404 }
    );
  }
  const patientId = matchingUser.id;

  // Handle event types ---------------------------------------------------
  const calEventId = p.uid ?? p.id?.toString() ?? null;
  const startsAt = p.startTime;
  const endsAt = p.endTime;
  const meetUrl = extractMeetUrl(p);

  switch (body.triggerEvent) {
    case "BOOKING_CREATED": {
      const { error } = await admin.from("bookings").insert({
        patient_id: patientId,
        therapist_id: therapistId,
        starts_at: startsAt,
        ends_at: endsAt,
        status: "scheduled",
        meet_url: meetUrl,
        cal_event_id: calEventId,
        amount_gross: 6500, // TODO: collegare a Stripe quando attivo
        amount_net: 4800,
      });
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ ok: true, created: true });
    }

    case "BOOKING_RESCHEDULED": {
      const { error } = await admin
        .from("bookings")
        .update({
          starts_at: startsAt,
          ends_at: endsAt,
          meet_url: meetUrl,
          status: "scheduled",
        })
        .eq("cal_event_id", calEventId);
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ ok: true, rescheduled: true });
    }

    case "BOOKING_CANCELLED": {
      const { error } = await admin
        .from("bookings")
        .update({ status: "cancelled" })
        .eq("cal_event_id", calEventId);
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ ok: true, cancelled: true });
    }

    default:
      return NextResponse.json({ ok: true, ignored: body.triggerEvent });
  }
}

// Tipi minimali del payload Cal.com (solo i campi che usiamo) ---------------

type CalWebhookPayload = {
  triggerEvent: string;
  payload: {
    id?: number;
    uid?: string;
    title?: string;
    startTime: string;
    endTime: string;
    location?: string;
    organizer?: {
      email?: string;
      name?: string;
      username?: string;
    };
    attendees?: Array<{
      email?: string;
      name?: string;
    }>;
    metadata?: Record<string, unknown>;
    videoCallData?: {
      type?: string;
      url?: string;
    };
    references?: Array<{
      type?: string;
      uid?: string;
      meetingUrl?: string;
    }>;
  };
};

function isHttpUrl(v: unknown): v is string {
  return typeof v === "string" && /^https?:\/\//.test(v);
}

function extractMeetUrl(p: CalWebhookPayload["payload"]): string | null {
  if (isHttpUrl(p.videoCallData?.url)) return p.videoCallData!.url!;
  const metaUrl = p.metadata?.videoCallUrl;
  if (isHttpUrl(metaUrl)) return metaUrl;
  if (isHttpUrl(p.location)) return p.location;
  if (p.references) {
    const ref = p.references.find(
      (r) => r.type?.includes("google_meet") || r.type?.includes("daily_video")
    );
    if (isHttpUrl(ref?.meetingUrl)) return ref!.meetingUrl!;
  }
  return null;
}

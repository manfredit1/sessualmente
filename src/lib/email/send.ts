import "server-only";
import { FROM_EMAIL, REPLY_TO, getResend } from "./client";
import {
  BookingConfirmedEmail,
  type BookingConfirmedProps,
} from "./templates/booking-confirmed";
import {
  BookingCancelledEmail,
  type BookingCancelledProps,
} from "./templates/booking-cancelled";

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Rome",
  }).format(new Date(iso));
}

function formatTime(iso: string): string {
  return new Intl.DateTimeFormat("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Rome",
  }).format(new Date(iso));
}

function siteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL;
  if (url && /^https?:\/\//.test(url)) return url.replace(/\/$/, "");
  return "";
}

type SendResult = { ok: boolean; error?: string };

async function sendWithResend(args: {
  to: string;
  subject: string;
  react: React.ReactElement;
}): Promise<SendResult> {
  const resend = getResend();
  if (!resend) {
    console.warn("[email] RESEND_API_KEY non configurata, skip invio:", args.subject);
    return { ok: false, error: "RESEND_API_KEY missing" };
  }
  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: args.to,
      subject: args.subject,
      react: args.react,
      replyTo: REPLY_TO,
    });
    if (error) {
      console.error("[email] send failed:", error);
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (e) {
    console.error("[email] send threw:", e);
    return { ok: false, error: e instanceof Error ? e.message : "unknown" };
  }
}

export async function sendBookingConfirmed(args: {
  toEmail: string;
  patientFirstName: string;
  therapistName: string;
  startsAtIso: string;
  meetUrl: string | null;
}): Promise<SendResult> {
  const dateLabel = formatDate(args.startsAtIso);
  const timeLabel = formatTime(args.startsAtIso);
  const site = siteUrl();
  const props: BookingConfirmedProps = {
    patientFirstName: args.patientFirstName,
    therapistName: args.therapistName,
    dateLabel,
    timeLabel,
    timezoneLabel: "Europe/Rome",
    meetUrl: args.meetUrl,
    dashboardUrl: site ? `${site}/app/sedute` : "/app/sedute",
  };
  return sendWithResend({
    to: args.toEmail,
    subject: `Seduta confermata con ${args.therapistName}`,
    react: BookingConfirmedEmail(props),
  });
}

export async function sendBookingCancelled(args: {
  toEmail: string;
  patientFirstName: string;
  therapistName: string;
  startsAtIso: string;
}): Promise<SendResult> {
  const dateLabel = formatDate(args.startsAtIso);
  const timeLabel = formatTime(args.startsAtIso);
  const site = siteUrl();
  const props: BookingCancelledProps = {
    patientFirstName: args.patientFirstName,
    therapistName: args.therapistName,
    dateLabel,
    timeLabel,
    bookingAgainUrl: site ? `${site}/app/prenota` : "/app/prenota",
  };
  return sendWithResend({
    to: args.toEmail,
    subject: `Seduta del ${dateLabel} cancellata`,
    react: BookingCancelledEmail(props),
  });
}

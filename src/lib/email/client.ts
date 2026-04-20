import "server-only";
import { Resend } from "resend";

let cached: Resend | null = null;

export function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!cached) cached = new Resend(key);
  return cached;
}

export const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
export const REPLY_TO =
  process.env.RESEND_REPLY_TO ?? undefined;

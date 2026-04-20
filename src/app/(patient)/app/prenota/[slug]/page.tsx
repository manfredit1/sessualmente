import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Lock, ShieldCheck, Video } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireUser, displayName } from "@/lib/auth";
import { getTherapistBySlug, formatCurrency } from "@/lib/queries";
import { createAdminClient } from "@/lib/supabase/admin";
import { CalEmbed } from "@/components/app/cal-embed";
import { TherapistProfile } from "@/components/app/therapist-profile";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const t = await getTherapistBySlug(slug);
  return {
    title: t ? `Prenota con ${t.name}` : "Specialista",
  };
}

export default async function TherapistDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [t, user] = await Promise.all([
    getTherapistBySlug(slug),
    requireUser("patient"),
  ]);
  if (!t) notFound();

  // Conta pazienti unici seguiti da questo terapista (bypassa RLS via admin).
  let patientCount = 0;
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("bookings")
      .select("patient_id")
      .eq("therapist_id", t.id);
    patientCount = new Set((data ?? []).map((b) => b.patient_id)).size;
  } catch {
    // Non-blocking.
  }

  const calLink = t.calComUsername || null;

  return (
    <div className="flex flex-col gap-8">
      <Link
        href="/app/prenota"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Torna alla lista
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        {/* Left: rich profile */}
        <div>
          <TherapistProfile t={t} patientCount={patientCount} />
        </div>

        {/* Right: Cal.com embed + trust strip */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 rounded-xl bg-muted/30 p-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Video className="h-3.5 w-3.5" />
              Su Google Meet, link via email
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" />
              Pagamento Stripe, cancellazione gratuita 24h prima
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5" />
              Dati cifrati, server EU
            </span>
            <span className="mt-1 font-medium text-foreground">
              Prima seduta {formatCurrency(t.pricePerSession)} · 50 min
            </span>
          </div>

          <Card className="overflow-hidden border-border/60">
            <CardHeader className="border-b border-border/60">
              <CardTitle>Scegli lo slot</CardTitle>
              <CardDescription>
                Slot live dal calendario del sessuologo.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {calLink ? (
                <div className="h-[760px] w-full md:h-[860px] lg:h-[920px]">
                  <CalEmbed
                    calLink={calLink}
                    patientEmail={user.email}
                    patientName={displayName(user)}
                    therapistSlug={t.slug}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 p-10 text-center">
                  <p className="text-sm text-muted-foreground">
                    Il sessuologo non ha ancora collegato la sua agenda Cal.com.
                  </p>
                  <Link
                    href="/app/prenota"
                    className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                  >
                    Vedi altri specialisti
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

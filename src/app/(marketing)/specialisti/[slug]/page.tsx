import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getTherapistBySlug, formatCurrency } from "@/lib/queries";
import { createAdminClient } from "@/lib/supabase/admin";
import { TherapistProfile } from "@/components/app/therapist-profile";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const t = await getTherapistBySlug(slug);
  if (!t) return { title: "Specialista" };
  return {
    title: t.name,
    description:
      t.bio.slice(0, 155) + (t.bio.length > 155 ? "..." : ""),
  };
}

export default async function SpecialistPublicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const t = await getTherapistBySlug(slug);
  if (!t || t.status !== "active") notFound();

  // Conteggio pazienti seguiti (via service_role, non esposto via RLS)
  let patientCount = 0;
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("bookings")
      .select("patient_id")
      .eq("therapist_id", t.id);
    patientCount = new Set((data ?? []).map((b) => b.patient_id)).size;
  } catch {}

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <Link
        href="/specialisti"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Tutti gli specialisti
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <TherapistProfile t={t} patientCount={patientCount} />
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Card className="border-primary/30 shadow-lg shadow-primary/5">
            <CardHeader>
              <CardTitle className="text-base">Inizia con {t.name.split(" ")[1]}</CardTitle>
              <CardDescription>
                Per prenotare ti chiediamo di fare un breve questionario (3 min)
                e registrarti con email. Così il sessuologo arriva preparato.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-baseline justify-between rounded-lg bg-muted/40 p-3">
                <span className="text-sm text-muted-foreground">Seduta singola</span>
                <span className="text-xl font-semibold tracking-tight">
                  {formatCurrency(t.pricePerSession)}
                </span>
              </div>
              <Link
                href="/questionario"
                className={`${buttonVariants({ className: "w-full" })}`}
              >
                <Sparkles className="mr-1 h-4 w-4" />
                Inizia il questionario
              </Link>
              <p className="text-center text-xs text-muted-foreground">
                3 min · nessun pagamento richiesto · riservato
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

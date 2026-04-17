import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function PazienteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role, first_name, last_name, phone, city, birth_year, marketing_ok, created_at")
    .eq("id", id)
    .maybeSingle();

  if (!profile) notFound();

  const [userRes, { data: intakes }, { data: bookings }, { data: therapists }] =
    await Promise.all([
      supabase.auth.admin.getUserById(id),
      supabase
        .from("intake_responses")
        .select("id, responses, clinical_consent, marketing_consent, submitted_at")
        .eq("profile_id", id)
        .order("submitted_at", { ascending: false }),
      supabase
        .from("bookings")
        .select(
          "id, therapist_id, starts_at, ends_at, status, meet_url, amount_gross, stripe_payment_intent_id"
        )
        .eq("patient_id", id)
        .order("starts_at", { ascending: false }),
      supabase.from("therapists").select("id, name, slug"),
    ]);

  const email = userRes.data.user?.email ?? "—";
  const therapistById = new Map((therapists ?? []).map((t) => [t.id, t]));
  const fullName =
    `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim() ||
    "(senza nome)";
  const age = profile.birth_year
    ? new Date().getFullYear() - profile.birth_year
    : null;
  const intake = intakes?.[0] ?? null;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/admin/pazienti"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" /> Torna alla lista
        </Link>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{fullName}</h1>
        <p className="text-muted-foreground">{email}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Info label="Città" value={profile.city ?? "—"} />
        <Info label="Età" value={age ? `${age} anni` : "—"} />
        <Info label="Telefono" value={profile.phone ?? "—"} />
        <Info
          label="Registrato"
          value={new Date(profile.created_at).toLocaleDateString("it-IT", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        />
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base">Questionario intake</CardTitle>
          <CardDescription>
            {intake
              ? `Ultimo invio: ${new Date(intake.submitted_at).toLocaleDateString(
                  "it-IT",
                  { day: "numeric", month: "short", year: "numeric" }
                )}`
              : "Non ancora compilato."}
          </CardDescription>
        </CardHeader>
        {intake && (
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge variant={intake.clinical_consent ? "secondary" : "outline"}>
                Consenso clinico: {intake.clinical_consent ? "sì" : "no"}
              </Badge>
              <Badge variant={intake.marketing_consent ? "secondary" : "outline"}>
                Consenso marketing: {intake.marketing_consent ? "sì" : "no"}
              </Badge>
            </div>
            <pre className="overflow-x-auto rounded-md bg-muted p-4 text-xs">
              {JSON.stringify(intake.responses, null, 2)}
            </pre>
          </CardContent>
        )}
      </Card>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base">Storico sedute</CardTitle>
          <CardDescription>
            {bookings?.length
              ? `${bookings.length} prenotazion${bookings.length === 1 ? "e" : "i"}`
              : "Nessuna prenotazione."}
          </CardDescription>
        </CardHeader>
        {(bookings?.length ?? 0) > 0 && (
          <CardContent className="flex flex-col gap-2">
            {bookings!.map((b) => {
              const t = therapistById.get(b.therapist_id);
              return (
                <div
                  key={b.id}
                  className="flex flex-col gap-1 rounded-lg border border-border/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {t?.name ?? "Terapista rimosso"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(b.starts_at).toLocaleString("it-IT", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        timeZone: "Europe/Rome",
                      })}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline">{b.status}</Badge>
                    {b.stripe_payment_intent_id ? (
                      <Badge variant="secondary">Pagata</Badge>
                    ) : (
                      <Badge variant="outline">Non pagata</Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        )}
      </Card>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-lg font-semibold tracking-tight">
          {value}
        </CardTitle>
      </CardHeader>
    </Card>
  );
}

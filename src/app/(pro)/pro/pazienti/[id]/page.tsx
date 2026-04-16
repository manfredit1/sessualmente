import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  ClipboardList,
  Clock,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { requireUser } from "@/lib/auth";
import {
  getMyTherapistRecord,
  getProPatient,
  getProBookings,
  formatDate,
  formatTime,
} from "@/lib/queries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser("pro");
  const therapist = await getMyTherapistRecord(user.id);
  if (!therapist) return { title: "Paziente" };
  const p = await getProPatient(therapist.id, id);
  return {
    title: p ? `${p.firstName ?? "?"} ${p.lastName ?? ""}` : "Paziente",
  };
}

const intakeLabels: Record<string, Record<string, string>> = {
  soggetto: {
    io: "Percorso individuale",
    coppia: "Percorso di coppia",
    terzi: "Sta valutando per qualcun altro",
  },
  durata: {
    breve: "Meno di un mese",
    medio: "Qualche mese",
    lungo: "Più di un anno",
    incerto: "Non sa definirlo",
  },
  esperienza: {
    mai: "Prima esperienza",
    in_corso: "Ha un percorso in corso",
    completato: "Ha concluso un percorso in passato",
  },
  tema: {
    coppia: "Dinamiche di coppia",
    desiderio: "Desiderio e intimità",
    disfunzioni: "Disfunzioni sessuali",
    identita: "Identità / orientamento",
    trauma: "Esperienze traumatiche",
    altro: "Indefinito",
  },
};

export default async function PatientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser("pro");
  const therapist = await getMyTherapistRecord(user.id);
  if (!therapist) notFound();
  const patient = await getProPatient(therapist.id, id);
  if (!patient) notFound();

  const bookings = (await getProBookings(therapist.id)).filter(
    (b) => b.patientId === id
  );
  const upcoming = bookings.filter((b) => b.status === "scheduled");
  const past = bookings.filter((b) => b.status === "completed");

  const intake = patient.intake as Record<string, unknown> | null;
  const intakeTema = (intake?.tema as string[] | undefined) ?? [];

  return (
    <div className="flex flex-col gap-8">
      <Link
        href="/pro/pazienti"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Torna ai pazienti
      </Link>

      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 flex-none items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
            {patient.initials}
          </div>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              {patient.firstName ?? "?"} {patient.lastName ?? ""}
            </h1>
            <p className="text-muted-foreground">
              {patient.city ?? "—"}
              {patient.birthYear
                ? ` · ${new Date().getFullYear() - patient.birthYear} anni`
                : ""}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card className="border-border/60">
          <CardHeader>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-primary/10 text-primary">
                <ClipboardList className="h-4 w-4" />
              </span>
              <div>
                <CardTitle className="text-base">Risposte al questionario</CardTitle>
                <CardDescription>
                  Quello che il paziente ha dichiarato prima della prima seduta.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5 text-sm">
            {intake ? (
              <>
                {intake.soggetto && (
                  <IntakeRow
                    label="Tipo di percorso"
                    value={
                      intakeLabels.soggetto[intake.soggetto as string] ??
                      (intake.soggetto as string)
                    }
                  />
                )}
                {intakeTema.length > 0 && (
                  <IntakeRow
                    label="Temi"
                    value={
                      <div className="flex flex-wrap gap-1.5">
                        {intakeTema.map((t) => (
                          <Badge key={t} variant="secondary">
                            {intakeLabels.tema[t] ?? t}
                          </Badge>
                        ))}
                      </div>
                    }
                  />
                )}
                {intake.durata && (
                  <IntakeRow
                    label="Da quanto"
                    value={
                      intakeLabels.durata[intake.durata as string] ??
                      (intake.durata as string)
                    }
                  />
                )}
                {intake.esperienza && (
                  <IntakeRow
                    label="Esperienza"
                    value={
                      intakeLabels.esperienza[intake.esperienza as string] ??
                      (intake.esperienza as string)
                    }
                  />
                )}
                {intake.note && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Note dal paziente
                      </p>
                      <p className="mt-2 italic text-foreground">
                        &ldquo;{intake.note as string}&rdquo;
                      </p>
                    </div>
                  </>
                )}
              </>
            ) : (
              <p className="text-muted-foreground">
                Il paziente non ha ancora compilato il questionario.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="h-fit border-border/60">
          <CardHeader>
            <CardTitle className="text-base">Storico sedute</CardTitle>
            <CardDescription>
              {bookings.length} totali · {past.length} completate
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {upcoming.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Prossime
                </p>
                <div className="mt-2 space-y-2">
                  {upcoming.map((b) => (
                    <div
                      key={b.id}
                      className="flex items-center justify-between rounded-lg border border-primary/30 bg-primary/5 px-3 py-2"
                    >
                      <span className="flex items-center gap-2 text-xs">
                        <CalendarDays className="h-3.5 w-3.5 text-primary" />
                        {formatDate(b.startsAt)} · {formatTime(b.startsAt)}
                      </span>
                      {b.meetUrl && (
                        <a
                          href={b.meetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-medium text-primary underline-offset-2 hover:underline"
                        >
                          Meet
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {past.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Passate
                </p>
                <div className="mt-2 space-y-1.5">
                  {past.map((b) => (
                    <div
                      key={b.id}
                      className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2 text-xs"
                    >
                      <span className="flex items-center gap-2">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        {formatDate(b.startsAt)}
                      </span>
                      <span className="text-muted-foreground">Completata</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {bookings.length === 0 && (
              <p className="text-muted-foreground">Nessuna seduta ancora.</p>
            )}
          </CardContent>
        </Card>
      </div>

    </div>
  );
}

function IntakeRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:w-32">
        {label}
      </p>
      <div className="flex-1 text-sm">{value}</div>
    </div>
  );
}

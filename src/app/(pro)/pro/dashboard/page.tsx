import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Clock,
  TrendingUp,
  UserPlus,
  Video,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { requireUser } from "@/lib/auth";
import {
  getMyTherapistRecord,
  getProBookings,
  getProPatients,
  formatCurrency,
  formatTime,
  minutesUntil,
} from "@/lib/queries";

export const metadata = { title: "Dashboard" };

export default async function ProDashboardPage() {
  const user = await requireUser("pro");
  const therapist = await getMyTherapistRecord(user.id);
  if (!therapist) {
    return <EmptyProDashboard />;
  }

  const [bookings, patients] = await Promise.all([
    getProBookings(therapist.id),
    getProPatients(therapist.id),
  ]);

  const now = Date.now();
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const today = bookings.filter((b) => {
    const t = new Date(b.startsAt).getTime();
    return (
      b.status === "scheduled" &&
      t >= startOfToday.getTime() &&
      t <= endOfToday.getTime()
    );
  }).sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());

  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const thisMonth = bookings.filter(
    (b) => b.status === "completed" && new Date(b.startsAt) >= monthStart
  );
  const lastMonthStart = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
  const lastMonthEnd = new Date(new Date().getFullYear(), new Date().getMonth(), 0, 23, 59, 59);
  const lastMonth = bookings.filter(
    (b) =>
      b.status === "completed" &&
      new Date(b.startsAt) >= lastMonthStart &&
      new Date(b.startsAt) <= lastMonthEnd
  );
  const netThisMonth = thisMonth.reduce((s, b) => s + b.amountNet, 0);
  const grossLast = lastMonth.reduce((s, b) => s + b.amountGross, 0);
  const grossThis = thisMonth.reduce((s, b) => s + b.amountGross, 0);
  const delta = grossLast > 0 ? Math.round(((grossThis - grossLast) / grossLast) * 100) : 0;

  const activePatients = patients.filter((p) => p.status === "attivo").length;
  const pendingPatients = patients.filter((p) => p.status === "in_valutazione");
  const next = today[0];
  const nextPatient = next
    ? patients.find((p) => p.id === next.patientId)
    : null;
  const imminent = next && minutesUntil(next.startsAt) <= 30;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Ciao {user.firstName ?? therapist.name.split(" ")[1] ?? user.email}
          </h1>
          <p className="text-muted-foreground">
            {new Intl.DateTimeFormat("it-IT", {
              weekday: "long",
              day: "numeric",
              month: "long",
            }).format(new Date())}
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
          <span className="h-2 w-2 rounded-full bg-primary" />
          Attivo sulla piattaforma
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <CardDescription>Sedute oggi</CardDescription>
            <CardTitle className="text-3xl font-semibold tracking-tight">
              {today.length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <CardDescription>Pazienti attivi</CardDescription>
            <CardTitle className="text-3xl font-semibold tracking-tight">
              {activePatients}
            </CardTitle>
          </CardHeader>
          {pendingPatients.length > 0 && (
            <CardContent className="text-xs text-muted-foreground">
              + {pendingPatients.length} in valutazione
            </CardContent>
          )}
        </Card>
        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <CardDescription>Incasso mese (netto)</CardDescription>
            <CardTitle className="text-3xl font-semibold tracking-tight">
              {formatCurrency(netThisMonth)}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            {delta >= 0 ? (
              <span className="inline-flex items-center gap-1 text-primary">
                <TrendingUp className="h-3 w-3" />+{delta}%
              </span>
            ) : (
              <span>{delta}%</span>
            )}{" "}
            vs mese scorso
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <CardDescription>Sedute mese</CardDescription>
            <CardTitle className="text-3xl font-semibold tracking-tight">
              {thisMonth.length}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Bonifico il 5 del prossimo mese
          </CardContent>
        </Card>
      </div>

      {next && nextPatient && (
        <Card className="relative overflow-hidden border-primary/20 bg-primary text-primary-foreground">
          <div
            aria-hidden
            className="absolute -right-16 -top-16 h-60 w-60 rounded-full bg-primary-foreground/10 blur-3xl"
          />
          <CardHeader className="relative">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/70">
              Prossima seduta
            </p>
            <CardTitle className="mt-1 text-2xl tracking-tight">
              {imminent
                ? `Tra ${minutesUntil(next.startsAt)} minuti`
                : formatTime(next.startsAt)}
            </CardTitle>
            <CardDescription className="text-primary-foreground/80">
              Con {nextPatient.firstName} {nextPatient.lastName} · 50 min
            </CardDescription>
          </CardHeader>
          <CardContent className="relative flex flex-wrap items-center gap-2">
            {next.meetUrl && (
              <a
                href={next.meetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({
                  variant: "secondary",
                  className:
                    "bg-primary-foreground text-primary hover:bg-primary-foreground/90",
                })}
              >
                <Video className="mr-1 h-4 w-4" />
                {imminent ? "Entra nella seduta" : "Apri link Meet"}
              </a>
            )}
            <Link
              href={`/pro/pazienti/${next.patientId}`}
              className={buttonVariants({
                variant: "ghost",
                className:
                  "text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground",
              })}
            >
              Vai al paziente
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base">Oggi in agenda</CardTitle>
              <CardDescription>
                {today.length === 0
                  ? "Nessuna seduta in programma oggi."
                  : `${today.length} ${today.length === 1 ? "seduta" : "sedute"} oggi`}
              </CardDescription>
            </div>
            <Link
              href="/pro/agenda"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Tutta l&apos;agenda →
            </Link>
          </CardHeader>
          {today.length > 0 && (
            <CardContent className="space-y-2">
              {today.map((b) => {
                const pt = patients.find((p) => p.id === b.patientId);
                return (
                  <div
                    key={b.id}
                    className="flex items-center justify-between rounded-lg border border-border/60 px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {pt?.initials}
                      </span>
                      <div>
                        <p className="text-sm font-medium">
                          {pt?.firstName} {pt?.lastName}
                        </p>
                        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatTime(b.startsAt)} · 50 min
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {b.meetUrl && (
                        <a
                          href={b.meetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={buttonVariants({ size: "sm", variant: "outline" })}
                        >
                          Meet
                        </a>
                      )}
                      <Link
                        href={`/pro/pazienti/${b.patientId}`}
                        className={buttonVariants({ size: "sm" })}
                      >
                        Apri
                      </Link>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          )}
        </Card>

        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-start gap-3 space-y-0">
            <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-primary/10 text-primary">
              <UserPlus className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <CardTitle className="text-base">Nuovi pazienti</CardTitle>
              <CardDescription>
                {pendingPatients.length === 0
                  ? "Nessuno in valutazione al momento."
                  : `${pendingPatients.length} in attesa di prima seduta.`}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {pendingPatients.map((p) => (
              <Link
                key={p.id}
                href={`/pro/pazienti/${p.id}`}
                className="flex items-center justify-between rounded-lg border border-border/60 px-4 py-3 transition hover:border-primary/40"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                    {p.initials}
                  </span>
                  <div>
                    <p className="text-sm font-medium">
                      {p.firstName} {p.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {p.city ?? "—"} ·{" "}
                      {p.birthYear
                        ? `${new Date().getFullYear() - p.birthYear} anni`
                        : "età ignota"}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary">Nuovo</Badge>
              </Link>
            ))}
            <Link
              href="/pro/pazienti"
              className="block text-center text-sm text-muted-foreground hover:text-foreground"
            >
              Tutti i pazienti →
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function EmptyProDashboard() {
  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle>Profilo non ancora collegato</CardTitle>
        <CardDescription>
          Il tuo account è autenticato ma non è ancora associato a un profilo
          sessuologo. Contatta l&apos;admin a candidature@sessualmente.it per
          completare l&apos;onboarding.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

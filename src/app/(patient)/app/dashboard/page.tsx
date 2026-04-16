import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Clock,
  Video,
  Sparkles,
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
import { requireUser, displayName } from "@/lib/auth";
import {
  getMyBookings,
  getMyNextBooking,
  getTherapistById,
  listActiveTherapists,
  formatDate,
  formatTime,
  minutesUntil,
} from "@/lib/queries";

export const metadata = { title: "La tua area" };

export default async function PatientDashboardPage() {
  const user = await requireUser("patient");
  const [next, allBookings, therapists] = await Promise.all([
    getMyNextBooking(user.id),
    getMyBookings(user.id),
    listActiveTherapists(),
  ]);
  const nextTherapist = next ? await getTherapistById(next.therapistId) : null;
  const past = allBookings.filter((b) => b.status === "completed");
  const pastTherapists = await Promise.all(
    past.slice(0, 3).map((b) => getTherapistById(b.therapistId))
  );
  const suggested = therapists
    .filter((t) => !next || t.id !== next.therapistId)
    .slice(0, 2);
  const imminent = next && minutesUntil(next.startsAt) <= 30;
  const firstName = user.firstName ?? displayName(user).split(" ")[0];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Ciao {firstName} 👋
        </h1>
        <p className="text-muted-foreground">
          Ecco dove sei oggi. Ogni cosa è nella tua area riservata.
        </p>
      </div>

      {next && nextTherapist ? (
        <Card className="relative overflow-hidden border-primary/20 bg-primary text-primary-foreground">
          <div
            aria-hidden
            className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary-foreground/10 blur-3xl"
          />
          <CardHeader className="relative">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/70">
              Prossima seduta
            </p>
            <CardTitle className="mt-1 text-2xl tracking-tight">
              {imminent
                ? `Tra ${minutesUntil(next.startsAt)} minuti`
                : formatDate(next.startsAt)}
            </CardTitle>
            <CardDescription className="text-primary-foreground/80">
              Con {nextTherapist.name} · {nextTherapist.role}
            </CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <div className="flex flex-wrap gap-4 text-sm">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" />
                {formatDate(next.startsAt)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {formatTime(next.startsAt)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Video className="h-4 w-4" />
                Google Meet
              </span>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {next.meetUrl && (
                <a
                  href={next.meetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({
                    variant: imminent ? "default" : "secondary",
                    className: imminent
                      ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                      : "",
                  })}
                >
                  {imminent ? "Entra nella seduta" : "Apri link Meet"}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              )}
              <Link
                href={`/app/sedute`}
                className={buttonVariants({
                  variant: "ghost",
                  className:
                    "text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground",
                })}
              >
                Modifica o annulla
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>Non hai sedute in programma</CardTitle>
            <CardDescription>
              Prenota la tua prossima seduta con il sessuologo che preferisci.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/app/prenota" className={buttonVariants()}>
              Prenota una seduta
            </Link>
          </CardContent>
        </Card>
      )}

      <div>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              Selezionati per te
            </p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight">
              Sessuologi in linea con il tuo questionario
            </h2>
          </div>
          <Link
            href="/app/prenota"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Vedi tutti →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {suggested.map((t) => (
            <Card key={t.slug} className="border-border/60">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {t.initials}
                  </div>
                  <div>
                    <CardTitle className="text-base">{t.name}</CardTitle>
                    <CardDescription className="text-xs">
                      {t.role}
                      {t.experience ? ` · ${t.experience}` : ""}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {t.bio}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {t.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Link
                  href={`/app/prenota/${t.slug}`}
                  className={`${buttonVariants({ variant: "outline", size: "sm" })} w-full`}
                >
                  Vedi profilo e prenota
                  <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Le tue sedute passate</CardTitle>
            <CardDescription>
              {past.length === 0
                ? "Ancora nessuna seduta alle spalle."
                : `${past.length} sedute completate`}
            </CardDescription>
          </div>
          {past.length > 0 && (
            <Link
              href="/app/sedute"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Tutte →
            </Link>
          )}
        </CardHeader>
        {past.length > 0 && (
          <CardContent className="space-y-2">
            {past.slice(0, 3).map((b, i) => {
              const t = pastTherapists[i];
              return (
                <div
                  key={b.id}
                  className="flex items-center justify-between rounded-lg border border-border/60 px-4 py-3 text-sm"
                >
                  <div>
                    <p className="font-medium">{t?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(b.startsAt)} · {formatTime(b.startsAt)}
                    </p>
                  </div>
                  <Badge variant="secondary">Completata</Badge>
                </div>
              );
            })}
          </CardContent>
        )}
      </Card>

      <Card className="border-dashed bg-muted/30">
        <CardHeader className="flex flex-row items-start gap-4 space-y-0">
          <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-primary/10 text-primary">
            <Sparkles className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <CardTitle className="text-base">Vuoi cambiare sessuologo?</CardTitle>
            <CardDescription>
              Nessun problema, puoi farlo in qualsiasi momento. Senza spiegare
              perché.
            </CardDescription>
          </div>
          <Link
            href="/app/prenota"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            Esplora altri specialisti
          </Link>
        </CardHeader>
      </Card>
    </div>
  );
}

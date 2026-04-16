import Link from "next/link";
import { CalendarDays, Clock, Video } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { requireUser } from "@/lib/auth";
import {
  getMyTherapistRecord,
  getProBookings,
  getProPatients,
  formatDate,
  formatTime,
  type Booking,
  type ProPatient,
} from "@/lib/queries";

export const metadata = { title: "Agenda" };

export default async function ProAgendaPage() {
  const user = await requireUser("pro");
  const therapist = await getMyTherapistRecord(user.id);
  if (!therapist) return <p className="text-muted-foreground">Profilo non collegato.</p>;

  const [bookings, patients] = await Promise.all([
    getProBookings(therapist.id),
    getProPatients(therapist.id),
  ]);
  const byPatient = new Map(patients.map((p) => [p.id, p]));

  const now = Date.now();
  const upcoming = bookings
    .filter((b) => b.status === "scheduled" && new Date(b.startsAt).getTime() >= now)
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
  const past = bookings
    .filter((b) => b.status === "completed" || new Date(b.startsAt).getTime() < now)
    .sort((a, b) => new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime());

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Agenda</h1>
          <p className="text-muted-foreground">
            Le tue sedute prenotate, passate e future.
          </p>
        </div>
        <a
          href={
            therapist.calComUsername
              ? `https://cal.com/${therapist.calComUsername}`
              : "https://cal.com"
          }
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          Gestisci disponibilità su Cal.com
        </a>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">
            Prossime ({upcoming.length})
          </TabsTrigger>
          <TabsTrigger value="past">Passate ({past.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          {upcoming.length === 0 ? (
            <EmptyAgenda />
          ) : (
            <div className="space-y-3">
              {groupByDay(upcoming).map(([day, items]) => (
                <div key={day} className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {day}
                  </p>
                  {items.map((b) => (
                    <BookingRow
                      key={b.id}
                      booking={b}
                      patient={byPatient.get(b.patientId) ?? null}
                      variant="upcoming"
                    />
                  ))}
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-6 space-y-3">
          {past.length === 0 ? (
            <p className="text-sm text-muted-foreground">Ancora nessuna seduta passata.</p>
          ) : (
            past.map((b) => (
              <BookingRow
                key={b.id}
                booking={b}
                patient={byPatient.get(b.patientId) ?? null}
                variant="past"
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function groupByDay(bookings: Booking[]): [string, Booking[]][] {
  const map = new Map<string, Booking[]>();
  for (const b of bookings) {
    const key = formatDate(b.startsAt);
    map.set(key, [...(map.get(key) ?? []), b]);
  }
  return Array.from(map.entries());
}

function BookingRow({
  booking,
  patient,
  variant,
}: {
  booking: Booking;
  patient: ProPatient | null;
  variant: "upcoming" | "past";
}) {
  return (
    <Card className="border-border/60">
      <CardContent className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {patient?.initials ?? "??"}
          </div>
          <div>
            <p className="text-sm font-semibold">
              {patient ? `${patient.firstName ?? "?"} ${patient.lastName ?? ""}` : "Paziente"}
            </p>
            <p className="text-xs text-muted-foreground">
              {patient?.totalSessions
                ? `${patient.totalSessions} sedute completate`
                : "Prima seduta"}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5" />
            {formatDate(booking.startsAt)}
          </span>
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            {formatTime(booking.startsAt)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {variant === "upcoming" ? (
            <>
              {booking.meetUrl && (
                <a
                  href={booking.meetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({ size: "sm" })}
                >
                  <Video className="mr-1 h-3.5 w-3.5" />
                  Meet
                </a>
              )}
              {patient && (
                <Link
                  href={`/pro/pazienti/${patient.id}`}
                  className={buttonVariants({ size: "sm", variant: "outline" })}
                >
                  Paziente
                </Link>
              )}
            </>
          ) : (
            <>
              <Badge variant="secondary">Completata</Badge>
              {patient && (
                <Link
                  href={`/pro/pazienti/${patient.id}`}
                  className={buttonVariants({ size: "sm", variant: "outline" })}
                >
                  Paziente
                </Link>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyAgenda() {
  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle className="text-base">Agenda libera</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Nessuna seduta prenotata. Controlla che la tua disponibilità su Cal.com
        sia aggiornata.
      </CardContent>
    </Card>
  );
}

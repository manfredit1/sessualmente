import Link from "next/link";
import { CalendarDays, Clock, MoreHorizontal, Video } from "lucide-react";
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
  getMyBookings,
  getTherapistById,
  formatDate,
  formatTime,
  type Booking,
  type Therapist,
} from "@/lib/queries";

export const metadata = { title: "Le mie sedute" };

export default async function SedutePage() {
  const user = await requireUser("patient");
  const bookings = await getMyBookings(user.id);
  const therapistIds = Array.from(new Set(bookings.map((b) => b.therapistId)));
  const therapists = await Promise.all(
    therapistIds.map((id) => getTherapistById(id))
  );
  const byId = new Map(
    therapists.filter(Boolean).map((t) => [t!.id, t!] as const)
  );

  const now = Date.now();
  const upcoming = bookings.filter(
    (b) => b.status === "scheduled" && new Date(b.startsAt).getTime() >= now
  );
  const past = bookings.filter(
    (b) => b.status === "completed" || new Date(b.startsAt).getTime() < now
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Le mie sedute</h1>
        <p className="text-muted-foreground">Prossime, passate e storico.</p>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">
            Prossime ({upcoming.length})
          </TabsTrigger>
          <TabsTrigger value="past">Passate ({past.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="mt-6 space-y-3">
          {upcoming.length === 0 ? (
            <EmptyState
              title="Non hai sedute in arrivo"
              description="Prenotane una per continuare il tuo percorso."
            />
          ) : (
            upcoming.map((b) => (
              <BookingRow
                key={b.id}
                booking={b}
                therapist={byId.get(b.therapistId) ?? null}
                variant="upcoming"
              />
            ))
          )}
        </TabsContent>
        <TabsContent value="past" className="mt-6 space-y-3">
          {past.length === 0 ? (
            <EmptyState
              title="Ancora nessuna seduta alle spalle"
              description="Dopo la prima, qui trovi lo storico."
            />
          ) : (
            past.map((b) => (
              <BookingRow
                key={b.id}
                booking={b}
                therapist={byId.get(b.therapistId) ?? null}
                variant="past"
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function BookingRow({
  booking,
  therapist,
  variant,
}: {
  booking: Booking;
  therapist: Therapist | null;
  variant: "upcoming" | "past";
}) {
  return (
    <Card className="border-border/60">
      <CardContent className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            {therapist?.initials ?? "??"}
          </div>
          <div>
            <p className="font-semibold">{therapist?.name}</p>
            <p className="text-xs text-muted-foreground">
              {therapist?.approach} · {therapist?.role}
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
                  Link Meet
                </a>
              )}
              <button
                type="button"
                className={buttonVariants({ size: "sm", variant: "outline" })}
                title="Altre azioni"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <Badge variant="secondary">Completata</Badge>
              {therapist && (
                <Link
                  href={`/app/prenota/${therapist.slug}`}
                  className={buttonVariants({ size: "sm", variant: "outline" })}
                >
                  Ri-prenota
                </Link>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
        <Link
          href="/app/prenota"
          className={`mt-4 ${buttonVariants({ variant: "outline", size: "sm" })}`}
        >
          Prenota una seduta
        </Link>
      </CardContent>
    </Card>
  );
}

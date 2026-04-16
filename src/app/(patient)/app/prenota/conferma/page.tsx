import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CalendarDays,
  Clock,
  CreditCard,
  Mail,
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
import { formatCurrency, getTherapistBySlug } from "@/lib/queries";

export const metadata = { title: "Conferma prenotazione" };

export default async function ConfermaPage({
  searchParams,
}: {
  searchParams: Promise<{ therapist?: string; slot?: string }>;
}) {
  const { therapist: therapistSlug, slot } = await searchParams;
  if (!therapistSlug || !slot) notFound();
  const t = await getTherapistBySlug(therapistSlug);
  if (!t) notFound();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          Conferma prenotazione
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
          Un ultimo passaggio.
        </h1>
        <p className="mt-2 text-muted-foreground">
          Controlla i dettagli e procedi con il pagamento. Prenotazione
          confermata solo dopo il pagamento.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base">Dettaglio seduta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 text-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                {t.initials}
              </div>
              <div>
                <p className="font-semibold">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>

            <div className="space-y-2 rounded-xl border border-border/60 bg-muted/30 p-4">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{slot}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                50 minuti
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Video className="h-4 w-4" />
                Google Meet, link via email
              </div>
            </div>

            <div className="rounded-xl border border-dashed border-border/60 p-4 text-xs text-muted-foreground">
              <p className="font-medium text-foreground">Cosa succede dopo</p>
              <ul className="mt-2 list-disc space-y-1 pl-4">
                <li>Completi il pagamento con Stripe (test mode nell&apos;MVP).</li>
                <li>Ricevi email di conferma con link Meet e ICS.</li>
                <li>Cancellazione gratuita fino a 24h prima.</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="h-fit border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Riepilogo pagamento</CardTitle>
            <CardDescription>
              Paghi ora solo la seduta che hai appena scelto.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Seduta singola</span>
              <span>{formatCurrency(t.pricePerSession)}</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Durata</span>
              <span>50 min</span>
            </div>
            <div className="mt-2 flex items-baseline justify-between border-t border-border/60 pt-3">
              <span className="font-semibold">Totale</span>
              <span className="text-xl font-semibold tracking-tight">
                {formatCurrency(t.pricePerSession)}
              </span>
            </div>

            <Link
              href={`/app/prenota/successo?therapist=${t.slug}&slot=${encodeURIComponent(slot)}`}
              className={`${buttonVariants({ className: "w-full" })} mt-4`}
            >
              <CreditCard className="mr-1 h-4 w-4" />
              Paga {formatCurrency(t.pricePerSession)} e prenota
            </Link>
            <p className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
              <Mail className="h-3 w-3" />
              Conferma via email entro 30 secondi
            </p>
            <Link
              href={`/app/prenota/${t.slug}`}
              className={`${buttonVariants({ variant: "ghost", size: "sm" })} w-full`}
            >
              Cambia slot
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

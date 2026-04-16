import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarDays, CheckCircle2, Mail } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { getTherapistBySlug } from "@/lib/queries";

export const metadata = {
  title: "Prenotazione confermata",
  robots: { index: false },
};

export default async function SuccessoPage({
  searchParams,
}: {
  searchParams: Promise<{ therapist?: string; slot?: string }>;
}) {
  const { therapist: therapistSlug, slot } = await searchParams;
  if (!therapistSlug || !slot) notFound();
  const t = await getTherapistBySlug(therapistSlug);
  if (!t) notFound();

  return (
    <div className="mx-auto max-w-xl text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <CheckCircle2 className="h-8 w-8" />
      </div>
      <p className="text-xs font-semibold uppercase tracking-wider text-primary">
        Prenotazione confermata
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        Ti aspettiamo.
      </h1>
      <p className="mt-4 text-muted-foreground">
        La seduta con{" "}
        <span className="font-medium text-foreground">{t.name}</span> è fissata
        per <span className="font-medium text-foreground">{slot}</span>.
      </p>

      <div className="mt-8 rounded-2xl border border-border/60 bg-card p-6 text-left shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-primary/10 text-primary">
            <Mail className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold">Email in arrivo</p>
            <p className="text-xs text-muted-foreground">
              Link Google Meet e file calendario (ICS) in allegato.
            </p>
          </div>
        </div>
        <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
          <li className="flex items-start gap-3">
            <CalendarDays className="mt-0.5 h-4 w-4 flex-none text-primary" />
            Aggiungi la seduta al tuo calendario via il file ICS.
          </li>
          <li className="flex items-start gap-3">
            <ArrowRight className="mt-0.5 h-4 w-4 flex-none text-primary" />
            5 minuti prima ti arriva un reminder con il link Meet.
          </li>
        </ul>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/app/sedute" className={buttonVariants()}>
          Vedi le mie sedute
        </Link>
        <Link
          href="/app/dashboard"
          className={buttonVariants({ variant: "outline" })}
        >
          Torna alla home
        </Link>
      </div>
    </div>
  );
}

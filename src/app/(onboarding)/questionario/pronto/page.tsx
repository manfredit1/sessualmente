import Link from "next/link";
import { CheckCircle2, Mail } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export const metadata = {
  title: "Quasi fatto",
  description:
    "Grazie per aver risposto. Controlla la tua email per continuare.",
  robots: { index: false },
};

export default function ProntoPage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-4 py-16 text-center sm:px-6 sm:py-24">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <CheckCircle2 className="h-8 w-8" />
      </div>
      <p className="text-xs font-semibold uppercase tracking-wider text-primary">
        Grazie
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
        Abbiamo letto le tue risposte.
      </h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        Ti abbiamo inviato un&apos;email con un link per accedere alla tua area.
        Dentro troverai la selezione di sessuologi pensata per te.
      </p>

      <div className="mt-10 w-full max-w-md rounded-2xl border border-border/60 bg-card p-6 text-left shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-primary/10 text-primary">
            <Mail className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold">Cosa succede adesso</p>
            <p className="text-xs text-muted-foreground">
              Di solito arriva entro un minuto.
            </p>
          </div>
        </div>
        <ol className="mt-5 space-y-3 text-sm text-muted-foreground">
          <li className="flex gap-3">
            <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
              1
            </span>
            Controlla la tua casella (anche lo spam, per sicurezza).
          </li>
          <li className="flex gap-3">
            <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
              2
            </span>
            Clicca sul link che trovi nell&apos;email per entrare nella tua area.
          </li>
          <li className="flex gap-3">
            <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
              3
            </span>
            Scegli il sessuologo con cui ti senti più a tuo agio e prenota la
            prima seduta.
          </li>
        </ol>
      </div>

      <p className="mt-8 text-xs text-muted-foreground">
        Non hai ricevuto nulla?{" "}
        <Link
          href="/questionario"
          className="underline underline-offset-4 hover:text-foreground"
        >
          Riprova il questionario
        </Link>{" "}
        o scrivici a{" "}
        <a
          href="mailto:aiuto@sessualmente.it"
          className="underline underline-offset-4 hover:text-foreground"
        >
          aiuto@sessualmente.it
        </a>
        .
      </p>

      <Link
        href="/"
        className={`mt-10 ${buttonVariants({ variant: "outline" })}`}
      >
        Torna alla home
      </Link>
    </div>
  );
}

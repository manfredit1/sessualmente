import Link from "next/link";
import { Check } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata = {
  title: "Prezzi",
  description:
    "65 € a seduta, 50 minuti, nessun abbonamento. Paghi solo quello che usi.",
};

const includes = [
  "50 minuti di seduta online, uno a uno",
  "Sessuologo con titolo e formazione certificata",
  "Videochiamata Google Meet, nessun software da installare",
  "Area riservata con storico, fatture e ri-prenotazione in un click",
  "Cancellazione gratuita fino a 24 ore prima",
  "Assistenza email rapida se qualcosa non va",
];

export default function PrezziPage() {
  return (
    <>
      <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-24">
        <p className="text-sm font-medium uppercase tracking-wider text-primary">
          Prezzi
        </p>
        <h1 className="mt-3 text-4xl font-medium tracking-tight sm:text-5xl">
          Un prezzo semplice. Nient’altro.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
          Niente pacchetti, niente abbonamenti, niente piccola stampa.
          Paghi solo la seduta che fai, quando la fai.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-24 sm:px-6">
        <Card className="border-border/60 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              Seduta singola
            </CardTitle>
            <CardDescription>Pay-per-session, senza vincoli</CardDescription>
            <div className="mt-4 flex items-baseline justify-center gap-2">
              <span className="text-6xl font-medium">65</span>
              <span className="text-xl text-muted-foreground">€</span>
            </div>
            <p className="text-sm text-muted-foreground">per seduta da 50 min</p>
          </CardHeader>
          <CardContent>
            <ul className="mx-auto max-w-md space-y-3">
              {includes.map((item) => (
                <li key={item} className="flex gap-3 text-sm">
                  <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex justify-center">
              <Link
                href="/questionario"
                className={buttonVariants({ size: "lg" })}
              >
                Inizia il questionario
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="mt-12 grid gap-6 rounded-2xl border bg-muted/30 p-8 md:grid-cols-2">
          <div>
            <h3 className="text-xl font-medium">
              Perché questo prezzo?
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              65 € è in linea con la media del mercato italiano della terapia
              online (Unobravo, Serenis), ed è il prezzo minimo sostenibile per
              garantire ai nostri sessuologi un compenso dignitoso senza
              costringerli ad aderire a pacchetti o listini scontati.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-medium">
              Serve una fattura?
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Ogni seduta genera una fattura in PDF scaricabile dalla tua area
              riservata. Le sedute psicologiche/sessuologiche sono detraibili al
              19 % in dichiarazione dei redditi, se soddisfano i requisiti
              previsti.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

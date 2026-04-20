import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Prezzi",
  description:
    "Il primo colloquio con ciascun terapista è gratuito. Poi 65 € a seduta, 50 minuti, nessun abbonamento.",
};

const firstCallIncludes = [
  "Conosci il terapista senza impegno",
  "Capite insieme se è il match giusto per te",
  "Nessun obbligo di prenotare una seduta dopo",
  "Se cambi sessuologo, il primo colloquio è di nuovo gratuito",
];

const sessionIncludes = [
  "50 minuti di seduta online, uno a uno",
  "Sessuologo con titolo e formazione certificata",
  "Videochiamata Google Meet, nessun software da installare",
  "Area riservata con storico, fatture e ri-prenotazione",
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
          Il primo colloquio è gratis. Sempre.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
          Con ciascun sessuologo della piattaforma hai diritto a un primo
          colloquio gratuito. Serve a capire se è la persona giusta per te,
          senza impegno. Decidi dopo se continuare.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="relative flex flex-col border-primary/30 bg-primary/5">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="bg-primary text-primary-foreground">
                <Sparkles className="mr-1 h-3 w-3" />
                Primo incontro
              </Badge>
            </div>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Primo colloquio</CardTitle>
              <CardDescription>Conoscitivo, senza impegno</CardDescription>
              <div className="mt-4 flex items-baseline justify-center gap-2">
                <span className="text-6xl font-medium">0</span>
                <span className="text-xl text-muted-foreground">€</span>
              </div>
              <p className="text-sm text-muted-foreground">
                gratuito con ciascun terapista
              </p>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="mx-auto max-w-md space-y-3">
                {firstCallIncludes.map((item) => (
                  <li key={item} className="flex gap-3 text-sm">
                    <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-primary/15 text-primary">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="flex flex-col border-border/60">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Seduta</CardTitle>
              <CardDescription>
                Dalla seconda in poi, pay-per-session
              </CardDescription>
              <div className="mt-4 flex items-baseline justify-center gap-2">
                <span className="text-6xl font-medium">65</span>
                <span className="text-xl text-muted-foreground">€</span>
              </div>
              <p className="text-sm text-muted-foreground">per seduta da 50 min</p>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="mx-auto max-w-md space-y-3">
                {sessionIncludes.map((item) => (
                  <li key={item} className="flex gap-3 text-sm">
                    <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            href="/questionario"
            className={buttonVariants({ size: "lg" })}
          >
            Inizia il questionario
          </Link>
        </div>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Niente carta di credito richiesta per il primo colloquio.
        </p>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-24 sm:px-6">
        <div className="grid gap-6 rounded-2xl border bg-muted/30 p-8 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-medium">Perché il primo è gratis?</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Trovare il sessuologo giusto è la variabile più importante di un
              percorso. Lo saprai solo parlando con lui. Rimuoviamo la barriera
              economica per ridurre al minimo il rischio di un match sbagliato.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium">E se cambio sessuologo?</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Il primo colloquio è gratuito con ciascun professionista. Se dopo
              il primo incontro senti che non è la persona giusta, ne provi un
              altro senza costi. Puoi farlo in qualsiasi momento.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium">Perché 65 € a seduta?</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              È in linea con la media del mercato italiano della terapia online
              ed è il prezzo minimo sostenibile per garantire ai nostri
              sessuologi un compenso dignitoso, senza listini scontati o
              pacchetti forzati.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 rounded-2xl border bg-muted/30 p-8 md:grid-cols-2">
          <div>
            <h3 className="text-lg font-medium">Serve una fattura?</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Ogni seduta genera una fattura in PDF scaricabile dalla tua area
              riservata. Le sedute psicologiche/sessuologiche sono detraibili al
              19% in dichiarazione dei redditi, se rispettano i requisiti
              previsti.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium">Niente abbonamenti</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Nessun pacchetto, nessun vincolo mensile. Prenoti una seduta alla
              volta quando ti serve. Se fai una pausa di 3 mesi, non paghi
              nulla nel frattempo.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

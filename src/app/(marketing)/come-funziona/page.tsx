import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export const metadata = {
  title: "Come funziona",
  description:
    "In tre passi semplici: questionario, scelta dello specialista, prima seduta online. Nessun impegno iniziale.",
};

const steps = [
  {
    number: "01",
    title: "Racconta chi sei, in forma anonima.",
    body: "Un questionario di 10 domande, dura circa 3 minuti. Ci aiuta a capire cosa stai cercando: un tema di coppia, un dubbio personale, qualcosa che ti trascini da tempo. Nessuna domanda invasiva, nessun obbligo di dare la tua email fino alla fine.",
  },
  {
    number: "02",
    title: "Ti proponiamo i sessuologi adatti.",
    body: "Sulla base delle tue risposte, ti mostriamo 3–5 specialisti con la formazione giusta per te. Leggi la bio, l’approccio, la disponibilità. Scegli quello con cui ti senti più a tuo agio — e se non lo trovi subito, nessun problema: possiamo proporti altri nomi.",
  },
  {
    number: "03",
    title: "Prenoti e parli, dal tuo divano.",
    body: "Scegli uno slot dall’agenda online del sessuologo, paghi solo la seduta che farai (65 €), e ricevi via email il link per la videochiamata. La seduta dura 50 minuti su Google Meet. Nessun software da installare.",
  },
  {
    number: "04",
    title: "Cambi, aggiungi, riduci. Sempre tu al comando.",
    body: "Dopo la prima seduta decidi tu: continuare con lo stesso sessuologo, cambiare, fare una pausa. Niente pacchetti forzati, niente abbonamento, nessuna penale. Paghi una seduta alla volta, esattamente quando serve.",
  },
];

export default function ComeFunzionaPage() {
  return (
    <>
      <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-24">
        <p className="text-sm font-medium uppercase tracking-wider text-primary">
          Come funziona
        </p>
        <h1 className="mt-3 text-4xl font-medium tracking-tight sm:text-5xl">
          Quattro passaggi semplici, zero complicazioni.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
          Sessualmente è pensata per abbassare la soglia d’ingresso: niente sale
          d’attesa, niente pagamenti complicati, nessun vincolo.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-24 sm:px-6">
        <ol className="flex flex-col gap-10">
          {steps.map((step) => (
            <li key={step.number} className="flex gap-6">
              <span className="text-4xl font-medium text-primary/40">
                {step.number}
              </span>
              <div className="flex-1 border-l border-border/60 pl-6">
                <h2 className="text-2xl font-medium">
                  {step.title}
                </h2>
                <p className="mt-3 text-muted-foreground">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-16 flex flex-col items-center gap-4 rounded-2xl border bg-muted/30 p-10 text-center">
          <h3 className="text-2xl font-medium">
            Pronto a iniziare?
          </h3>
          <p className="max-w-md text-muted-foreground">
            Il questionario è anonimo e dura meno di un caffè. Ti chiediamo
            l’email solo alla fine, se decidi di andare avanti.
          </p>
          <Link
            href="/questionario"
            className={buttonVariants({ size: "lg" })}
          >
            Inizia il questionario
          </Link>
        </div>
      </section>
    </>
  );
}

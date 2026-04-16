import Link from "next/link";
import {
  CalendarCheck,
  HeartHandshake,
  LineChart,
  Receipt,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata = {
  title: "Lavora con noi",
  description:
    "Sei un sessuologo qualificato? Unisciti alla rete di Sessualmente: pazienti già qualificati, tecnologia pronta, compenso trasparente.",
};

const benefits = [
  {
    icon: HeartHandshake,
    title: "Pazienti già qualificati",
    body: "Arrivano dopo un questionario mirato. Meno dispersione, più continuità di percorso.",
  },
  {
    icon: CalendarCheck,
    title: "Agenda fatta per te",
    body: "Cal.com integrato, reminder automatici, nessuna chiamata di segreteria.",
  },
  {
    icon: Receipt,
    title: "Fatturazione senza stress",
    body: "Il paziente paga sulla piattaforma, a te arriva il bonifico ogni mese con riepilogo.",
  },
  {
    icon: ShieldCheck,
    title: "Compliance gestita da noi",
    body: "GDPR, server EU, DPA, informativa dati sanitari. Tu ti concentri sulle sedute.",
  },
  {
    icon: Sparkles,
    title: "Nessun costo di iscrizione",
    body: "Tratteniamo una fee sulla seduta solo se prendi pazienti tramite noi.",
  },
  {
    icon: LineChart,
    title: "Dashboard reale",
    body: "Vedi agenda, pazienti, incassi e retention in un posto solo.",
  },
];

const requirements = [
  "Laurea in Psicologia o Medicina",
  "Specializzazione in sessuologia clinica riconosciuta (FISS, CIS, AISPA o equivalente)",
  "Almeno 3 anni di pratica supervisionata",
  "Iscrizione all’ordine professionale e P.IVA attiva",
  "Disponibilità minima di 3 ore a settimana in slot serali o weekend",
];

export default function LavoraConNoiPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--color-accent)_0%,transparent_55%)] opacity-60"
        />
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-28">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">
            Per sessuologi
          </p>
          <h1 className="mt-3 text-4xl font-medium tracking-tight sm:text-5xl">
            Fai il lavoro che ami, senza pensare al resto.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Cerchiamo sessuologi qualificati per costruire insieme la prima
            piattaforma italiana verticale sulla sessuologia. Pazienti
            qualificati, tecnologia pronta, compenso trasparente.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/candidatura"
              className={buttonVariants({ size: "lg" })}
            >
              Candidati ora
            </Link>
            <Link
              href="#requisiti"
              className={buttonVariants({ size: "lg", variant: "outline" })}
            >
              Vedi i requisiti
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-medium tracking-tight sm:text-4xl">
            Cosa offriamo
          </h2>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {benefits.map(({ icon: Icon, title, body }) => (
            <Card key={title} className="border-border/60">
              <CardHeader>
                <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <CardTitle className="text-lg">{title}</CardTitle>
                <CardDescription>{body}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section
        id="requisiti"
        className="border-y border-border/60 bg-muted/40"
      >
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
          <h2 className="text-3xl font-medium tracking-tight sm:text-4xl">
            Requisiti
          </h2>
          <p className="mt-4 text-muted-foreground">
            Non accettiamo tutti perché la fiducia dei pazienti dipende dalla
            qualità di chi sta dall’altra parte dello schermo.
          </p>
          <ul className="mt-8 space-y-3">
            {requirements.map((req) => (
              <li
                key={req}
                className="flex gap-3 rounded-xl border bg-background p-4"
              >
                <span className="mt-1 h-2 w-2 flex-none rounded-full bg-primary" />
                <span className="text-sm">{req}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <h2 className="text-3xl font-medium tracking-tight sm:text-4xl">
          Come candidarsi
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          In questa fase MVP valutiamo ogni candidatura personalmente.
          Scrivici un’email con CV, specializzazione e un paragrafo sul tuo
          approccio clinico. Ti rispondiamo entro 5 giorni lavorativi.
        </p>
        <Link
          href="/candidatura"
          className={`mt-8 ${buttonVariants({ size: "lg" })}`}
        >
          Vai al form di candidatura
        </Link>
      </section>
    </>
  );
}

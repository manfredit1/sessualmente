import Link from "next/link";
import {
  ArrowRight,
  Heart,
  Lock,
  ShieldCheck,
  Sparkles,
  Users,
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
import { HeroMockup } from "@/components/marketing/hero-mockup";
import { PhonePreview } from "@/components/marketing/phone-preview";

const steps = [
  {
    title: "Racconta chi sei",
    body: "Rispondi a un questionario di 3 minuti. Ci aiuta a capire cosa cerchi, senza giudizio e senza etichette.",
  },
  {
    title: "Scegli lo specialista",
    body: "Ti proponiamo sessuologi con formazione e approccio adatti a te. Leggi le bio, scegli chi ti ispira fiducia.",
  },
  {
    title: "Parlane online",
    body: "Prenoti quando ti è comodo, paghi solo la seduta che fai, ti colleghi da casa in videochiamata riservata.",
  },
];

const benefits = [
  {
    icon: Lock,
    title: "Privacy reale",
    body: "Niente sala d’attesa. Email discrete, nessun dato clinico in chiaro, server in Europa.",
  },
  {
    icon: ShieldCheck,
    title: "Solo professionisti",
    body: "Sessuologi con titolo e formazione verificata. Non accettiamo tutti.",
  },
  {
    icon: Heart,
    title: "Zero giudizio",
    body: "Ogni tema è legittimo: coppia, desiderio, identità, dubbi, traumi. Sei al sicuro.",
  },
  {
    icon: Video,
    title: "Dove vuoi tu",
    body: "Sedute di 50 minuti su Google Meet. Solo un link, niente app da installare.",
  },
  {
    icon: Sparkles,
    title: "Paghi quando usi",
    body: "Nessun abbonamento, nessun vincolo. Una seduta alla volta.",
  },
  {
    icon: Users,
    title: "Anche in coppia",
    body: "Puoi prenotare per te o per la coppia. Decidi tu chi ti accompagna.",
  },
];

const faqs = [
  {
    q: "È davvero riservato?",
    a: "Sì. I dati sanitari vivono su server EU cifrati, non appaiono nelle email e sono accessibili solo a te e al tuo sessuologo.",
  },
  {
    q: "Quanto dura una seduta?",
    a: "50 minuti in videochiamata. Puoi prenotarne quante vuoi, senza minimi né abbonamenti.",
  },
  {
    q: "Posso cambiare sessuologo?",
    a: "Quando vuoi. Dalla tua area riservata scegli un altro specialista e riparti dalla prossima seduta.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,var(--color-accent)_0%,transparent_60%)]"
        />
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Sessuologia online · riservata · su misura
            </span>
            <h1 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Parla della tua sessualità con chi sa davvero ascoltarti.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Sessuologi qualificati, videosedute in totale privacy, zero
              giudizio. Rispondi a poche domande e scopri il percorso giusto
              per te.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/questionario"
                className={buttonVariants({ size: "lg" })}
              >
                Inizia il questionario
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
              <Link
                href="/come-funziona"
                className={buttonVariants({ size: "lg", variant: "outline" })}
              >
                Come funziona
              </Link>
            </div>
            <p className="mt-5 text-xs text-muted-foreground">
              3 minuti · nessun pagamento richiesto · email cifrata
            </p>
          </div>

          <div className="lg:pl-8">
            <HeroMockup />
          </div>
        </div>
      </section>

      {/* COME FUNZIONA */}
      <section className="border-y border-border/60 bg-muted/40">
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 py-24 sm:px-6 lg:grid-cols-[1fr_1.1fr]">
          <div className="order-2 lg:order-1">
            <PhonePreview />
          </div>
          <div className="order-1 lg:order-2">
            <p className="text-sm font-medium uppercase tracking-wider text-primary">
              Come funziona
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Dal primo click alla prima seduta, in meno di un pomeriggio.
            </h2>
            <ol className="mt-10 flex flex-col gap-8">
              {steps.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            <Link
              href="/come-funziona"
              className={`mt-10 ${buttonVariants({ variant: "outline" })}`}
            >
              Scopri tutti i passaggi
            </Link>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">
            Perché sessualmente
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            Pensata per la discrezione e la fiducia.
          </h2>
        </div>
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map(({ icon: Icon, title, body }) => (
            <Card key={title} className="border-border/60">
              <CardHeader>
                <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <CardTitle className="text-lg tracking-tight">
                  {title}
                </CardTitle>
                <CardDescription>{body}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <div
          aria-hidden
          className="absolute -left-20 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-accent/20 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -right-20 top-1/4 h-96 w-96 rounded-full bg-primary-foreground/10 blur-3xl"
        />
        <div className="relative mx-auto max-w-4xl px-4 py-24 sm:px-6 sm:py-28">
          <div className="flex flex-col gap-6 text-center">
            <span className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/5 px-3 py-1 text-xs font-medium">
              <Heart className="h-3.5 w-3.5" />
              Testimonianza anonima
            </span>
            <p className="text-2xl font-medium leading-snug tracking-tight sm:text-3xl md:text-4xl">
              “Pensavo fosse un argomento troppo intimo per parlarne con uno
              sconosciuto. Dopo la prima seduta ho capito che era l’unica cosa
              di cui avevo bisogno.”
            </p>
            <p className="text-sm text-primary-foreground/70">
              — Paziente Sessualmente, 34 anni
            </p>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-primary">
              Prezzo
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Il primo colloquio è gratis. Poi 65 € a seduta.
            </h2>
            <p className="mt-4 max-w-md text-muted-foreground">
              Con ciascun sessuologo hai diritto a un primo colloquio gratuito
              per capire se è il match giusto. Se continui, paghi solo le
              sedute che fai. Nessun abbonamento, nessun pacchetto.
            </p>
            <Link
              href="/prezzi"
              className={`mt-6 ${buttonVariants({ variant: "outline" })}`}
            >
              Scopri di più sui prezzi
            </Link>
          </div>
          <Card className="relative overflow-hidden border-border/60 shadow-xl shadow-primary/5">
            <div
              aria-hidden
              className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/10 blur-3xl"
            />
            <CardContent className="relative flex flex-col gap-4 py-8 text-sm">
              <div className="flex items-baseline justify-between border-b border-border/50 pb-4">
                <span className="text-muted-foreground">Primo colloquio</span>
                <span className="text-3xl font-semibold tracking-tight text-primary">
                  Gratis
                </span>
              </div>
              <div className="flex items-baseline justify-between border-b border-border/50 pb-4">
                <span className="text-muted-foreground">Seduta successiva</span>
                <span className="text-3xl font-semibold tracking-tight">
                  65 €
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-muted-foreground">Durata</span>
                <span className="font-medium">50 minuti</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-muted-foreground">Formato</span>
                <span className="font-medium">Google Meet</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-muted-foreground">Cancellazione</span>
                <span className="font-medium">Gratuita fino 24h prima</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-muted-foreground">Fattura</span>
                <span className="font-medium">Detraibile 19%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-y border-border/60 bg-muted/40">
        <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-primary">
              Domande frequenti
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Quello che la gente ci chiede più spesso.
            </h2>
          </div>
          <dl className="mt-10 space-y-3">
            {faqs.map(({ q, a }) => (
              <div
                key={q}
                className="rounded-xl border bg-background p-6 transition hover:border-primary/40"
              >
                <dt className="font-semibold tracking-tight">{q}</dt>
                <dd className="mt-2 text-sm text-muted-foreground">{a}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-10 text-center">
            <Link
              href="/faq"
              className={buttonVariants({ variant: "outline" })}
            >
              Tutte le FAQ
            </Link>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mx-auto max-w-4xl px-4 py-24 text-center sm:px-6">
        <h2 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
          Il primo passo è anche quello più leggero.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Rispondi al questionario: nessun impegno, nessun pagamento. Alla fine
          decidi tu se andare avanti.
        </p>
        <Link
          href="/questionario"
          className={`mt-8 ${buttonVariants({ size: "lg" })}`}
        >
          Inizia adesso
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </section>
    </>
  );
}

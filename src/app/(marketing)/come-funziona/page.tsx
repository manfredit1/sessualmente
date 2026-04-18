import Link from "next/link";
import {
  CheckCircle2,
  Lock,
  MessageCircle,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  Video,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata = {
  title: "Come funziona",
  description:
    "In quattro passi semplici: questionario, scelta dello specialista, prima seduta online. Nessun impegno iniziale, privacy garantita.",
};

const steps = [
  {
    number: "01",
    title: "Racconta chi sei, in forma anonima.",
    body: "Un questionario di 10 domande, dura circa 3 minuti. Ci aiuta a capire cosa stai cercando: un tema di coppia, un dubbio personale, qualcosa che ti trascini da tempo. Nessuna domanda invasiva, nessun obbligo di dare la tua email fino alla fine.",
    meta: "≈ 3 minuti",
  },
  {
    number: "02",
    title: "Ti proponiamo i sessuologi adatti.",
    body: "Sulla base delle tue risposte ti mostriamo 3–5 specialisti con la formazione giusta per te. Leggi la bio, l'approccio, la disponibilità. Scegli quello con cui ti senti più a tuo agio — e se non lo trovi subito, nessun problema: possiamo proporti altri nomi.",
    meta: "Scegli tu",
  },
  {
    number: "03",
    title: "Prenoti e parli, dal tuo divano.",
    body: "Scegli uno slot dall'agenda online del sessuologo, paghi solo la seduta che farai (65 €), ricevi via email il link per la videochiamata. La seduta dura 50 minuti su Google Meet. Nessun software da installare.",
    meta: "Entro 48h",
  },
  {
    number: "04",
    title: "Decidi tu come andare avanti.",
    body: "Dopo la prima seduta continui con lo stesso sessuologo, cambi, fai una pausa. Niente pacchetti forzati, nessun abbonamento, nessuna penale. Paghi una seduta alla volta, esattamente quando serve.",
    meta: "Zero vincoli",
  },
];

const firstSessionPoints = [
  {
    title: "Prima di collegarti",
    body: "Trova un posto tranquillo, con una connessione stabile e delle cuffie. Non serve preparare nulla. Se hai domande, scrivi un appunto.",
  },
  {
    title: "I primi 10 minuti",
    body: "Il sessuologo si presenta, ti spiega come lavora, e ti chiede cosa ti ha portato qui. Puoi dire quanto o quanto poco vuoi: siamo abituati a ritmi diversi.",
  },
  {
    title: "Durante la seduta",
    body: "Parla nel modo che ti viene naturale. Non esistono domande 'sbagliate' o argomenti 'inappropriati'. Il compito del professionista è accogliere, non valutare.",
  },
  {
    title: "Alla fine",
    body: "Il sessuologo ti propone, se serve, un piano di lavoro: frequenza, obiettivi, tempi. Decidi tu se continuare. Niente pressioni.",
  },
];

const privacyPillars = [
  {
    icon: Lock,
    title: "Server in Europa",
    body: "Dati ospitati su infrastruttura EU (Germania). Nessun trasferimento verso Paesi extra-UE. GDPR art. 9 applicato integralmente.",
  },
  {
    icon: MessageCircle,
    title: "Email discrete",
    body: "Nessun dato clinico viene mai scritto nel corpo delle email. Solo promemoria minimali con link alla tua area riservata.",
  },
  {
    icon: ShieldCheck,
    title: "Cancellazione in un click",
    body: "Puoi eliminare l'account e ottenere un export dei tuoi dati in qualsiasi momento, dalla tua area personale.",
  },
];

const faqs = [
  {
    q: "Quanto tempo ci vuole per iniziare davvero?",
    a: "In media 2–4 giorni tra completamento del questionario e prima seduta, dipende dalla disponibilità che scegli. Se hai un'urgenza (non clinica, per quella serve un servizio di emergenza), di solito troviamo uno slot entro 48 ore.",
  },
  {
    q: "Devo avere una diagnosi o un problema 'grosso' per prenotare?",
    a: "No. La sessuologia non serve solo in caso di disfunzione: va bene anche per dubbi, curiosità, dinamiche di coppia, temi di identità. Chiunque voglia capirne di più ha diritto di parlare con un professionista.",
  },
  {
    q: "E se non mi trovo bene con il sessuologo?",
    a: "Ti proponiamo altri nomi gratuitamente dopo la prima seduta. Il match giusto è importante e non si trova sempre al primo colpo — è normale e non è un problema.",
  },
  {
    q: "Serve sempre la videocamera?",
    a: "No. Se preferisci la sola voce, dillo al sessuologo all'inizio. Molti pazienti preferiscono la chiamata audio, specie le prime volte.",
  },
  {
    q: "I miei dati resteranno riservati?",
    a: "Sì. Il sessuologo è vincolato al segreto professionale dell'Ordine degli Psicologi. Noi come piattaforma trattiamo i dati secondo GDPR art. 9 (categoria speciale), con audit log su ogni accesso.",
  },
  {
    q: "Posso fare la seduta con il mio partner?",
    a: "Sì, la sessuologia di coppia è uno dei temi più frequenti. Nel questionario scegli 'Io e il mio partner' e ti proponiamo specialisti con formazione in terapia di coppia.",
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
          Sessualmente è pensata per abbassare la soglia d&apos;ingresso: niente
          sale d&apos;attesa, pagamenti semplici, nessun vincolo. In meno di
          una settimana sei davanti al tuo sessuologo, se vuoi.
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
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-medium">{step.title}</h2>
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                    {step.meta}
                  </span>
                </div>
                <p className="mt-3 text-muted-foreground">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-y border-border/60 bg-muted/30 py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-wider text-primary">
              Prima seduta
            </p>
            <h2 className="mt-3 text-3xl font-medium tracking-tight sm:text-4xl">
              Cosa ti aspetta la prima volta.
            </h2>
            <p className="mt-4 text-muted-foreground">
              La prima seduta è il momento che spaventa di più — quindi diciamoti
              esattamente com&apos;è. Niente sorprese.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {firstSessionPoints.map((p) => (
              <Card key={p.title} className="border-border/60">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{p.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {p.body}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:items-center">
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-primary">
              Privacy concreta
            </p>
            <h2 className="mt-3 text-3xl font-medium tracking-tight sm:text-4xl">
              La discrezione non è una promessa, è un&apos;architettura.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Parlare di sessualità richiede fiducia. Abbiamo progettato la
              piattaforma per ridurre al minimo i dati conservati, senza
              rinunciare alla sicurezza.
            </p>
          </div>
          <div className="grid gap-4">
            {privacyPillars.map((pillar) => (
              <div
                key={pillar.title}
                className="flex gap-4 rounded-xl border border-border/60 bg-card p-5"
              >
                <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-primary/10 text-primary">
                  <pillar.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-medium">{pillar.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {pillar.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border/60 bg-muted/30 py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-wider text-primary">
                Flessibilità
              </p>
              <h2 className="mt-3 text-3xl font-medium tracking-tight sm:text-4xl">
                Cambiare idea non è un problema.
              </h2>
            </div>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            <InfoCard
              icon={RefreshCcw}
              title="Cambi sessuologo"
              body="Se dopo la prima seduta senti che non è la persona giusta, te ne proponiamo altri. Nessun costo di cambio."
            />
            <InfoCard
              icon={Video}
              title="Annulli fino a 24h prima"
              body="Puoi cancellare o riprenotare uno slot fino a 24 ore prima dell'inizio, direttamente dalla tua area."
            />
            <InfoCard
              icon={Sparkles}
              title="Paghi solo ciò che usi"
              body="Nessun abbonamento, nessun pacchetto. Ogni seduta è una scelta indipendente."
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 sm:py-24">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">
            Domande frequenti
          </p>
          <h2 className="mt-3 text-3xl font-medium tracking-tight sm:text-4xl">
            Le cose che ci chiedete di più.
          </h2>
        </div>

        <div className="mt-12 space-y-3">
          {faqs.map((f) => (
            <details
              key={f.q}
              className="group rounded-xl border border-border/60 bg-card p-5 transition hover:border-primary/30"
            >
              <summary className="flex cursor-pointer items-center justify-between text-base font-medium">
                {f.q}
                <span className="ml-4 text-primary transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center gap-4 rounded-2xl border bg-muted/30 p-10 text-center">
          <CheckCircle2 className="h-10 w-10 text-primary" />
          <h3 className="text-2xl font-medium">Pronto a iniziare?</h3>
          <p className="max-w-md text-muted-foreground">
            Il questionario è anonimo e dura meno di un caffè. Ti chiediamo
            l&apos;email solo alla fine, se decidi di andare avanti.
          </p>
          <Link href="/questionario" className={buttonVariants({ size: "lg" })}>
            Inizia il questionario
          </Link>
          <p className="text-xs text-muted-foreground">
            Nessun dato raccolto finché non ti registri.
          </p>
        </div>
      </section>
    </>
  );
}

function InfoCard({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-5">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </span>
      <p className="mt-4 font-medium">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}

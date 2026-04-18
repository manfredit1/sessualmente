import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Clock,
  Eye,
  GraduationCap,
  MapPin,
  RefreshCcw,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { listActiveTherapists } from "@/lib/queries";

export const metadata = {
  title: "Specialisti",
  description:
    "I sessuologi di Sessualmente: bio, approccio e formazione. Selezionati uno a uno, con titolo e supervisione continua.",
};

export const revalidate = 3600;

const selectionSteps = [
  {
    icon: GraduationCap,
    title: "Titolo verificato",
    body: "Laurea in psicologia o medicina + specializzazione in sessuologia clinica presso enti riconosciuti (CIS, FISS, AIS).",
  },
  {
    icon: UserCheck,
    title: "Iscrizione all'albo",
    body: "Verifichiamo l'iscrizione attiva all'Ordine degli Psicologi o all'Ordine dei Medici prima di ogni onboarding.",
  },
  {
    icon: Clock,
    title: "Esperienza clinica",
    body: "Almeno 3 anni di pratica supervisionata. Chi ha meno esperienza non viene preso in carico in questa fase.",
  },
  {
    icon: Eye,
    title: "Colloquio e prova",
    body: "Un colloquio con il nostro team clinico e una sessione di prova con case study simulato, prima dell'attivazione.",
  },
];

const guarantees = [
  {
    icon: ShieldCheck,
    title: "Supervisione continua",
    body: "Ogni sessuologo partecipa a supervisione di gruppo mensile. I casi complessi vengono discussi con supervisori senior.",
  },
  {
    icon: BookOpen,
    title: "Aggiornamento costante",
    body: "Richiediamo almeno 30 ore annuali di formazione continua in sessuologia, oltre ai crediti ECM obbligatori.",
  },
  {
    icon: RefreshCcw,
    title: "Codice deontologico",
    body: "Vincolati al segreto professionale dell'Ordine degli Psicologi. Violazioni → sospensione immediata dalla piattaforma.",
  },
];

const faqs = [
  {
    q: "Come scelgo il sessuologo giusto?",
    a: "Dopo il questionario ti proponiamo una rosa ristretta (3–5 nomi) basata su tema, preferenze di genere, orari e approccio. Da lì scegli tu leggendo bio e approccio. Se vuoi vedere tutti i sessuologi, sei già in questa pagina.",
  },
  {
    q: "Posso cambiare sessuologo?",
    a: "Sì, in qualsiasi momento e senza costi. Il match giusto non sempre si trova al primo tentativo: è normale. Dalla tua dashboard puoi richiedere una nuova rosa di specialisti.",
  },
  {
    q: "Sono tutti sessuologi con specializzazione?",
    a: "Sì. Non accettiamo psicologi o medici privi di specializzazione in sessuologia clinica. La sessualità richiede competenze specifiche che non si improvvisano.",
  },
  {
    q: "Posso vedere i titoli e la formazione completa?",
    a: "Certo. Clicca su un profilo e troverai formazione, albo di iscrizione, corsi di aggiornamento e approccio terapeutico nel dettaglio.",
  },
];

export default async function SpecialistiPage() {
  const therapists = await listActiveTherapists();

  return (
    <>
      <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-24">
        <p className="text-sm font-medium uppercase tracking-wider text-primary">
          I nostri specialisti
        </p>
        <h1 className="mt-3 text-4xl font-medium tracking-tight sm:text-5xl">
          Sessuologi con titolo, selezionati uno a uno.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Non accettiamo chiunque. Ogni professionista deve avere una laurea in
          psicologia o medicina, una specializzazione in sessuologia clinica,
          almeno 3 anni di pratica e superare un colloquio con il nostro team.
        </p>
      </section>

      <section className="border-y border-border/60 bg-muted/30 py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-wider text-primary">
              Selezione
            </p>
            <h2 className="mt-3 text-3xl font-medium tracking-tight sm:text-4xl">
              Come scegliamo chi entra in piattaforma.
            </h2>
            <p className="mt-4 text-muted-foreground">
              La sessuologia è un campo delicato: servono competenze precise,
              non improvvisazione. Ogni candidato passa per quattro filtri.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {selectionSteps.map((step) => (
              <div
                key={step.title}
                className="flex gap-4 rounded-xl border border-border/60 bg-card p-5"
              >
                <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-primary/10 text-primary">
                  <step.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-medium">{step.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-24">
        <div className="mb-12 max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">
            Profili
          </p>
          <h2 className="mt-3 text-3xl font-medium tracking-tight sm:text-4xl">
            Conosci il nostro team.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Clicca su un profilo per leggere bio, formazione completa e
            approccio terapeutico.
          </p>
        </div>

        {therapists.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-10 text-center">
            <p className="text-lg font-medium">
              Stiamo completando la selezione.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              I primi sessuologi entreranno in piattaforma nelle prossime
              settimane. Iscriviti al questionario, ti avvisiamo appena sono
              disponibili.
            </p>
            <Link
              href="/questionario"
              className={`mt-6 inline-flex ${buttonVariants({ variant: "outline" })}`}
            >
              Inizia il questionario
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {therapists.map((t) => (
              <Link
                key={t.slug}
                href={`/specialisti/${t.slug}`}
                className="group block rounded-xl transition hover:shadow-md"
              >
                <Card className="flex h-full flex-col border-border/60 transition group-hover:border-primary/40">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 bg-primary/10 text-primary">
                        <AvatarFallback>{t.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{t.name}</CardTitle>
                        <CardDescription>{t.role}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-4 text-sm">
                    <p className="line-clamp-3 text-muted-foreground">
                      {t.bio}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {t.tags.slice(0, 4).map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex flex-col gap-2 pt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <GraduationCap className="h-3.5 w-3.5" />
                        {t.approach}
                      </span>
                      {t.experience && (
                        <span className="flex items-center gap-2">
                          <Clock className="h-3.5 w-3.5" />
                          {t.experience}
                        </span>
                      )}
                      {t.region && (
                        <span className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5" />
                          {t.region}
                        </span>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <span className="inline-flex w-full items-center justify-between text-sm font-medium text-primary">
                      Scopri di più
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="border-y border-border/60 bg-muted/30 py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-wider text-primary">
              Garanzie
            </p>
            <h2 className="mt-3 text-3xl font-medium tracking-tight sm:text-4xl">
              Non basta il titolo sulla carta.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Entrare in piattaforma è un passo, restarci è un lavoro continuo.
              Ecco cosa chiediamo ai nostri sessuologi dopo l&apos;ingresso.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            {guarantees.map((g) => (
              <Card key={g.title} className="border-border/60">
                <CardHeader className="pb-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <g.icon className="h-5 w-5" />
                  </span>
                  <CardTitle className="mt-4 text-base">{g.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {g.body}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 sm:py-24">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">
            Domande frequenti
          </p>
          <h2 className="mt-3 text-3xl font-medium tracking-tight sm:text-4xl">
            Sui sessuologi, in breve.
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

        <div className="mt-16 rounded-2xl border bg-muted/30 p-10 text-center">
          <h3 className="text-2xl font-medium">
            Vuoi una rosa selezionata per te?
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Compila il questionario: in 3 minuti ti proponiamo i 3-5 sessuologi
            più adatti al tema che vuoi affrontare.
          </p>
          <Link href="/questionario" className={`mt-6 ${buttonVariants()}`}>
            Trova il sessuologo giusto per te
          </Link>
        </div>
      </section>
    </>
  );
}

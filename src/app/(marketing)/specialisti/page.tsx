import Link from "next/link";
import { Clock, GraduationCap, Languages } from "lucide-react";
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

export const metadata = {
  title: "Specialisti",
  description:
    "I sessuologi di Sessualmente: bio, approccio e formazione. Scegli con chi vuoi parlare.",
};

// TODO: sostituire con dati da Supabase (tabella therapist_profiles) in Sprint 3.
const therapists = [
  {
    slug: "giulia-bianchi",
    name: "Dott.ssa Giulia Bianchi",
    initials: "GB",
    role: "Sessuologa clinica",
    approach: "Sistemico-relazionale",
    bio: "Specializzata in dinamiche di coppia, desiderio e conflitto relazionale. Lavora con individui e coppie, con particolare attenzione a chi attraversa fasi di cambiamento (genitorialità, convivenza, separazione).",
    tags: ["Coppia", "Desiderio", "Conflitto"],
    languages: ["Italiano", "Inglese"],
    experience: "8 anni di pratica clinica",
  },
  {
    slug: "luca-ferrari",
    name: "Dott. Luca Ferrari",
    initials: "LF",
    role: "Sessuologo e psicoterapeuta",
    approach: "Cognitivo-comportamentale",
    bio: "Si occupa di disfunzioni sessuali maschili e femminili, ansia da prestazione e temi legati all’identità. Approccio strutturato, orientato a obiettivi concreti in tempi definiti.",
    tags: ["Ansia da prestazione", "Disfunzioni", "Identità"],
    languages: ["Italiano"],
    experience: "12 anni di pratica clinica",
  },
  {
    slug: "sara-conti",
    name: "Dott.ssa Sara Conti",
    initials: "SC",
    role: "Sessuologa",
    approach: "Gestaltico e corporeo",
    bio: "Accompagna persone LGBTQ+, giovani adulti e chi ha vissuto esperienze traumatiche. Lavora molto sul corpo, sull’ascolto e sulla rielaborazione non verbale.",
    tags: ["LGBTQ+", "Trauma", "Giovani adulti"],
    languages: ["Italiano", "Spagnolo"],
    experience: "6 anni di pratica clinica",
  },
];

export default function SpecialistiPage() {
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
          psicologia o medicina, una specializzazione in sessuologia clinica e
          almeno 3 anni di pratica supervisionata.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-24 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {therapists.map((t) => (
            <Card key={t.slug} className="flex flex-col border-border/60">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 bg-primary/10 text-primary">
                    <AvatarFallback>{t.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">
                      {t.name}
                    </CardTitle>
                    <CardDescription>{t.role}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-4 text-sm">
                <p className="text-muted-foreground">{t.bio}</p>
                <div className="flex flex-wrap gap-2">
                  {t.tags.map((tag) => (
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
                  <span className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5" />
                    {t.experience}
                  </span>
                  <span className="flex items-center gap-2">
                    <Languages className="h-3.5 w-3.5" />
                    {t.languages.join(", ")}
                  </span>
                </div>
              </CardContent>
              <CardFooter>
                <Link
                  href="/app/prenota"
                  className={buttonVariants({ className: "w-full" })}
                >
                  Prenota con {t.name.split(" ")[1]}
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-16 rounded-2xl border bg-muted/30 p-10 text-center">
          <h3 className="text-2xl font-medium">
            Nessuno ti ha convinto del tutto?
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Compila il questionario: ti proponiamo una rosa più ristretta in
            base al tema che vuoi affrontare.
          </p>
          <Link
            href="/questionario"
            className={`mt-6 ${buttonVariants()}`}
          >
            Trova il sessuologo giusto per te
          </Link>
        </div>
      </section>
    </>
  );
}

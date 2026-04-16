import Link from "next/link";
import { ArrowRight, Clock, GraduationCap } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { requireUser } from "@/lib/auth";
import {
  getMyCurrentTherapist,
  listActiveTherapists,
  formatCurrency,
  type Therapist,
} from "@/lib/queries";

export const metadata = { title: "Prenota una seduta" };

export default async function PrenotaListPage() {
  const user = await requireUser("patient");
  const [therapists, current] = await Promise.all([
    listActiveTherapists(),
    getMyCurrentTherapist(user.id),
  ]);
  const others = current
    ? therapists.filter((t) => t.id !== current.id)
    : therapists;

  return (
    <div className="flex flex-col gap-10">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          Prenota
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
          {current ? "Il tuo sessuologo" : "Scegli il tuo sessuologo"}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {current
            ? "Continua il percorso con chi già conosci, o esplora un altro profilo più in basso."
            : "Abbiamo selezionato questi specialisti in base alle tue risposte. Leggi le bio, scegli chi ti ispira fiducia."}
        </p>
      </div>

      {current && <TherapistCard t={current} featured />}

      {others.length > 0 && (
        <div>
          {current && (
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Vuoi cambiare?
              </p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight">
                Altri specialisti per te
              </h2>
            </div>
          )}
          <div className="grid gap-4 lg:grid-cols-2">
            {others.map((t, i) => (
              <TherapistCard
                key={t.slug}
                t={t}
                showMatchBadge={!current && i === 0}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TherapistCard({
  t,
  featured,
  showMatchBadge,
}: {
  t: Therapist;
  featured?: boolean;
  showMatchBadge?: boolean;
}) {
  return (
    <Card
      className={
        featured
          ? "flex flex-col border-primary/30 shadow-md shadow-primary/5"
          : "flex flex-col border-border/60"
      }
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`flex flex-none items-center justify-center rounded-full bg-primary/10 font-semibold text-primary ${
                featured ? "h-14 w-14 text-base" : "h-12 w-12 text-sm"
              }`}
            >
              {t.initials}
            </div>
            <div>
              <CardTitle className={featured ? "text-xl" : "text-lg"}>
                {t.name}
              </CardTitle>
              <CardDescription>{t.role}</CardDescription>
            </div>
          </div>
          {featured && <Badge variant="default">Il tuo</Badge>}
          {showMatchBadge && (
            <Badge variant="default" className="shrink-0">
              Match alto
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 text-sm">
        <p className={featured ? "text-muted-foreground" : "line-clamp-3 text-muted-foreground"}>
          {t.bio}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {t.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
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
        </div>
        <div className="mt-auto flex items-center justify-between border-t border-border/60 pt-4">
          <span className="text-sm">
            <span className="text-muted-foreground">
              {featured ? "Prossima seduta · " : "Prima seduta · "}
            </span>
            <span className="font-semibold">
              {formatCurrency(t.pricePerSession)}
            </span>
          </span>
          <Link
            href={`/app/prenota/${t.slug}`}
            className={buttonVariants({ variant: featured ? "default" : "outline" })}
          >
            {featured ? "Prenota nuova seduta" : "Vedi disponibilità"}
            <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

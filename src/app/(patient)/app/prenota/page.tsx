import Link from "next/link";
import { ArrowRight, Clock, GraduationCap, Languages } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { listActiveTherapists, formatCurrency } from "@/lib/queries";

export const metadata = { title: "Prenota una seduta" };

export default async function PrenotaListPage() {
  const therapists = await listActiveTherapists();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          Prenota
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
          Scegli il tuo sessuologo
        </h1>
        <p className="mt-2 text-muted-foreground">
          Abbiamo selezionato questi specialisti in base alle tue risposte.
          Leggi le bio, scegli chi ti ispira fiducia.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {therapists.map((t, i) => (
          <Card key={t.slug} className="flex flex-col border-border/60">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {t.initials}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{t.name}</CardTitle>
                    <CardDescription>{t.role}</CardDescription>
                  </div>
                </div>
                {i === 0 && (
                  <Badge variant="default" className="shrink-0">
                    Match alto
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-4 text-sm">
              <p className="line-clamp-3 text-muted-foreground">{t.bio}</p>
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
                <span className="flex items-center gap-2">
                  <Languages className="h-3.5 w-3.5" />
                  {t.languages.join(", ")}
                </span>
              </div>
              <div className="mt-auto flex items-center justify-between border-t border-border/60 pt-4">
                <span className="text-sm">
                  <span className="text-muted-foreground">
                    Prima seduta ·{" "}
                  </span>
                  <span className="font-semibold">
                    {formatCurrency(t.pricePerSession)}
                  </span>
                </span>
                <Link
                  href={`/app/prenota/${t.slug}`}
                  className={buttonVariants()}
                >
                  Vedi disponibilità
                  <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

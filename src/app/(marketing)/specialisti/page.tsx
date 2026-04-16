import Link from "next/link";
import { ArrowRight, Clock, GraduationCap, MapPin } from "lucide-react";
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
    "I sessuologi di Sessualmente: bio, approccio e formazione. Scegli con chi vuoi parlare.",
};

export const revalidate = 3600; // ISR: ripolla ogni ora

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
          psicologia o medicina, una specializzazione in sessuologia clinica e
          almeno 3 anni di pratica supervisionata.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-24 sm:px-6">
        {therapists.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground">
            Stiamo completando la selezione. Torna a trovarci a breve.
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

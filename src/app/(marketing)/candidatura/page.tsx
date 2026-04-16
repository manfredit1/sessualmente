import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CandidaturaForm } from "./candidatura-form";

export const metadata = {
  title: "Candidatura sessuologi",
  description:
    "Candidati come sessuologo su Sessualmente. Rispondiamo entro 5 giorni lavorativi.",
};

const steps = [
  "Candidatura ricevuta",
  "Colloquio online (30 min)",
  "Firma contratto e setup profilo",
  "Primo paziente entro 30 giorni",
];

export default function CandidaturaPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-10 px-4 py-16 sm:px-6 sm:py-20">
      <Link
        href="/lavora-con-noi"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Torna a &ldquo;Lavora con noi&rdquo;
      </Link>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          Candidatura
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Unisciti a Sessualmente.
        </h1>
        <p className="mt-3 text-muted-foreground">
          In fase MVP valutiamo ogni candidatura personalmente. Rispondiamo
          entro 5 giorni lavorativi.
        </p>
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base">Il processo in 4 tappe</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {steps.map((s, i) => (
              <li
                key={s}
                className="flex flex-1 items-center gap-2 rounded-lg border border-border/60 bg-muted/30 p-3 text-xs"
              >
                <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                  {i + 1}
                </span>
                {s}
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base">I tuoi dati</CardTitle>
          <CardDescription>
            Li trattiamo solo per valutare la candidatura. Niente di più.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CandidaturaForm />
        </CardContent>
      </Card>
    </div>
  );
}

import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { ApplicationRow } from "../_components/ApplicationRow";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Status = "new" | "review" | "approved" | "rejected";

const tabs: { status: Status; label: string }[] = [
  { status: "new", label: "Nuove" },
  { status: "review", label: "In review" },
  { status: "approved", label: "Approvate" },
  { status: "rejected", label: "Rifiutate" },
];

export default async function CandidaturePage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: statusParam } = await searchParams;
  const activeStatus: Status =
    (tabs.find((t) => t.status === statusParam)?.status as Status) ?? "new";

  const supabase = createAdminClient();

  const [counts, { data: applications }] = await Promise.all([
    loadCounts(supabase),
    supabase
      .from("pro_applications")
      .select(
        "id, first_name, last_name, email, phone, qualification, albo, years_of_practice, approach, motivation, cv_url, status, created_at"
      )
      .eq("status", activeStatus)
      .order("created_at", { ascending: false }),
  ]);

  const rows = applications ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Candidature</h1>
        <p className="text-muted-foreground">
          Valuta le richieste di sessuologi che vogliono unirsi alla piattaforma.
        </p>
      </div>

      <div className="flex flex-wrap gap-1 border-b border-border/40">
        {tabs.map((t) => {
          const active = t.status === activeStatus;
          return (
            <Link
              key={t.status}
              href={`/admin/candidature?status=${t.status}`}
              className={cn(
                "rounded-t-md px-3 py-2 text-sm transition -mb-px",
                active
                  ? "border border-b-background border-border/60 bg-background font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t.label}
              <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                {counts[t.status]}
              </span>
            </Link>
          );
        })}
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base">
            {tabs.find((t) => t.status === activeStatus)?.label}
          </CardTitle>
          <CardDescription>
            {rows.length === 0
              ? "Nessuna candidatura in questa sezione."
              : `${rows.length} candidatur${rows.length === 1 ? "a" : "e"}.`}
          </CardDescription>
        </CardHeader>
        {rows.length > 0 && (
          <CardContent className="flex flex-col gap-3">
            {rows.map((app) => (
              <ApplicationRow key={app.id} application={app} />
            ))}
          </CardContent>
        )}
      </Card>
    </div>
  );
}

async function loadCounts(
  supabase: ReturnType<typeof createAdminClient>
): Promise<Record<Status, number>> {
  const results = await Promise.all(
    tabs.map(async (t) => {
      const { count } = await supabase
        .from("pro_applications")
        .select("id", { count: "exact", head: true })
        .eq("status", t.status);
      return [t.status, count ?? 0] as const;
    })
  );
  return Object.fromEntries(results) as Record<Status, number>;
}

import { createAdminClient } from "@/lib/supabase/admin";
import { ApplicationRow } from "./_components/ApplicationRow";
import { KpiCards } from "./_components/KpiCards";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function AdminPage() {
  const supabase = createAdminClient();

  const [{ data: applications }, { data: kpi }] = await Promise.all([
    supabase
      .from("pro_applications")
      .select(
        "id, first_name, last_name, email, phone, qualification, albo, years_of_practice, approach, motivation, cv_url, status, created_at"
      )
      .in("status", ["new", "review"])
      .order("created_at", { ascending: false }),
    supabase.from("admin_kpi").select("*").single(),
  ]);

  const rows = applications ?? [];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Pannello admin</h1>
        <p className="text-muted-foreground">
          Gestione candidature sessuologi e metriche piattaforma.
        </p>
      </div>

      <KpiCards kpi={kpi ?? null} pendingApplications={rows.length} />

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base">Candidature in attesa</CardTitle>
          <CardDescription>
            {rows.length === 0
              ? "Nessuna candidatura da valutare."
              : `${rows.length} candidatura${rows.length === 1 ? "" : "e"} da valutare.`}
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

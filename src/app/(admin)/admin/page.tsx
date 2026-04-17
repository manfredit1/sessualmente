import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { KpiCards } from "./_components/KpiCards";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export default async function AdminPage() {
  const supabase = createAdminClient();

  const [{ data: kpi }, { count: pendingCount }] = await Promise.all([
    supabase.from("admin_kpi").select("*").single(),
    supabase
      .from("pro_applications")
      .select("id", { count: "exact", head: true })
      .in("status", ["new", "review"]),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Panoramica</h1>
        <p className="text-muted-foreground">
          Metriche piattaforma e accesso rapido alle sezioni di gestione.
        </p>
      </div>

      <KpiCards kpi={kpi ?? null} pendingApplications={pendingCount ?? 0} />

      <div className="grid gap-4 sm:grid-cols-3">
        <QuickLink
          href="/admin/candidature"
          title="Candidature"
          description={
            pendingCount
              ? `${pendingCount} in attesa di valutazione`
              : "Nessuna candidatura pending"
          }
        />
        <QuickLink
          href="/admin/pazienti"
          title="Pazienti"
          description={`${kpi?.patients ?? 0} registrati`}
        />
        <QuickLink
          href="/admin/terapisti"
          title="Terapisti"
          description={`${kpi?.active_therapists ?? 0} attivi`}
        />
      </div>
    </div>
  );
}

function QuickLink({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link href={href} className="group">
      <Card className="h-full border-border/60 transition hover:border-primary/40">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">{title}</CardTitle>
            <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" />
          </div>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}

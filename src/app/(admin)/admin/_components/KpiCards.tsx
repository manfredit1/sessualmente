import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Kpi = {
  active_therapists: number;
  patients: number;
  bookings_this_month: number;
  gross_this_month: number;
  pending_applications: number;
} | null;

function formatEuro(cents: number): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function KpiCards({
  kpi,
  pendingApplications,
}: {
  kpi: Kpi;
  pendingApplications: number;
}) {
  const cards = [
    {
      label: "Candidature in attesa",
      value: String(kpi?.pending_applications ?? pendingApplications),
    },
    {
      label: "Sessuologi attivi",
      value: String(kpi?.active_therapists ?? 0),
    },
    {
      label: "Pazienti registrati",
      value: String(kpi?.patients ?? 0),
    },
    {
      label: "Sedute mese corrente",
      value: String(kpi?.bookings_this_month ?? 0),
    },
    {
      label: "Fatturato lordo mese",
      value: formatEuro(kpi?.gross_this_month ?? 0),
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {cards.map((c) => (
        <Card key={c.label} className="border-border/60">
          <CardHeader className="pb-3">
            <CardDescription>{c.label}</CardDescription>
            <CardTitle className="text-3xl font-semibold tracking-tight">
              {c.value}
            </CardTitle>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

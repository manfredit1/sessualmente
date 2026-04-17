import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TherapistStatusSelect } from "../_components/TherapistStatusSelect";

type Status = "pending" | "active" | "suspended";

function formatEuro(cents: number): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export default async function TerapistiPage() {
  const supabase = createAdminClient();

  const [{ data: therapists }, { data: bookings }] = await Promise.all([
    supabase
      .from("therapists")
      .select(
        "id, name, email, slug, cal_com_username, role, status, phone, created_at"
      )
      .order("created_at", { ascending: false }),
    supabase
      .from("bookings")
      .select("therapist_id, patient_id, starts_at, status, amount_gross"),
  ]);

  const monthStart = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  ).toISOString();

  const statsByTherapist = new Map<
    string,
    { patients: Set<string>; bookingsMonth: number; grossMonth: number; total: number }
  >();
  for (const b of bookings ?? []) {
    const entry = statsByTherapist.get(b.therapist_id) ?? {
      patients: new Set<string>(),
      bookingsMonth: 0,
      grossMonth: 0,
      total: 0,
    };
    entry.patients.add(b.patient_id);
    entry.total += 1;
    if (b.starts_at >= monthStart) {
      entry.bookingsMonth += 1;
      if (b.status === "completed") entry.grossMonth += b.amount_gross ?? 0;
    }
    statsByTherapist.set(b.therapist_id, entry);
  }

  const rows = therapists ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Terapisti</h1>
        <p className="text-muted-foreground">
          Gestione stato dei sessuologi e statistiche principali.
        </p>
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base">
            {rows.length} terapist{rows.length === 1 ? "a" : "i"}
          </CardTitle>
          <CardDescription>
            Cambia lo stato dal menu a tendina. Active = pubblico su /specialisti.
          </CardDescription>
        </CardHeader>
        {rows.length > 0 && (
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Cal.com</TableHead>
                  <TableHead>Pazienti</TableHead>
                  <TableHead>Sedute mese</TableHead>
                  <TableHead className="text-right">Lordo mese</TableHead>
                  <TableHead>Stato</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((t) => {
                  const stats = statsByTherapist.get(t.id);
                  return (
                    <TableRow key={t.id}>
                      <TableCell>
                        <p className="font-medium">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.role}</p>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {t.email ?? "—"}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {t.cal_com_username ?? "—"}
                      </TableCell>
                      <TableCell>{stats?.patients.size ?? 0}</TableCell>
                      <TableCell>{stats?.bookingsMonth ?? 0}</TableCell>
                      <TableCell className="text-right">
                        {formatEuro(stats?.grossMonth ?? 0)}
                      </TableCell>
                      <TableCell>
                        <TherapistStatusSelect
                          therapistId={t.id}
                          current={t.status as Status}
                        />
                      </TableCell>
                      <TableCell>
                        {t.status === "active" && (
                          <Link
                            href={`/specialisti/${t.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                          >
                            Profilo <ExternalLink className="h-3 w-3" />
                          </Link>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        )}
      </Card>
    </div>
  );
}

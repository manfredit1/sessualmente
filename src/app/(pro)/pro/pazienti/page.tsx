import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { requireOnboardedPro } from "@/lib/pro-guard";
import {
  getMyTherapistRecord,
  getProPatients,
  formatDate,
  type ProPatient,
} from "@/lib/queries";

export const metadata = { title: "Pazienti" };

const statusLabel: Record<ProPatient["status"], string> = {
  attivo: "Attivo",
  in_valutazione: "Nuovo",
  concluso: "Concluso",
};

const statusVariant: Record<
  ProPatient["status"],
  "default" | "secondary" | "outline"
> = {
  attivo: "default",
  in_valutazione: "secondary",
  concluso: "outline",
};

export default async function PazientiPage() {
  const { user } = await requireOnboardedPro();
  const therapist = await getMyTherapistRecord(user.id);
  if (!therapist) return <p className="text-muted-foreground">Profilo non collegato.</p>;
  const patients = await getProPatients(therapist.id);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Pazienti</h1>
          <p className="text-muted-foreground">
            Tutti i tuoi pazienti. Clicca per vedere intake e storico sedute.
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {(["attivo", "in_valutazione", "concluso"] as const).map((s) => {
          const count = patients.filter((p) => p.status === s).length;
          return (
            <Card key={s} className="border-border/60">
              <CardHeader className="pb-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {statusLabel[s]}
                </p>
                <CardTitle className="text-2xl font-semibold tracking-tight">
                  {count}
                </CardTitle>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      {patients.length === 0 ? (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-base">Nessun paziente al momento</CardTitle>
          </CardHeader>
        </Card>
      ) : (
        <Card className="overflow-hidden border-border/60">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Paziente</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead>Prima seduta</TableHead>
                <TableHead>Sedute</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <Link
                      href={`/pro/pazienti/${p.id}`}
                      className="flex items-center gap-3 font-medium"
                    >
                      <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {p.initials}
                      </span>
                      <span>
                        <span className="block">
                          {p.firstName ?? "?"} {p.lastName ?? ""}
                        </span>
                        <span className="block text-xs font-normal text-muted-foreground">
                          {p.city ?? "—"}
                          {p.birthYear
                            ? ` · ${new Date().getFullYear() - p.birthYear} anni`
                            : ""}
                        </span>
                      </span>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[p.status]}>
                      {statusLabel[p.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {p.firstBookingAt ? formatDate(p.firstBookingAt) : "—"}
                  </TableCell>
                  <TableCell>{p.totalSessions}</TableCell>
                  <TableCell>
                    <Link
                      href={`/pro/pazienti/${p.id}`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}

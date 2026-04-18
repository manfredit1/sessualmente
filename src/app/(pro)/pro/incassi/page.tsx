import { Banknote, Info } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
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
  getProBookings,
  getProPatients,
  formatCurrency,
  formatDate,
} from "@/lib/queries";

export const metadata = { title: "Incassi" };

export default async function IncassiPage() {
  const { user } = await requireOnboardedPro();
  const therapist = await getMyTherapistRecord(user.id);
  if (!therapist) return <p className="text-muted-foreground">Profilo non collegato.</p>;

  const [bookings, patients] = await Promise.all([
    getProBookings(therapist.id),
    getProPatients(therapist.id),
  ]);
  const byPatient = new Map(patients.map((p) => [p.id, p]));
  const completed = bookings
    .filter((b) => b.status === "completed")
    .sort((a, b) => new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime());

  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const thisMonth = completed.filter((b) => new Date(b.startsAt) >= monthStart);
  const lastMonthStart = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
  const lastMonthEnd = new Date(new Date().getFullYear(), new Date().getMonth(), 0, 23, 59, 59);
  const lastMonth = completed.filter(
    (b) =>
      new Date(b.startsAt) >= lastMonthStart &&
      new Date(b.startsAt) <= lastMonthEnd
  );

  const sumGross = (arr: typeof completed) => arr.reduce((s, b) => s + b.amountGross, 0);
  const sumNet = (arr: typeof completed) => arr.reduce((s, b) => s + b.amountNet, 0);

  const iban = therapist.iban ?? null;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Incassi</h1>
        <p className="text-muted-foreground">
          Le tue sedute pagate e i prossimi bonifici.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <CardDescription>Mese in corso</CardDescription>
            <CardTitle className="text-3xl font-semibold tracking-tight">
              {formatCurrency(sumNet(thisMonth))}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            {thisMonth.length} sedute · {formatCurrency(sumGross(thisMonth))} lordo
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <CardDescription>Mese scorso</CardDescription>
            <CardTitle className="text-3xl font-semibold tracking-tight">
              {formatCurrency(sumNet(lastMonth))}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            {lastMonth.length} sedute · {formatCurrency(sumGross(lastMonth))} lordo
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden border-primary/20 bg-primary text-primary-foreground">
          <div
            aria-hidden
            className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-primary-foreground/10 blur-3xl"
          />
          <CardHeader className="relative pb-3">
            <CardDescription className="text-primary-foreground/70">
              Prossimo bonifico
            </CardDescription>
            <CardTitle className="text-3xl font-semibold tracking-tight">
              {formatCurrency(sumNet(thisMonth))}
            </CardTitle>
          </CardHeader>
          <CardContent className="relative text-xs text-primary-foreground/80">
            {iban ? (
              <>
                Bonifico il 5 del mese prossimo su{" "}
                <span className="font-mono">{iban.slice(0, 12)}...</span>
              </>
            ) : (
              <>IBAN non configurato. Vai sul tuo profilo.</>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-dashed bg-muted/30">
        <CardContent className="flex items-start gap-3 py-5 text-sm">
          <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-primary/10 text-primary">
            <Info className="h-4 w-4" />
          </span>
          <div className="flex-1 text-muted-foreground">
            <p className="font-medium text-foreground">Come funziona lo split</p>
            <p className="mt-1">
              Il paziente paga <strong>65 €</strong> tramite Stripe. Stripe
              trattiene ~1,50 €, Sessualmente trattiene 15 € come fee di
              piattaforma, a te arrivano <strong>48 € netti</strong> per seduta.
              Bonifici mensili.
            </p>
          </div>
        </CardContent>
      </Card>

      {completed.length === 0 ? (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-base">Ancora nessun incasso</CardTitle>
            <CardDescription>
              Dopo la prima seduta completata vedi qui il dettaglio.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <Card className="overflow-hidden border-border/60">
          <CardHeader>
            <CardTitle className="text-base">Storico sedute incassate</CardTitle>
          </CardHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Paziente</TableHead>
                <TableHead className="text-right">Lordo</TableHead>
                <TableHead className="text-right">Netto</TableHead>
                <TableHead>Stato</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {completed.map((b) => {
                const pt = byPatient.get(b.patientId);
                const paidOut = new Date(b.startsAt) < monthStart;
                return (
                  <TableRow key={b.id}>
                    <TableCell className="text-muted-foreground">
                      {formatDate(b.startsAt)}
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-2">
                        <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                          {pt?.initials ?? "??"}
                        </span>
                        {pt?.firstName ?? "?"} {pt?.lastName ?? ""}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(b.amountGross)}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(b.amountNet)}
                    </TableCell>
                    <TableCell>
                      {paidOut ? (
                        <Badge variant="secondary">
                          <Banknote className="mr-1 h-3 w-3" />
                          Bonificato
                        </Badge>
                      ) : (
                        <Badge variant="default">In attesa di bonifico</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}

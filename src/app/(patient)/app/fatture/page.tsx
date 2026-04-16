import { Download, FileText } from "lucide-react";
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
import { requireUser } from "@/lib/auth";
import {
  getMyInvoices,
  getTherapistById,
  formatCurrency,
  formatDate,
} from "@/lib/queries";

export const metadata = { title: "Fatture" };

export default async function FatturePage() {
  const user = await requireUser("patient");
  const invoices = await getMyInvoices(user.id);
  const therapistIds = Array.from(new Set(invoices.map((i) => i.therapistId)));
  const therapists = await Promise.all(
    therapistIds.map((id) => getTherapistById(id))
  );
  const byId = new Map(
    therapists.filter(Boolean).map((t) => [t!.id, t!] as const)
  );
  const totalThisYear = invoices.reduce((s, i) => s + i.amount, 0);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Fatture</h1>
        <p className="text-muted-foreground">
          Tutte le fatture delle tue sedute, pronte per la dichiarazione.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <CardDescription>Totale {new Date().getFullYear()}</CardDescription>
            <CardTitle className="text-2xl font-semibold tracking-tight">
              {formatCurrency(totalThisYear)}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Detraibile al 19% come spesa sanitaria, se applicabile.
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <CardDescription>Sedute fatturate</CardDescription>
            <CardTitle className="text-2xl font-semibold tracking-tight">
              {invoices.length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <CardDescription>Emittente</CardDescription>
            <CardTitle className="text-base font-medium tracking-tight">
              Il singolo sessuologo
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            La fattura è nominale. Sessualmente non fattura direttamente le
            sedute cliniche.
          </CardContent>
        </Card>
      </div>

      {invoices.length === 0 ? (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-base">Ancora nessuna fattura</CardTitle>
            <CardDescription>
              Dopo la prima seduta trovi qui il PDF scaricabile.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <Card className="overflow-hidden border-border/60">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Numero</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Sessuologo</TableHead>
                <TableHead className="text-right">Importo</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((inv) => {
                const t = byId.get(inv.therapistId);
                return (
                  <TableRow key={inv.id}>
                    <TableCell className="font-medium">
                      <span className="inline-flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        {inv.number}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(inv.issuedAt)}
                    </TableCell>
                    <TableCell>{t?.name}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(inv.amount)}
                    </TableCell>
                    <TableCell>
                      {inv.pdfUrl ? (
                        <a
                          href={inv.pdfUrl}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground"
                          title="Scarica PDF"
                        >
                          <Download className="h-4 w-4" />
                        </a>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          —
                        </span>
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
